"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiTrash2 } from "react-icons/fi";

// Components
import CartItem from "@components/cart/CartItem";
import { useCart } from "@hooks/azli_hooks/useCart";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { getUserSession } from "@lib/auth-client";

const CartPage = () => {
  const router = useRouter();
  const { currency } = useUtilsFunction();
  const userInfo = getUserSession();

  const {
    cartList,
    totalAmount,
    handleFetchCartList,
    handleClearCart,
    isLoggedIn,
    loading
  } = useCart();

  // Fetch cart on mount if logged in
  useEffect(() => {
    if (isLoggedIn) {
      handleFetchCartList();
    }
  }, [isLoggedIn]);

  const isEmpty = !cartList || cartList.length === 0;
  const subtotal = totalAmount || 0;

  const handleCheckout = () => {
    if (!userInfo) {
       router.push("/auth/login?redirect=/checkout");
    } else {
       router.push("/checkout");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32 relative">
      
      {/* 1. CUSTOM HEADER */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 h-14 flex items-center justify-between px-4 shadow-sm">
        <button 
            onClick={() => router.back()}
            className="p-2 -ml-2 text-gray-700 hover:bg-gray-50 rounded-full"
        >
            <FiArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">My Cart</h1>
        
        <div className="w-9" />
      </div>

      {/* 2. CART CONTENT */}
      <div className="p-4 space-y-4">
        {loading ? (
           // Simple Loading Skeleton
           <div className="space-y-4 animate-pulse">
              {[1,2,3].map(i => (
                  <div key={i} className="bg-white h-24 rounded-2xl"></div>
              ))}
           </div>
        ) : isEmpty ? (
            // EMPTY STATE
            <div className="flex flex-col items-center justify-center pt-20">
                <div className="w-48 h-48 relative mb-6 opacity-80">
                    <Image 
                        src="/no-result.svg" 
                        alt="Empty Cart" 
                        fill
                        className="object-contain"
                    />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 text-center max-w-xs mb-8">
                    Looks like you haven't added anything to your cart yet.
                </p>
                <Link 
                    href="/search"
                    className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-green-200 hover:bg-green-700 transition"
                >
                    Browse Products
                </Link>
            </div>
        ) : (
            // CART ITEMS LIST
            <div className="space-y-3">
                {cartList.map((item) => (
                    <CartItem 
                        key={item.id} 
                        item={item} 
                        currency={currency} 
                    />
                ))}
            </div>
        )}
      </div>

      {/* 3. STICKY CHECKOUT BAR */}
      {!isEmpty && (
          <div className="fixed bottom-[60px] left-0 w-full bg-white border-t border-gray-100 p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] z-30">
              <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                      <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total</span>
                      <span className="text-xl font-bold text-gray-900">
                          {currency}{subtotal.toFixed(2)}
                      </span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="flex-1 bg-green-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-green-100 hover:bg-green-700 active:scale-[0.98] transition-all"
                  >
                      Proceed to Checkout
                  </button>
              </div>
          </div>
      )}

    </div>
  );
};

export default CartPage;
