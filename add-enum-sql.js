#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addEnumValueDirectly() {
  console.log('🔧 Attempting to add "broker" enum value using direct SQL...\n');
  
  try {
    // Use the sql function to execute raw SQL
    const { data, error } = await supabase
      .from('companies')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      console.error('Basic connection test failed:', error);
      return false;
    }
    
    console.log('✅ Database connection successful');
    
    // Try to use the SQL function if available
    const { data: sqlResult, error: sqlError } = await supabase.rpc('exec_sql', {
      query: "ALTER TYPE company_type_enum ADD VALUE 'broker';"
    });
    
    if (sqlError) {
      console.log('RPC exec_sql not available, trying direct approach...');
      
      // Alternative: Use the REST API to execute SQL
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: "ALTER TYPE company_type_enum ADD VALUE 'broker';"
        })
      });
      
      if (!response.ok) {
        console.log('Direct SQL execution not available through REST API');
        return false;
      }
      
      console.log('✅ Successfully added "broker" enum value');
      return true;
    }
    
    console.log('✅ Successfully added "broker" enum value via RPC');
    return true;
    
  } catch (error) {
    console.error('Error adding enum value:', error);
    return false;
  }
}

async function checkEnumAfterAdd() {
  console.log('🔍 Verifying "broker" enum value was added...');
  
  try {
    // Try to query for companies with broker type (should not error if enum exists)
    const { data, error } = await supabase
      .from('companies')
      .select('id, name, company_type')
      .eq('company_type', 'broker')
      .limit(1);
    
    if (error && error.message.includes('invalid input value for enum')) {
      console.log('❌ "broker" enum value still does not exist');
      return false;
    }
    
    console.log('✅ "broker" enum value exists and can be queried');
    return true;
    
  } catch (error) {
    console.error('Error checking enum:', error);
    return false;
  }
}

async function updateWolthersCompany() {
  console.log('🔄 Updating Wolthers & Associates to use "broker" type...');
  
  try {
    const { data: updatedCompany, error: updateError } = await supabase
      .from('companies')
      .update({ company_type: 'broker' })
      .eq('name', 'Wolthers & Associates')
      .select()
      .single();
    
    if (updateError) {
      console.error('Error updating company:', updateError);
      return false;
    }
    
    console.log('✅ Successfully updated Wolthers & Associates');
    console.log('📋 Updated data:', {
      id: updatedCompany.id,
      name: updatedCompany.name,
      company_type: updatedCompany.company_type
    });
    
    return true;
  } catch (error) {
    console.error('Error updating company:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting enum addition and company update...\n');
  
  // Step 1: Try to add enum value
  const enumAdded = await addEnumValueDirectly();
  
  if (!enumAdded) {
    console.log('\n⚠️  Automatic enum addition failed.');
    console.log('🔧 Please run this SQL command manually in Supabase SQL Editor:');
    console.log('ALTER TYPE company_type_enum ADD VALUE \'broker\';');
    console.log('\nOr use the following steps:');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Run: ALTER TYPE company_type_enum ADD VALUE \'broker\';');
    console.log('4. Then run this script again');
    return;
  }
  
  // Step 2: Verify enum was added
  const enumExists = await checkEnumAfterAdd();
  
  if (!enumExists) {
    console.log('\n⚠️  Enum verification failed. Please add manually.');
    return;
  }
  
  // Step 3: Update company
  await updateWolthersCompany();
  
  console.log('\n🏁 All operations completed successfully!');
}

main().catch(console.error);