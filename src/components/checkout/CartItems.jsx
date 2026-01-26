"use client";

import Image from "next/image";

const CartItemCard = ({ item, onIncrease, onDecrease, onRemove }) => {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        {/* IMAGE */}
        <div className="relative h-28 w-28 overflow-hidden rounded-xl">
          <Image
            src={item.img}
            alt={item.name}
            fill
            sizes="112px"
            className="object-cover"
          />

          <button className="absolute bottom-0 left-0 w-full bg-black/50 py-1 text-center text-[12px] text-white">
            Add Instruction
          </button>
        </div>

        {/* DETAILS */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <p className="text-[15px] font-semibold text-gray-900 leading-4">
              {item.name}
            </p>
            <p className="mt-1 text-[12px] text-gray-500">{item.cut}</p>
            <p className="text-[12px] text-gray-500">{item.weight}</p>
          </div>

          <div className="mt-3 flex items-center justify-between">
            {item.isAddon ? (
              <>
                <p className="text-[15px] font-semibold text-[#1B9A3F]">
                  Free
                </p>
                <button
                  type="button"
                  onClick={onRemove}
                  className="text-[13px] font-semibold text-[#E53935]"
                >
                  Remove
                </button>
              </>
            ) : (
              <>
                <p className="text-[17px] font-semibold text-[#1B9A3F]">
                  ₹ {(item.price * item.qty).toFixed(2)}
                </p>

                <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
                  <button
                    className="flex h-8 w-8 items-center justify-center text-lg text-gray-600"
                    onClick={onDecrease}
                  >
                    -
                  </button>

                  <span className="min-w-[36px] text-center text-sm font-semibold text-gray-800">
                    {item.qty}
                  </span>

                  <button
                    className="flex h-8 w-8 items-center justify-center text-lg text-gray-600"
                    onClick={onIncrease}
                  >
                    +
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
