"use client";

import { useEffect, useRef, useState } from "react";
import { IoAdd, IoRemove } from "react-icons/io5";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname, useSearchParams } from "next/navigation";
import ImageWithFallback from "@components/common/ImageWithFallBack";
import { notifyError } from "@utils/toast";
import { useSetting } from "@context/SettingContext";
import Discount from "@components/common/Discount";
import { handleLogEvent } from "src/lib/analytics";
import Price from "@components/common/Price";
import Stock from "@components/common/Stock";
import Rating from "@components/common/Rating";
import { useCart } from "@hooks/azli_hooks/useCart";

const ProductCard = ({ product }) => {
  const modalRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { globalSetting } = useSetting();

  const { cartList, handleAddItem, handleUpdateQuantity } = useCart();
  const currency = globalSetting?.default_currency || "₹";

  // 🧠 Debug
  // useEffect(() => {
  //   console.log("🔹 Product from API Search Page:", product);
  // }, [product]);

  // 🧩 Extract your product properties safely
  const productId = product?.id;
  const weight = product?.weight;

  const productName = product?.name;
  const productImage = product?.imgs?.[0]?.img;
  const off_price = product?.off_price || 0;
  const originalPrice = product?.price || 0;
  const stock = product?.stock || 0;
  const stock_status = product?.stock_status;
  const showNotify = stock === 0 || stock_status === false;
  const isAppOnlyProduct =
    Array.isArray(product?.fish_cutting_options) &&
    product.fish_cutting_options.length > 0 &&
    product.fish_cutting_options.every(
      (option) => option?.normal_visible === false
    );
  const hasSingleCuttingOption =
    Array.isArray(product?.fish_cutting_options) &&
    product.fish_cutting_options.length === 1;
  const singleCuttingOption = hasSingleCuttingOption
    ? product.fish_cutting_options[0]
    : null;

  const cartItem = hasSingleCuttingOption
    ? cartList.find(
        (item) => item.cart_product_option_data?.id === singleCuttingOption?.id
      )
    : null;
  // useEffect(() => {
  //   console.log("🔹 stock_status of :",productName ,  stock);
  // }, [stock]);

  // 🛒 Add-to-cart handler
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPath = searchParams?.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;

  const handleAddToCartWithRedirect = async () => {
    if (!singleCuttingOption || showNotify) return;

    if (product?.stock < 1) {
      notifyError("Out of stock!");
      return;
    }

    await handleAddItem({
      product_id: productId,
      product_option_id: singleCuttingOption.id,
      quantity: 1,
      redirect: currentPath,
    });
  };

  const handleIncrease = () => {
    if (!cartItem) return;
    handleUpdateQuantity(cartItem.id, cartItem.quantity + 1);
  };

  const handleDecrease = () => {
    if (!cartItem) return;
    if (cartItem.quantity === 1) {
      handleUpdateQuantity(cartItem.id, 0);
    } else {
      handleUpdateQuantity(cartItem.id, cartItem.quantity - 1);
    }
  };

  // 🧩 Handle modal
  const handleModalOpen = (event) => {
    setModalOpen(event);
  };

  // 🧩 Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setModalOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
    

      <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-white border-gray-100 transition-all duration-150 hover:border-emerald-500">
        {/* 🔹 Discount Badge */}
        <div className="absolute top-2 left-2 z-10">
          {off_price < originalPrice && (
            <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded">
              {Math.round(((originalPrice - off_price) / originalPrice) * 100)}%
              OFF
            </span>
          )}
        </div>

        {/* 🔹 Product Image */}
   <div className="relative w-full h-[140px] sm:h-[140px] lg:h-[180px] overflow-hidden">
  <Link href={`/product?productId=${productId}`}>
    <ImageWithFallback
      src={productImage}
      alt={productName}
      fill
      className="object-cover object-center"
      priority={false}
    />
  </Link>

</div>


        {/* 🔹 Product Info */}
        <div className="flex flex-col flex-1 p-4 space-y-2">
          <h3 className="text-sm font-medium text-gray-800">
            {productName}
          </h3>
          <p className="text-xs text-gray-500">{weight}</p>

          {/* <Stock stock={stock} /> */}
          {/* <Rating rating={4.5} totalReviews={10} /> */}

          {!showNotify && (
            <Price
              card
              currency={currency}
              price={off_price}
              originalPrice={originalPrice}
            />
          )}
          {!showNotify && hasSingleCuttingOption && (
            <div className="flex justify-center">
              {cartItem ? (
                <div className="flex items-center gap-2 bg-emerald-600 text-white px-2 py-[2px] rounded-full text-sm w-fit">
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
                  className="bg-emerald-600 px-4 py-2 rounded-full text-sm font-semibold text-white hover:bg-emerald-700 w-fit"
                >
                  ADD
                </button>
              )}
            </div>
          )}
          {showNotify && (
            <button
              className={`mt-1 w-full rounded-lg border py-2 text-sm font-semibold ${
                isAppOnlyProduct
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-rose-500 bg-white text-rose-600"
              }`}
              disabled
            >
              {isAppOnlyProduct ? "APP ONLY PRODUCT" : "Out Of Stock"}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(ProductCard), { ssr: false });
