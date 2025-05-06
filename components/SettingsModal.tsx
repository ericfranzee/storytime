"use client";
import React, { useState, useEffect } from 'react';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, faUserCog, faBell, faCreditCard, faCode, faVideo, faBars, faTimes 
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import PaymentSection from '@/components/PaymentSection';
import { Button } from "@/components/ui/button";
import './ui/modal-styles.css';
import Modal from '@/components/ui/Modal';
import MyVideosSection from '@/components/MyVideosSection';
import UserDashboard from '@/components/UserDashboard';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false); // State for sidebar collapse
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

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const sidebarItems = [
    { name: 'dashboard', icon: faTachometerAlt, label: 'Dashboard' },
    { name: 'account', icon: faUserCog, label: 'Account' },
    { name: 'notifications', icon: faBell, label: 'Notifications' },
    { name: 'billing', icon: faCreditCard, label: 'Billing' },
    { name: 'api', icon: faCode, label: 'API' },
    { name: 'my videos', icon: faVideo, label: 'My Videos' },
  ];

  const sidebarVariants = {
    expanded: { width: '14rem' },
    collapsed: { width: '5rem' }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isWide>
      <div className="flex h-[80vh] overflow-hidden rounded-xl bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Enhanced Sidebar */}
        <motion.div
          animate={isCollapsed ? "collapsed" : "expanded"}
          variants={sidebarVariants}
          transition={{ duration: 0.3 }}
          className="relative bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-lg"
        >
          <div className="p-4 flex items-center justify-between border-b dark:border-gray-700">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-semibold text-gray-800 dark:text-white"
              >
                Settings
              </motion.span>
            )}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <FontAwesomeIcon
                icon={isCollapsed ? faBars : faTimes}
                className="h-5 w-5 text-gray-600 dark:text-gray-400"
              />
            </button>
          </div>

          <nav className="flex-1 space-y-1 p-2">
            {sidebarItems.map(item => (
              <motion.button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center px-4 py-3 rounded-lg capitalize transition-all duration-200 ${
                  activeTab === item.name
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
              >
                <FontAwesomeIcon icon={item.icon} className={`h-5 w-5 ${!isCollapsed ? 'mr-3' : ''}`} />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </motion.button>
            ))}
          </nav>
        </motion.div>

        {/* Enhanced Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-y-auto p-6"
          >
            {activeTab === 'account' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
                {/* Removed redundant container and centering */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
                  {user && (
                    <div className="mb-6 pb-4 border-b dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Logged in as:</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-4">Change Password</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="currentPassword">Current Password</label>
                    <input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      required
                      placeholder="Enter Current Password"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-1" htmlFor="newPassword">New Password</label>
                    <input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      required
                      placeholder="Enter New Password"
                    />
                  </div>
                  <Button
                    onClick={handleChangePassword}
                    className="w-full" // Use Button's default styling, ensure it spans width if needed via parent
                  >
                    Update Password
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
                {user ? (
                  <UserDashboard />
                ) : (
                  <div className="text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    Please login to view your dashboard.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'my videos' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4">My Videos</h2>
                {user ? (
                  <MyVideosSection userId={user.uid} />
                ) : (
                  <div className="text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    Please login to view your video history.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4">Notification Preferences</h2>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 border-b dark:border-gray-700 last:border-b-0">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')} Notifications</span>
                      {/* Using ShadCN Switch component if available, otherwise simple toggle */}
                      <button
                        onClick={() => handleNotificationChange(key as keyof typeof notifications)}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                      >
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${value ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4">Billing & Subscription</h2>
                <PaymentSection key={key} /> {/* Assuming PaymentSection handles its own styling */}
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4">API Settings</h2>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
                  <p className="text-sm mb-2 text-gray-600 dark:text-gray-400">Your API Key:</p>
                  <div className="flex items-center space-x-3">
                    <code className="flex-1 p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm">
                      {user?.uid ? `sk_${user.uid.substring(0, 32)}...` : 'Log in to view API Key'}
                    </code>
                    <Button variant="outline" size="sm" disabled={!user}>
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" disabled={!user}>
                      Regenerate
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">Keep your API key secure. Do not share it publicly.</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Enhanced Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-t dark:border-gray-700 p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-900"
      >
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date().toLocaleDateString()}
        </div>
        <div className="space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Save Changes
          </Button>
        </div>
      </motion.div>
    </Modal>
  );
};

export default SettingsModal;
