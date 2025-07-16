const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const envVars = {};
envContent.split('\n').forEach(line => {
  if (line.trim() && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    envVars[key] = valueParts.join('=');
  }
});

console.log('🔍 Environment Variables Verification\n');

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
  'SUPABASE_SERVICE_ROLE_KEY',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASSWORD',
  'SMTP_FROM',
  'NEXTAUTH_SECRET'
];

const optionalVars = [
  'NEXTAUTH_URL',
  'NEXT_PUBLIC_APP_URL',
  'NODE_ENV',
  'CLAUDE_API_KEY',
  'OPENAI_API_KEY',
  'GOOGLE_MAPS_API_KEY',
  'HOTELS_COM_API_KEY',
  'MICROSOFT_CLIENT_ID',
  'MICROSOFT_CLIENT_SECRET'
];

console.log('✅ Required Variables:');
requiredVars.forEach(varName => {
  const value = envVars[varName];
  if (value) {
    const preview = value.length > 20 ? value.substring(0, 20) + '...' : value;
    console.log(`  ${varName}: ${preview}`);
  } else {
    console.log(`  ❌ ${varName}: MISSING`);
  }
});

console.log('\n📋 Optional Variables:');
optionalVars.forEach(varName => {
  const value = envVars[varName];
  if (value) {
    const preview = value.length > 20 ? value.substring(0, 20) + '...' : value;
    console.log(`  ${varName}: ${preview}`);
  } else {
    console.log(`  ⚠️  ${varName}: Not set`);
  }
});

// Check if all required variables are present
const missingRequired = requiredVars.filter(varName => !envVars[varName]);

if (missingRequired.length === 0) {
  console.log('\n🎉 All required environment variables are configured!');
} else {
  console.log('\n❌ Missing required variables:');
  missingRequired.forEach(varName => {
    console.log(`  - ${varName}`);
  });
}

// Generate Vercel CLI commands
console.log('\n🚀 Vercel CLI Commands to Set Variables:');
console.log('Run these commands in your terminal:\n');

requiredVars.concat(optionalVars).forEach(varName => {
  const value = envVars[varName];
  if (value) {
    console.log(`vercel env add ${varName} production`);
  }
});

console.log('\n💡 Or use the Vercel Dashboard:');
console.log('1. Go to https://vercel.com/dashboard');
console.log('2. Select your project: wolthers-trips');
console.log('3. Go to Settings → Environment Variables');
console.log('4. Import the vercel-env-import.env file');
console.log('5. Make sure all variables are set for "Production" environment');