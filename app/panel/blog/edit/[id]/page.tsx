"use client";

import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import BlogEditorForm from '@/components/admin/BlogEditorForm';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EditBlogPostPage = () => {
  const params = useParams();
  const postId = params.id as string; // Get post ID from URL

  return (
    <AdminLayout>
      <div className="container mx-auto p-4 md:p-8">
         <div className="flex items-center mb-6">
           <Button variant="outline" size="icon" asChild className="mr-4">
             <Link href="/panel">
               <ArrowLeft className="h-4 w-4" />
             </Link>
           </Button>
           <h1 className="text-2xl font-bold">Edit Blog Post</h1>
         </div>
        {/* Pass the postId to the form */}
        {postId ? <BlogEditorForm postId={postId} /> : <p>Loading post...</p>}
      </div>
    </AdminLayout>
  );
};

export default EditBlogPostPage;
