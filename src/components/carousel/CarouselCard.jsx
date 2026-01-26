"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const CarouselCard = ({ storeCustomizationSetting, sliderData }) => {
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      loop={true}
      pagination={
        (storeCustomizationSetting?.slider?.bottom_dots ||
          storeCustomizationSetting?.slider?.both_slider) && {
          clickable: true,
        }
      }
      navigation={
        (storeCustomizationSetting?.slider?.left_right_arrow ||
          storeCustomizationSetting?.slider?.both_slider) && {
          clickable: true,
        }
      }
      modules={[Autoplay, Pagination, Navigation]}
      className="mySwiper"
    >
      {sliderData?.map((item, i) => (
        <SwiperSlide
          className="h-full relative rounded-lg overflow-hidden dark:bg-zinc-900"
          key={i + 1}
        >
          <div className="text-sm text-gray-600 hover:text-emerald-dark dark:bg-zinc-900">
            <Image
              width={1920}
              height={400}
              src={item.img}
              alt="image"
              className="object-cover w-full h-[200px] sm:h-[300px] lg:h-[400px]"
              loading="lazy"
            />
          </div>
      
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CarouselCard;
