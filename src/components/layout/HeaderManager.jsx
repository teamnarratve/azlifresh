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
        </div>
      )}

      {/* Default Navbar: Visible on Desktop OR (Mobile AND Root Pages) */}
      <div className={!isRootPage ? "hidden lg:block" : "block"}>
        <Navbar
          globalSetting={globalSetting}
          storeCustomization={storeCustomization}
        />
      </div>
    </>
  );
};

export default HeaderManager;
