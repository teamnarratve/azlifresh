"use client";

import React from "react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";

const AppDownloadBar = () => {
  // Static visibility - no session storage as per new requirement
  
  // Handlers
  const [isVisible, setIsVisible] = React.useState(true);
  
  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="w-full bg-[#EBF5FF] border-b border-blue-100 px-4 py-2 flex items-center justify-between relative z-[60]">
      <div className="flex items-center gap-3">
        {/* Brand Logo (Replaces App Icon) */}
        <div className="w-auto h-8 shrink-0 flex items-center">
           <Image
             src="/logo/azli_small_icon.png" 
             width={32}
             height={32}
             alt="Azli Fresh"
             className="object-contain w-auto h-full"
           />
        </div>
        
        {/* Text */}
        <div className="flex flex-col">
            <span className="text-[13px] font-bold text-gray-900 leading-tight">
               Fast & Fresh Delivery
            </span>
            <span className="text-[11px] text-gray-600 font-medium">
               Get the app for best experience
            </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
         {/* CTA */}
         <a
           href="https://api.aslifresh.com/redirect?place=lmc-758526"
           target="_blank"
           rel="noreferrer"
           className="bg-[#124b8a] text-white text-xs font-bold px-4 py-2 rounded-full shadow-sm active:scale-95 transition-transform"
         >
           Get App
         </a>

         {/* Close */}
         <button
           onClick={handleDismiss}
           className="p-1 text-gray-400 hover:bg-gray-200 rounded-full transition-colors"
           aria-label="Dismiss"
         >
            <IoClose className="w-5 h-5" />
         </button>
      </div>
    </div>
  );
};

export default AppDownloadBar;
