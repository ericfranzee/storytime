import React, { Suspense } from 'react';
import LoginHandler from './login-handler'; // Import the new client component

// This page component remains a Server Component (or can be prerendered)
const LoginPage = () => {
  return (
    // Wrap the client component that uses useSearchParams in Suspense
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><p>Loading...</p></div>}>
      <LoginHandler />
    </Suspense>
  );
};

export default LoginPage;
