"use client";

import React, { useEffect } from "react";
import { IoAlertCircleOutline, IoReturnUpBackOutline } from "react-icons/io5";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import { getUserSession } from "@lib/auth-client";

import CartItem from "@components/cart/CartItem";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { useSetting } from "@context/SettingContext";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { useCart } from "@hooks/azli_hooks/useCart";

// ⭐ USE REDUX CART

const CheckoutCartScreen = () => {
  const userInfo = getUserSession();
  const { storeCustomization } = useSetting();
  const { showingTranslateValue } = useUtilsFunction();
  const { currency } = useUtilsFunction();

  // ⭐ REDUX CART
  const {
    cartList,
    totalAmount,
    discount,
    addonTotalAmount,
    count,
    handleFetchCartList,
    isLoggedIn
  } = useCart();

      useEffect(() => {
  if (isLoggedIn) {
    if (!cartList || cartList.length === 0) {
      handleFetchCartList();
    }
  }
}, [isLoggedIn, cartList]);

  const checkout = storeCustomization?.checkout;

  const isEmpty = cartList.length === 0;

  // ⭐ Total = subtotal + addons - discount
  const subtotal = totalAmount || 0;
  const addonTotal = addonTotalAmount || 0;
  const discountAmount = discount || 0;

  const finalTotal = subtotal + addonTotal - discountAmount;

  const handleCheckout = () => {
    if (cartList.length <= 0) {
      closeCartDrawer();
    } else {
      if (!userInfo) {
        router.push(`/checkout-cart`);
        closeCartDrawer();
      } else {
        router.push("/checkout-cart");
        closeCartDrawer();
      }
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-3 sm:px-10 pt-16 pb-16">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-[60%] xl:w-[55%] divide-y divide-slate-200 dark:divide-slate-700 ">
          <h2 className="font-bold text-xl pb-3">Shopping Cartt</h2>

          <div className="w-full block mt-3">
            {cartList?.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                currency={currency}
              />
            ))}

            {isEmpty && (
              <div className="mt-10 flex flex-col h-full justify-center">
                <div className="flex flex-col items-center">
                  <Image
                    className="size-40 flex-none rounded-md object-cover"
                    src="/no-result.svg"
                    alt="no-result"
                    width={400}
                    height={380}
                  />
                  <h3 className=" font-semibold text-gray-700 text-lg pt-5">
                    Your cart is empty
                  </h3>
                  <p className="px-12 text-center text-sm text-gray-500 pt-2">
                    No items added in your cart. Please add product to your cart
                    list.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE SUMMARY */}
        <div className="border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 my-10 lg:my-0 lg:mx-10 xl:mx-16 2xl:mx-20 flex-shrink-0"></div>

        <div className="flex-1">
          <div className="sticky top-44 border bg-white rounded-lg border-gray-100">
            <div className="p-8">
              <h2 className="font-semibold text-lg">
                {showingTranslateValue(checkout?.order_summary)}
              </h2>

              <div className="mt-3 text-sm text-slate-500 dark:text-gray-400 divide-y divide-gray-200/70 dark:divide-gray-700/80">
                <div className="flex justify-between py-3">
                  <span className="font-semibold text-gray-600">
                    {showingTranslateValue(checkout?.sub_total)}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {currency}
                    {subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between py-3">
                  <span className="font-semibold text-gray-600">
                    Addon Total
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {currency}
                    {addonTotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between py-3">
                  <span className="font-semibold text-gray-600">
                    Discount
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {currency}
                    {discountAmount.toFixed(2)}
                  </span>
                </div>

                {/* Coupon Section can be enabled later */}
              </div>
            </div>

            <div className="bg-neutral-100 dark:bg-slate-900 p-8 rounded-b-md">
              <p className="flex justify-between font-semibold text-slate-900 dark:text-slate-100">
                <span>
                  <span className="text-sm">
                    {showingTranslateValue(checkout?.total_cost)}
                  </span>
                  <span className="block text-sm text-slate-500 dark:text-slate-400 font-normal">
                    Shipping and taxes calculated at checkout.
                  </span>
                </span>

                <span className="font-bold text-gray-900 dark:text-gray-100">
                  {currency}
                  {finalTotal.toFixed(2)}
                </span>
              </p>

              <div className="flex space-x-3 items-center mt-8">
                <Link
                  href="/products"
                  className="relative h-auto inline-flex items-center justify-center rounded-md transition-colors text-xs sm:text-base font-medium py-2 px-3 bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 flex-1 border border-slate-200 dark:border-slate-700 dark:focus:ring-offset-0"
                >
                  <span className="text-xl mr-2">
                    <IoReturnUpBackOutline />
                  </span>
                  Continue Shopping
                </Link>

                <Link
                  href="/checkout"
                  onClick={handleCheckout}
                  className="relative h-auto inline-flex items-center justify-center rounded-md w-full transition-colors text-xs sm:text-base font-medium py-2 px-3 bg-emerald-500 hover:bg-emerald-600 border border-emerald-500 text-white flex-1"
                >
                  Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(CheckoutCartScreen), {
  ssr: false,
});
