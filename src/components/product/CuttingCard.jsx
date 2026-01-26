"use client";

import { useEffect, useRef, useState } from "react";
import { IoAdd, IoRemove, IoBagAdd } from "react-icons/io5";
import Link from "next/link";
import dynamic from "next/dynamic";
import ImageWithFallback from "@components/common/ImageWithFallBack";
import Price from "@components/common/Price";
import { useSetting } from "@context/SettingContext";
import { useCart } from "@hooks/azli_hooks/useCart";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const CuttingCard = ({ product, ProductId,stock,stockStatus }) => {



  const modalRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { globalSetting } = useSetting();
  const currency = globalSetting?.default_currency || "₹";

  const { cartList, handleAddItem, handleUpdateQuantity } = useCart();

  const productOptionId = product?.id;
  const productName = product?.name;
  const productImage = product?.img;
  const off_price = product?.total_price || 0;
  const originalPrice = product?.total_price || 0;
  const cleaned_weight = product?.cleaned_weight || "";
  const cleaned_weight_to = product?.cleaned_weight_to || "";
  const un_cleaned_weight = product?.un_cleaned_weight || "";

  //     useEffect(() => {
  //   console.log("🔹 Product from API cutting Page:", product);
  // }, [product]);

  //    useEffect(() => {
  //   console.log("🔹 cutting Page stock_status of :",productName ,  stockStatus);
  // }, [stockStatus]);
 
  const outOfStock = stock <= 0;

  const cartItem = cartList.find(
    (i) => i.cart_product_option_data?.id === productOptionId
  );

const pathname = usePathname();
const searchParams = useSearchParams();
const currentPath = searchParams?.toString()
  ? `${pathname}?${searchParams.toString()}`
  : pathname;

const handleAddToCartWithRedirect = async () => {
  const redirectPath = searchParams?.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;

  console.log("REDIRECT PATH: ", redirectPath);

  await handleAddItem({
    product_id: ProductId, // 🔹 Correct ID
    product_option_id: productOptionId, // important for cutting options
    quantity: 1,
    redirect: redirectPath,
  });
};


  const handleIncrease = () => {
    handleUpdateQuantity(cartItem.id, cartItem.quantity + 1);
  };

  const handleDecrease = () => {
    if (cartItem.quantity === 1) {
      handleUpdateQuantity(cartItem.id, 0);
    } else {
      handleUpdateQuantity(cartItem.id, cartItem.quantity - 1);
    }
  };

  return (
    <div className="flex gap-3 border border-gray-200 bg-white rounded-lg p-2 shadow-sm hover:shadow-md transition-all duration-300">
      {/* IMAGE SECTION */}
      <div className="relative w-24 h-28 bg-gray-100 rounded-lg overflow-hidden">
        <Link href="#" onClick={(e) => e.preventDefault()}>
          <ImageWithFallback
            fill
            alt={productName}
            src={productImage}
            className="object-cover transition-transform duration-300"
          />
        </Link>
        {outOfStock && (
          <span className="absolute inset-x-1 top-1 rounded-md bg-black/70 px-2 py-[2px] text-[11px] font-semibold text-white">
            Out of stock
          </span>
        )}
      </div>

      {/* CONTENT SECTION */}
      <div className="flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
            {productName}
          </h3>

          <div className="text-[11px] text-gray-500 leading-snug mt-1">
            {cleaned_weight && (
              <p>
                Cleaned: {cleaned_weight}
                {cleaned_weight_to && ` - ${cleaned_weight_to}`}
              </p>
            )}
            {un_cleaned_weight && <p>Uncleaned: {un_cleaned_weight}</p>}
          </div>
        </div>

        <div className="flex items-center justify-between mt-1">
          <Price
            card
            currency={currency}
            price={off_price}
            originalPrice={originalPrice}
          />

            {!stockStatus ? (
            <button
              className="self-start rounded-full border border-rose-500 px-3 py-1 text-xs font-semibold text-rose-600 bg-white"
              disabled
            >
              Out Of Stock
            </button>
          ) : cartItem ? (
            <div className="flex items-center gap-2 bg-emerald-600 text-white px-2 py-[2px] rounded-full text-sm">
              <button onClick={handleDecrease}>
                <IoRemove />
              </button>
              <span className="font-medium">{cartItem.quantity}</span>
              <button onClick={handleIncrease}>
                <IoAdd />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCartWithRedirect}
              className="bg-emerald-600 px-4 py-2 rounded-full text-sm font-semibold text-white hover:bg-emerald-700"
            >
              ADD
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(CuttingCard), { ssr: false });
