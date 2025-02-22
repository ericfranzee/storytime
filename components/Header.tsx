"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ModeToggle } from "./mode-toggle";
import MobileMenu from "./MobileMenu";
import { useAuth } from '@/hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '@/app/firebase';
import dynamic from 'next/dynamic';
import { getFirestore, doc, DocumentData, onSnapshot } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getUserVideoCount, getUserSubscription } from '@/app/firebase';
import PaymentSection from './PaymentSection';
import CurrencySwitch from "./CurrencySwitch";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false); // Add settings modal state
  const [hasMounted, setHasMounted] = useState(false); // Track if component has mounted
  const db = getFirestore();
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setHasMounted(true); // Set hasMounted to true after component mounts
  }, []);


  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('Logout successful!');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Logout failed: ' + error.message);
      } else {
        console.error('Logout failed: Unknown error');
      }
    }
  };

  const DynamicLoginModal = dynamic(() => import('./LoginModal'), { ssr: false });
  const DynamicSignupModal = dynamic(() => import('./SignupModal'), {
    ssr: false,
  });
  const DynamicSettingsModal = dynamic(() => import('@/components/SettingsModal'), { ssr: false });

  return (
    <>
      <header className="bg-golding-orange text-black dark:text-white p-4">
        <div className="container mx-auto flex flex-row justify-between items-center">
          <h1 className="text-4 font-bold tracking-wide uppercase">
            <a href="/">Story Time</a>
          </h1>
          <nav
            className={`${
              isOpen
                ? 'flex flex-col absolute top-full left-0 w-full bg-golding-orange text-black dark:text-white p-4'
                : 'hidden'
            } md:flex md:items-center md:space-x-4 md:static md:bg-transparent`}
          >
            <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 justify-center">
              <li>
                <a href="/" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="#api" className="hover:underline">
                  API
                </a>
              </li>
              <li>
                <a href="#story" className="hover:underline">
                  Story Generator
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:underline">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#about" className="hover:underline">
                  About
                </a>
              </li>
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <CurrencySwitch />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                  ref={dropdownButtonRef}
                >
                  {user ? (
                    user.email ? user.email.split('@')[0] : 'User'
                  ) : (
                    'Guest'
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {user ? (
                  <>
                    <DropdownMenuItem onClick={() => setIsSettingsModalOpen(true)}>
                      My Account
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsSettingsModalOpen(true)}>
                      <PaymentSection />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Log out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => setIsLoginModalOpen(true)}>
                      Log in
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsSignupModalOpen(true)}>
                      Sign up
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-black dark:text-white focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <MobileMenu
          isOpen={isOpen}
          onClose={toggleMenu}
          setIsLoginModalOpen={setIsLoginModalOpen}
          setIsSignupModalOpen={setIsSignupModalOpen}
        />
      </header>
      {hasMounted && (
        <>
          <DynamicLoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onLoginSuccess={() => console.log('Login successful!')}
            setIsSignupModalOpen={setIsSignupModalOpen}
          />
          <DynamicSignupModal
            isOpen={isSignupModalOpen}
            onClose={() => setIsSignupModalOpen(false)}
            setIsLoginModalOpen={setIsLoginModalOpen}
            onSignupSuccess={() => console.log('Signup successful!')}
          />
          <DynamicSettingsModal
            isOpen={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
          />
        </>
      )}
    </>
  );
};

export default Header;
