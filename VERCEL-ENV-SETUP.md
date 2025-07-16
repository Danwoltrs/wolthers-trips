# Vercel Environment Variables Setup

## 🚨 Critical Issue: API Routes Returning 500 Errors

The main app is working, but API routes are failing. This is likely due to environment variables not being properly configured in Vercel's production environment.

## 🔧 Solution: Import Environment Variables

### Method 1: Import .env File (Recommended)

1. **Download the file**: `vercel-env-import.env` (created in this project)
2. **Go to Vercel Dashboard**: https://vercel.com/dashboard
3. **Select your project**: `wolthers-trips`
4. **Navigate to**: Settings → Environment Variables
5. **Click**: "Import .env File"
6. **Upload**: `vercel-env-import.env`
7. **Select Environment**: "Production"
8. **Click**: "Import"

### Method 2: Manual Entry

If import doesn't work, manually add these variables in Vercel Dashboard:

**Required Variables:**
```
NEXT_PUBLIC_SUPABASE_URL=https://ocbdrrzhautyybqmebsx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jYmRycnpoYXV0eXlicW1lYnN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNTQ2NTAsImV4cCI6MjA2NzgzMDY1MH0.NAxL4Bytqbg0vR2Q6yi8E68Ja-k297U07XZfGuH-tGU
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jYmRycnpoYXV0eXlicW1lYnN4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjI1NDY1MCwiZXhwIjoyMDY3ODMwNjUwfQ.hYgOQiwhZ3-dEg5_QQ8ZxuipB8fB4GCokPoKgOV2mvE
NEXTAUTH_SECRET=jJp+M/bEmzYmRFdL+x8IqZgLKOgF+19zOlXJnhXX0lE=
NEXTAUTH_URL=https://wolthers-trips.vercel.app
NEXT_PUBLIC_APP_URL=https://wolthers-trips.vercel.app
NODE_ENV=production
```

**Optional Email Configuration:**
```
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=trips@trips.wolthers.com
SMTP_PASSWORD=whvZYkvo68^s$E
SMTP_FROM=trips@trips.wolthers.com
```

### Method 3: Vercel CLI

If you have Vercel CLI installed:

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
vercel env add NEXT_PUBLIC_APP_URL production
vercel env add NODE_ENV production
```

## 🔍 After Setting Variables

1. **Trigger a redeployment**: Go to Vercel Dashboard → Deployments → Click "Redeploy"
2. **Test the endpoints**:
   - Health: `https://wolthers-trips.vercel.app/api/health`
   - Debug: `https://wolthers-trips.vercel.app/api/debug`
   - MCP: `https://wolthers-trips.vercel.app/api/mcp/reimbursements`

## 📋 Expected Results

After setting environment variables correctly:

### Health Endpoint Should Return:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-16T...",
  "database": "connected",
  "storage": "connected",
  "environment": "production",
  "buckets": {
    "existing": ["receipts", "dashboard-photos", "documents"],
    "missing": [],
    "required": ["receipts", "dashboard-photos", "documents"]
  }
}
```

### Debug Endpoint Should Return:
```json
{
  "timestamp": "2025-01-16T...",
  "environment": {
    "NEXT_PUBLIC_SUPABASE_URL": true,
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": true,
    "SUPABASE_SERVICE_ROLE_KEY": true,
    "NODE_ENV": "production"
  }
}
```

## 🎯 Current Status

✅ **Working:**
- Main app: https://wolthers-trips.vercel.app
- Dashboard: https://wolthers-trips.vercel.app/dashboard
- Test page: https://wolthers-trips.vercel.app/test-page
- Database connection (confirmed)
- Storage buckets (confirmed)

❌ **Not Working:**
- API routes (500 errors)
- Health endpoint
- MCP endpoints

## 🚀 Next Steps

1. Set environment variables using one of the methods above
2. Redeploy the application
3. Test the API endpoints
4. If still failing, check Vercel function logs for specific errors

The MCP integration is ready to use locally with the production database once the API routes are working!