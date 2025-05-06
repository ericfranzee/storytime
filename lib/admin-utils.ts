import { getFirestore, doc, getDoc } from 'firebase/firestore';

export async function isUserAdmin(uid: string): Promise<boolean> {
  try {
    const db = getFirestore();
    const userDoc = await getDoc(doc(db, 'users', uid));
    const userData = userDoc.data();
    return userData?.userType === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}
