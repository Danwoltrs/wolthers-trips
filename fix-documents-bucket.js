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

async function fixDocumentsBucket() {
  try {
    console.log('🔧 Fixing documents bucket...\n');

    // Check if documents bucket exists
    const { data: listData, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError);
      return;
    }

    const documentsExists = listData.some(bucket => bucket.name === 'documents');
    
    if (!documentsExists) {
      console.log('Creating documents bucket...');
      
      const { data, error } = await supabase.storage.createBucket('documents', {
        public: false,
        fileSizeLimit: 104857600, // 100MB
      });
      
      if (error) {
        console.error('❌ Error creating documents bucket:', error);
      } else {
        console.log('✅ Created documents bucket successfully');
      }
    } else {
      console.log('✅ Documents bucket already exists');
    }

    // List all buckets
    const { data: finalBuckets, error: finalError } = await supabase.storage.listBuckets();
    
    if (finalError) {
      console.error('❌ Error listing final buckets:', finalError);
    } else {
      console.log('\n✅ All buckets:');
      finalBuckets.forEach(bucket => {
        console.log(`  - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
      });
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

fixDocumentsBucket();