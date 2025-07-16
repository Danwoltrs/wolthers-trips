'use client';

import { useEffect, useState } from 'react';

interface HealthCheck {
  status: string;
  timestamp: string;
  database: string;
  environment: string;
  supabase_url?: string;
  error?: string;
}

interface ReimbursementData {
  due_date: number;
  currency: string;
  total_amount: number;
  total_usd_amount: number;
  total_expenses: number;
  employees: Array<{
    name: string;
    email: string;
    last_four: string;
    amount: number;
    usd_amount: number;
    expense_count: number;
    trip_title: string;
  }>;
}

export default function Dashboard() {
  const [health, setHealth] = useState<HealthCheck | null>(null);
  const [reimbursements, setReimbursements] = useState<ReimbursementData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Health check
        const healthResponse = await fetch('/api/health');
        const healthData = await healthResponse.json();
        setHealth(healthData);

        // Reimbursements
        const reimbursementsResponse = await fetch('/api/mcp/reimbursements');
        const reimbursementsData = await reimbursementsResponse.json();
        if (reimbursementsData.success) {
          setReimbursements(reimbursementsData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Wolthers Trips Dashboard
        </h1>

        {/* Health Check */}
        <div className="mb-8">
          <div className={`p-4 rounded-lg ${
            health?.status === 'healthy' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <h2 className="text-lg font-semibold mb-2">System Health</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Status:</span>{' '}
                <span className={health?.status === 'healthy' ? 'text-green-600' : 'text-red-600'}>
                  {health?.status || 'Unknown'}
                </span>
              </div>
              <div>
                <span className="font-medium">Database:</span>{' '}
                <span className={health?.database === 'connected' ? 'text-green-600' : 'text-red-600'}>
                  {health?.database || 'Unknown'}
                </span>
              </div>
              <div>
                <span className="font-medium">Environment:</span>{' '}
                {health?.environment || 'Unknown'}
              </div>
              <div>
                <span className="font-medium">Last Check:</span>{' '}
                {health?.timestamp ? new Date(health.timestamp).toLocaleTimeString() : 'Unknown'}
              </div>
            </div>
            {health?.error && (
              <div className="mt-2 text-red-600 text-sm">
                Error: {health.error}
              </div>
            )}
          </div>
        </div>

        {/* Pending Reimbursements */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Pending Reimbursements
          </h2>
          
          {reimbursements.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow border">
              <p className="text-gray-600">No pending reimbursements found.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {reimbursements.map((reimbursement, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow border">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Due: {reimbursement.due_date}th of month
                      </h3>
                      <p className="text-gray-600">
                        {reimbursement.currency} {reimbursement.total_amount.toFixed(2)} 
                        {reimbursement.currency !== 'USD' && 
                          ` (${reimbursement.total_usd_amount.toFixed(2)} USD)`
                        }
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {reimbursement.total_expenses} expenses
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {reimbursement.employees.map((employee, empIndex) => (
                      <div key={empIndex} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-gray-600">{employee.email}</p>
                          <p className="text-sm text-gray-600">Card: ****{employee.last_four}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {employee.amount} {reimbursement.currency}
                          </p>
                          <p className="text-sm text-gray-600">
                            {employee.expense_count} expenses
                          </p>
                          <p className="text-xs text-gray-500">
                            {employee.trip_title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MCP Information */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            MCP Server Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium mb-2">Available API Endpoints:</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• /api/health - System health check</li>
                <li>• /api/mcp/reimbursements - Pending reimbursements</li>
                <li>• /api/mcp/trip-costs - Trip cost summaries</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">MCP Tools Available:</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• get_pending_reimbursements_by_due_date</li>
                <li>• get_trip_cost_summaries</li>
                <li>• check_meeting_confirmation_status</li>
                <li>• analyze_expenses_by_category_currency</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}