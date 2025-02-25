"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getUserSubscription } from '@/app/firebase';
import { useAuth } from '@/hooks/useAuth';

interface UserStats {
  totalVideos: number;
  remainingCredits: number;
  planType: string;
  nextReset: Date;
}

const UserDashboard = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserStats = async () => {
      if (user) {
        const subscription = await getUserSubscription(user.uid);
        if (subscription) {
          setStats({
            totalVideos: subscription.videoCount || 0,
            remainingCredits: subscription.remainingUsage || 0,
            planType: subscription.plan || 'free',
            nextReset: new Date(subscription.resetDate)
          });
        }
      }
    };

    fetchUserStats();
  }, [user]);

  if (!stats) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Your Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg"
        >
          <h3 className="text-lg font-semibold mb-2">Total Videos</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {stats.totalVideos}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg"
        >
          <h3 className="text-lg font-semibold mb-2">Credits Left</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {stats.remainingCredits}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg"
        >
          <h3 className="text-lg font-semibold mb-2">Current Plan</h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 capitalize">
            {stats.planType}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg"
        >
          <h3 className="text-lg font-semibold mb-2">Next Reset</h3>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {stats.nextReset.toLocaleDateString()}
          </p>
        </motion.div>
      </div>

      {stats.remainingCredits < 3 && (
        <div className="mt-6 bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
          <p className="text-red-600 dark:text-red-400">
            ⚠️ You're running low on credits! Consider upgrading your plan to continue creating videos.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
