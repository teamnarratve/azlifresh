"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@layout/navbar/Navbar";
import MobileHeader from "@components/mobile/MobileHeader";

const HeaderManager = ({ globalSetting, storeCustomization }) => {
  const pathname = usePathname();

  // Define Root Pages where the Default Navbar should show on mobile
  // All other pages are considered "Inner" pages and will show the Back Navigation
  const rootRoutes = [
    "/", // Home
    "/search", // Categories/Search (often treated as main tab)
    "/user/dashboard", // Main Account Screen
    "/auth/login", // Login typically has its own header or default
    "/auth/signup",
  ];

  // Logic: 
  // If ROOT route: Show Navbar (Desktop & Mobile), Hide MobileHeader.
  // If INNER route: Hide Navbar (Mobile only), Show MobileHeader (Mobile only).
  // Desktop ALWAYS shows Navbar.

  const isRootPage = rootRoutes.includes(pathname);

  return (
    <>
      {/* Mobile Back Header: Visible only on Mobile AND Inner Pages */}
      {!isRootPage && (
        <div className="lg:hidden">
          <MobileHeader />
           {/* Spacer for Fixed Header + Extra Gap for Product Page */}
          <div className="h-14 mb-3" /> 
        </div>
      )}

      {/* Default Navbar: Visible on Desktop OR (Mobile AND Root Pages) */}
      <div className={!isRootPage ? "hidden lg:block" : "block"}>
        {/* Force Fixed on Mobile, Sticky/Relative on Desktop as per original behavior ?? 
            Original Navbar was Sticky. User wants "All top bar should be sticky".
            We force Fixed on Mobile to ensure it stays top.
        */}
        <div className={`
            ${isRootPage ? 'fixed top-0 left-0 w-full z-30 lg:relative lg:z-auto' : ''}
        `}>
             <Navbar
                globalSetting={globalSetting}
                storeCustomization={storeCustomization}
             />
        </div>
        
        {/* Spacer for Mobile Root Page (Navbar Height ~80px/h-20) */}
        {isRootPage && <div className="h-20 lg:hidden" />} 
        {/* Note: Navbar includes TopBar + Search Header. Height might be more than 80px. 
            TopBar (~40px?) + Header (80px) = ~120px? 
            Let's estimate 120px safe area for now, or check Navbar source.
            Navbar.jsx: TopNavbar + Header(h-20/80px).
        */}
      </div>
    </>
  );
};

export default HeaderManager;
