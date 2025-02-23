"use client";
import React, { useState, useEffect } from 'react';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import PaymentSection from '@/components/PaymentSection';
import { Button } from "@/components/ui/button";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();
  const [key, setKey] = useState(0); // State to force re-render

  const handleChangePassword = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to change your password.",
        variant: "destructive",
      });
      return;
    }

    const auth = getAuth();
    if (!user || !user.email) {
      toast({
        title: "Error",
        description: "User information is not available.",
        variant: "destructive",
      });
      return;
    }

    const credential = EmailAuthProvider.credential(user.email,
      currentPassword);

    try {
      if (auth.currentUser) {
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, newPassword);
        toast({
          title: "Success",
          description: "Your password has been changed successfully.",
        });
        setCurrentPassword('');
        setNewPassword('');
      } else {
        toast({
          title: "Error",
          description: "No current user",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  useEffect(() => {
    setKey(prevKey => prevKey + 1); // Update key when modal opens
  }, [isOpen]);

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`}>
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Settings</h2>
            {user && <p>Email: {user.email}<br /><br /><hr /></p>}
            <div className="mb-4"><br />
              <h3 className="text-lg font-bold mb-2">Change Password</h3>
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
            <Button
              onClick={handleChangePassword}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Change Password
            </Button>
            <div className="mt-4">
              <PaymentSection key={key} />
            </div>
            <Button variant="ghost" onClick={onClose} className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 mt-4">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
