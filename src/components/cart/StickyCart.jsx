"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { IoBagHandleOutline } from "react-icons/io5";

//internal import
// import CartDrawer from "@components/drawer/CartDrawer";
import { useCart } from "@hooks/azli_hooks/useCart";

//internal import
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { FiShoppingBag, FiChevronRight } from "react-icons/fi";

const StickyCart = ({ currency, count, totalAmount }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Hidden on Cart, Checkout, or if Empty
  if (count <= 0 || pathname === "/cart" || pathname.includes("/checkout")) {
    return null;
  }

  return (
    <div className="fixed bottom-16 left-0 w-full px-4 z-40 lg:hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
      <button
        onClick={() => router.push("/cart")}
        className="w-full bg-green-900/95 backdrop-blur-md text-white shadow-lg shadow-green-900/20 rounded-xl p-3 flex items-center justify-between border border-green-800"
      >
        {/* Left: Icon + Text */}
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <FiShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs font-medium text-green-200 uppercase tracking-wide">
              {count} {count === 1 ? "Item" : "Items"}
            </span>
            <span className="text-sm font-bold text-white">
              {currency}
              {totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Right: Action */}
        <div className="flex items-center gap-1 text-sm font-bold text-white bg-green-600 px-3 py-1.5 rounded-lg">
          View Cart
          <FiChevronRight className="w-4 h-4" />
        </div>
      </button>
    </div>
  );
};

export default dynamic(() => Promise.resolve(StickyCart), { ssr: false });
