"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@layout/navbar/Navbar";
import MobileHeader from "@components/mobile/MobileHeader";
import { useCategory } from "@hooks/azli_hooks/usecategory";
import { useCart } from "@hooks/azli_hooks/useCart";
import MobileFooter from "@layout/footer/MobileFooter";

import AppDownloadBar from "@components/mobile/AppDownloadBar";

const HeaderManager = ({ globalSetting, storeCustomization }) => {
  const pathname = usePathname();
  const { categories, error: categoryError, handleFetchCategories } = useCategory();
  const { count } = useCart();

  // Load categories if needed (ensure MobileFooter has data)
  React.useEffect(() => {
    if (!categories || categories.length === 0) {
      handleFetchCategories();
    }
  }, []);

  // Define Root Pages where the Default Navbar should show on mobile
  // All other pages are considered "Inner" pages and will show the Back Navigation
  const rootRoutes = [
    "/", // Home
    // "/search", // Now treated as inner page for Category/Search results
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
      <MobileFooter
        count={count}
        categories={categories}
        categoryError={categoryError}
        globalSetting={globalSetting}
      />

      {/* Mobile Back Header: Visible only on Mobile AND Inner Pages */}
      {!isRootPage && (
        <>
          <div className="lg:hidden">
            <AppDownloadBar />
          </div>
          <div className="lg:hidden sticky top-0 z-50 bg-white">
            <MobileHeader />
          </div>
        </>
      )}
      {!isRootPage && <div className="h-14 mb-3 lg:hidden" />} 

      {/* Default Navbar: Visible on Desktop OR (Mobile AND Root Pages) */}
      
      {/* App Bar for Mobile Root Pages - Unfixed, scrolls away */}
      {isRootPage && (
          <div className="lg:hidden">
            <AppDownloadBar />
          </div>
      )}

      <div className={`${!isRootPage ? "hidden lg:block" : "block"} sticky top-0 z-30`}>
        {/* Navbar is internally sticky on Desktop (lg:sticky), but wrapper forces sticky on Mobile too */}
        <div className="flex flex-col">
             <Navbar
                globalSetting={globalSetting}
                storeCustomization={storeCustomization}
             />
        </div>
      </div>
    </>
  );
};

export default HeaderManager;
