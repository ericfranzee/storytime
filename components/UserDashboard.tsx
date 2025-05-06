"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserSubscription } from '@/app/firebase';
import { useAuth } from '@/hooks/useAuth';
import { getAuth, getIdToken } from 'firebase/auth'; // Added for token
import { Button } from '@/components/ui/button'; // Added for download buttons
import { Skeleton } from '@/components/ui/skeleton'; // Added for loading state
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Added for warning/info
import { Download, Video, AudioLines, Image as ImageIcon } from 'lucide-react'; // Icons

// Define the structure for a history item fetched from the API
interface HistoryItem {
  id: string;
  createdAt: string; // ISO string from API
  storyTitle: string;
  videoUrl: string;
  voiceUrl: string;
  imageUrls: string[];
}

interface UserStats {
  totalVideos: number;
  remainingCredits: number;
  planType: string;
  nextReset: Date;
}

const UserDashboard = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const { user } = useAuth();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const auth = getAuth(); // Get auth instance

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        // --- Fetch subscription (existing logic) ---
        setIsLoadingHistory(true); // Start loading history here too
        try {
          const subscription = await getUserSubscription(user.uid);
          if (subscription) {
            setStats({
              totalVideos: subscription.videoCount || 0,
              remainingCredits: subscription.remainingUsage || 0,
              planType: subscription.plan || 'free',
              nextReset: new Date(subscription.resetDate)
            });
          }
        } catch (error) {
          console.error("Error fetching subscription:", error);
          // Handle subscription fetch error if needed
        }

        // --- Fetch history ---
        try {
          const currentUser = auth.currentUser;
          if (currentUser) {
            const idToken = await getIdToken(currentUser);
            const response = await fetch('/api/user/history', {
              headers: {
                'Authorization': `Bearer ${idToken}`
              }
            });

            if (response.ok) {
              const data = await response.json();
              setHistoryItems(data);
            } else {
              console.error("Failed to fetch history:", response.statusText);
              setHistoryItems([]); // Clear history on error
            }
          } else {
             console.error("No current user found for fetching history.");
             setHistoryItems([]);
          }
        } catch (error) {
          console.error("Error fetching history:", error);
          setHistoryItems([]); // Clear history on error
        } finally {
          setIsLoadingHistory(false);
        }
      } else {
        // Handle case where user is null (logged out)
        setStats(null);
        setHistoryItems([]);
        setIsLoadingHistory(false);
      }
    };

    fetchUserData();
  }, [user, auth]); // Add auth to dependency array

  // Helper function to format title
  const formatTitle = (title: string) => {
    return title.replace(/_/g, ' ');
  };

  // Helper function to format date
  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (!stats && !isLoadingHistory && !user) return <p>Please log in to view your dashboard.</p>; // Handle logged out state
  // Keep loading indicator if stats OR history is loading
  if (!stats && isLoadingHistory) return <DashboardSkeleton />;

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-8 space-y-8"
    >
      <motion.div className="flex justify-between items-center" variants={itemVariants}>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Your Dashboard
        </h2>
        {stats?.planType !== 'elite' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium hover:shadow-lg transition-shadow"
          >
            Upgrade Plan
          </motion.button>
        )}
      </motion.div>

      {stats ? (
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Total Videos</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalVideos}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Credits Left</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.remainingCredits === Infinity ? 'Unlimited' : stats.remainingCredits}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Current Plan</h3>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 capitalize">
              {stats.planType}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Next Reset</h3>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {stats.planType === 'elite' ? 'N/A' : stats.nextReset.toLocaleDateString()}
            </p>
          </motion.div>
        </motion.div>
      ) : (
        <DashboardSkeleton />
      )}

      <motion.div variants={itemVariants} className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold">Generation History</h3>
          <motion.div 
            className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Auto-updating</span>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {isLoadingHistory ? (
            <HistorySkeleton />
          ) : historyItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <p className="text-gray-500 dark:text-gray-400 mb-4">No generation history found.</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                Create Your First Video
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              className="grid gap-4"
            >
              {historyItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex-grow">
                    <p className="font-medium text-lg">{formatTitle(item.storyTitle)}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Created: {formatDate(item.createdAt)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <Button variant="outline" size="sm" asChild>
                      <a href={item.videoUrl} download={`${formatTitle(item.storyTitle)}_video.mp4`} target="_blank" rel="noopener noreferrer">
                        <Video className="mr-2 h-4 w-4" /> Video
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={item.voiceUrl} download={`${formatTitle(item.storyTitle)}_voice.mp3`} target="_blank" rel="noopener noreferrer">
                        <AudioLines className="mr-2 h-4 w-4" /> Voice
                      </a>
                    </Button>
                    {item.imageUrls && item.imageUrls.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.imageUrls.map((imgUrl, index) => (
                          <Button key={index} variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <a href={imgUrl} download={`${formatTitle(item.storyTitle)}_image_${index + 1}.jpg`} target="_blank" rel="noopener noreferrer" title={`Download Image ${index + 1}`}>
                              <ImageIcon className="h-4 w-4" />
                              <span className="sr-only">Download Image {index + 1}</span>
                            </a>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const DashboardSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="space-y-8"
  >
    <h2 className="text-2xl font-bold">Your Dashboard</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Skeleton className="h-24 rounded-lg" />
      <Skeleton className="h-24 rounded-lg" />
      <Skeleton className="h-24 rounded-lg" />
      <Skeleton className="h-24 rounded-lg" />
    </div>
  </motion.div>
);

const HistorySkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="border dark:border-gray-700 rounded-lg p-4 flex flex-col md:flex-row md:items-center justifyBetween gap-4">
        <div className="flex-grow space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    ))}
  </div>
);

export default UserDashboard;
