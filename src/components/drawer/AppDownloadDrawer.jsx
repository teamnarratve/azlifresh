import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { FiSmartphone } from "react-icons/fi";

const AppDownloadDrawer = ({ open, setOpen }) => {
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-t-2xl bg-white text-left align-middle shadow-xl transition-all max-h-[70vh] flex flex-col">
                
                {/* Header with Close */}
                <div className="relative bg-white pt-4 px-4 pb-2 border-b border-gray-100 flex justify-between items-center z-10 shrink-0">
                  <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto absolute left-0 right-0 top-3"></div>
                   <h3 className="text-lg font-bold text-gray-800 mt-2">Get the App</h3>
                   <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors mt-2"
                  >
                    <IoClose className="text-xl text-gray-600" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    <div className="flex flex-col items-center text-center">
                         <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                            <FiSmartphone className="w-8 h-8 text-[#124b8a]" />
                         </div>

                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                           Exclusive App-Only Products
                        </h2>
                        <p className="text-gray-500 mb-8 text-sm leading-relaxed max-w-xs">
                          This product is available exclusively on the Azli Fresh App. Download now to order!
                        </p>

                         {/* Single Universal App Download CTA */}
                         <div className="w-full mb-2">
                              <a
                                href="https://api.aslifresh.com/redirect?place=lmc-758526"
                                target="_blank"
                                rel="noreferrer"
                                className="w-full bg-[#124b8a] text-white font-bold h-14 rounded-xl flex items-center justify-center shadow-lg active:scale-[0.98] transition-all text-base"
                              >
                                Download My Azli Fresh App
                              </a>
                         </div>
                         
                         <button 
                            onClick={() => setOpen(false)}
                            className="mt-6 text-sm text-gray-400 font-medium hover:text-gray-600"
                          >
                            Maybe Later
                         </button>

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

export default AppDownloadDrawer;
