"use client";

import { useContext } from "react";
import Link from "next/link";
import Image from "next/image"; // Added Image import

//internal import
import { SidebarContext } from "@context/SidebarContext";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { useSetting } from "@context/SettingContext";

const NavbarPromo = ({ languages, categories, categoryError }) => {
  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const { storeCustomization } = useSetting();

  const { showingTranslateValue } = useUtilsFunction();
  // const navbar = storeCustomization?.navbar; // Unused variable

  return (
    <>
      <div className="hidden lg:block xl:block bg-white border-b">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-10 h-14 flex justify-between items-center">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide w-full">
             {categories?.map((category) => (
                <Link
                  key={category.id}
                  href={`/search?category=${category.id}`}
                  onClick={() => setIsLoading(!isLoading)}
                  className="flex items-center gap-2 text-sm font-medium hover:text-emerald-600 whitespace-nowrap text-black group hover:shadow-sm px-2 py-1 rounded-md transition-all"
                >
                  {category.img ? (
                    <Image
                      src={category.img}
                      width={24}
                      height={24}
                      alt={category.name}
                      className="object-contain"
                    />
                  ) : (
                    // Fallback icon if no image
                     <Image
                      src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                      width={24}
                      height={24}
                      alt="category"
                    />
                  )}
                  <span className="group-hover:text-emerald-600 transition-colors">
                    {typeof category.name === "string"
                      ? category.name
                      : showingTranslateValue(category.name)}
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarPromo;
