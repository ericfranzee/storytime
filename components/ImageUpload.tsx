'use client';

import React, { useState, useCallback, useEffect, ChangeEvent } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import type { PutBlobResult } from '@vercel/blob';
import { UploadCloud, Loader2, AlertCircle, CheckCircle, Trash2 } from 'lucide-react'; // Added Trash2
import { Button } from '@/components/ui/button'; // Import Button for delete
import { useToast } from '@/hooks/use-toast'; // Import useToast for feedback

interface ImageUploadProps {
  onUploadComplete: (url: string | null) => void; // Allow null for deletion
  uploadType: 'blog' | 'settings' | 'misc';
  className?: string;
  initialImageUrl?: string;
  // Optional: Callback specifically for delete completion
  onDeleteComplete?: (deletedUrl: string) => void;
}

interface FileUploadError {
  message: string;
  code?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadComplete,
  uploadType,
  className = '',
  initialImageUrl,
  onDeleteComplete,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(initialImageUrl || null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(initialImageUrl || null);
  const [isDeleting, setIsDeleting] = useState(false); // State for delete operation
  const { toast } = useToast(); // Initialize toast

  // Effect to update internal state if initialImageUrl prop changes after mount
  useEffect(() => {
    // Only update if the prop changes and it's different from the current state,
    // or if the internal state is null but the prop has a value.
    if (initialImageUrl && initialImageUrl !== uploadedUrl) {
      setPreview(initialImageUrl);
      setUploadedUrl(initialImageUrl);
      setError(null); // Reset error if initial image is provided/changed
    }
    // If the prop becomes null/undefined (e.g., parent clears it after delete), update internal state
    if (initialImageUrl === null && uploadedUrl !== null) {
        setPreview(null);
        setUploadedUrl(null);
    }
  }, [initialImageUrl, uploadedUrl]);


  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setError(null); // Reset error on new drop/selection

      if (fileRejections.length > 0) {
        setError(`File rejected: ${fileRejections[0].errors[0].message}`);
        return;
      }

      const file = acceptedFiles[0];
      if (!file) return;

      // Set preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setUploading(true);
      setUploadedUrl(null); // Clear previous success URL

      try {
        // Add the uploadType to the query parameters
        const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}&type=${uploadType}`, {
          method: 'POST',
          body: file,
          headers: {
            'Content-Type': file.type, // Important for Vercel Blob
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Upload failed with status: ${response.status}`);
        }

        const newBlob = (await response.json()) as PutBlobResult;
        setUploadedUrl(newBlob.url);
        onUploadComplete(newBlob.url); // Call the callback with the final URL
        setError(null); // Clear error on success
      } catch (err: any) {
        console.error('Upload error:', err);
        setError(err.message || 'Failed to upload image.');
        setPreview(null); // Clear preview on error
        setUploadedUrl(null);
      } finally {
        setUploading(false);
      }
    },
    [onUploadComplete, uploadType] // Added uploadType dependency
  );

  const handleDelete = useCallback(async (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the dropzone click
    if (!uploadedUrl) return;

    setIsDeleting(true);
    setError(null);
    const urlToDelete = uploadedUrl; // Store URL before clearing state

    try {
      const response = await fetch('/api/upload/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToDelete }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete image');
      }

      setPreview(null);
      setUploadedUrl(null);
      onUploadComplete(null); // Notify parent that the image is gone
      if (onDeleteComplete) {
        onDeleteComplete(urlToDelete); // Notify parent about successful deletion
      }
      toast({ title: "Success", description: "Image deleted successfully." });

    } catch (err: any) {
      console.error('Delete error:', err);
      setError(err.message || 'Failed to delete image.');
      toast({ title: "Error", description: err.message || 'Failed to delete image.', variant: "destructive" });
      // Keep the preview/URL if delete fails
    } finally {
      setIsDeleting(false);
    }
  }, [uploadedUrl, onUploadComplete, onDeleteComplete, toast]);


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.gif', '.jpg', '.webp'] },
    multiple: false,
    maxSize: 4.5 * 1024 * 1024,
    disabled: uploading || isDeleting, // Disable dropzone during upload/delete
  });

  // Prevent dropzone activation when clicking the delete button
  const dropzoneProps = getRootProps();
  const deleteButtonProps = {
      onClick: handleDelete,
      // Prevent dropzone's onClick if delete button is clicked
      onMouseDown: (e: React.MouseEvent) => e.stopPropagation(),
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    // ...existing code...
  };

  const handleUploadError = (error: FileUploadError) => {
    // ...existing code...
  };

  return (
    <div className={`relative ${className}`}> {/* Added relative positioning for delete button */}
      <div
        {...dropzoneProps}
        className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-gray-400 ${
          isDragActive ? 'border-blue-500 bg-blue-50' : ''
        } ${error ? 'border-red-500 bg-red-50' : ''} ${
          (uploading || isDeleting) ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        <input {...getInputProps()} disabled={uploading || isDeleting} />

        {uploading || isDeleting ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-2" />
            <p className="text-gray-500">{isDeleting ? 'Deleting...' : 'Uploading...'}</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-red-600">
            <AlertCircle className="h-8 w-8 mb-2" />
            <p className="font-semibold">Operation Failed</p> {/* Generic message */}
            <p className="text-sm">{error}</p>
            <p className="text-sm mt-2">Click or drag to retry upload.</p>
          </div>
        ) : uploadedUrl || preview ? (
          <div className="relative group"> {/* Keep relative for potential overlay */}
             <img
               src={uploadedUrl || preview || ''}
               alt="Preview"
               className="max-h-40 mx-auto rounded"
             />
             {/* Overlay to indicate successful upload or allow re-upload */}
             <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex flex-col items-center justify-center transition-opacity rounded">
               {uploadedUrl && !uploading && !isDeleting && (
                  <CheckCircle className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 mb-1 transition-opacity" />
               )}
               <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                 {uploadedUrl ? 'Replace Image' : 'Click or drag to upload'}
               </p>
             </div>
           </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <UploadCloud className="h-10 w-10 mb-2" />
            {isDragActive ? (
              <p className="font-semibold">Drop the image here...</p>
            ) : (
              <p className="font-semibold">Drag & drop an image here, or click to select</p>
            )}
            <p className="text-sm mt-1">Max 4.5MB (JPG, PNG, GIF, WEBP)</p>
          </div>
        )}
      </div>
      {/* Delete Button - positioned absolutely */}
      {uploadedUrl && !uploading && !isDeleting && (
        <Button
          {...deleteButtonProps}
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 z-10 h-7 w-7" // Position top-right
          aria-label="Delete image"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ImageUpload; // Add the default export back
