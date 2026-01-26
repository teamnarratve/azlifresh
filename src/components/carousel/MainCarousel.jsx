"use client";

import { useEffect, useState } from "react";
import useUtilsFunction from "@hooks/useUtilsFunction";
import CarouselCard from "@components/carousel/CarouselCard";
import { getStoreCustomizationSetting } from "@services/SettingServices";
import { showingTranslateValue } from "@lib/translate";
import { useBanner } from "@hooks/azli_hooks/useBanner";

const MainCarousel = () => {
  const { showingUrl, showingImage } = useUtilsFunction();
  const { bannerList, handleFetchBannerList } = useBanner();
  const [storeCustomizationSetting, setStoreCustomizationSetting] =
    useState(null);

  // ✅ Fetch banners when not loaded
  useEffect(() => {
    if (!bannerList?.length) {
      handleFetchBannerList();
    }
  }, [bannerList]);

  // ✅ Fetch customization settings
  useEffect(() => {
    const fetchCustomization = async () => {
      const { storeCustomizationSetting } =
        await getStoreCustomizationSetting();
      setStoreCustomizationSetting(storeCustomizationSetting);
    };
    fetchCustomization();
  }, []);

  const slider = storeCustomizationSetting?.slider;



  return (
    <>
      <CarouselCard sliderData={bannerList} />
    </>
  );
};

export default MainCarousel;
