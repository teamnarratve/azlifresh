//internal imports
import React from "react";
import "@styles/custom.css";
import Providers from "./provider";
import Footer from "@layout/footer/Footer";
import FooterTop from "@layout/footer/FooterTop";
import MobileFooter from "@layout/footer/MobileFooter";
import FeatureCard from "@components/feature-card/FeatureCard";
import {
  getStoreSetting,
  getGlobalSetting,
  getStoreCustomizationSetting,
} from "@services/SettingServices";

import HeaderManager from "@components/layout/HeaderManager";

import { SettingProvider } from "@context/SettingContext";

export const metadata = {
  title: "My Azli Fresh",
  description: "My Azli Fresh E-commerce Application",
};

export default async function RootLayout({ children }) {
  const { globalSetting } = await getGlobalSetting();
  const { storeSetting } = await getStoreSetting();

  // Fetch all customization data at once (adjust your API to return full data)
  const { storeCustomizationSetting, error } =
    await getStoreCustomizationSetting();

  return (
    <html lang="en" className="" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="bg-white antialiased dark:bg-zinc-900"
      >
        <div>
          <SettingProvider
            initialGlobalSetting={globalSetting}
            initialStoreSetting={storeSetting}
            initialCustomizationSetting={storeCustomizationSetting}
          >
            <Providers storeSetting={storeSetting}>
              
              <HeaderManager
                globalSetting={globalSetting}
                storeCustomization={storeCustomizationSetting}
              />
              
              {/* pt-14 on mobile to prevent content being hidden behind fixed header */}
              <main className="bg-gray-50 dark:bg-zinc-900 z-10 pt-14 lg:pt-0">
                {children}
              </main>

              {/* <div className="bg-gray-50 dark:bg-zinc-900 z-10">{children}</div> */}
              {/* <MobileFooter globalSetting={globalSetting} /> */}

              {/* app download componet */}
              <div className="w-full site-footer">
                <FooterTop error={error} />

                {/* icons and 4 sentences component */}
                <div className="hidden relative  lg:block mx-auto max-w-screen-2xl py-6 px-3 sm:px-10">
                  <FeatureCard
                    storeCustomizationSetting={storeCustomizationSetting}
                  />
                </div>
                <hr className="hr-line"></hr>
                <div className="border-t border-gray-100 w-full">
                  <Footer
                    error={error}
                    storeCustomizationSetting={storeCustomizationSetting}
                  />
                </div>
              </div>
            </Providers>
          </SettingProvider>
        </div>
      </body>
    </html>
  );
}
