'use client';

import React, { ReactElement } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SettingsPanel from '@/components/admin/SettingsPanel';
import BlogPanel from '@/components/admin/BlogPanel';
import UserManagementPanel from '@/components/admin/UserManagementPanel';
import dynamic from 'next/dynamic';

// Dynamic import for the editor
const BlogPostEditor = dynamic(() => import('@/components/admin/BlogPostEditor'), {
  ssr: false
});

const PanelContent = (): ReactElement => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'settings';

  const handleTabChange = (value: string) => {
    router.push(`/panel?tab=${value}`);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          {/* Updated grid columns for the new tab */}
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="settings">General Settings</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger> {/* New Tab Trigger */}
            <TabsTrigger value="blog">Blog Posts</TabsTrigger>
            <TabsTrigger value="new-post">New Post</TabsTrigger>
          </TabsList>
          <TabsContent value="settings" className="mt-4">
            <SettingsPanel />
          </TabsContent>
          {/* New Tab Content */}
          <TabsContent value="users" className="mt-4">
            <UserManagementPanel />
          </TabsContent>
          <TabsContent value="blog" className="mt-4">
            <BlogPanel />
          </TabsContent>
          <TabsContent value="new-post" className="mt-4">
            <BlogPostEditor />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default PanelContent;
