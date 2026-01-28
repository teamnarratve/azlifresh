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
import CustomizationBottomDrawer from "@components/drawer/CustomizationBottomDrawer"; // Import
import { FiInfo } from "react-icons/fi"; // Import

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
      <CustomizationBottomDrawer 
            open={isCustomizationOpen} 
            setOpen={setIsCustomizationOpen} 
       />

      <div className="bg-white px-0 pt-2 lg:pt-0">
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
                      <div className="mt-6 w-full mb-6" onClick={() => setIsCustomizationOpen(true)}>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 border border-blue-100 cursor-pointer active:scale-[0.98] transition-all">
                          {/* Left: Content */}
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                               <FiInfo className="text-[#124b8a] w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-[#124b8a] font-semibold text-sm">
                                Need Specific Cuts?
                              </h4>
                              <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                                Customize weight, cut style, and cleaning in our mobile app.
                              </p>
                            </div>
                          </div>

                          {/* Right: CTA */}
                          <button
                            className="bg-white text-[#124b8a] text-xs font-bold px-3 py-2 rounded-lg border border-blue-100 shadow-sm shrink-0 whitespace-nowrap"
                          >
                             App Only
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
