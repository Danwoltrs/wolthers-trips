const { createClient } = require('@supabase/supabase-js');
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

const supabase = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY);

async function createStorageBuckets() {
  try {
    console.log('🪣 Creating storage buckets...\n');

    const buckets = [
      {
        name: 'receipts',
        options: {
          public: false,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
          fileSizeLimit: 52428800, // 50MB
        }
      },
      {
        name: 'dashboard-photos',
        options: {
          public: false,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
          fileSizeLimit: 10485760, // 10MB
        }
      },
      {
        name: 'documents',
        options: {
          public: false,
          allowedMimeTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
          fileSizeLimit: 104857600, // 100MB
        }
      }
    ];

    for (const bucket of buckets) {
      console.log(`Creating bucket: ${bucket.name}`);
      
      const { data, error } = await supabase.storage.createBucket(bucket.name, bucket.options);
      
      if (error) {
        if (error.message.includes('already exists')) {
          console.log(`✅ Bucket '${bucket.name}' already exists`);
        } else {
          console.error(`❌ Error creating bucket '${bucket.name}':`, error);
        }
      } else {
        console.log(`✅ Created bucket '${bucket.name}' successfully`);
      }
    }

    // Test bucket access
    console.log('\n🔍 Testing bucket access...');
    const { data: listData, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError);
    } else {
      console.log('✅ Available buckets:');
      listData.forEach(bucket => {
        console.log(`  - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
      });
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

createStorageBuckets();