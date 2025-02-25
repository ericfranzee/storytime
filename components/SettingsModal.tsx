"use client";
import React, { useState, useEffect } from 'react';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import PaymentSection from '@/components/PaymentSection';
import { Button } from "@/components/ui/button";
import './ui/modal-styles.css';
import Modal from '@/components/ui/Modal';

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
  const [activeTab, setActiveTab] = useState('account');
  const [notifications, setNotifications] = useState({
    email: true,
    updates: false,
    marketing: false
  });

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

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  useEffect(() => {
    setKey(prevKey => prevKey + 1); // Update key when modal opens
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isWide>
      <div className="flex h-[80vh]">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 dark:bg-gray-900 p-4 border-r border-gray-200 dark:border-gray-700">
          <nav className="space-y-2">
            {['account', 'notifications', 'billing', 'api'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-2 rounded-lg capitalize ${
                  activeTab === tab 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'account' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Account Settings</h2>
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
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Notification Preferences</h2>
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="capitalize">{key} Notifications</span>
                    <button
                      onClick={() => handleNotificationChange(key as keyof typeof notifications)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        value ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`block w-4 h-4 ml-1 rounded-full bg-white transition-transform ${
                        value ? 'transform translate-x-6' : ''
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Billing & Subscription</h2>
              <PaymentSection key={key} />
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">API Settings</h2>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2">Your API Key:</p>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                    {user?.uid ? `sk_${user.uid.substring(0, 32)}` : 'Not available'}
                  </code>
                  <Button variant="outline" size="sm">
                    Regenerate
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t p-4 flex justify-end">
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default SettingsModal;
