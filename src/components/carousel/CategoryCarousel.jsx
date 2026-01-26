"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import useUtilsFunction from "@hooks/useUtilsFunction";

const CategoryCarousel = ({ categories }) => {
  const router = useRouter();
  const { showingTranslateValue } = useUtilsFunction();

  const handleCategoryClick = (id, category) => {
    const category_name = showingTranslateValue(category)
      ?.toLowerCase()
      .replace(/[^A-Z0-9]+/gi, "-");

    router.push(`/search?category=${id}`);
  };

  return (
    <div className="py-3 px-4">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
        Shop by Categories
      </h2>

      <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {categories?.map((category, index) => (
          <div
            key={index}
            onClick={() => handleCategoryClick(category?.id, category?.name)}
            className="flex flex-col items-center gap-2 cursor-pointer group"
          >
            {/* Circular Image */}
            <div className="w-16 h-16 sm:w-40 sm:h-40 bg-transparent rounded-full overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
              <Image
                src={
                  category?.img ||
                  "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                }
                width={160}
                height={160}
                alt={category?.name || "Category"}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Category Name */}
            <p className="text-[10px] sm:text-base font-medium text-center text-gray-900 group-hover:text-emerald-600 px-1 leading-tight">
              {category?.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(CategoryCarousel);
