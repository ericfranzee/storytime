import React from 'react';
import CurrencySwitch from "./CurrencySwitch";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between md:items-start">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold mb-4"><a href="/">Story Time</a></h3>
            <p className="text-lg sm:text-sm">
              Transforming stories into captivating<br /> videos, one frame at a time.
            </p>
            <div className="mt-4">
              <p className="text-lg sm:text-sm">Change Currency</p>
              {/* Currency Switch */}
              <CurrencySwitch />
            </div>
          </div>
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold mb-4">Useful Links</h3>
            <ul className="list-none">
              <li><a href="/" className="text-lg sm:text-sm hover:text-white">Home</a></li>
              <li><a href="#api" className="text-lg sm:text-sm hover:text-white">API</a></li>
              <li><a href="#about" className="text-lg sm:text-sm hover:text-white">About</a></li>
              <li><a href="#pricing" className="text-lg sm:text-sm hover:text-white">Pricing</a></li>
              <li><a href="#story" className="text-lg sm:text-sm hover:text-white">Story Gernerator</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Contact Us</h3>
            <p className="text-lg sm:text-sm">Address: Wuse 2, Abuja, Nigeria</p>
            <p className="text-lg sm:text-sm">Phone: +234 80123456789</p>
            <p className="text-lg sm:text-sm">Email: info@ericfranzee.com</p>
            <div className="flex justify-center md:justify-start mt-4">
              <a href="https://www.fracbook.com/ericfranzee" className="text-gray-300 hover:text-white mr-4">
                <i className="fab fa-facebook-square fa-2x"></i>
              </a>
              <a href="https://www.x.com/ericfranzee" className="text-gray-300 hover:text-white mr-4">
                <i className="fab fa-twitter-square fa-2x"></i>
              </a>
              <a href="https://www.instagram.com/ericfranzee" className="text-gray-300 hover:text-white">
                <i className="fab fa-instagram-square fa-2x"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-lg sm:text-sm">
            © 2025 <a href="https://ericfranzee.com" >ericfranzee.com</a>. All rights reserved. Made with ❤️.
          </p>
          <p className="text-lg sm:text-sm">
            <a href="#" className="hover:text-white">Privacy Policy</a> | <a href="#" className="hover:text-white">Terms of Use</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
