import React from 'react';
import CurrencySwitch from "./CurrencySwitch";
import { Button } from "@/components/ui/button";
import { settingsService } from '@/lib/firebase/settings-service';
import { useTheme } from 'next-themes'; // Import useTheme

const Footer = () => {
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
        { label: "Documentation", href: "/docs" },
        { label: "API Reference", href: "/api-docs" },
        { label: "Blog", href: "/blog" },
        { label: "Tutorials", href: "/tutorials" },
        { label: "Support", href: "/support" }
      ]
    },
    // {
    //   title: "Company",
    //   links: [
    //     { label: "About Us", href: "/about" },
    //     { label: "Careers", href: "/careers" },
    //     { label: "Contact", href: "/contact" },
    //     { label: "Press Kit", href: "/press" }
    //   ]
    // },
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

  const socialLinks = [
    { icon: "facebook", href: "https://facebook.com/storytime" },
    { icon: "twitter", href: "https://twitter.com/storytime" },
    { icon: "linkedin", href: "https://linkedin.com/company/storytime" },
    { icon: "instagram", href: "https://instagram.com/storytime" }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/assets/images/logo/logo-light.png" alt="Story Time" className="w-[250px] h-[40px] md:h-[50px]" />
              
            </div>
            <p className="mb-4 text-gray-400 max-w-sm">
              Transforming African stories into captivating videos through the power of AI.
              Join us in preserving and sharing our rich cultural heritage.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.icon}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className={`fab fa-${link.icon} fa-lg`} />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Story Time Africa. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <CurrencySwitch />
              <select className="bg-gray-800 text-gray-300 rounded px-2 py-1">
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="yo">Yoruba</option>
                <option value="ha">Hausa</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
