"use client";

import Image from "next/image";

const CartItemCard = ({ item, onIncrease, onDecrease, onRemove }) => {
  return (
    <div className="rounded-xl bg-white border border-gray-100 p-2 shadow-sm flex items-start gap-3">
      {/* IMAGE (Small & Compact) */}
      <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-gray-50 border border-gray-100 shrink-0">
        <Image
          src={item.img}
          alt={item.name}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>

      {/* DETAILS */}
      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
        
        {/* TOP ROW: Name & Remove */}
        <div className="flex justify-between items-start">
            <div className="pr-2">
                <p className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">
                    {item.name}
                </p>
                <p className="text-[11px] text-gray-500 font-medium mt-0.5">{item.cut} {item.weight && `• ${item.weight}`}</p>
            </div>
             {/* REMOVE LINK */}
             {!item.isAddon && (
                <button 
                    onClick={onRemove}
                    className="text-[10px] text-gray-400 hover:text-red-500 font-semibold px-1"
                >
                    REMOVE
                </button>
             )}
        </div>

        {/* BOTTOM ROW: Price & Stepper */}
        <div className="flex items-center justify-between mt-2">
           {item.isAddon ? (
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">Free</span>
           ) : (
                <p className="text-sm font-bold text-gray-900">
                    ₹ {(item.price * item.qty).toFixed(2)}
                </p>
           )}

            {/* Stepper */}
            {!item.isAddon && (
                <div className="flex items-center h-7 border border-gray-200 rounded-lg bg-gray-50">
                    <button
                        className="w-7 h-full flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-l-lg transition"
                        onClick={onDecrease}
                    >
                        -
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-gray-800">
                        {item.qty}
                    </span>
                    <button
                        className="w-7 h-full flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-r-lg transition"
                        onClick={onIncrease}
                    >
                        +
                    </button>
                </div>
            )}
            
            {/* Addon Remove Button (if needed distinct from regular item) */}
            {item.isAddon && (
                 <button 
                    onClick={onRemove}
                    className="text-xs text-red-500 font-medium"
                >
                    Remove
                </button>
            )}

        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
