#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkCurrentEnumValues() {
  console.log('🔍 Checking current enum values for company_type_enum...');
  
  try {
    // Query to get current enum values
    const { data, error } = await supabase.rpc('get_enum_values', {
      enum_name: 'company_type_enum'
    });
    
    if (error) {
      console.log('RPC function might not exist, trying alternative method...');
      
      // Alternative: Query information_schema directly
      const { data: enumData, error: enumError } = await supabase
        .from('information_schema.columns')
        .select('*')
        .eq('table_name', 'companies')
        .eq('column_name', 'company_type');
      
      if (enumError) {
        console.error('Error querying enum values:', enumError);
        return null;
      }
      
      console.log('Column information:', enumData);
      return enumData;
    }
    
    console.log('✅ Current enum values:', data);
    return data;
  } catch (error) {
    console.error('Error checking enum values:', error);
    return null;
  }
}

async function addEnumValue() {
  console.log('🔧 Attempting to add "broker" to company_type_enum...');
  
  try {
    // First, let's check if the enum value already exists by querying companies
    const { data: existingBrokers, error: checkError } = await supabase
      .from('companies')
      .select('id, name, company_type')
      .eq('company_type', 'broker');
    
    if (checkError) {
      console.log('Error checking existing broker companies (this is expected if enum value doesn\'t exist):', checkError.message);
    } else if (existingBrokers && existingBrokers.length > 0) {
      console.log('✅ "broker" enum value already exists! Found companies:', existingBrokers);
      return true;
    }
    
    // Try to add the enum value using raw SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `ALTER TYPE company_type_enum ADD VALUE 'broker';`
    });
    
    if (error) {
      console.log('RPC exec_sql might not exist, trying alternative method...');
      
      // Alternative: Use direct SQL execution (requires proper permissions)
      const { data: alterData, error: alterError } = await supabase
        .from('postgres_changes')
        .select('*')
        .limit(1);
      
      if (alterError) {
        console.error('⚠️  Cannot execute DDL commands directly. SQL command needed:');
        console.log('🔧 Run this SQL command in Supabase SQL editor:');
        console.log('ALTER TYPE company_type_enum ADD VALUE IF NOT EXISTS \'broker\';');
        return false;
      }
    }
    
    console.log('✅ Successfully added "broker" to company_type_enum');
    return true;
  } catch (error) {
    console.error('Error adding enum value:', error);
    console.log('🔧 Manual SQL command needed:');
    console.log('ALTER TYPE company_type_enum ADD VALUE IF NOT EXISTS \'broker\';');
    return false;
  }
}

async function updateWolthersCompany() {
  console.log('🔄 Updating Wolthers & Associates company record...');
  
  try {
    // First, find the Wolthers company
    const { data: wolthers, error: findError } = await supabase
      .from('companies')
      .select('*')
      .eq('name', 'Wolthers & Associates')
      .single();
    
    if (findError) {
      console.error('Error finding Wolthers company:', findError);
      return false;
    }
    
    if (!wolthers) {
      console.error('Wolthers & Associates company not found');
      return false;
    }
    
    console.log('📋 Current Wolthers company data:', wolthers);
    
    // Update the company_type to 'broker'
    const { data: updatedCompany, error: updateError } = await supabase
      .from('companies')
      .update({ company_type: 'broker' })
      .eq('id', wolthers.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error updating Wolthers company:', updateError);
      return false;
    }
    
    console.log('✅ Successfully updated Wolthers & Associates company_type to "broker"');
    console.log('📋 Updated company data:', updatedCompany);
    return true;
  } catch (error) {
    console.error('Error updating Wolthers company:', error);
    return false;
  }
}

async function verifyEnumValues() {
  console.log('🔍 Verifying all available enum values...');
  
  try {
    // Get all distinct company_type values from companies table
    const { data: companyTypes, error } = await supabase
      .from('companies')
      .select('company_type')
      .not('company_type', 'is', null);
    
    if (error) {
      console.error('Error getting company types:', error);
      return;
    }
    
    const uniqueTypes = [...new Set(companyTypes.map(c => c.company_type))];
    console.log('📋 Current company_type values in use:', uniqueTypes);
    
    // Try to get all companies with their types
    const { data: allCompanies, error: allError } = await supabase
      .from('companies')
      .select('id, name, company_type')
      .order('name');
    
    if (allError) {
      console.error('Error getting all companies:', allError);
      return;
    }
    
    console.log('📋 All companies with their types:');
    allCompanies.forEach(company => {
      console.log(`  - ${company.name}: ${company.company_type || 'NULL'}`);
    });
    
  } catch (error) {
    console.error('Error verifying enum values:', error);
  }
}

async function main() {
  console.log('🚀 Starting enum operations for company_type_enum...\n');
  
  // Step 1: Check current enum values
  await checkCurrentEnumValues();
  
  // Step 2: Verify current company types
  await verifyEnumValues();
  
  // Step 3: Try to add enum value (may require manual SQL)
  const enumAdded = await addEnumValue();
  
  // Step 4: Update Wolthers company (only if enum was added successfully)
  if (enumAdded) {
    await updateWolthersCompany();
  } else {
    console.log('\n⚠️  Enum value addition failed or requires manual intervention.');
    console.log('🔧 Please run this SQL command in Supabase SQL editor first:');
    console.log('ALTER TYPE company_type_enum ADD VALUE IF NOT EXISTS \'broker\';');
    console.log('\nThen run this script again to update the company record.');
  }
  
  console.log('\n🏁 Enum operations completed!');
}

main().catch(console.error);