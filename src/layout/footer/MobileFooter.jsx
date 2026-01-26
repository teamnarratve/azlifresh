"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import { FiUser, FiShoppingCart, FiGrid } from "react-icons/fi";
import { IoFishOutline } from "react-icons/io5";

// Internal Components
import CategoryBottomDrawer from "@components/drawer/CategoryBottomDrawer";
import CartDrawer from "@components/drawer/CartDrawer";
import { useAuth } from "@hooks/azli_hooks/useCustomAuth";

import MobileAppBanner from "@components/mobile/MobileAppBanner";

const MobileFooter = ({ globalSetting, categories, categoryError, count }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [openPageDrawer, setOpenPageDrawer] = useState(false);
  const [openCartDrawer, setOpenCartDrawer] = useState(false);

  const { isLoggedIn } = useSelector((state) => state.auth);
  const { profile, handleFetchProfile } = useAuth();

  useEffect(() => {
    if (isLoggedIn && (!profile || Object.keys(profile).length === 0)) {
      handleFetchProfile();
    }
  }, [isLoggedIn, profile]);


  const handleAccountClick = () => {
    console.log("Account icon clicked and isLoggedIn :",isLoggedIn);
    if (isLoggedIn) {
      router.push("/user/dashboard");
    } else{
        router.push("/auth/login");
    }
  };

  return (
    <>
      <MobileAppBanner />
      {/* 🛍 CART DRAWER */}
      <CartDrawer
        currency={globalSetting?.default_currency || "₹"}
        open={openCartDrawer}
        setOpen={setOpenCartDrawer}
      />

      {/* 📂 CATEGORY BOTTOM DRAWER */}
      <CategoryBottomDrawer
        open={openPageDrawer}
        setOpen={setOpenPageDrawer}
        categories={categories}
      />

      {/* 📌 Bottom Navigation */}
      <footer className="sm:hidden fixed bottom-0 w-full bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.06)] z-50">
        <div className="flex justify-between items-center h-16 px-6">

          {/* 🏠 Home (Fish Icon) */}
          <Link
            href="/"
            className="flex flex-col items-center justify-center"
          >
            <IoFishOutline
              className={`w-6 h-6 ${
                pathname === "/" ? "text-emerald-600" : "text-gray-500"
              }`}
            />
            <span
              className={`text-[11px] font-medium mt-1 ${
                pathname === "/" ? "text-emerald-600" : "text-gray-500"
              }`}
            >
              Home
            </span>
          </Link>

          {/* 📂 Categories Drawer (Grid Icon) */}
          <button
            onClick={() => setOpenPageDrawer(true)}
            className="flex flex-col items-center justify-center"
          >
            <FiGrid
              className={`w-6 h-6 ${
                pathname.includes("/categories")
                  ? "text-emerald-600"
                  : "text-gray-500"
              }`}
            />
            <span
              className={`text-[11px] font-medium mt-1 ${
                pathname.includes("/categories")
                  ? "text-emerald-600"
                  : "text-gray-500"
              }`}
            >
              Categories
            </span>
          </button>

          {/* 🛒 Cart Drawer */}
          <button
            onClick={() => setOpenCartDrawer(true)}
            className="flex flex-col items-center justify-center relative"
          >
            {count > 0 && (
              <span className="absolute -top-1 right-0 w-4 h-4 text-[10px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
            <FiShoppingCart
              className={`w-6 h-6 ${
                pathname.includes("/cart")
                  ? "text-emerald-600"
                  : "text-gray-500"
              }`}
            />
            <span
              className={`text-[11px] font-medium mt-1 ${
                pathname.includes("/cart")
                  ? "text-emerald-600"
                  : "text-gray-500"
              }`}
            >
              Cart
            </span>
          </button>

          {/* 👤 Account (Dashboard/Login) */}
          <button
            onClick={handleAccountClick}
            className="flex flex-col items-center justify-center"
          >
            <FiUser
              className={`w-6 h-6 ${
                pathname.includes("/user/dashboard")
                  ? "text-emerald-600"
                  : "text-gray-500"
              }`}
            />
            <span
              className={`text-[11px] font-medium mt-1 ${
                pathname.includes("/user/dashboard")
                  ? "text-emerald-600"
                  : "text-gray-500"
              }`}
            >
              Account
            </span>
          </button>
        </div>
      </footer>
    </>
  );
};

export default dynamic(() => Promise.resolve(MobileFooter), { ssr: false });
