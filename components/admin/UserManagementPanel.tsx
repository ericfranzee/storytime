'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { toast } from '@/components/ui/use-toast';
import EditUserModal from './EditUserModal'; // Import the modal
import { Badge } from "@/components/ui/badge"; // For displaying status/plan

// Match the structure returned by /api/admin/users
interface UserListData {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  disabled: boolean;
  creationTime?: string;
  lastSignInTime?: string;
  isAdmin: boolean; // From custom claims
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  // Add usage/remaining if fetched by the API later
  usage?: number;
  remainingUsage?: number;
}

const UserManagementPanel: React.FC = () => {
  const [users, setUsers] = useState<UserListData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [selectedUser, setSelectedUser] = useState<UserListData | null>(null); // State for user being edited

  // Fetch users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch users from the API endpoint
        const response = await fetch('/api/admin/users');
        const data = await response.json(); // Read body once

        if (!response.ok) {
          throw new Error(data.error || `Failed to fetch users (${response.status})`);
        }
        setUsers(data.users); // Set the fetched users

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Open the modal with the selected user's data
  const handleEditUser = (user: UserListData) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Update local state when modal saves changes
  const handleUserUpdate = (updatedUser: UserListData) => {
     setUsers(prevUsers =>
       prevUsers.map(user =>
         user.uid === updatedUser.uid ? updatedUser : user
       )
     );
     // Optionally re-fetch users here if needed after complex updates
  };

  // Filter users based on search term (email), handling undefined emails
  const filteredUsers = users.filter(user =>
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">User Management</h2>
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        {/* Add button for creating users if needed */}
      </div>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">Error loading users: {error}</p>}

      {!loading && !error && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Sub Plan</TableHead>
              <TableHead>Sub Status</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                // Make row clickable, but stop propagation for the button inside
                <TableRow key={user.uid} className="hover:bg-muted/50 cursor-pointer" onClick={() => handleEditUser(user)}>
                  <TableCell className="font-medium">{user.email || 'N/A'}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{user.uid}</TableCell>
                  <TableCell>{user.creationTime ? new Date(user.creationTime).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={user.subscriptionPlan === 'free' || user.subscriptionPlan === 'N/A' ? 'outline' : 'default'}>
                      {user.subscriptionPlan || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {/* Assuming you have a 'success' variant for Badge */}
                    <Badge variant={user.subscriptionStatus === 'active' ? 'success' : 'secondary'}>
                      {user.subscriptionStatus || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.isAdmin ? <Badge variant="destructive">Admin</Badge> : <Badge variant="outline">User</Badge>}
                  </TableCell>
                  <TableCell>
                    {/* Stop propagation prevents row click when button is clicked */}
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleEditUser(user); }}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center"> {/* Adjusted colSpan */}
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
       {/* TODO: Add pagination if user list becomes long */}

       {/* Render the Modal */}
       <EditUserModal
         user={selectedUser}
         isOpen={isModalOpen}
         onClose={handleCloseModal}
         onUserUpdate={handleUserUpdate}
       />
    </div>
  );
};

export default UserManagementPanel;

// Note: Ensure you have appropriate Badge variants defined in ui/badge.tsx
// e.g., success: "border-transparent bg-green-500 text-primary-foreground hover:bg-green-500/80",
