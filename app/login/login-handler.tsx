"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useModal } from '@/lib/modal-context';

const LoginHandler = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setIsLoginModalOpen } = useModal();

  useEffect(() => {
    setIsLoginModalOpen(true); // Open the login modal

    // After a short delay, redirect to the original page (if provided)
    const redirect = searchParams.get('redirect') || '/';
    const timer = setTimeout(() => {
      router.push(redirect);
    }, 500); // Adjust delay as needed

    return () => clearTimeout(timer); // Clear timeout on unmount
  }, [router, searchParams, setIsLoginModalOpen]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Opening login modal...</p>
      {/* You might want a loading spinner here */}
    </div>
  );
};

export default LoginHandler;
