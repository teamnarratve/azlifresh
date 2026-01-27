"use client";

import { useEffect, useRef, useState } from "react";
import { IoAdd, IoRemove } from "react-icons/io5";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import ImageWithFallback from "@components/common/ImageWithFallBack";
import { notifyError } from "@utils/toast";
import { useSetting } from "@context/SettingContext";
import Discount from "@components/common/Discount";
import { handleLogEvent } from "src/lib/analytics";
import Price from "@components/common/Price";
import Stock from "@components/common/Stock";
import Rating from "@components/common/Rating";
import { useCart } from "@hooks/azli_hooks/useCart";
import VariantSelectionDrawer from "@components/drawer/VariantSelectionDrawer"; // Import Drawer
import AppDownloadDrawer from "@components/drawer/AppDownloadDrawer";

const ProductCard = ({ product, attributes, currency }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const modalRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [variantDrawerOpen, setVariantDrawerOpen] = useState(false); // New State
  const [appDrawerOpen, setAppDrawerOpen] = useState(false); // New State
  const { globalSetting } = useSetting();

  const { cartList, handleAddItem, handleUpdateQuantity, isLoggedIn, isInCart } = useCart();
  const defaultCurrency = globalSetting?.default_currency || "₹";
  const [pendingAddToCart, setPendingAddToCart] = useState(false);

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

  const hasOptions = Array.isArray(product?.fish_cutting_options) && product.fish_cutting_options.length > 0;
  // If ALL options are hidden (App Only), treat as Variable? Or treat as Out of Stock?
  // Existing logic for isAppOnlyProduct handles the "Notify/AppOnly" button.
  // But for CTA:
  // If isAppOnlyProduct is true, showNotify is NOT necessarily true (unless stock also 0).
  // Wait, `isAppOnlyProduct` logic was used to show "APP ONLY PRODUCT" button.
  // The User didn't specify changing App Only logic.
  
  // Refined isVariableProduct:
  const isVariableProduct = hasOptions && product.fish_cutting_options.length > 1;
  
  // Simple product: Valid product with 0 or 1 option (treat 0 as flat product)
  const productOptionId = hasOptions ? product.fish_cutting_options[0].id : productId; // Fallback to productId

  const cartItem = cartList.find((item) => {
     if (isVariableProduct) return false; 
     return item.cart_product_option_data?.id === productOptionId;
  });

  // 🛒 Add-to-cart handler
  const currentPath = searchParams?.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;

  const handleAddToCartWithRedirect = async () => {
    if (showNotify) return;

    if (product?.stock < 1) {
      notifyError("Out of stock!");
      return;
    }

    // Mobile Inline Login Logic
    if (!isLoggedIn && typeof window !== "undefined" && window.innerWidth < 1024) {
      setPendingAddToCart(true);
      window.dispatchEvent(new Event("openAuthModal"));
      return;
    }

    await handleAddItem({
      product_id: productId,
      product_option_id: productOptionId, // Use the determined ID
      quantity: 1,
      redirect: currentPath,
    });
  };

  // Effect to retry add to cart after login
  useEffect(() => {
    if (isLoggedIn && pendingAddToCart) {
       handleAddToCartWithRedirect();
       setPendingAddToCart(false);
    }
  }, [isLoggedIn]);

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

          {/* App Only Handling */}
          {!showNotify && isAppOnlyProduct && (
               <div className="flex flex-col items-center gap-1 w-full">
                 <button
                  onClick={() => setAppDrawerOpen(true)}
                  className="bg-white border border-[#124b8a] text-[#124b8a] px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-50 w-full"
                >
                  Get app
                </button>
                 <span className="text-[10px] text-[#124b8a] font-medium bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                    App only
                 </span>
            </div>
          )}

          {!showNotify && !isVariableProduct && !isAppOnlyProduct && (
            <div className="flex justify-center w-full">
              {/* Home Page: View Details (No Add to Cart) */}
              {pathname === "/" ? (
                <Link
                  href={`/product?productId=${productId}`}
                  className="bg-emerald-600 px-4 py-2 rounded-full text-sm font-semibold text-white hover:bg-emerald-700 w-full text-center"
                >
                  View details
                </Link>
              ) : (
                /* Other Pages: Add to Cart / Counter */
                <>
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
                    </button> // 299: Fixed line formatting
                  )}
                </>
              )}
            </div>
          )}

          {/* 🔹 Multiple Options CTA */}
          {!showNotify && isVariableProduct && !isAppOnlyProduct && (
            <div className="flex flex-col items-center gap-1 w-full">
                 <button
                  onClick={() => setVariantDrawerOpen(true)}
                  className="bg-emerald-600 px-4 py-2 rounded-full text-sm font-semibold text-white hover:bg-emerald-700 w-full"
                >
                  Choose Options
                </button>
                 <span className="text-[10px] text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                    Multiple options available
                 </span>
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
      
      {/* Variant Selection Drawer */}
      <VariantSelectionDrawer 
        open={variantDrawerOpen} 
        setOpen={setVariantDrawerOpen} 
        variants={product?.fish_cutting_options || []}
        product={product}
        currency={currency}
      />
      <AppDownloadDrawer 
        open={appDrawerOpen} 
        setOpen={setAppDrawerOpen} 
      />
    </>
  );
};

export default dynamic(() => Promise.resolve(ProductCard), { ssr: false });
