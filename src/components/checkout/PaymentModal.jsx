"use client";

import { useState } from "react";
import { IoClose } from "react-icons/io5";

export default function PaymentModal({
  open,
  onClose,
  totalAmount,
  walletBalance = 0,
  onConfirmPayment,
}) {
  const [applyWallet, setApplyWallet] = useState(false);

  // NEW → selected payment method
  const [paymentMethod, setPaymentMethod] = useState(null); // "online" | "cod"

  if (!open) return null;

  const maxWalletUsable = Math.min(walletBalance, totalAmount * 0.1); // cap at 10% of order total
  const walletDiscount = applyWallet ? maxWalletUsable : 0;
  const finalAmount = Math.max(totalAmount - walletDiscount, 0);


  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className="w-full max-w-md bg-white rounded-t-3xl p-6 animate-slide-up relative">
        
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 text-2xl"
          onClick={onClose}
        >
          <IoClose />
        </button>

        <h2 className="text-lg font-semibold mb-5">Payment Option</h2>

        {/* ---------------- PAYMENT OPTIONS (SINGLE ROW) ---------------- */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          
          {/* ONLINE */}
          <div
            className={`border rounded-xl p-4 flex justify-center items-center cursor-pointer 
              ${paymentMethod === "online" ? "border-green-500 bg-green-50" : "border-gray-300"}
            `}
            onClick={() => setPaymentMethod("online")}
          >
            <p className="text-[15px] font-medium">Online Payment</p>
          </div>

          {/* COD */}
          <div
            className={`border rounded-xl p-4 flex justify-center items-center cursor-pointer 
              ${paymentMethod === "cod" ? "border-green-500 bg-green-50" : "border-gray-300"}
            `}
            onClick={() => setPaymentMethod("cod")}
          >
            <p className="text-[15px] font-medium">Pay on Delivery</p>
          </div>
        </div>

        {/* Wallet apply */}
        <div className="flex items-center justify-between border rounded-xl p-4 mb-5">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={applyWallet}
              onChange={() => setApplyWallet(!applyWallet)}
              className="w-5 h-5 text-green-600"
            />
            <div>
              <p className="text-[14px] font-semibold">Apply Wallet Amount </p>
              <p className="text-[12px] text-gray-500">
                Save extra{" "}
                <span className="text-[#2A8B45] font-semibold">
                  ₹ {maxWalletUsable.toFixed(2)}
                </span>{" "}
                using Wallet
              </p>
            </div>
          </div>
          <p className="text-[13px] font-semibold text-gray-700">₹ {walletBalance}</p>
        </div>

        {/* PAY BUTTON */}
        <button
          className="w-full rounded-xl bg-[#2A8B45] py-3 text-[16px] font-semibold text-white shadow-lg disabled:opacity-50"
          disabled={!paymentMethod} // disable if nothing selected
          onClick={() => onConfirmPayment(finalAmount, paymentMethod,walletDiscount)}
        >
          Click to Pay ₹ {finalAmount.toFixed(2)}
        </button>

        <div
          className="mt-4 w-12 h-1.5 bg-gray-300 rounded-full mx-auto cursor-pointer"
          onClick={onClose}
        ></div>
      </div>
    </div>
  );
}
