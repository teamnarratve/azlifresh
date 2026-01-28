"use client";

import { Suspense, useEffect, useState } from "react";

// internal imports
import Banner from "@components/banner/Banner";
import CardTwo from "@components/cta-card/CardTwo";
import OfferCard from "@components/offer/OfferCard";
import StickyCart from "@components/cart/StickyCart";
import ProductCard from "@components/product/ProductCard";
import MainCarousel from "@components/carousel/MainCarousel";
import CMSkeletonTwo from "@components/preloader/CMSkeleton";
import FeatureCategory from "@components/category/FeatureCategory";
import {
  getShowingStoreProducts,
  getShowingAttributes,
  getGlobalSetting,
  getStoreCustomizationSetting,
} from "@services/SettingServices";
import DiscountedCard from "@components/product/DiscountedCard";
import CategoryCarousel from "@components/carousel/CategoryCarousel";
import { useCategory } from "@hooks/azli_hooks/usecategory";
import { useProduct } from "@hooks/azli_hooks/useProduct";
import { useCart } from "@hooks/azli_hooks/useCart";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";
import Lottie from "lottie-react";
import fryingPanAnimation from "../data/frying-pan.json";

const isOutOfStock = (item) => {
  const stock = item?.stock ?? 0;
  const stockStatus = item?.stock_status;
  return stock === 0 || stockStatus === false;
};
const isAppOnlyProduct = (item) =>
  Array.isArray(item?.fish_cutting_options) &&
  item.fish_cutting_options.length > 0 &&
  item.fish_cutting_options.every((option) => option?.normal_visible === false);
const isAppOnlyForSort = (item) => isAppOnlyProduct(item) && isOutOfStock(item);
const sortOutOfStockLast = (items) => {
  if (!Array.isArray(items)) return [];
  return [...items].sort((a, b) => {
    const aRank = isAppOnlyForSort(a) ? 1 : isOutOfStock(a) ? 2 : 0;
    const bRank = isAppOnlyForSort(b) ? 1 : isOutOfStock(b) ? 2 : 0;
    return aRank - bRank;
  });
};

const Home = () => {
  const [currency, setCurrency] = useState("₹");

  const { totalAmount, count, handleFetchCartList, isLoggedIn, cartList } =
    useCart();

  // 🔥 LOAD CART ONLY AFTER LOGIN
  useEffect(() => {
    if (isLoggedIn && cartList.length === 0) {
      handleFetchCartList();
    }
  }, [isLoggedIn]); // 👈 clean dependency

  const { categories, error, loading, handleFetchCategories } = useCategory();

  useEffect(() => {
    if (!categories || categories.length === 0) {
      handleFetchCategories();
    }
  }, []);
  const {
    readyToEatProductData,
    offerProducts,
    handleFetchOfferProducts,
    readyToEat,
    handleFetchReadyToEat,
    readyToEatImg,
  } = useProduct();

  // ✅ Fetch offer products on first render
  useEffect(() => {
    handleFetchOfferProducts();
    handleFetchReadyToEat();
  }, []); // Empty dependency ensures it runs only once

  // (Optional) log once data is available
  useEffect(() => {
    if (offerProducts?.length) {
      console.log("🔹 Offer Products:", offerProducts);
      console.log("🔹 readyToEat Products:", readyToEat);
      console.log("🔹 readyToEatImg image url:", readyToEatImg);
    }
  }, [offerProducts, readyToEat]);

  useEffect(() => {
    if (readyToEat?.length) {
      // console.log("🔹 Ready to eat Products:", readyToEat);
      console.log("🔹 readyToEatProductData:", readyToEatProductData);
    }
  }, [readyToEat]);

  return (
    <div className="min-h-screen dark:bg-zinc-900">
      {/* sticky cart section */}
      <StickyCart currency={currency} count={count} totalAmount={totalAmount} />

      {/* carousel full width */}
      <div className="bg-white dark:bg-zinc-900 mt-4">
        <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
          <div className="rounded-xl overflow-hidden">
            <Suspense fallback={<p>Loading carousel...</p>}>
              <MainCarousel />
            </Suspense>
          </div>

          {/* Sub-Banner Placeholder (Mobile Only) */}
          <div className="w-full h-auto mt-4 rounded-xl overflow-hidden block sm:hidden">
            <video
              src="/banner/BANNER 2.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>


      {/* Category Carousel */}

      <div className="bg-white dark:bg-zinc-800 lg:py-16 py-10">
        <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
          {/* <div className="mb-10 flex justify-center">
            <div className="text-center w-full lg:w-2/5">
              <h2 className="text-xl lg:text-2xl mb-2 font-semibold">
                <CMSkeletonTwo
                  count={1}
                  height={30}
                  loading={false}
                  data="Featured Categories"
                />
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400 leading-6">
                <CMSkeletonTwo
                  count={4}
                  height={10}
                  loading={false}
                  data="Choose your necessary products from our categories."
                />
              </p>
            </div>
          </div> */}
          {/* category  */}
          <Suspense fallback={<p>Loading feature category...</p>}>
            <CategoryCarousel categories={categories} />
          </Suspense>
        </div>
      </div>
      {/* <div className="relative">
        <CategoryCarousel />
      </div> */}

      {/* Popular Products */}
      <div className="bg-gray-50 dark:bg-zinc-900 lg:py-16 py-10 mx-auto max-w-screen-2xl px-3 sm:px-10">
        <div className="mb-4 lg:mb-10 flex justify-start lg:justify-center">
          <div className="text-left lg:text-center w-full lg:w-2/5">
            <h2 className="text-[20px] lg:text-2xl mb-2 font-bold text-gray-900">
              <CMSkeletonTwo
                count={1}
                height={30}
                loading={false}
                error={error}
                data="Hot Deals You Can’t Miss"
              />
            </h2>
            <p className="hidden lg:block text-base font-sans text-gray-600 dark:text-gray-400 leading-6">
              <CMSkeletonTwo
                count={5}
                height={10}
                loading={false}
                error={error}
                data="Save more while you shop for the freshest fish, prawns, and daily catch — all delivered straight from the shore to your doorstep."
              />
            </p>
          </div>
        </div>

        <div className="flex">
          <div className="w-full">
            {error ? (
              <CMSkeletonTwo
                count={20}
                height={20}
                error={error}
                loading={false}
              />
            ) : (
              // <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3">
              //   {offerProducts?.slice(0, 10).map((product) => (
              //     <DiscountedCard
              //       key={product.id}
              //       product={product}
              //       currency={currency}
              //     />
              //   ))}
              // </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3">
                {sortOutOfStockLast(offerProducts)
                  ?.slice(0, 20)
                  .map((product, i) => (
                    <ProductCard
                      key={i + 1}
                      product={product}
                      currency={currency}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Promotional Banner */}
      {/* Card with Download Now Button */}
      {/* 
      <div className="block mx-auto max-w-screen-2xl">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-10">
          <div className="lg:p-16 p-6 bg-emerald-500 shadow-sm border text-black rounded-lg">
            <CardTwo />
          </div>
        </div>
      </div> */}

      {/* Discounted Products */}

      <div
        id="discount"
        className="bg-[#FFF5F2] dark:bg-zinc-800 lg:py-16 py-8 mx-auto max-w-screen-2xl px-3 sm:px-10"
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12">
               <Lottie animationData={fryingPanAnimation} loop={true} />
             </div>
             <div>
                <h2 className="text-xl lg:text-2xl font-bold text-green-700">Ready in Minutes!</h2>
                <p className="text-sm lg:text-base text-gray-500 font-medium">Simplify Your Meals</p>
             </div>
          </div>
          <Link href="/ready-to-cook">
             <button className="border border-green-600 text-green-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
               See All
             </button>
          </Link>
        </div>

        <Swiper
          modules={[Navigation]}
          spaceBetween={12}
          slidesPerView="auto"
          pagination={{ clickable: true }}
          className="product-swiper"
        >
          {/* Banner Card */}
          <SwiperSlide className="pb-2 !w-auto !h-auto flex-shrink-0">
            <div className="group relative h-full rounded-xl overflow-hidden cursor-pointer">
                  <img
                    src="/rtc.png"
                    alt="Ready To Cook Banner"
                    className="h-[260px] sm:h-[280px] lg:h-[320px] w-auto object-cover rounded-xl hover:scale-105 transition-transform duration-500"
                  />
            </div>
          </SwiperSlide>

          {/* 🔹 All Product Cards */}
          {sortOutOfStockLast(readyToEatProductData)
            ?.slice(0, 10)
            .map((product) => (
              <SwiperSlide key={product.id} className="pb-2 !w-[170px] sm:!w-[200px] lg:!w-[240px] flex-shrink-0">
                <ProductCard product={product} currency={currency} />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Home;
