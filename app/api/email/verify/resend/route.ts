import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  const db = getFirestore();
  
  try {
    const { email, verificationCode, expiresAt } = await request.json();
    
    // Check existing verification
    const verificationRef = doc(db, 'verifications', email);
    const verificationDoc = await getDoc(verificationRef);
    
    if (verificationDoc.exists()) {
      // Update existing verification
      await updateDoc(verificationRef, {
        verificationCode,
        expiresAt,
        attempts: 0,
        status: 'pending'
      });
    }

    // Send new verification email
    // ...existing email sending code...

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json({ success: false, error: 'Failed to resend verification' }, { status: 500 });
  }
}
