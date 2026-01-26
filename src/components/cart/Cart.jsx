"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCart } from "@hooks/azli_hooks/useCart";
import { IoClose } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import CartItem from "@components/cart/CartItem";
import { getUserSession } from "@lib/auth-client";
import { isLoggedIn } from "@utils/auth";

const Cart = ({ setOpen, currency }) => {
  const router = useRouter();

  const {
    cartList,
    totalAmount,
    addonTotalAmount,
    discount,
    loading,
    error,
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


  const isEmpty = !cartList || cartList.length === 0;

 

  const handleCheckout = () => {
    console.log("handle checkout called.");


  if (!isLoggedIn) {
    console.log("User not logged in, redirecting to login page.");
    router.push(`/auth/login?redirect=/checkout`);
    setOpen(false);
    return;
  }
    console.log("User  logged in, redirecting to checkout page.");

  router.push("/checkout");
  setOpen(false);
};


  return (
    <>
      <div className="flex flex-col h-full justify-between items-middle bg-white rounded w-screen max-w-lg">
        {/* Header */}
        <div className="w-full flex justify-between items-center px-5 py-4 border-b bg-indigo-50 border-gray-100">
          <h2 className="font-semibold text-lg text-heading flex items-center">
            <FiShoppingCart className="size-6 me-2" />
            Shopping Cart
          </h2>

          <button
            onClick={() => setOpen(false)}
            className="inline-flex text-base items-center text-gray-500 p-2 hover:text-red-400"
          >
            <IoClose />
            <span className="text-sm ml-1">Close</span>
          </button>
        </div>

        {/* Cart List */}
        <div className="overflow-y-scroll flex-grow scrollbar-hide p-4 lg:p-6">
          {/* Empty Cart */}
          {isEmpty && (
            <div className="flex flex-col h-full justify-center items-center">
              <Image
                className="size-40 object-cover"
                src="/no-result.svg"
                alt="no-result"
                width={400}
                height={380}
              />
              <h3 className="font-semibold text-gray-700 text-lg pt-5">
                Your cart is empty
              </h3>
              <p className="px-12 text-center text-sm text-gray-500 pt-2">
                No items added in your cart. Please add products to your cart.
              </p>
            </div>
          )}

          {/* Cart Items */}
          {!isEmpty &&
            cartList.map((item, index) => <CartItem key={index} item={item} />)}
        </div>

        {/* Footer */}
        {!isEmpty && (
          <div className="bg-neutral-50 p-5">
            <p className="flex justify-between font-semibold text-slate-900">
              <span>
                <span>Subtotal</span>
                <span className="block text-sm text-slate-500 font-normal">
                  Shipping and taxes calculated at checkout.
                </span>
              </span>
              <span>
                {currency}
                {totalAmount}
              </span>
            </p>

            <div className="flex space-x-3 mt-5">
              {/* <Link
                href="/checkout-cart"
                className="inline-flex justify-center rounded-md py-2 px-3 bg-white text-slate-700 hover:bg-gray-100 border flex-1"
              >
                View Cart
              </Link> */}

              <button
                onClick={handleCheckout}
                className="inline-flex justify-center rounded-md py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-white flex-1"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
