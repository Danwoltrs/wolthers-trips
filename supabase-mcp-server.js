#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const server = new Server(
  {
    name: "supabase-wolthers-trips",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Tool 1: Query pending reimbursements by due date
server.setRequestHandler("list_tools", async () => {
  return {
    tools: [
      {
        name: "get_pending_reimbursements_by_due_date",
        description: "Query pending reimbursements by credit card due date to prioritize payments",
        inputSchema: {
          type: "object",
          properties: {
            due_date_start: {
              type: "string",
              format: "date",
              description: "Start date for due date range (YYYY-MM-DD)",
            },
            due_date_end: {
              type: "string", 
              format: "date",
              description: "End date for due date range (YYYY-MM-DD)",
            },
            currency: {
              type: "string",
              description: "Filter by currency (e.g., USD, BRL, EUR)",
            },
          },
        },
      },
      {
        name: "get_trip_cost_summaries",
        description: "Get trip cost summaries for client billing preparation",
        inputSchema: {
          type: "object",
          properties: {
            trip_status: {
              type: "string",
              enum: ["draft", "proposal", "confirmed", "in_progress", "completed", "cancelled"],
              description: "Filter by trip status",
            },
            start_date: {
              type: "string",
              format: "date", 
              description: "Filter trips starting from this date (YYYY-MM-DD)",
            },
            end_date: {
              type: "string",
              format: "date",
              description: "Filter trips ending before this date (YYYY-MM-DD)",
            },
            client_billable_only: {
              type: "boolean",
              description: "Only include trips with client billable expenses",
              default: false,
            },
          },
        },
      },
      {
        name: "check_meeting_confirmation_status",
        description: "Check meeting confirmation status for upcoming meetings",
        inputSchema: {
          type: "object",
          properties: {
            date_from: {
              type: "string",
              format: "date",
              description: "Start date to check meetings from (YYYY-MM-DD)",
            },
            date_to: {
              type: "string",
              format: "date", 
              description: "End date to check meetings to (YYYY-MM-DD)",
            },
            confirmation_status: {
              type: "string",
              enum: ["pending", "confirmed", "cancelled", "needs_reschedule"],
              description: "Filter by confirmation status",
            },
            trip_id: {
              type: "string",
              description: "Filter by specific trip ID",
            },
          },
        },
      },
      {
        name: "analyze_expenses_by_category_currency",
        description: "Analyze expenses by category and currency for reporting",
        inputSchema: {
          type: "object",
          properties: {
            start_date: {
              type: "string",
              format: "date",
              description: "Start date for expense analysis (YYYY-MM-DD)",
            },
            end_date: {
              type: "string",
              format: "date",
              description: "End date for expense analysis (YYYY-MM-DD)",
            },
            trip_id: {
              type: "string",
              description: "Filter by specific trip ID",
            },
            user_id: {
              type: "string",
              description: "Filter by specific user ID",
            },
            group_by: {
              type: "string",
              enum: ["category", "currency", "user", "trip"],
              description: "Primary grouping field",
              default: "category",
            },
          },
        },
      },
    ],
  };
});

// Tool handlers
server.setRequestHandler("call_tool", async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "get_pending_reimbursements_by_due_date":
        return await handlePendingReimbursements(args);
      case "get_trip_cost_summaries":
        return await handleTripCostSummaries(args);
      case "check_meeting_confirmation_status":
        return await handleMeetingConfirmationStatus(args);
      case "analyze_expenses_by_category_currency":
        return await handleExpenseAnalysis(args);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
    };
  }
});

async function handlePendingReimbursements(args) {
  const { due_date_start, due_date_end, currency } = args;

  let query = supabase
    .from('finance_reimbursement_summary')
    .select('*');

  if (due_date_start && due_date_end) {
    // Calculate the next due date for each card based on due_date field
    query = query.or(`and(card_due_date.gte.${due_date_start.split('-')[2]},card_due_date.lte.${due_date_end.split('-')[2]})`);
  }

  if (currency) {
    query = query.eq('expense_currency', currency);
  }

  const { data, error } = await query.order('card_due_date', { ascending: true });

  if (error) throw error;

  // Group by due date and calculate totals
  const groupedData = data.reduce((acc, item) => {
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

  return {
    content: [
      {
        type: "text",
        text: `Pending Reimbursements by Due Date:\n\n${JSON.stringify(Object.values(groupedData), null, 2)}`,
      },
    ],
  };
}

async function handleTripCostSummaries(args) {
  const { trip_status, start_date, end_date, client_billable_only } = args;

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

  if (error) throw error;

  // Additional client billing summary if needed
  let clientBillingData = null;
  if (client_billable_only) {
    const { data: billingData, error: billingError } = await supabase
      .from('finance_client_billing_summary')
      .select('*')
      .order('start_date', { ascending: false });

    if (billingError) throw billingError;
    clientBillingData = billingData;
  }

  return {
    content: [
      {
        type: "text",
        text: `Trip Cost Summaries:\n\n${JSON.stringify(data, null, 2)}${
          clientBillingData ? `\n\nClient Billing Summary:\n${JSON.stringify(clientBillingData, null, 2)}` : ''
        }`,
      },
    ],
  };
}

async function handleMeetingConfirmationStatus(args) {
  const { date_from, date_to, confirmation_status, trip_id } = args;

  let query = supabase
    .from('meetings')
    .select(`
      id,
      title,
      description,
      meeting_date,
      start_time,
      end_time,
      status,
      confirmation_status,
      confirmation_method,
      notes,
      follow_up_required,
      follow_up_date,
      trip_id,
      trips!inner(title, start_date, end_date),
      company_locations!inner(name, city, country),
      company_contacts!inner(full_name, email, phone)
    `);

  if (date_from) {
    query = query.gte('meeting_date', date_from);
  }

  if (date_to) {
    query = query.lte('meeting_date', date_to);
  }

  if (confirmation_status) {
    query = query.eq('confirmation_status', confirmation_status);
  }

  if (trip_id) {
    query = query.eq('trip_id', trip_id);
  }

  const { data, error } = await query.order('meeting_date', { ascending: true });

  if (error) throw error;

  // Group by confirmation status
  const statusSummary = data.reduce((acc, meeting) => {
    const status = meeting.confirmation_status;
    if (!acc[status]) {
      acc[status] = {
        count: 0,
        meetings: [],
      };
    }
    acc[status].count++;
    acc[status].meetings.push({
      id: meeting.id,
      title: meeting.title,
      date: meeting.meeting_date,
      time: meeting.start_time,
      trip: meeting.trips?.title,
      location: meeting.company_locations?.name,
      contact: meeting.company_contacts?.full_name,
      follow_up_required: meeting.follow_up_required,
    });
    return acc;
  }, {});

  return {
    content: [
      {
        type: "text",
        text: `Meeting Confirmation Status:\n\n${JSON.stringify(statusSummary, null, 2)}`,
      },
    ],
  };
}

async function handleExpenseAnalysis(args) {
  const { start_date, end_date, trip_id, user_id, group_by } = args;

  let query = supabase
    .from('expenses')
    .select(`
      id,
      amount,
      currency,
      usd_amount,
      category,
      description,
      transaction_date,
      approval_status,
      billing_status,
      client_billable,
      reimbursement_status,
      user_id,
      trip_id,
      users!inner(full_name, email),
      trips!inner(title, start_date, end_date)
    `);

  if (start_date) {
    query = query.gte('transaction_date', start_date);
  }

  if (end_date) {
    query = query.lte('transaction_date', end_date);
  }

  if (trip_id) {
    query = query.eq('trip_id', trip_id);
  }

  if (user_id) {
    query = query.eq('user_id', user_id);
  }

  const { data, error } = await query.order('transaction_date', { ascending: false });

  if (error) throw error;

  // Group and analyze data
  const analysis = data.reduce((acc, expense) => {
    const groupKey = group_by === 'category' ? expense.category :
                     group_by === 'currency' ? expense.currency :
                     group_by === 'user' ? expense.users?.full_name :
                     group_by === 'trip' ? expense.trips?.title :
                     expense.category;

    if (!acc[groupKey]) {
      acc[groupKey] = {
        total_amount: 0,
        total_usd_amount: 0,
        expense_count: 0,
        currencies: new Set(),
        categories: new Set(),
        client_billable_amount: 0,
        pending_reimbursement: 0,
        expenses: [],
      };
    }

    acc[groupKey].total_amount += parseFloat(expense.amount);
    acc[groupKey].total_usd_amount += parseFloat(expense.usd_amount || 0);
    acc[groupKey].expense_count += 1;
    acc[groupKey].currencies.add(expense.currency);
    acc[groupKey].categories.add(expense.category);

    if (expense.client_billable) {
      acc[groupKey].client_billable_amount += parseFloat(expense.usd_amount || 0);
    }

    if (expense.reimbursement_status === 'pending') {
      acc[groupKey].pending_reimbursement += parseFloat(expense.usd_amount || 0);
    }

    acc[groupKey].expenses.push({
      id: expense.id,
      amount: expense.amount,
      currency: expense.currency,
      category: expense.category,
      date: expense.transaction_date,
      user: expense.users?.full_name,
      trip: expense.trips?.title,
    });

    return acc;
  }, {});

  // Convert Sets to Arrays for JSON serialization
  Object.values(analysis).forEach(group => {
    group.currencies = Array.from(group.currencies);
    group.categories = Array.from(group.categories);
  });

  return {
    content: [
      {
        type: "text",
        text: `Expense Analysis (grouped by ${group_by}):\n\n${JSON.stringify(analysis, null, 2)}`,
      },
    ],
  };
}

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);