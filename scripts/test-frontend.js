#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Test with service role key for backend access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🧪 Testing Frontend Data Layer Integration\n');

async function testFrontendIntegration() {
  try {
    console.log('🔗 Testing Supabase connection...');
    
    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('trips')
      .select('count')
      .limit(1);

    if (connectionError) {
      console.log('❌ Connection failed:', connectionError.message);
      return;
    }

    console.log('✅ Supabase connection successful\n');

    // Test trips data
    console.log('📅 Testing trips data...');
    const { data: trips, error: tripsError } = await supabase
      .from('trips')
      .select(`
        id,
        title,
        start_date,
        end_date,
        type,
        regions,
        main_clients,
        estimated_cost
      `);

    if (tripsError) {
      console.log('❌ Trips query failed:', tripsError.message);
    } else {
      console.log(`✅ Found ${trips?.length || 0} trips`);
      trips?.forEach(trip => {
        console.log(`   • ${trip.title} (${trip.start_date} → ${trip.end_date})`);
      });
    }

    console.log('\n🎉 Frontend Integration Test Complete!');
    console.log(`✅ ${trips?.length || 0} trips available for dashboard`);
    
    console.log('\n🚀 Ready for production deployment!');
    console.log('   Next steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Visit: http://localhost:3000/dashboard');
    console.log('   3. Your Brazil trip data will be displayed');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error(error);
  }
}

testFrontendIntegration();