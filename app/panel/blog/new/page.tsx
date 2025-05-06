"use client";

import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import BlogEditorForm from '@/components/admin/BlogEditorForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NewBlogPostPage = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex items-center mb-6">
           <Button variant="outline" size="icon" asChild className="mr-4">
             <Link href="/panel">
               <ArrowLeft className="h-4 w-4" />
             </Link>
           </Button>
          <h1 className="text-2xl font-bold">Create New Blog Post</h1>
        </div>
        <BlogEditorForm />
      </div>
    </AdminLayout>
  );
};

export default NewBlogPostPage;
