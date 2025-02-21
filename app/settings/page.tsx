"use client";
import React, { useState } from 'react';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  const handleChangePassword = async () => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to change your password.", variant: "destructive" });
      return;
    }

    const auth = getAuth();
    if (!user || !user.email) {
      toast({ title: "Error", description: "User information is not available.", variant: "destructive" });
      return;
    }

    const credential = EmailAuthProvider.credential(user.email, currentPassword);

    try {
      if (auth.currentUser) {
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, newPassword);
        toast({ title: "Success", description: "Your password has been changed successfully." });
        setCurrentPassword('');
        setNewPassword('');
      } else {
        toast({title: "Error", description: "No current user", variant: "destructive"});
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
            placeholder="Current Password"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
            placeholder="New Password"
          />
        </div>
        <button
          onClick={handleChangePassword}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
