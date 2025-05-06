"use client";

import React, { useState, useEffect, useMemo, useCallback, ChangeEvent } from 'react'; // Added ChangeEvent back
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { getFirestore, collection, addDoc, updateDoc, doc, serverTimestamp, Timestamp, getDoc } from 'firebase/firestore';
// Removed Firebase Storage imports: getStorage, ref, uploadBytes, getDownloadURL
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from '@/components/ImageUpload'; // Import the new component
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { showToast } from "@/lib/toast-utils";
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner';
import { generateSlug } from '@/lib/utils/string-utils'; // Import slug function
import { blogService } from '@/lib/firebase/blog-service'; // Import blogService

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface BlogPostData {
  title: string;
  content: string;
  featuredImageUrl?: string;
  slug: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

interface BlogEditorFormProps {
  postId?: string; // Optional: If provided, we are editing an existing post
  initialData?: Partial<BlogPostData>; // Optional: Initial data for editing
}

const BlogEditorForm: React.FC<BlogEditorFormProps> = ({ postId, initialData }) => {
  const [formData, setFormData] = useState<BlogPostData>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    featuredImageUrl: initialData?.featuredImageUrl || '',
    slug: initialData?.slug || '',
  });
  // Removed featuredImageFile state
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(!!postId && !initialData); // Load data if postId is present but no initialData
  const router = useRouter();
  const db = getFirestore();
  // Removed storage initialization
 // const { toast } = useToast();

  // Fetch post data if editing and initialData wasn't provided
  useEffect(() => {
    const fetchPostData = async () => {
      if (postId && !initialData) {
        setIsLoadingData(true);
        try {
          const postRef = doc(db, 'blog', postId);
          const docSnap = await getDoc(postRef);
          if (docSnap.exists()) {
            setFormData(docSnap.data() as BlogPostData);
          } else {
            showToast.error("Not Found", "Blog post not found.");
            router.push('/panel'); // Redirect if post doesn't exist
          }
        } catch (error) {
          console.error("Error fetching post data:", error);
          showToast.error("Fetch Error", "Could not load post data.");
          router.push('/panel');
        } finally {
          setIsLoadingData(false);
        }
      }
    };
    fetchPostData();
  }, [postId, initialData, db, router]);


  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: newTitle,
      slug: generateSlug(newTitle) // Auto-generate slug from title
    }));
  };

  const handleContentChange = (value: string) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  // Callback for the ImageUpload component (handles upload and delete) - Modified to save immediately when editing
  const handleUploadComplete = useCallback(async (url: string | null): Promise<void> => {
    const newUrl = url ?? '';
    // Update local state first
    setFormData(prev => ({ ...prev, featuredImageUrl: newUrl }));

    // If editing an existing post, save the change immediately
    if (postId) {
      try {
        await blogService.updatePost(postId, { featuredImageUrl: newUrl });
        showToast.success("Image Updated", "Featured image updated successfully.");
      } catch (error) {
        console.error("Error saving featured image:", error);
        showToast.error("Save Error", "Failed to update featured image.");
        // Optionally revert local state here if needed
      }
    } else {
      // If creating a new post, just show a local confirmation (will be saved on full submit)
       if (url) {
         showToast.success("Image Ready", "Featured image selected.");
       }
    }
  }, [postId]); // Added postId dependency

  // Callback specifically for handling deletion completion from ImageUpload
  const handleDeleteComplete = useCallback(async (deletedUrl: string): Promise<void> => {
    // Update local state first (already done by handleUploadComplete(null))
    // If editing an existing post, save the deletion immediately
    if (postId) {
      try {
        // Use null to signify deletion in Firestore if desired, or empty string
        await blogService.updatePost(postId, { featuredImageUrl: '' });
        showToast.info("Image Removed", "Featured image removed successfully.");
      } catch (error) {
        console.error("Error removing featured image:", error);
        showToast.error("Save Error", "Failed to remove featured image.");
        // Optionally revert local state if deletion fails
        setFormData(prev => ({ ...prev, featuredImageUrl: deletedUrl })); // Revert state
      }
    }
  }, [postId]); // Added postId dependency

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // No need to call uploadFeaturedImage, URL is already in formData via handleUploadComplete
    try {
      const postData: Omit<BlogPostData, 'createdAt'> & { updatedAt: Timestamp; createdAt?: Timestamp } = {
        ...formData,
        // featuredImageUrl is already set in state by handleUploadComplete
        updatedAt: serverTimestamp() as Timestamp, // Always update timestamp
      };

      if (postId) {
        // Editing existing post
        const postRef = doc(db, 'blog', postId);
        await updateDoc(postRef, postData);
        showToast.success("Post Updated", "Blog post updated successfully.");
      } else {
        // Creating new post
        postData.createdAt = serverTimestamp() as Timestamp; // Set createdAt only for new posts
        await addDoc(collection(db, 'blog'), postData);
        showToast.success("Post Created", "New blog post created successfully.");
      }
      router.push('/panel?tab=blog'); // Redirect back to the blog panel list

    } catch (error) {
      console.error("Error saving post:", error);
      showToast.error("Save Error", "Failed to save blog post.");
    } finally {
      setIsSaving(false);
    }
  };

  // Quill Modules and Formats (customize as needed)
  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'], // Add image upload handling if needed
      ['clean']
    ],
  }), []);

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  if (isLoadingData) {
    return <LoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleTitleChange}
          required
          disabled={isSaving}
        />
         {formData.slug && (
           <p className="text-sm text-muted-foreground">Slug: /blog/{formData.slug}</p>
         )}
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
        {/* Render ReactQuill only on the client */}
        {typeof window !== 'undefined' && (
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={handleContentChange}
            modules={quillModules}
            formats={quillFormats}
            readOnly={isSaving}
            style={{ backgroundColor: 'white', color: 'black' }} // Basic styling for visibility
          />
        )}
      </div>

      <div className="space-y-2">
        <Label>Featured Image</Label>
        <ImageUpload
          uploadType="blog" // Specify upload type
          onUploadComplete={handleUploadComplete}
          onDeleteComplete={handleDeleteComplete} // Add delete handler
          initialImageUrl={formData.featuredImageUrl} // Pass existing URL for editing
          className="mt-1" // Add some margin if needed
        />
        {/* Removed old input and preview logic */}
      </div>

      {/* Placeholder for Categories */}
      {/* <div className="space-y-2">
        <Label>Category</Label>
        <p className="text-sm text-muted-foreground">Category selection/creation UI goes here.</p>
      </div> */}

      {/* Placeholder for Tags */}
      {/* <div className="space-y-2">
        <Label>Tags</Label>
         <p className="text-sm text-muted-foreground">Tag selection/creation UI goes here.</p>
      </div> */}

      <div className="flex justify-end space-x-2">
         <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSaving}>
           Cancel
         </Button>
         <Button type="submit" disabled={isSaving}>
           {isSaving ? <LoadingSpinner size="sm" /> : (postId ? 'Update Post' : 'Create Post')}
         </Button>
      </div>
    </form>
  );
};

export default BlogEditorForm;
