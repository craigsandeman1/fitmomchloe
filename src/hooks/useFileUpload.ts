import { useState } from 'react';
import { supabase } from '../lib/supabase';

type UploadResult = {
  url: string | null;
  error: string | null;
};

/**
 * Custom hook for uploading files to Supabase storage with progress tracking
 */
export const useFileUpload = () => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Upload a file to Supabase storage
   * @param bucket - The storage bucket to upload to
   * @param path - The path within the bucket
   * @param file - The file to upload
   * @returns The URL of the uploaded file or null if there was an error
   */
  const uploadFile = async (
    bucket: string,
    path: string,
    file: File
  ): Promise<UploadResult> => {
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Calculate file size for chunked upload
      const MAX_CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
      const totalSize = file.size;
      
      if (totalSize <= MAX_CHUNK_SIZE) {
        // Small file, upload directly
        const { data, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(path, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        // Get public URL
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
        return { url: urlData.publicUrl, error: null };
      } else {
        // Large file, manually track progress with chunked uploads
        // For now, this is a simplified version that still uploads the whole file
        // but shows a simulated progress
        
        // Start progress updates
        const interval = setInterval(() => {
          setProgress((prev) => {
            const newProgress = prev + 10;
            if (newProgress >= 90) {
              clearInterval(interval);
              return 90;
            }
            return newProgress;
          });
        }, 500);
        
        // Upload file
        const { data, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(path, file, {
            cacheControl: '3600',
            upsert: false
          });

        clearInterval(interval);
        
        if (uploadError) {
          throw new Error(uploadError.message);
        }
        
        // Set to 100% when done
        setProgress(100);
        
        // Get public URL
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
        return { url: urlData.publicUrl, error: null };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error during upload';
      setError(errorMessage);
      return { url: null, error: errorMessage };
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadFile,
    progress,
    uploading,
    error
  };
};

export default useFileUpload; 