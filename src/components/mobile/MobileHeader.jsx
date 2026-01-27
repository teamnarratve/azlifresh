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

import Link from "next/link";
import SearchInput from "@components/navbar/SearchInput"; // Import SearchInput
import { FiX } from "react-icons/fi"; // Import Close Icon

const MobileHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { title } = useMobileHeader();
  const [showSearch, setShowSearch] = React.useState(false); // Search Toggle State

  // Determine display title: Dynamic Context Title > Route Map > Pathname fallback
  const displayTitle = title || routeTitles[pathname] || "My Azli Fresh";

  const handleBack = () => {
    if (pathname === "/") return;
    if (window.history.length > 2) {
       router.back();
    } else {
       router.push('/');
    }
  };

  return (
    <div className="bg-white border-b border-gray-100 shadow-sm h-14 flex items-center px-4 transition-all duration-300 w-full">
      
      {showSearch ? (
        /* Search Mode */
        <div className="flex w-full items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="flex-1">
                 <SearchInput />
             </div>
             <button 
                onClick={() => setShowSearch(false)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
             >
                 <FiX className="w-5 h-5" />
             </button>
        </div>
      ) : (
        /* Standard Header Mode */
        <>
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
            <h1 className="flex-1 text-lg font-semibold text-gray-900 truncate text-center pr-2">
                {displayTitle}
            </h1>

            {/* Right: Search Action */}
            <button 
                onClick={() => setShowSearch(true)}
                className="p-2 -mr-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                aria-label="Search"
            >
                <FiSearch className="w-5 h-5" />
            </button>
        </>
      )}
    </div>
  );
};

export default MobileHeader;
