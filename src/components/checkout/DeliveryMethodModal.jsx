"use client";

import { FiChevronRight, FiX } from "react-icons/fi";
import { IoCheckmarkCircle } from "react-icons/io5";

export default function DeliveryMethodModal({
  open,
  onClose,
  deliveryTypes = [],   // <-- FEED API DATA HERE
  selectedMethod,
  onSelectMethod,
  onSelectTimeSlot,
}) {
  if (!open) return null;

  return (
<div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className="w-full max-w-md bg-white rounded-t-3xl p-6 animate-slide-up relative">

        {/* Close Button */}
        <button
          className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          onClick={onClose}
        >
          <FiX className="text-gray-600 text-xl" />
        </button>

        <h2 className="text-xl font-semibold mb-5">Choose Delivery Method</h2>

        {deliveryTypes.map((method) => (
          <div
            key={method.id}
            className={`p-4 border rounded-2xl mb-3 cursor-pointer flex justify-between items-center
            ${
              selectedMethod?.id === method.id
                ? "border-green-500 bg-green-50"
                : "border-gray-200"
            }`}
            onClick={() => {
              if (method.disable_time_slot) {
                // ▶️ If time slot disabled → select and close
                onSelectMethod(method);
                onClose();
              } else {
                // ▶️ If time slot enabled → open TimeSlotModal
                onSelectTimeSlot(method);
              }
            }}
          >
            <div>
              <p className="text-[15px] font-semibold">{method.name}</p>
              <p className="text-[12px] text-gray-500">{method.description}</p>
            </div>

            {method.disable_time_slot ? (
              selectedMethod?.id === method.id && (
                <IoCheckmarkCircle className="text-2xl text-green-600" />
              )
            ) : (
              <FiChevronRight className="text-gray-400 text-xl" />
            )}
          </div>
        ))}

        {/* Close handle bar */}
        <div
          className="mt-5 w-12 h-1.5 bg-gray-300 rounded-full mx-auto cursor-pointer"
          onClick={onClose}
        ></div>
      </div>
    </div>
  );
}
