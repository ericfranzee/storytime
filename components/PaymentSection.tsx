import React from 'react';
import { auth, getUserSubscription } from '@/app/firebase';
import { getFirestore, doc, onSnapshot, DocumentData } from "firebase/firestore";

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-4 font-bold">Subscription Details</h2>
      {subscription ? (
        <div>
          <p>Plan: {subscription.plan}</p>
          <p>Status: {subscription.status}</p>
          <p>Payment Method: {subscription.paymentMethod || 'N/A'}</p>
          <p>Usage: {subscription.usage}</p>
          <p>Remaining Usage: {subscription.remainingUsage}</p>
          <p>
            Reset/Expiry Date:{' '}
            {subscription.expiryDateISO ? (
              new Date(subscription.expiryDateISO).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            ) : (
              'N/A'
            )}
          </p>
        </div>
      ) : (
        <p>No active subscription</p>
      )}
    </div>
  );
};

export default React.memo(PaymentSection);
