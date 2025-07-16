import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const due_date_start = searchParams.get('due_date_start');
    const due_date_end = searchParams.get('due_date_end');
    const currency = searchParams.get('currency');

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let query = supabase
      .from('finance_reimbursement_summary')
      .select('*');

    if (due_date_start && due_date_end) {
      // Filter by due date range
      query = query.or(`and(card_due_date.gte.${due_date_start.split('-')[2]},card_due_date.lte.${due_date_end.split('-')[2]})`);
    }

    if (currency) {
      query = query.eq('expense_currency', currency);
    }

    const { data, error } = await query.order('card_due_date', { ascending: true });

    if (error) {
      throw error;
    }

    // Group by due date and calculate totals
    const groupedData = data.reduce((acc: any, item: any) => {
      const key = `${item.card_due_date}-${item.expense_currency}`;
      if (!acc[key]) {
        acc[key] = {
          due_date: item.card_due_date,
          currency: item.expense_currency,
          total_amount: 0,
          total_usd_amount: 0,
          employees: [],
          total_expenses: 0,
        };
      }
      acc[key].total_amount += parseFloat(item.total_amount);
      acc[key].total_usd_amount += parseFloat(item.total_usd_amount);
      acc[key].total_expenses += item.expense_count;
      acc[key].employees.push({
        name: item.employee_name,
        email: item.employee_email,
        last_four: item.last_four_digits,
        amount: item.total_amount,
        usd_amount: item.total_usd_amount,
        expense_count: item.expense_count,
        trip_title: item.trip_title,
      });
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: Object.values(groupedData),
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Reimbursements API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}