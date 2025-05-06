import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CurrencySwitch from "./CurrencySwitch";
import { settingsService } from '@/lib/firebase/settings-service';

type SocialIconKey = 'facebook' | 'twitter' | 'linkedin' | 'instagram';

interface SocialLink {
  icon: SocialIconKey;
  href: string;
}

const Footer = () => {
  const [darkLogoUrl, setDarkLogoUrl] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'yo', name: 'Yoruba' },
    { code: 'ha', name: 'Hausa' }
  ];

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const siteSettings = await settingsService.getSiteSettings();
        setDarkLogoUrl(siteSettings?.darkLogo || null);
      } catch (error) {
        console.error("Error loading settings for footer logo:", error);
      }
    };
    loadSettings();
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
    // You can add your language change logic here
    // For example, update the app's locale or trigger a translation update
  };

  const footerAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/#benefits" },
        { label: "How it Works", href: "/#how-it-works" },
        { label: "Pricing", href: "/#pricing" },
        { label: "API", href: "/#api" },
        { label: "Success Stories", href: "/#success-stories" }
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "/documentation" },
        { label: "Blog", href: "/blog" },
        { label: "Tutorials", href: "/tutorials" },
        { label: "Support", href: "/support" }
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "GDPR", href: "/gdpr" }
      ]
    }
  ];

  const socialLinks: SocialLink[] = [
    { icon: "facebook", href: "https://facebook.com/storytime" },
    { icon: "twitter", href: "https://twitter.com/storytime" },
    { icon: "linkedin", href: "https://linkedin.com/company/storytime" },
    { icon: "instagram", href: "https://instagram.com/storytime" }
  ];

  const socialIcons: Record<SocialIconKey, JSX.Element> = {
    facebook: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z"/>
      </svg>
    ),
    twitter: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>
    ),
    linkedin: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    instagram: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    )
  };

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-black text-gray-300 pt-12 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black opacity-90" />
        <div className="absolute inset-0 bg-[url('/assets/images/noise.png')] opacity-5" />
      </div>
      
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        variants={footerAnimation}
        className="container relative z-10 mx-auto px-4"
      >
        {/* Background Effect */}
        <div className="absolute inset-0 blur-[118px]">
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-blue-500/10 rounded-full"></div>
          <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-purple-500/10 rounded-full"></div>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            variants={footerAnimation}
          >
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={darkLogoUrl || "/assets/images/logo/logo-light.png"}
              alt="Story Time"
              className="w-[250px] h-[40px] md:h-[50px]"
            />
            <p className="text-gray-400 max-w-sm leading-relaxed">
              Transforming African stories into captivating videos through the power of AI.
              Join us in preserving and sharing our rich cultural heritage.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.icon}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {socialIcons[link.icon]}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer Sections with enhanced interactions */}
          {footerSections.map((section, idx) => (
            <motion.div
              key={section.title}
              variants={footerAnimation}
              transition={{ delay: idx * 0.1 }}
            >
              <h3 className="text-white font-semibold mb-6 text-lg">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIdx) => (
                  <motion.li
                    key={link.label}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors inline-flex items-center group"
                    >
                      <span className="group-hover:underline">{link.label}</span>
                      <motion.span
                        className="opacity-0 group-hover:opacity-100 ml-1"
                        initial={{ x: -5 }}
                        animate={{ x: 0 }}
                      >
                        →
                      </motion.span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Bottom Bar */}
        <motion.div 
          variants={footerAnimation}
          className="mt-16 pt-8 border-t border-gray-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-8">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Story Time Africa. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800 rounded-lg p-2"
              >
                <CurrencySwitch />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <select 
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  className="appearance-none bg-gray-800 text-gray-300 rounded-lg px-4 py-2 pr-8 cursor-pointer hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
