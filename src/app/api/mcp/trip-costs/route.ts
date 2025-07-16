import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trip_status = searchParams.get('trip_status');
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');
    const client_billable_only = searchParams.get('client_billable_only') === 'true';

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let query = supabase
      .from('trip_cost_summary')
      .select('*');

    if (trip_status) {
      query = query.eq('status', trip_status);
    }

    if (start_date) {
      query = query.gte('start_date', start_date);
    }

    if (end_date) {
      query = query.lte('end_date', end_date);
    }

    if (client_billable_only) {
      query = query.gt('client_billable_total', 0);
    }

    const { data, error } = await query.order('start_date', { ascending: false });

    if (error) {
      throw error;
    }

    // Additional client billing summary if needed
    let clientBillingData = null;
    if (client_billable_only) {
      const { data: billingData, error: billingError } = await supabase
        .from('finance_client_billing_summary')
        .select('*')
        .order('start_date', { ascending: false });

      if (billingError) {
        throw billingError;
      }
      clientBillingData = billingData;
    }

    return NextResponse.json({
      success: true,
      data: {
        trip_costs: data,
        client_billing: clientBillingData,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Trip costs API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}