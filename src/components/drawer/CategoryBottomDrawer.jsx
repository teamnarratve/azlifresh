"use client";

import { Fragment } from "react";
import { Dialog, Transition, TransitionChild, DialogPanel } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useUtilsFunction from "@hooks/useUtilsFunction";

const CategoryBottomDrawer = ({ open, setOpen, categories }) => {
  const router = useRouter();
  const { showingTranslateValue } = useUtilsFunction();

  const handleCategoryClick = (id, categoryName) => {
    const category_name = showingTranslateValue(categoryName)
      ?.toLowerCase()
      .replace(/[^A-Z0-9]+/gi, "-");
    
    router.push(`/search?category=${id}`);
    setOpen(false);
  };

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50 lg:hidden" onClose={setOpen}>
        <TransitionChild
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </TransitionChild>

        <div className="fixed inset-x-0 bottom-0 z-50 flex min-h-full items-end justify-center text-center">
          <TransitionChild
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <DialogPanel className="relative w-full max-w-md transform overflow-hidden rounded-t-2xl bg-white p-6 pb-20 shadow-xl transition-all h-auto max-h-[85vh] flex flex-col">
              
              {/* Drag Handle Indicator */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-300 rounded-full" />

              <div className="mt-4 text-left mb-4">
                 <h3 className="text-lg font-bold text-gray-900">Categories</h3>
              </div>
              
              <div className="overflow-y-auto scrollbar-hide flex-1">
                 {/* Reusing Category Carousel Grid Layout */}
                 <div className="grid grid-cols-4 gap-x-4 gap-y-6">
                    {categories?.map((category, index) => (
                      <div
                        key={index}
                        onClick={() => handleCategoryClick(category?.id, category?.name)}
                        className="flex flex-col items-center gap-2 cursor-pointer group"
                      >
                        {/* Circular Image */}
                        <div className="w-16 h-16 bg-gray-50 rounded-full overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 border border-gray-100">
                          <Image
                            src={
                              category?.img ||
                              "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                            }
                            width={64}
                            height={64}
                            alt={category?.name || "Category"}
                            className="object-cover w-full h-full"
                          />
                        </div>

                        {/* Category Name */}
                        <p className="text-[11px] font-medium text-center text-gray-900 group-hover:text-emerald-600 leading-tight line-clamp-2">
                          {category?.name}
                        </p>
                      </div>
                    ))}
                 </div>
              </div>

            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CategoryBottomDrawer;
