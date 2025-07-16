// lib/storage.ts
import { supabase } from './supabase'

// Test storage connection
export async function testStorageConnection() {
  try {
    // Check environment variables first
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables')
      return { error: 'Missing Supabase environment variables' }
    }

    // List all buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('Storage connection failed:', bucketsError)
      return { error: `Storage connection failed: ${bucketsError.message}` }
    }

    console.log('✅ Storage connected successfully!')
    console.log('📁 Available buckets:', buckets?.map(b => b.name) || [])
    
    // Check if our buckets exist
    const requiredBuckets = ['receipts', 'dashboard-photos', 'documents']
    const existingBuckets = buckets?.map(b => b.name) || []
    const missingBuckets = requiredBuckets.filter(bucket => !existingBuckets.includes(bucket))
    
    if (missingBuckets.length > 0) {
      console.warn('⚠️ Missing buckets:', missingBuckets)
      return { error: `Missing required buckets: ${missingBuckets.join(', ')}` }
    }
    
    console.log('✅ All required buckets exist!')
    return { success: true, buckets: existingBuckets }

  } catch (error) {
    console.error('Storage test failed:', error)
    return { error: error instanceof Error ? error.message : 'Unknown storage error' }
  }
}

// Upload receipt function
export async function uploadReceipt(file: File, userId: string, tripId: string) {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${tripId}/${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('receipts')
      .upload(fileName, file)

    if (error) {
      console.error('Receipt upload failed:', error)
      return { error }
    }

    console.log('✅ Receipt uploaded successfully:', data.path)
    return { data }

  } catch (error) {
    console.error('Receipt upload error:', error)
    return { error }
  }
}

// Upload dashboard photo function
export async function uploadDashboardPhoto(file: File, userId: string, vehicleLogId: string, type: 'start' | 'end') {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${vehicleLogId}/dashboard_${type}_${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('dashboard-photos')
      .upload(fileName, file)

    if (error) {
      console.error('Dashboard photo upload failed:', error)
      return { error }
    }

    console.log('✅ Dashboard photo uploaded successfully:', data.path)
    return { data }

  } catch (error) {
    console.error('Dashboard photo upload error:', error)
    return { error }
  }
}

// Get signed URL for viewing files
export async function getFileUrl(bucket: string, path: string) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 3600) // 1 hour expiry

    if (error) {
      console.error('Failed to get file URL:', error)
      return { error }
    }

    return { url: data.signedUrl }

  } catch (error) {
    console.error('Get file URL error:', error)
    return { error }
  }
}

// Delete file function
export async function deleteFile(bucket: string, path: string) {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      console.error('File deletion failed:', error)
      return { error }
    }

    console.log('✅ File deleted successfully:', path)
    return { success: true }

  } catch (error) {
    console.error('File deletion error:', error)
    return { error }
  }
}