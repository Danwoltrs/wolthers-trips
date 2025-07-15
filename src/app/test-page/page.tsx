'use client'

import { useState } from 'react'
import { testDatabaseConnection } from '@/lib/supabase'
import { testStorageConnection } from '@/lib/storage'

export default function TestPage() {
  const [dbResult, setDbResult] = useState<any>(null)
  const [storageResult, setStorageResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testDatabase = async () => {
    setLoading(true)
    try {
      const result = await testDatabaseConnection()
      setDbResult(result)
      console.log('Database test result:', result)
    } catch (error) {
      console.error('Database test failed:', error)
      setDbResult({ error: error.message })
    }
    setLoading(false)
  }

  const testStorage = async () => {
    setLoading(true)
    try {
      const result = await testStorageConnection()
      setStorageResult(result)
      console.log('Storage test result:', result)
    } catch (error) {
      console.error('Storage test failed:', error)
      setStorageResult({ error: error.message })
    }
    setLoading(false)
  }

  const testBoth = async () => {
    setLoading(true)
    await testDatabase()
    await testStorage()
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Wolthers Travel App - Connection Test
            </h1>
            
            {/* Test Buttons */}
            <div className="space-y-4 mb-8">
              <div className="flex space-x-4">
                <button
                  onClick={testDatabase}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium"
                >
                  {loading ? 'Testing...' : 'Test Database'}
                </button>
                
                <button
                  onClick={testStorage}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium"
                >
                  {loading ? 'Testing...' : 'Test Storage'}
                </button>
                
                <button
                  onClick={testBoth}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium"
                >
                  {loading ? 'Testing...' : 'Test Both'}
                </button>
              </div>
            </div>

            {/* Database Results */}
            {dbResult && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Database Test Results</h2>
                <div className={`p-4 rounded-md ${dbResult.error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                  {dbResult.error ? (
                    <div>
                      <p className="text-red-800 font-medium">❌ Database Connection Failed</p>
                      <p className="text-red-600 text-sm mt-1">{dbResult.error}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-green-800 font-medium">✅ Database Connected Successfully!</p>
                      {dbResult.data && (
                        <div className="mt-2 text-sm text-green-700">
                          <p><strong>Company found:</strong> {dbResult.data.name}</p>
                          <p><strong>Fantasy name:</strong> {dbResult.data.fantasy_name}</p>
                          <p><strong>Industry:</strong> {dbResult.data.industry}</p>
                          <p><strong>Created:</strong> {new Date(dbResult.data.created_at).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Storage Results */}
            {storageResult !== null && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Storage Test Results</h2>
                <div className={`p-4 rounded-md ${!storageResult ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                  {!storageResult ? (
                    <div>
                      <p className="text-red-800 font-medium">❌ Storage Connection Failed</p>
                      <p className="text-red-600 text-sm mt-1">Check console for details</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-green-800 font-medium">✅ Storage Connected Successfully!</p>
                      <p className="text-green-700 text-sm mt-1">All required buckets are available</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Environment Check */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Environment Configuration</h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Supabase URL:</p>
                    <p className="text-gray-600 font-mono">
                      {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configured' : '❌ Missing'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Supabase Anon Key:</p>
                    <p className="text-gray-600 font-mono">
                      {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configured' : '❌ Missing'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">SMTP Host:</p>
                    <p className="text-gray-600 font-mono">
                      {process.env.SMTP_HOST ? '✅ Configured' : '❌ Missing'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Environment:</p>
                    <p className="text-gray-600 font-mono">
                      {process.env.NODE_ENV || 'development'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="font-medium text-blue-900 mb-2">Next Steps:</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>1. ✅ Database schema created</li>
                <li>2. ✅ Storage buckets configured</li>
                <li>3. 🔄 Test connections (use buttons above)</li>
                <li>4. 📱 Build authentication system</li>
                <li>5. 🚀 Start building the app interface</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}