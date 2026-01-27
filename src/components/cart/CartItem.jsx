import Link from "next/link";
import ImageWithFallback from "@components/common/ImageWithFallBack";
import { useDispatch } from "react-redux";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";

import { removeFromCart, updateCartQuantity } from "@redux/slices/cartSlice";
import { useCart } from "@hooks/azli_hooks/useCart";

const CartItem = ({ item, currency }) => {
  const dispatch = useDispatch();

  // Extract mapped fields
  const product = item?.cart_product_data;
  const option = item?.cart_product_option_data;

  const title = product?.name || option?.name || "Product";
  const image = option?.img || product?.imgs?.[0]?.img || "/placeholder.png";

  const price = option?.total_price || product?.off_price || product?.price;

  const { handleUpdateQuantity } = useCart();

  const handleIncrease = () => {
    handleUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrease = () => {
    const newQty = item.quantity - 1;
    handleUpdateQuantity(item.id, newQty <= 0 ? 0 : newQty);
  };

  const handleRemove = () => {
    handleUpdateQuantity(item.id, 0);
  };

  return (
    <div className="group w-full h-auto flex justify-start items-start py-3 bg-white rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
      {/* 1. PRODUCT IMAGE */}
      <div className="relative flex overflow-hidden flex-shrink-0 cursor-pointer ml-3 mt-1">
        <ImageWithFallback
          width={60}
          height={60}
          src={image}
          alt={title}
          className="size-16 flex-none rounded-lg bg-gray-50 object-cover border border-gray-100"
        />
      </div>

      {/* 2. PRODUCT DETAILS */}
      <div className="flex flex-col w-full pl-3 pr-3">
        <div className="flex justify-between items-start">
            <div className="min-w-0 pr-2">
                <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 leading-tight">
                    {title}
                </h3>
                {item.variant && (
                     <p className="text-xs text-gray-500 mt-0.5">{item.variant.name}</p>
                )}
                <div className="mt-1 font-medium text-xs text-gray-500">
                    {currency}{price} / unit
                </div>
            </div>
            
            {/* REMOVE BUTTON - Compact Top Right */}
            <button
               onClick={handleRemove}
               className="text-gray-400 hover:text-red-500 p-1 -mr-1 transition-colors"
               aria-label="Remove item"
            >
                <FiTrash2 className="w-4 h-4" />
            </button>
        </div>

        {/* 3. QUANTITY & TOTAL ROW */}
        <div className="flex items-end justify-between mt-3">
            {/* Quantity Stepper */}
            <div className="flex items-center h-8 bg-gray-50 rounded-lg border border-gray-200">
                <button 
                    onClick={handleDecrease}
                    className="w-8 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg transition"
                >
                    <FiMinus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center text-sm font-semibold text-gray-900">{item.quantity}</span>
                <button 
                    onClick={handleIncrease}
                    className="w-8 h-full flex items-center justify-center text-green-600 hover:bg-green-50 rounded-r-lg transition"
                >
                    <FiPlus className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Line Item Total */}
            <div className="text-right">
                <p className="text-sm font-bold text-gray-900">
                    {currency}{(price * item.quantity).toFixed(2)}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
