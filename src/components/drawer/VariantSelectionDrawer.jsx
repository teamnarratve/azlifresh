"use client";

import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import CuttingCard from "@components/product/CuttingCard";

const VariantSelectionDrawer = ({ open, setOpen, product }) => {
  const { name, fish_cutting_options } = product || {};
  
  // Filter visible options
  const variants = fish_cutting_options?.filter(option => option?.normal_visible !== false) || [];

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setOpen(false)}
      >
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center text-center">
            
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom="translate-y-full"
              enterTo="translate-y-0"
              leave="transform transition ease-in-out duration-300"
              leaveFrom="translate-y-0"
              leaveTo="translate-y-full"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-t-2xl bg-white text-left align-middle shadow-xl transition-all max-h-[85vh] flex flex-col">
                
                {/* Header with Close */}
                <div className="relative bg-white pt-4 px-4 pb-2 border-b border-gray-100 flex justify-between items-center z-10 shrink-0">
                  <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto absolute left-0 right-0 top-3"></div>
                   <div className="mt-2 pr-8">
                      <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{name}</h3>
                      <p className="text-xs text-gray-500">Select an option to add to cart</p>
                   </div>
                   <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors mt-2"
                  >
                    <IoClose className="text-xl text-gray-600" />
                  </button>
                </div>

                {/* Content - Variant List */}
                <div className="p-4 overflow-y-auto bg-gray-50 flex-1">
                    <div className="flex flex-col gap-3 pb-8">
                        {variants.length > 0 ? (
                            variants.map((option, idx) => (
                                <CuttingCard 
                                    key={option.id || idx}
                                    product={option}
                                    ProductId={product.id}
                                    stock={product.stock}
                                    stockStatus={product.stock_status}
                                />
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500 text-sm">
                                No options available.
                            </div>
                        )}
                    </div>
                </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default VariantSelectionDrawer;
