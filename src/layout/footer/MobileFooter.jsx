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
import LoginBottomDrawer from "@components/drawer/LoginBottomDrawer";
import CartDrawer from "@components/drawer/CartDrawer";
import { useAuth } from "@hooks/azli_hooks/useCustomAuth";

const MobileFooter = ({ globalSetting, categories, categoryError, count }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [openPageDrawer, setOpenPageDrawer] = useState(false);
  const [openCartDrawer, setOpenCartDrawer] = useState(false);
  const [openLoginDrawer, setOpenLoginDrawer] = useState(false);

  const { isLoggedIn } = useSelector((state) => state.auth);
  const { profile, handleFetchProfile } = useAuth();

  // Listen for custom event to open login drawer logic
  useEffect(() => {
    const handleOpenAuth = () => setOpenLoginDrawer(true);
    window.addEventListener("openAuthModal", handleOpenAuth);
    return () => window.removeEventListener("openAuthModal", handleOpenAuth);
  }, []);

  const handleAccountClick = () => {
     router.push("/user/dashboard");
  };

  return (
    <>
      
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
      
      {/* 🔐 LOGIN BOTTOM DRAWER */}
      <LoginBottomDrawer
        open={openLoginDrawer}
        setOpen={setOpenLoginDrawer}
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
                pathname === "/" ? "text-[#124b8a]" : "text-gray-500"
              }`}
            />
            <span
              className={`text-[11px] font-medium mt-1 ${
                pathname === "/" ? "text-[#124b8a]" : "text-gray-500"
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
                openPageDrawer || pathname.includes("/search")
                  ? "text-[#124b8a]"
                  : "text-gray-500"
              }`}
            />
            <span
              className={`text-[11px] font-medium mt-1 ${
                openPageDrawer || pathname.includes("/search")
                  ? "text-[#124b8a]"
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
                openCartDrawer || pathname.includes("/cart")
                  ? "text-[#124b8a]"
                  : "text-gray-500"
              }`}
            />
            <span
              className={`text-[11px] font-medium mt-1 ${
                openCartDrawer || pathname.includes("/cart")
                  ? "text-[#124b8a]"
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
                pathname.includes("/user") || pathname.includes("/auth") || openLoginDrawer
                  ? "text-[#124b8a]"
                  : "text-gray-500"
              }`}
            />
            <span
              className={`text-[11px] font-medium mt-1 ${
                pathname.includes("/user") || pathname.includes("/auth") || openLoginDrawer
                  ? "text-[#124b8a]"
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
