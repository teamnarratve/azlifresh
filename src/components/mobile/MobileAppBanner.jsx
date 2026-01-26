"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FiX } from "react-icons/fi";

const MobileAppBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check local storage on mount
    const isDismissed = localStorage.getItem("mobileAppBannerDismissed");
    if (!isDismissed) {
      // Small delay for smooth entrance
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("mobileAppBannerDismissed", "true");
  };

  const handleDownload = () => {
    // Detect OS and redirect accordingly (placeholder logic)
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) {
      window.open("https://play.google.com/store/apps", "_blank");
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      window.open("https://apps.apple.com", "_blank");
    } else {
        // Fallback or generic link
      window.open("https://play.google.com/store/apps", "_blank");
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-16 left-0 w-full z-40 transition-transform duration-500 ease-in-out ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] border-t border-gray-100 p-3 mx-2 mb-2 rounded-lg flex items-center justify-between gap-3 relative sm:hidden">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 p-1"
          aria-label="Close Banner"
        >
          <FiX className="w-4 h-4" />
        </button>

        {/* Logo */}
        <div className="flex-shrink-0">
             <img
              src="/logo/azli_small_icon.png" 
              alt="App Logo" 
              className="w-10 h-10 object-contain"
            />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-tight">
            Download our <span className="font-bold">Mobile App</span>
          </p>
          <p className="text-xs text-gray-500 leading-tight truncate">
            for a better experience
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleDownload}
          className="bg-[#6f42c1] text-white text-xs font-medium px-3 py-2 rounded-md shadow-md active:scale-95 transition-transform whitespace-nowrap"
          style={{ backgroundColor: '#6f42c1' }} // Explicit hex as per screenshot hint (purple)
        >
          Download Now
        </button>
      </div>
    </div>
  );
};

export default MobileAppBanner;
