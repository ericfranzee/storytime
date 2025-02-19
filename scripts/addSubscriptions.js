require('dotenv').config();
const { addSubscription } = require('../app/firebase.ts');

const subscriptions = [
  {
    type: 'monthly',
    price: 20,
    videoLimit: 50,
    description: 'Monthly subscription with 50 video creations per month'
  },
  {
    type: 'monthly',
    price: 100,
    videoLimit: 'unlimited',
    description: 'Monthly subscription with unlimited video creations'
  }
];

const addSubscriptions = async () => {
  for (const subscription of subscriptions) {
    await addSubscription(subscription);
  }
  console.log('Subscriptions added successfully');
};

addSubscriptions().catch(console.error);
