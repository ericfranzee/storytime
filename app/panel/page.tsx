import React, { Suspense } from 'react';
import PanelContent from './panel-content'; // Import the new client component
import AdminLayout from '@/components/AdminLayout'; // Keep AdminLayout for fallback structure if needed

// This page component remains a Server Component (or can be prerendered)
const AdminDashboardPage = () => {
  return (
    // Wrap the client component that uses useSearchParams in Suspense
    <Suspense fallback={
      // Provide a fallback UI that matches the layout if possible
      <AdminLayout>
        <div className="container mx-auto p-4 md:p-8">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          <p>Loading dashboard content...</p>
          {/* You could add skeleton loaders here */}
        </div>
      </AdminLayout>
    }>
      <PanelContent />
    </Suspense>
  );
};

export default AdminDashboardPage;
