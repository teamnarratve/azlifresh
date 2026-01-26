"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { FiChevronLeft, FiSearch, FiShoppingBag } from "react-icons/fi";
import { useMobileHeader } from "@context/MobileHeaderContext";

// Map common routes to titles if dynamic title is not set
const routeTitles = {
  "/": "Home",
  "/auth/login": "Login",
  "/auth/signup": "Sign Up",
  "/user/dashboard": "Dashboard",
  "/checkout": "Checkout",
  "/search": "Search",
  "/offer": "Offers",
};

const MobileHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { title } = useMobileHeader();

  // Determine display title: Dynamic Context Title > Route Map > Pathname fallback
  const displayTitle = title || routeTitles[pathname] || "My Azli Fresh";

  const handleBack = () => {
    // If on home, do nothing or open drawer? For now, nothing.
    if (pathname === "/") return;
    
    // Attempt basic back navigation
    if (window.history.length > 2) {
       router.back();
    } else {
       // Fallback if accessed directly
       router.push('/');
    }
  };

  // Hide on Desktop
  return (
    <div className="lg:hidden fixed top-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm h-14 flex items-center px-4 transition-all duration-300">
      
      {/* Left: Back Button */}
      {pathname !== "/" && (
        <button 
            onClick={handleBack} 
            className="mr-3 p-1 -ml-2 text-gray-800 hover:bg-gray-50 rounded-full"
            aria-label="Go Back"
        >
          <FiChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Center: Title */}
      <h1 className="flex-1 text-lg font-semibold text-gray-900 truncate text-center pr-8">
        {displayTitle}
      </h1>

      {/* Right: Actions (Optional - keeping clean for now, maybe Search/Cart later) */}
      {/* <div className="flex gap-2">
         <FiSearch className="w-5 h-5 text-gray-600" />
      </div> */}
    </div>
  );
};

export default MobileHeader;
