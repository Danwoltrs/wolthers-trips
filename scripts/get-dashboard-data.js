#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Test with service role key for backend access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🗄️  Getting Dashboard Data Preview\n');

async function getDashboardData() {
  try {
    // Get all trips with full details
    const { data: trips, error: tripsError } = await supabase
      .from('trips')
      .select(`
        id,
        title,
        description,
        start_date,
        end_date,
        type,
        status,
        regions,
        main_clients,
        estimated_cost,
        created_at,
        updated_at
      `)
      .order('start_date', { ascending: false });

    if (tripsError) {
      console.log('❌ Error fetching trips:', tripsError);
      return;
    }

    console.log(`📊 Found ${trips?.length || 0} trips in database:\n`);

    trips?.forEach((trip, index) => {
      const startDate = new Date(trip.start_date);
      const endDate = new Date(trip.end_date);
      const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
      
      // Determine if trip is current/upcoming or past
      const now = new Date();
      const category = now < startDate ? 'UPCOMING' : 
                     (now >= startDate && now <= endDate) ? 'ONGOING' : 'PAST';

      console.log(`🎯 Trip ${index + 1}: ${trip.title}`);
      console.log(`   📅 Dates: ${trip.start_date} → ${trip.end_date} (${duration} days)`);
      console.log(`   🏷️  Type: ${trip.type}`);
      console.log(`   📍 Status: ${trip.status} (${category})`);
      console.log(`   🌎 Regions: ${trip.regions ? trip.regions.join(', ') : 'None specified'}`);
      console.log(`   🏢 Main Clients: ${trip.main_clients ? trip.main_clients.join(', ') : 'None specified'}`);
      console.log(`   💰 Estimated Cost: ${trip.estimated_cost ? `$${trip.estimated_cost.toLocaleString()}` : 'Not specified'}`);
      console.log(`   📝 Description: ${trip.description || 'No description'}`);
      console.log('');
    });

    // Count by category
    const now = new Date();
    const currentAndUpcoming = trips?.filter(trip => {
      const start = new Date(trip.start_date);
      const end = new Date(trip.end_date);
      return now <= end; // Either upcoming or ongoing
    }).length || 0;

    const past = trips?.filter(trip => {
      const end = new Date(trip.end_date);
      return now > end;
    }).length || 0;

    console.log('📈 Dashboard Summary:');
    console.log(`   🔮 Current & Upcoming Trips: ${currentAndUpcoming}`);
    console.log(`   📚 Past Trips: ${past}`);
    console.log(`   📊 Total Trips: ${trips?.length || 0}`);

    console.log('\n🎨 Dashboard Preview:');
    console.log('┌─────────────────────────────────────────────────────────────────┐');
    console.log('│                     WOLTHERS TRAVEL DASHBOARD                   │');
    console.log('└─────────────────────────────────────────────────────────────────┘');
    console.log('');
    
    if (currentAndUpcoming > 0) {
      console.log('🔮 CURRENT & UPCOMING TRIPS SECTION:');
      trips?.forEach(trip => {
        const end = new Date(trip.end_date);
        if (now <= end) {
          console.log(`   📋 Card: "${trip.title}"`);
          console.log(`       Clients: ${trip.main_clients ? trip.main_clients.slice(0,2).join(', ') : 'No clients'}`);
          console.log(`       Duration: ${Math.ceil((end.getTime() - new Date(trip.start_date).getTime()) / (1000 * 3600 * 24))} days`);
          console.log(`       Type: ${trip.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`);
          console.log(`       Regions: ${trip.regions ? trip.regions.join(', ') : 'No regions'}`);
          if (trip.estimated_cost) {
            console.log(`       Cost: $${trip.estimated_cost.toLocaleString()}`);
          }
          console.log('');
        }
      });
    } else {
      console.log('🔮 CURRENT & UPCOMING TRIPS SECTION:');
      console.log('   📝 "No current or upcoming trips found."');
      console.log('');
    }

    if (past > 0) {
      console.log('📚 PAST TRIPS SECTION:');
      trips?.forEach(trip => {
        const end = new Date(trip.end_date);
        if (now > end) {
          console.log(`   📋 Card: "${trip.title}" (GRAYED OUT)`);
          console.log(`       Clients: ${trip.main_clients ? trip.main_clients.slice(0,2).join(', ') : 'No clients'}`);
          console.log(`       Duration: ${Math.ceil((end.getTime() - new Date(trip.start_date).getTime()) / (1000 * 3600 * 24))} days`);
          console.log(`       Type: ${trip.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`);
          console.log(`       Regions: ${trip.regions ? trip.regions.join(', ') : 'No regions'}`);
          if (trip.estimated_cost) {
            console.log(`       Cost: $${trip.estimated_cost.toLocaleString()}`);
          }
          console.log('');
        }
      });
    } else {
      console.log('📚 PAST TRIPS SECTION:');
      console.log('   📝 "No past trips found."');
      console.log('');
    }

  } catch (error) {
    console.error('❌ Script failed:', error);
  }
}

getDashboardData();