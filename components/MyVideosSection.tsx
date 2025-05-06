"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Video, Music, Image } from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";
import { getUserVideoHistory } from "@/app/firebase";
import { Button } from "@/components/ui/button";
import { Timestamp } from 'firebase/firestore';

interface MyVideosSectionProps {
  userId: string;
}

interface VideoHistoryItem {
  id: string;
  videoUrl: string;
  voiceUrl: string;
  imageUrls: string[];
  story: string;
  music: string;
  voice: string;
  videoScale: string;
  createdAt: Timestamp; // Assuming createdAt is a Firestore Timestamp
}

const MyVideosSection: React.FC<MyVideosSectionProps> = ({ userId }) => {
  const [videoHistory, setVideoHistory] = useState<VideoHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    const fetchVideoHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const history = await getUserVideoHistory(userId);
        setVideoHistory(history);
      } catch (e: any) {
        setError(e.message || "Failed to load video history");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchVideoHistory();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return <div>Error loading video history: {error}</div>;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Your Video Library
        </h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Auto-syncing</span>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        className="grid gap-6"
      >
        {videoHistory.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl"
          >
            <p className="text-gray-600 dark:text-gray-400 mb-4">No videos created yet</p>
            <Button variant="outline">Create Your First Video</Button>
          </motion.div>
        ) : (
          videoHistory.map((video, index) => (
            <motion.div
              key={video.id}
              variants={itemVariants}
              className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
              whileHover={{ y: -5 }}
            >
              <h4 className="font-semibold">Created at: {video.createdAt.toDate().toLocaleDateString()} {video.createdAt.toDate().toLocaleTimeString()}</h4>
              <div className="flex space-x-2 mt-2">
                <Button asChild variant="outline">
                  <a href={video.videoUrl} download>
                    <Download className="mr-2" /> Download Video
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href={video.voiceUrl} download>
                    <Download className="mr-2" /> Download Voice
                  </a>
                </Button>
                {video.imageUrls && video.imageUrls.map((imageUrl, i) => (
                  <Button key={i} asChild variant="outline">
                    <a href={imageUrl} download>
                      <Download className="mr-2" /> Download Image {i + 1}
                    </a>
                  </Button>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
};

export default MyVideosSection;
