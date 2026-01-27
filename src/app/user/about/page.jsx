"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FiChevronDown, FiChevronUp, FiTrash2, FiAlertTriangle, FiArrowLeft } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { logout } from "@redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { Dialog } from "@headlessui/react";
import Link from "next/link";
import { useMobileHeader } from "@context/MobileHeaderContext";

const AboutPage = () => {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { setMobileHeaderTitle } = useMobileHeader();

  React.useEffect(() => {
    setMobileHeaderTitle("About My Azli Fresh");
  }, [setMobileHeaderTitle]);

  // Handle Account Deletion
  const handleDeleteAccount = () => {
    // In a real app, this would be an API call
    console.log("Deleting account...");

    // Simulate cleanup
    dispatch(logout());
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    document.cookie = "api_key=; Max-Age=0; path=/";

    // Close modal and redirect
    setIsDeleteModalOpen(false);
    router.push("/");
  };

  return (
    <div className="bg-white min-h-screen pb-20 pt-4 lg:pt-10">
      <div className="container mx-auto px-4 max-w-screen-md">
        
        {/* Header - Handled by MobileHeader on Mobile, but we need title on Desktop? 
            MobileHeaderContext sets title for Mobile Header.
            For Desktop, we might want a Title.
        */}
        <h1 className="hidden lg:block text-2xl font-bold text-gray-900 mb-6">About My Azli Fresh</h1>

        {/* Brand Content */}
        <div className="space-y-6 text-gray-600 leading-relaxed">
           <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-sm">
             {/* Using a placeholder or existing banner */}
             <div className="bg-[#124b8a] w-full h-full flex items-center justify-center">
                <h2 className="text-white text-3xl font-bold opacity-20">Azli Fresh</h2>
             </div>
             {/* <Image src="/about-banner.jpg" fill className="object-cover" alt="About Azli" /> */}
           </div>

           <p>
             Welcome to Azli Fresh! We are dedicated to providing you with the freshest seafood and meats, delivered directly to your doorstep with the utmost care and quality.
           </p>
           <p>
             Our mission is to bring the taste of the ocean to your home, ensuring sustainability and freshness in every order.
           </p>
        </div>

        {/* Privacy & Account Section (At Bottom) */}
        <div className="mt-12 border-t border-gray-100 pt-8 mb-10">
           <div className="bg-red-50/50 rounded-xl border border-red-100 p-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowPrivacy(!showPrivacy)}
              >
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                        <FiAlertTriangle className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-gray-700">Privacy & Account</span>
                 </div>
                 {showPrivacy ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
              </div>

              {showPrivacy && (
                 <div className="mt-4 pt-4 border-t border-red-100/50">
                    <p className="text-sm text-gray-500 mb-4">
                       Managing your data is important. If you wish to permanently delete your account and remove all your data from our servers, you can do so here. This action is irreversible.
                    </p>
                    <button 
                       onClick={() => setIsDeleteModalOpen(true)}
                       className="w-full py-3 bg-white border border-red-200 text-red-600 rounded-lg font-medium shadow-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                    >
                       <FiTrash2 className="w-4 h-4" />
                       Delete my account
                    </button>
                 </div>
              )}
           </div>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      <Dialog 
        open={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        className="relative z-50"
      >
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/30 w-screen overflow-y-auto p-4 flex items-center justify-center">
            
            <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
              <Dialog.Title className="text-lg font-bold text-gray-900 flex items-center gap-2">
                 <FiAlertTriangle className="text-red-500" />
                 Delete Account?
              </Dialog.Title>
              <Dialog.Description className="mt-3 text-gray-500 text-sm leading-relaxed">
                 Are you sure you want to delete your account? You will lose your order history, saved addresses, and wallet balance. 
                 <br/><br/>
                 <span className="font-bold text-gray-700">This action cannot be undone.</span>
              </Dialog.Description>

              <div className="mt-6 flex gap-3">
                 <button
                   onClick={() => setIsDeleteModalOpen(false)}
                   className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                 >
                   Cancel
                 </button>
                 <button
                   onClick={handleDeleteAccount}
                   className="flex-1 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-sm shadow-red-200"
                 >
                   Yes, Delete
                 </button>
              </div>
            </Dialog.Panel>
        </div>
      </Dialog>

    </div>
  );
};

export default AboutPage;
