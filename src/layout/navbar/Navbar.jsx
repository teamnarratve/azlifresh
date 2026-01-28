"use client";
import Link from "next/link";
import { useEffect } from "react";

// internal imports
import TopNavbar from "./TopNavbar";
import NavbarPromo from "@layout/navbar/NavbarPromo";
import SearchInput from "@components/navbar/SearchInput";
import NotifyIcon from "@components/navbar/NotifyIcon";
import ProfileDropDown from "@components/navbar/ProfileDropDown";
// import MobileFooter from "@layout/footer/MobileFooter"; // Moved to HeaderManager
import { useCategory } from "@hooks/azli_hooks/usecategory";
import { useCart } from "@hooks/azli_hooks/useCart";

const Navbar = ({ globalSetting, storeCustomization }) => {
  const { categories, error, loading, handleFetchCategories } = useCategory();

  const { count, isLoggedIn } = useCart();

  // Always show persisted cart count
  const cartCount = count;

  const { default_currency: currency = "₹" } = globalSetting || {};

  // 🔹 Fetch categories on mount
  useEffect(() => {
  if (!categories || categories.length === 0) {
    handleFetchCategories();
  }
}, []);

  // useEffect(() => {
  //   console.log("************categories********", categories);
  // }, [categories]);

  return (
    <div className="w-full">
      {/* navbar top section */}
      <TopNavbar storeCustomization={storeCustomization} />

      {/* MOBILE ONLY: Location & Logo Row (Scrolls Away) */}
      <div className="lg:hidden flex items-center justify-between px-4 py-1 bg-white">
          <div className="flex items-center gap-1">
             <span className="text-xs font-bold text-gray-800">Select Location</span>
             <svg 
               className="w-3.5 h-3.5 text-gray-600" 
               fill="none" 
               viewBox="0 0 24 24" 
               stroke="currentColor"
             >
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
             </svg>
          </div>
          <Link href="/">
             <img
               className="h-8 w-auto px-1"
               src="/xpress.png"
               alt="azli"
             />
          </Link>
      </div>

      <header as="header" className="relative bg-white border-b border-gray-100 lg:static lg:shadow lg:border-b lg:border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-10 lg:divide-y lg:divide-gray-200">
          <div className="relative flex h-auto lg:h-20 justify-between items-center py-1 lg:py-0">
            
            {/* Logo (Desktop Only) */}
            <div className="hidden lg:flex relative z-10 px-2 lg:px-0">
              <Link href="/" className="flex flex-shrink-0 items-center">
                <img
                  className="h-8 w-auto"
                  src="/xpress.png"
                  alt="azli"
                />
              </Link>
            </div>

            {/* Search Input Section (Mobile: Full Width, Desktop: Center) */}
            <div className="w-full lg:w-auto min-w-0 flex-1 md:px-8 lg:px-10 xl:col-span-6">
              <div className="flex items-center px-0 lg:px-6 py-0 lg:py-4 md:mx-auto md:max-w-3xl lg:mx-0 lg:max-w-none xl:px-0">
                <div className="w-full">
                  <SearchInput />
                </div>
              </div>
            </div>

            {/* Notification Icons (Desktop Only) */}
            <div className="hidden lg:relative lg:z-10 sm:flex sm:items-center">
              <NotifyIcon count={cartCount} currency={currency} />
              <div className="relative ml-4 flex-shrink-0">
                <ProfileDropDown />
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* navbar bottom */}
      <NavbarPromo
        languages={[]} // or remove if handled elsewhere
        categories={categories}
        categoryError={error}
        loading={loading}
      />
      {/* MobileFooter moved to HeaderManager */}
    </div>
  );
};

export default Navbar;
