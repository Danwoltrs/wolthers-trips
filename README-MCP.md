# Supabase MCP Server for Wolthers Trips

This MCP (Model Context Protocol) server provides tools to query and analyze data from the Wolthers Trips Supabase database.

## Setup

### Prerequisites

1. Node.js installed
2. Access to the Wolthers Trips Supabase database
3. Required environment variables configured

### Installation

1. Install required dependencies:
```bash
npm install @modelcontextprotocol/sdk @supabase/supabase-js zod
```

2. Make the server executable:
```bash
chmod +x supabase-mcp-server.js
```

3. Configure your Claude Desktop settings to include the MCP server:
   - Add the contents of `mcp-config.json` to your Claude Desktop configuration
   - Update the `cwd` path to match your project location

## Available Tools

### 1. `get_pending_reimbursements_by_due_date`
Query pending reimbursements by credit card due date to prioritize payments.

**Parameters:**
- `due_date_start` (optional): Start date for due date range (YYYY-MM-DD)
- `due_date_end` (optional): End date for due date range (YYYY-MM-DD)
- `currency` (optional): Filter by currency (e.g., USD, BRL, EUR)

**Usage:**
```
Get pending reimbursements due between January 1-15, 2025 in USD
```

### 2. `get_trip_cost_summaries`
Get trip cost summaries for client billing preparation.

**Parameters:**
- `trip_status` (optional): Filter by trip status (draft, proposal, confirmed, in_progress, completed, cancelled)
- `start_date` (optional): Filter trips starting from this date (YYYY-MM-DD)
- `end_date` (optional): Filter trips ending before this date (YYYY-MM-DD)
- `client_billable_only` (optional): Only include trips with client billable expenses (default: false)

**Usage:**
```
Get cost summaries for completed trips with client billable expenses from December 2024
```

### 3. `check_meeting_confirmation_status`
Check meeting confirmation status for upcoming meetings.

**Parameters:**
- `date_from` (optional): Start date to check meetings from (YYYY-MM-DD)
- `date_to` (optional): End date to check meetings to (YYYY-MM-DD)
- `confirmation_status` (optional): Filter by confirmation status (pending, confirmed, cancelled, needs_reschedule)
- `trip_id` (optional): Filter by specific trip ID

**Usage:**
```
Check confirmation status for meetings in the next 2 weeks
```

### 4. `analyze_expenses_by_category_currency`
Analyze expenses by category and currency for reporting.

**Parameters:**
- `start_date` (optional): Start date for expense analysis (YYYY-MM-DD)
- `end_date` (optional): End date for expense analysis (YYYY-MM-DD)
- `trip_id` (optional): Filter by specific trip ID
- `user_id` (optional): Filter by specific user ID
- `group_by` (optional): Primary grouping field (category, currency, user, trip) - default: category

**Usage:**
```
Analyze expenses by category for Q4 2024
```

## Database Views Used

The MCP server leverages the following database views:

- **finance_reimbursement_summary**: Aggregated reimbursement data by employee and card
- **trip_cost_summary**: Trip cost breakdowns with client billing information
- **finance_client_billing_summary**: Client billing preparation data

## Example Queries

### Check Urgent Reimbursements
```
Show me all pending reimbursements due in the next 5 days
```

### Client Billing Report
```
Get trip cost summaries for completed trips in 2024 that have client billable expenses
```

### Meeting Status Check
```
What meetings need confirmation for next week?
```

### Expense Analysis
```
Analyze expenses by currency for trips in December 2024
```

## Error Handling

The MCP server includes comprehensive error handling:
- Database connection errors
- Invalid parameter validation
- Missing environment variables
- Query execution errors

## Security

- Uses Supabase service role key for database access
- Respects Row Level Security (RLS) policies
- Environment variables are loaded securely
- No sensitive data is logged

## Environment Variables

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for database access

## Support

For issues or questions about the MCP server, please refer to the main project documentation or contact the development team.