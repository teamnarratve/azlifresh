"use client";
import Link from "next/link";
import { useEffect } from "react";

// internal imports
import TopNavbar from "./TopNavbar";
import NavbarPromo from "@layout/navbar/NavbarPromo";
import SearchInput from "@components/navbar/SearchInput";
import NotifyIcon from "@components/navbar/NotifyIcon";
import ProfileDropDown from "@components/navbar/ProfileDropDown";
import MobileFooter from "@layout/footer/MobileFooter";
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
    <div className="sticky z-20 top-0 w-full">
      {/* navbar top section */}
      <TopNavbar storeCustomization={storeCustomization} />

      <header as="header" className="bg-white shadow border-b border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-10 lg:divide-y lg:divide-gray-200">
          <div className="relative flex h-20 justify-between">
            <div className="relative z-10 flex px-2 lg:px-0">
              {/* asli logo */}
              <Link href="/" className="flex flex-shrink-0 items-center">
                <img
                  className="h-8 w-auto"
                  src="/logo/azli_small_icon.png"
                  alt="azli"
                />
              </Link>
            </div>

            {/* search input section */}
            <div className="min-w-0 flex-1 md:px-8 lg:px-10 xl:col-span-6">
              <div className="flex items-center px-6 py-4 md:mx-auto md:max-w-3xl lg:mx-0 lg:max-w-none xl:px-0">
                <div className="w-full">
                  <SearchInput />
                </div>
              </div>
            </div>

            {/* notification icons */}
            <div className="lg:relative lg:z-10 sm:flex sm:items-center hidden">
              <NotifyIcon count={cartCount} currency={currency} />

              {/* Profile dropdown */}
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
      <MobileFooter
        count={cartCount}
        categories={categories}
        categoryError={error}
        globalSetting={globalSetting}
      />
    </div>
  );
};

export default Navbar;
