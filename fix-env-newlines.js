const fs = require('fs');
const path = require('path');

// Read the current .env.local file
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

console.log('🔧 Fixing environment variable newlines...\n');

// Clean up the service role key
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jYmRycnpoYXV0eXlicW1lYnN4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjI1NDY1MCwiZXhwIjoyMDY3ODMwNjUwfQ.hYgOQiwhZ3-dEg5_QQ8ZxuipB8fB4GCokPoKgOV2mvE';

console.log('✅ Clean Service Role Key:');
console.log(serviceRoleKey);
console.log('');

// Create a new clean .env file for Vercel
const cleanEnvContent = `# Vercel Environment Variables - CLEAN VERSION
# NO NEWLINES OR EXTRA CHARACTERS

NEXT_PUBLIC_SUPABASE_URL=https://ocbdrrzhautyybqmebsx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jYmRycnpoYXV0eXlicW1lYnN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNTQ2NTAsImV4cCI6MjA2NzgzMDY1MH0.NAxL4Bytqbg0vR2Q6yi8E68Ja-k297U07XZfGuH-tGU
SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}
NEXTAUTH_SECRET=jJp+M/bEmzYmRFdL+x8IqZgLKOgF+19zOlXJnhXX0lE=
NEXTAUTH_URL=https://wolthers-trips.vercel.app
NEXT_PUBLIC_APP_URL=https://wolthers-trips.vercel.app
NODE_ENV=production
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=trips@trips.wolthers.com
SMTP_PASSWORD=whvZYkvo68^s$E
SMTP_FROM=trips@trips.wolthers.com`;

// Write the clean version
fs.writeFileSync(path.join(__dirname, 'vercel-env-clean.env'), cleanEnvContent);

console.log('✅ Created clean environment file: vercel-env-clean.env');
console.log('');
console.log('🚀 Next steps:');
console.log('1. Go to Vercel Dashboard → Settings → Environment Variables');
console.log('2. DELETE the current SUPABASE_SERVICE_ROLE_KEY variable');
console.log('3. ADD it again with this clean value (no newlines):');
console.log('');
console.log('SUPABASE_SERVICE_ROLE_KEY');
console.log(serviceRoleKey);
console.log('');
console.log('4. Or import the vercel-env-clean.env file');
console.log('5. Redeploy your application');

// Also create individual key files for easy copy/paste
fs.writeFileSync(path.join(__dirname, 'clean-service-key.txt'), serviceRoleKey);
fs.writeFileSync(path.join(__dirname, 'clean-anon-key.txt'), 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jYmRycnpoYXV0eXlicW1lYnN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNTQ2NTAsImV4cCI6MjA2NzgzMDY1MH0.NAxL4Bytqbg0vR2Q6yi8E68Ja-k297U07XZfGuH-tGU');

console.log('✅ Created individual key files for easy copy/paste:');
console.log('  - clean-service-key.txt');
console.log('  - clean-anon-key.txt');