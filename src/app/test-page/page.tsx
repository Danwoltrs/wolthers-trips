'use client'

import { useState } from 'react'
import { testDatabaseConnection } from '@/lib/supabase'
import { testStorageConnection } from '@/lib/storage'
import { ColorDemo } from '@/components/color-demo'

export default function TestPage() {
  const [dbResult, setDbResult] = useState<any>(null)
  const [storageResult, setStorageResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showColorDemo, setShowColorDemo] = useState(false)

  const testDatabase = async () => {
    setLoading(true)
    try {
      const result = await testDatabaseConnection()
      setDbResult(result)
      console.log('Database test result:', result)
    } catch (error) {
      console.error('Database test failed:', error)
      setDbResult({ error: error instanceof Error ? error.message : 'Unknown error' })
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
      setStorageResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    }
    setLoading(false)
  }

  const testBoth = async () => {
    setLoading(true)
    await testDatabase()
    await testStorage()
    setLoading(false)
  }

  if (showColorDemo) {
    return (
      <div>
        <div className="p-4 border-b border-border bg-background">
          <button 
            onClick={() => setShowColorDemo(false)}
            className="btn btn-outline"
          >
            ← Back to Tests
          </button>
        </div>
        <ColorDemo />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h1 className="card-title text-3xl">
                Wolthers Travel App - Connection Test
              </h1>
              <button 
                onClick={() => setShowColorDemo(true)}
                className="btn btn-primary"
              >
                View Color System
              </button>
            </div>
          </div>
          <div className="card-content">
            {/* Test Buttons */}
            <div className="space-y-4 mb-8">
              <div className="flex space-x-4">
                <button
                  onClick={testDatabase}
                  disabled={loading}
                  className="btn btn-primary disabled:opacity-50"
                >
                  {loading ? 'Testing...' : 'Test Database'}
                </button>
                
                <button
                  onClick={testStorage}
                  disabled={loading}
                  className="btn btn-secondary disabled:opacity-50"
                >
                  {loading ? 'Testing...' : 'Test Storage'}
                </button>
                
                <button
                  onClick={testBoth}
                  disabled={loading}
                  className="btn btn-outline disabled:opacity-50"
                >
                  {loading ? 'Testing...' : 'Test Both'}
                </button>
              </div>
            </div>

            {/* Database Results */}
            {dbResult && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">Database Test Results</h2>
                <div className={`p-4 rounded-lg border ${dbResult.error ? 'bg-destructive/10 border-destructive/20' : 'bg-accent/10 border-accent/20'}`}>
                  {dbResult.error ? (
                    <div>
                      <p className="text-destructive font-medium">❌ Database Connection Failed</p>
                      <p className="text-destructive/80 text-sm mt-1">{dbResult.error}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-accent-foreground font-medium">✅ Database Connected Successfully!</p>
                      {dbResult.data && (
                        <div className="mt-2 text-sm text-muted-foreground">
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
                <h2 className="text-xl font-semibold text-foreground mb-4">Storage Test Results</h2>
                <div className={`p-4 rounded-lg border ${storageResult.error ? 'bg-destructive/10 border-destructive/20' : 'bg-accent/10 border-accent/20'}`}>
                  {storageResult.error ? (
                    <div>
                      <p className="text-destructive font-medium">❌ Storage Connection Failed</p>
                      <p className="text-destructive/80 text-sm mt-1">{storageResult.error}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-accent-foreground font-medium">✅ Storage Connected Successfully!</p>
                      <p className="text-muted-foreground text-sm mt-1">All required buckets are available</p>
                      {storageResult.buckets && (
                        <p className="text-muted-foreground text-xs mt-1">Buckets: {storageResult.buckets.join(', ')}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Environment Check */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">Environment Configuration</h2>
              <div className="bg-muted p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-foreground">Supabase URL:</p>
                    <p className="text-muted-foreground font-mono">
                      {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configured' : '❌ Missing'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Supabase Anon Key:</p>
                    <p className="text-muted-foreground font-mono">
                      {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configured' : '❌ Missing'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">SMTP Host:</p>
                    <p className="text-muted-foreground font-mono">
                      {process.env.SMTP_HOST ? '✅ Configured' : '❌ Missing'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Environment:</p>
                    <p className="text-muted-foreground font-mono">
                      {process.env.NODE_ENV || 'development'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <h3 className="font-medium text-primary mb-2">Next Steps:</h3>
              <ul className="text-primary/80 text-sm space-y-1">
                <li>1. ✅ Database schema created</li>
                <li>2. ✅ Storage buckets configured</li>
                <li>3. ✅ Color system implemented</li>
                <li>4. 🔄 Test connections (use buttons above)</li>
                <li>5. 📱 Build authentication system</li>
                <li>6. 🚀 Start building the app interface</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}