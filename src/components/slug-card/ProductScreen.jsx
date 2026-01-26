"use client";

import Image from "next/image";
import Link from "next/link";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { ArrowDown, ArrowUp, ChevronRight, Minus, Plus } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
//internal import

import Price from "@components/common/Price";
import Stock from "@components/common/Stock";
import Tags from "@components/common/Tags";
import Card from "@components/slug-card/Card";
import Discount from "@components/common/Discount";
import ProductCard from "@components/product/ProductCard";
import VariantList from "@components/variants/VariantList";
import useUtilsFunction from "@hooks/useUtilsFunction";
import ImageCarousel from "@components/carousel/ImageCarousel";
import { useSetting } from "@context/SettingContext";
import useProductAction from "@hooks/useProductAction";
import Rating from "@components/common/Rating";
import { Button } from "@components/ui/button";
import ProductReviews from "./ProductReviews";
import { FiChevronRight, FiHeadphones, FiMinus, FiPlus } from "react-icons/fi";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import CarouselCard from "@components/carousel/CarouselCard";
import { getStoreCustomizationSetting } from "@services/SettingServices";
import { useProduct } from "@hooks/azli_hooks/useProduct";
import CuttingCard from "@components/product/CuttingCard";
import CheckoutCartScreen from "@components/checkout/CheckoutCartScreen";
import { useMobileHeader } from "@context/MobileHeaderContext"; // Import

const ProductScreen = ({ product, reviews, relatedProducts }) => {
  const { globalSetting, storeCustomization } = useSetting();
  const { showingTranslateValue } = useUtilsFunction();
  const { setMobileHeaderTitle } = useMobileHeader(); // Use hook

  // Update Header Title
  useEffect(() => {
    if (product?.name) {
      setMobileHeaderTitle(product.name);
    }
    return () => setMobileHeaderTitle(""); // Cleanup
  }, [product]);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const currency = globalSetting?.default_currency || "₹";
  const {
    setValue,
    price,
    stock,
    stockStatus,
     isWhole,
    isSmall,
    discount,
    isReadMore,
    setIsReadMore,
    selectedImage,
    originalPrice,
    setSelectedImage,
    selectVariant,
    setSelectVariant,
    setSelectVa,
    variantTitle,
    category_name,
    // actions
    handleAddToCart,
  } = useProductAction({
    product,

    globalSetting,
  });
  const ProductId = product?.id;
  const isAppOnlyProduct =
    Array.isArray(product?.fish_cutting_options) &&
    product.fish_cutting_options.length > 0 &&
    product.fish_cutting_options.every(
      (option) => option?.normal_visible === false
    );

  useEffect(() => {
    document.body.classList.add("hide-site-footer");
    return () => {
      document.body.classList.remove("hide-site-footer");
    };
  }, []);


   

  // console.log("discount", discount);

  return (
    <>
      {isCustomizationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl">
            <button
              type="button"
              onClick={() => setIsCustomizationOpen(false)}
              aria-label="Close"
              className="absolute right-3 top-3 rounded-full bg-gray-100 p-2 text-gray-700 hover:bg-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div
              id="downloadApp"
              className="bg-indigo-50 py-8 lg:py-10 bg-repeat bg-center overflow-hidden"
            >
              <div className="max-w-screen-2xl mx-auto px-4 sm:px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-2 md:gap-3 lg:gap-3 items-center">
                  <div className="flex-grow hidden lg:flex md:flex md:justify-items-center lg:justify-start">
                    <Image
                      src="/app-download-img-left.png"
                      alt="app download"
                      width={500}
                      height={394}
                      priority
                      className="block w-auto"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3">
                      Get Your Needs From Our MY AZLI FRESH Store
                    </h3>
                    <p className="text-base opacity-90 leading-7">
                      There are many products you will find in our App, Choose
                      your product from our MY AZLI FRESH APP
                      and get some special offers.
                    </p>
                    <div className="mt-8 flex mx-auto justify-center text-center">
                      <Link
                        href="https://apps.apple.com/ae/app/my-azli-fresh/id1668533922"
                        className="mx-2"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Image
                          width="0"
                          height="0"
                          sizes="100vw"
                          className="w-full h-auto"
                          src="/app/app-store.svg"
                          alt="app store"
                        />
                      </Link>
                      <Link
                        href="https://play.google.com/store/apps/details?id=com.repad.asli&hl=en_IN"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Image
                          width="0"
                          height="0"
                          sizes="100vw"
                          className="w-full h-auto"
                          src="/app/play-store.svg"
                          alt="play store"
                        />
                      </Link>
                    </div>
                  </div>
                  <div className="md:hidden lg:block">
                    <div className="flex-grow hidden lg:flex md:flex lg:justify-end">
                      <Image
                        src="/app-download-img.png"
                        width={500}
                        height={394}
                        priority
                        alt="app download"
                        className="block w-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white px-0">
        <div className="container mx-auto px-3 sm:px-10 max-w-screen-2xl">
       
          {/* Product */}
          <div className="relative lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-4 lg:gap-y-8">
            {/* Product image */}

            <div className="lg:col-span-3 lg:row-end-1">
              <div className="w-full mx-auto">
                
                <CarouselCard sliderData={product?.imgs} />
              </div>
            </div>

            {/* Product details */}
            <div className="lg:sticky top-44 mt-6 lg:mt-0 self-start z-10 mx-auto lg:col-span-4 lg:row-span-2 lg:row-end-2 lg:max-w-none">
              <div className="mb-2 md:mb-2.5 block -mt-1.5">
                <div className="relative">{/* <Stock stock={stock} /> */}</div>
                <h1 className="leading-7 text-lg md:text-xl lg:text-2xl mb-1 font-semibold  text-gray-800">
                  {product?.name}
                </h1>
           
              </div>
              <div className="flex items-center">
                <span className="block">Net Wt: {product?.weight}</span>
              </div>
              <div className="flex items-center mb-8">
                <Price
                  price={price}
                  product={product}
                  currency={currency}
                  originalPrice={originalPrice}
                />
                <span className="ml-2 block">
                  <Discount slug product={product} discount="5" />
                </span>
              </div>

              <div>
              
        

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-medium text-gray-900">
                    Cleaning & Cutting Option
                  </h3>
                  <div className="mt-4">
                   

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {product.fish_cutting_options
                        ?.slice(0, 10)
                        .map((product) => (
                          <CuttingCard
                            ProductId={ProductId}
                            key={product.id}
                            product={product}
                            currency={currency}
                            stock={stock}
                            stockStatus={stockStatus}
                            isAppOnlyProduct={isAppOnlyProduct}

                          />
                        ))}
                    </div>

                    {(isWhole || isSmall) && (
                      <div className="mt-6 w-full mb-6"    onClick={() => setIsCustomizationOpen(true)}>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-400 via-emerald-400 to-lime-300 shadow-md hover:shadow-lg transition-all duration-300">
                          {/* Left: Illustration (replace with your SVG or image) */}
                          <div className="flex items-center gap-3">
                            <div>
                              <h4 className="text-white font-semibold text-lg">
                                Customize Your Own!
                              </h4>
                              <p className="text-white/90 text-sm">
                                Download our app to customize to your
                                preference.
                              </p>
                            </div>
                          </div>

                          {/* Right: Add icon or button */}
                          <button
                            className="text-white bg-white/20 hover:bg-white/30 rounded-full p-2 transition"
                         
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
            
              
              </div>
            </div>
            <div className="mx-auto w-full lg:col-span-3 lg:my-0 my-8 lg:max-w-none">
              <TabGroup>
                <div className="border-b border-gray-200">
                  <TabList className="-mb-px flex space-x-8">
                   

                    <Tab className="cursor-pointer border-b-2 border-transparent pb-3 text-sm font-medium whitespace-nowrap text-gray-700 hover:border-gray-300 focus:outline-0 hover:text-gray-800 data-selected:border-emerald-600 data-selected:text-emerald-600">
                      About
                    </Tab>
                  </TabList>
                </div>
                <TabPanels as={Fragment}>
                 
                  <TabPanel className="pt-8">
                    <h3 className="sr-only">Product Description</h3>

                    {/* Product Description */}
                    {product?.description && (
                      <div
                        className="text-sm leading-6 text-gray-600 md:leading-6 mb-6 rich-text-content"
                        dangerouslySetInnerHTML={{
                          __html: product.description,
                        }}
                      />
                    )}

                    {/* Product Details */}
                    {product?.details?.map((detail, index) => (
                      <div key={index} className="mb-6">
                        <div
                          className="text-sm leading-6 text-gray-600 rich-text-content"
                          dangerouslySetInnerHTML={{ __html: detail.content }}
                        />
                      </div>
                    ))}
                  </TabPanel>
                </TabPanels>
              </TabGroup>
            </div>
          </div>
        
        </div>
      </div>
    </>
  );
};

export default ProductScreen;
