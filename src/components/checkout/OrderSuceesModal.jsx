"use client";

import { useEffect } from "react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";

export default function OrderSuccessModal({ open, onClose, order }) {
  const router = useRouter();

  // Auto close after 5 seconds
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
        router.push("/my-orders");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center">
      <div className="bg-white w-11/12 max-w-sm rounded-2xl p-6 text-center relative shadow-xl">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-500 text-2xl"
          onClick={() => {
            onClose();
            router.push("/my-orders");
          }}
        >
          <IoClose />
        </button>

        {/* Success Image */}
        <div className="flex justify-center mb-4">
          <Image
            src="/order/success.png"
            width={180}
            height={180}
            alt="Order Success"
            className="rounded-xl"
            unoptimized
          />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-2">
          Order Placed Successfully!
        </h2>
        <p className="text-gray-600 text-sm">
          Thank you for ordering! Your delicious items are on the way.
        </p>
      </div>
    </div>
  );
}
