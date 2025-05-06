"use client";
import React from 'react';
import { auth, getUserSubscription } from '@/app/firebase';
import { getFirestore, doc, onSnapshot, DocumentData } from "firebase/firestore";
import { motion } from 'framer-motion';
import { CreditCard, Calendar, Activity, AlertCircle } from 'lucide-react';

interface Subscription {
  plan: string;
  usage: number;
  remainingUsage: number;
  expiryDate: any;
  status: string;
  paymentMethod: string;
  expiryDateISO: any;
}

const PaymentSection = () => {
  const [subscription, setSubscription] = React.useState<Subscription | null>(null);
  const [loading, setLoading] = React.useState(true);
  const db = getFirestore();

  React.useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      let unsubscribe: () => void;

      if (user) {
        const fetchSubscription = async () => {
          const sub = await getUserSubscription(user.uid);
          if (!sub) {
            console.warn('No subscription found for user:', user.uid);
            setSubscription(null);
            return;
          }
          if (typeof sub === 'object' && sub !== null && 'plan' in sub && 'usage' in sub && 'remainingUsage' in sub && 'expiryDate' in sub) {
            setSubscription(sub as Subscription);
          } else {
            console.error('Invalid subscription data:', sub);
          }
        };

        await fetchSubscription();

        // Listen for real-time updates
        unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            if (data && data.subscription) {
              let subscriptionData = data.subscription;
              if (typeof subscriptionData === 'string') {
                // Handle case where subscription is just the plan name
                subscriptionData = { plan: subscriptionData, usage: 0, remainingUsage: 0, expiryDate: null };
              }
              if (typeof subscriptionData === 'object' && 'plan' in subscriptionData && 'usage' in subscriptionData && 'remainingUsage' in subscriptionData && 'expiryDate' in subscriptionData) {
                setSubscription(subscriptionData as Subscription);
              } else {
                console.error('Invalid subscription data:', data?.subscription);
              }
            }
          }
        });
        setLoading(false);
      } else {
        setLoading(false);
      }

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    };

    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[200px] flex items-center justify-center"
      >
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Subscription Overview
        </h2>
        {subscription?.status === 'active' && (
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
            Active
          </span>
        )}
      </div>

      {subscription ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm opacity-80">Current Plan</p>
                <h3 className="text-2xl font-bold">{subscription.plan}</h3>
              </div>
              <CreditCard className="w-6 h-6" />
            </div>
            {/* ...other subscription details... */}
          </motion.div>
          

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">Usage</p>
                <h3 className="text-2xl font-bold">{subscription.usage} / {subscription.usage + subscription.remainingUsage}</h3>
              </div>
              <Activity className="w-6 h-6 text-blue-500" />
            </div>
            <div className="mt-4">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${(subscription.usage / (subscription.usage + subscription.remainingUsage)) * 100}%` 
                  }}
                  className="h-full bg-blue-500"
                />
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl text-center"
        >
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">No active subscription found</p>
          <a
            href="/#pricing">
            View Plans
          </a>
        </motion.div>
      )}
    </motion.div>
  );
};

export default React.memo(PaymentSection);
