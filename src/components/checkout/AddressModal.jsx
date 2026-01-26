"use client";

import { FiChevronRight, FiX } from "react-icons/fi";
import { IoHomeOutline } from "react-icons/io5";

export default function AddressSelectorModal({
  open,
  onClose,
  addresses,
  selectedId,
  onSelect,
  onAddNew,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className="w-full max-w-md bg-white rounded-t-3xl p-5 animate-slide-up relative">

        {/* Close Button */}
        <button
          className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          onClick={onClose}
        >
          <FiX className="text-gray-600 text-xl" />
        </button>

        <h2 className="text-xl font-semibold mb-5">Choose a delivery address</h2>

        <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
          {addresses.map((addr) => {
            // Build full formatted address
            const fullAddress = `
              ${addr.street_location || ""}, 
              ${addr.street || ""}, 
              ${addr.district || ""}, 
              ${addr.state || ""} - ${addr.pin_code || ""}
            `
              .replace(/\s+/g, " ")
              .trim();

            return (
              <div
                key={addr.id}
                className={`border rounded-2xl p-4 cursor-pointer transition
                ${
                  selectedId === addr.id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200"
                }`}
                onClick={() => onSelect(addr.id)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center
                    ${selectedId === addr.id ? "bg-green-500" : "bg-gray-100"}`}
                  >
                    <IoHomeOutline
                      className={`text-lg ${
                        selectedId === addr.id ? "text-white" : "text-gray-500"
                      }`}
                    />
                  </div>

                  <div className="flex-1">
                    <p
                      className={`text-[15px] font-semibold ${
                        selectedId === addr.id
                          ? "text-green-600"
                          : "text-gray-800"
                      }`}
                    >
                      {addr.address_type || "home"}
                    </p>

                    <p className="text-[13px] leading-5 text-gray-600 mt-1">
                      {fullAddress}
                    </p>

                    <p className="text-[12px] text-gray-500 mt-1">
                      Phone: {addr.ph_number}
                    </p>
                  </div>

                  <FiChevronRight className="text-gray-400 text-xl" />
                </div>
              </div>
            );
          })}
        </div>

        <button
          className="flex items-center gap-2 text-green-600 font-semibold mt-6 text-[16px]"
          onClick={onAddNew}
        >
          <span className="text-2xl">+</span>
          Add new Address
        </button>

        <div
          className="mt-4 w-12 h-1.5 bg-gray-300 rounded-full mx-auto cursor-pointer"
          onClick={onClose}
        ></div>
      </div>
    </div>
  );
}
