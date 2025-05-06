"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ModeToggle } from "./mode-toggle";
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
import CurrencySwitch from "./CurrencySwitch";
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, slideIn, stagger } from '@/lib/animation-variants';
import { useTheme } from 'next-themes';
import OptimizedImage from '@/components/ui/OptimizedImage';
import Avatar from '@/components/ui/avatar';
import { settingsService } from '@/lib/firebase/settings-service';
import { useModal } from '@/lib/modal-context'; // Import useModal

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const { user, logout } = useAuth();
  const { theme, systemTheme } = useTheme();
  const { isLoginModalOpen, setIsLoginModalOpen, isSignupModalOpen, setIsSignupModalOpen } = useModal(); // Use modal context
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [lightLogoUrl, setLightLogoUrl] = useState<string | undefined>();
  const [darkLogoUrl, setDarkLogoUrl] = useState<string | undefined>();
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setHasMounted(true);
    setMounted(true);
    const loadSettings = async () => {
      try {
        const siteSettings = await settingsService.getSiteSettings();
        setLightLogoUrl(siteSettings?.lightLogo);
        setDarkLogoUrl(siteSettings?.darkLogo);
      } catch (error) {
        console.error("Error loading settings for header logos:", error);
      }
    };
    loadSettings();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      // console.log('Logout successful!'); // Removed
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
    { label: 'Features', href: '/#benefits' },
    { label: 'How it Works', href: '/#how-it-works' },
    { label: 'API', href: '/#api' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Success Stories', href: '/#success-stories' }
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
      onClick: () => setIsSettingsModalOpen(true)
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

  const defaultLogoSrc = {
    desktop: {
      dark: '/assets/images/logo/logo-light.png',
      light: '/assets/images/logo/logo-dark.png'
    },
    mobile: {
      dark: '/assets/images/logo/logo-mobile-light.png',
      light: '/assets/images/logo/logo-mobile-dark.png'
    }
  };

  const navigationVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        staggerChildren: 0.05,
        ease: "easeOut"
      }
    }
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    hover: { 
      y: -4,
      color: 'var(--color-primary)',
      transition: { type: "spring", stiffness: 300 }
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 50, damping: 20 }}
      className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg z-50 border-b border-gray-200 dark:border-gray-800"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16" style={{
                  zIndex: 'var(--z-dropdown)',
                  position: 'relative'
                }}>
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
                    src={currentTheme === 'dark' ? (darkLogoUrl || defaultLogoSrc.desktop.dark) : (lightLogoUrl || defaultLogoSrc.desktop.light)}
                    alt="Story Time"
                    className="hidden md:block object-contain"
                    sizes="(max-width: 768px) 0px, 100px"
                  />
                  <OptimizedImage
                    src={currentTheme === 'dark' ? (darkLogoUrl || defaultLogoSrc.mobile.dark) : (lightLogoUrl || defaultLogoSrc.mobile.light)}
                    alt="Story Time"
                    className="block md:hidden object-contain"
                    sizes="(max-width: 768px) 80px, 0px"
                  />
                </>
              )}
            </div>
          </motion.a>

          <motion.nav
            variants={navigationVariants}
            initial="hidden"
            animate="visible"
            className="hidden md:flex space-x-1"
          >
            {navigationItems.map((item) => (
              <motion.a
                key={item.href}
                href={item.href}
                variants={navItemVariants}
                whileHover="hover"
                className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                {item.label}
              </motion.a>
            ))}
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="hidden md:block"
            >
              <CurrencySwitch />
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }}>
              <ModeToggle />
            </motion.div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="ghost" 
                    className="relative p-0 h-10 w-10 rounded-full overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all duration-200"
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
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 p-2 mt-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl"
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

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={toggleMenu}
            >
              <motion.i 
                animate={{ rotate: isOpen ? 90 : 0 }}
                className={`fas fa-${isOpen ? 'times' : 'bars'}`} 
              />
            </motion.button>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
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
              <hr />
              <div className="flex flex-col space-y-2">
              <CurrencySwitch />
              </div>
              <hr />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {hasMounted && (
        <>
          <DynamicLoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onLoginSuccess={() => { /* console.log('Login successful!'); */ }} // Removed log
            setIsSignupModalOpen={setIsSignupModalOpen}
          />
          <DynamicSignupModal
            isOpen={isSignupModalOpen}
            onClose={() => setIsSignupModalOpen(false)}
            setIsLoginModalOpen={setIsLoginModalOpen}
            onSignupSuccess={() => { /* console.log('Signup successful!'); */ }} // Removed log
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
