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
    <div className="group w-full h-auto flex justify-start items-center py-4 transition-all relative border-b border-gray-200 last:border-b-0">
      <div className="relative flex overflow-hidden flex-shrink-0 cursor-pointer mr-4">
        <ImageWithFallback
          width={40}
          height={40}
          src={image}
          alt={title}
          className="size-20 flex-none rounded-md bg-gray-100 object-cover"
        />
      </div>

      <div className="flex flex-col w-full overflow-hidden">
        <div className="flex">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-700 text-heading line-clamp-1">
              {title}
            </p>

            <span className="text-xs text-gray-400 mb-1">
              Item Price {currency}
              {price}
            </span>
          </div>

          <div className="ml-4 shrink-0">
            <button
              onClick={handleRemove}
              className="hover:text-red-600 text-red-400 text-lg cursor-pointer"
            >
              <FiTrash2 />
            </button>
          </div>
        </div>

        {/* Price × Quantity */}
        <div className="flex items-center justify-between">
          <div className="font-bold text-teal-600 text-sm md:text-base">
            {currency}
            {(price * item.quantity).toFixed(2)}
          </div>

          {/* Quantity buttons */}
          <div className="h-8 w-22 flex items-center justify-evenly p-1 border border-gray-100 bg-white text-gray-600 rounded-full">
            <button onClick={handleDecrease}>
              <FiMinus className="cursor-pointer hover:bg-gray-100" />
            </button>

            <p className="text-sm font-semibold px-1">{item.quantity}</p>

            <button onClick={handleIncrease}>
              <FiPlus className="cursor-pointer hover:bg-gray-100" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
