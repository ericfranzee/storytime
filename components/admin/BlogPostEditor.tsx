'use client';

import React, { useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ImageUpload from '@/components/ImageUpload';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { blogService } from '@/lib/firebase/blog-service'; // Removed unused STORAGE_PATHS
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

const BLOG_CATEGORIES = [
  { id: 'technology', label: 'Technology' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'news', label: 'News' },
  { id: 'children', label: 'Children' },
  { id: 'health', label: 'Health & Wellness' },
  { id: 'business', label: 'Business' }
];

// Removed unused QuillModule type definition

const QuillEditor = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>
});

interface BlogPost {
  title: string;
  content: string;
  featuredImageUrl?: string;
  category: string;
  tags: string[];
  published: boolean;
  slug?: string;
}

type BlogPostField = keyof BlogPost;

export default function BlogPostEditor() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState<BlogPost>({
    title: '',
    content: '',
    featuredImageUrl: '',
    category: '',
    tags: [],
    published: false,
    slug: ''
  });

  // Move quillModules inside the component
  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  }), []);

  const handlePostChange = (field: BlogPostField, value: unknown) => { // Changed any to unknown
    setPost(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // This function replaces the old handleImageUpload
  const handleUploadComplete = (url: string | null): void => { // Accept string | null
    handlePostChange('featuredImageUrl', url ?? ''); // Set to empty string if null
    // Optional: Show toast from ImageUpload or here, maybe remove from ImageUpload?
    // For now, let ImageUpload handle its own success/error feedback.
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { featuredImageUrl, ...postData } = post;
      await blogService.createPost({
        ...postData,
        featuredImageUrl: featuredImageUrl,
        slug: blogService.generateSlug(post.title)
      });
      toast({
        title: "Success",
        description: "Post saved successfully"
      });
      router.push('/panel?tab=blog');
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: "Error",
        description: "Failed to save post",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <div className="space-y-6">
          <div>
            <Label htmlFor="title">Post Title</Label>
            <Input
              id="title"
              value={post.title}
              onChange={(e) => handlePostChange('title', e.target.value)}
            />
          </div>

          <div>
            <Label>Featured Image</Label>
            <ImageUpload
              uploadType="blog" // Specify upload type
              initialImageUrl={post.featuredImageUrl} // Use initialImageUrl
              onUploadComplete={handleUploadComplete} // Use onUploadComplete
            />
          </div>

          <div>
            <Label>Category</Label>
            <select
              value={post.category}
              onChange={(e) => handlePostChange('category', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Category</option>
              {BLOG_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <Label>Tags</Label>
            <Input
              value={post.tags.join(', ')}
              onChange={(e) => handlePostChange('tags', e.target.value.split(',').map(t => t.trim()))}
              placeholder="Enter tags separated by commas"
            />
          </div>

          <div>
            <Label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={post.published}
                onChange={(e) => handlePostChange('published', e.target.checked)}
              />
              Published
            </Label>
          </div>

          <div>
            <Label>Content</Label>
            <div className="min-h-[400px]">
              <QuillEditor
                theme="snow"
                modules={quillModules}
                value={post.content}
                onChange={(content: string) => handlePostChange('content', content)}
                className="h-[300px] mb-12"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Save Post'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
