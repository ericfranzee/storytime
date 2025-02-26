"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ModeToggle } from "./mode-toggle";
import MobileMenu from "./MobileMenu";
import { useAuth } from '@/hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '@/app/firebase';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PaymentSection from './PaymentSection';
import CurrencySwitch from "./CurrencySwitch";
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, slideIn, stagger } from '@/lib/animation-variants';
import { useTheme } from 'next-themes';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { imageConfig } from '@/config/images';
import Avatar from '@/components/ui/avatar';

interface HeaderProps { }

const Header: React.FC<HeaderProps> = () => {
  const { user } = useAuth();
  const { theme, systemTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false); // Add settings modal state
  const [hasMounted, setHasMounted] = useState(false); // Track if component has mounted
  const [mounted, setMounted] = useState(false);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setHasMounted(true); // Set hasMounted to true after component mounts
    setMounted(true);
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

  const navigationItems = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '#benefits' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'API', href: '#api' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Success Stories', href: '#success-stories' }
  ];

  const userMenuItems = user ? [
    {
      label: 'My Dashboard',
      icon: 'chart-bar',
      onClick: () => setIsSettingsModalOpen(true)
    },
    {
      label: 'Settings',
      icon: 'cog',
      onClick: () => setIsSettingsModalOpen(true)
    },
    {
      label: 'My Videos',
      icon: 'video',
      onClick: () => window.location.href = '#my-videos'
    },
    {
      label: 'Subscription',
      icon: 'credit-card',
      onClick: () => setIsSettingsModalOpen(true)
    },
    {
      label: 'Log out',
      icon: 'sign-out-alt',
      onClick: handleLogout
    }
  ] : [
    {
      label: 'Log in',
      icon: 'sign-in-alt',
      onClick: () => setIsLoginModalOpen(true)
    },
    {
      label: 'Sign up',
      icon: 'user-plus',
      onClick: () => setIsSignupModalOpen(true)
    }
  ];

  const DynamicLoginModal = dynamic(() => import('./LoginModal'), { ssr: false });
  const DynamicSignupModal = dynamic(() => import('./SignupModal'), {
    ssr: false,
  });
  const DynamicSettingsModal = dynamic(() => import('@/components/SettingsModal'), { ssr: false });

  const mobileMenuVariants = {
    closed: { x: "100%", transition: { duration: 0.3 } },
    open: { x: 0, transition: { duration: 0.3 } }
  };

  const currentTheme = theme === 'system' ? systemTheme : theme;

  const logoSrc = {
    desktop: {
      dark: '/assets/images/logo/logo-light.png',
      light: '/assets/images/logo/logo-dark.png'
    },
    mobile: {
      dark: '/assets/images/logo/logo-mobile-light.png',
      light: '/assets/images/logo/logo-mobile-dark.png'
    }
  };

  return (
    <motion.header
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className="sticky top-0 sticky-header bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16" style={{
                  zIndex: 'var(--z-dropdown)',
                  position: 'relative'
                }}>
          {/* Updated Logo Section */}
          <motion.a
            href="/"
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative w-[100px] h-[40px] md:h-[50px]">
              {mounted && (
                <>
                  <OptimizedImage
                    src={currentTheme === 'dark' ? logoSrc.desktop.dark : logoSrc.desktop.light}
                    alt="Story Time"
                    fill
                    className="hidden md:block object-contain"
                    priority
                    sizes="(max-width: 768px) 0px, 100px"
                  />
                  <OptimizedImage
                    src={currentTheme === 'dark' ? logoSrc.mobile.dark : logoSrc.mobile.light}
                    alt="Story Time"
                    fill
                    className="block md:hidden object-contain"
                    priority
                    sizes="(max-width: 768px) 80px, 0px"
                  />
                </>
              )}
            </div>

          </motion.a>

          {/* Desktop Navigation */}
          <motion.nav
            variants={stagger}
            initial="initial"
            animate="animate"
            className="hidden md:flex space-x-7"
          >
            {navigationItems.map((item) => (
              <motion.a
                key={item.href}
                href={item.href}
                variants={slideIn}
                whileHover={{ y: -2 }}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white
                         transition-colors duration-200"
              >
                {item.label}
              </motion.a>
            ))}
          </motion.nav>

          {/* Right side actions with animations */}
          <motion.div
            variants={stagger}
            className="flex items-center space-x-5"
          >
            <div className="hidden md:flex">
            <CurrencySwitch />
            </div>
            <ModeToggle />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative p-0 h-auto w-auto hover:bg-transparent"
                >
                  <div className="w-8 h-8 overflow-hidden rounded-full">
                    {user ? (
                      <Avatar 
                        user={user} 
                        size="sm"
                        className="border-2 border-transparent hover:border-primary transition-colors"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <i className="fas fa-user text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 p-2 mt-1"
              >
                {user && (
                  <>
                    <div className="flex items-center gap-2 p-2">
                      <Avatar user={user} size="md" />
                      <div className="flex flex-col">
                        <p className="text-sm font-medium leading-none">
                          {user.displayName || user.email?.split('@')[0]}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                  </>
                )}
                {userMenuItems.map((item, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={item.onClick}
                    className="cursor-pointer"
                  >
                    <i className={`fas fa-${item.icon} w-4 h-4 mr-2`} />
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-4"
              onClick={toggleMenu}
            >
              <i className={`fas fa-${isOpen ? 'times' : 'bars'}`} />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="md:hidden fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-xl"
            style={{
              zIndex: 'var(--z-dropdown)',
              position: 'relative'
            }}
          >
            <nav className="px-4 pt-2 pb-4 space-y-2">
              {navigationItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Modals */}
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
    </motion.header>
  );
};

export default Header;
