"use client";

import Link from "next/link";
import { FiUser, FiShoppingBag, FiBell, FiCreditCard, FiRefreshCcw, FiMapPin, FiShare2, FiStar, FiHelpCircle, FiLogOut, FiShield, FiLock } from "react-icons/fi";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { IoChevronForward } from "react-icons/io5";
import { useAuth } from "@hooks/azli_hooks/useCustomAuth";
import { useEffect } from "react";

export default function Dashboard() {
    const { isLoggedIn } = useSelector((state) => state.auth);
      const dispatch = useDispatch();
      const router = useRouter();
  const { profile, handleFetchProfile } = useAuth();

useEffect(() => {
  if (isLoggedIn && (!profile || Object.keys(profile).length === 0)) {
    handleFetchProfile();
  }
}, [isLoggedIn, profile]);


      const handleLogout = () => {
        dispatch(logout());          // clear redux auth
        localStorage.removeItem("authToken"); // remove token
        document.cookie = "api_key=; Max-Age=0; path=/"; // remove cookie
        router.push("/auth/login");  // redirect to login
      };
  

  const iconStyle = "w-6 h-6 drop-shadow-xl text-emerald-600";

  const dashboardCards = [
    { title: "My Orders", icon: <FiShoppingBag />, gradient: "from-green-200 to-lime-200", link: "/my-orders" },
    { title: "Notifications", icon: <FiBell />, gradient: "from-sky-200 to-indigo-200", link: "#" },
    { title: "Wallet", icon: <FiCreditCard />, gradient: "from-yellow-200 to-orange-200", link: "#" },
    { title: "Refund", icon: <FiRefreshCcw />, gradient: "from-lime-200 to-green-200", link: "#" },
    { title: "Addresses", icon: <FiMapPin />, gradient: "from-rose-200 to-red-200", link: "/address" },
    { title: "Refer & Earn", icon: <FiShare2 />, gradient: "from-cyan-200 to-sky-200", link: "#" },
  ];


  const handleOpenLogin = () => {
    // Dispatch event for MobileFooter to open drawer
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("openAuthModal"));
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-white min-h-screen pb-20 pt-4 lg:pt-10">
        <div className="container mx-auto px-4 max-w-screen-md">
          {/* Guest Greeting */}
          <div className="flex flex-col items-center justify-center py-10 text-center">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <FiUser className="w-10 h-10 text-gray-400" />
             </div>
             <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Azli Fresh</h2>
             <p className="text-gray-500 mb-8 max-w-xs mx-auto">
               Login to view your orders, access your wallet, and manage your addresses.
             </p>
             
             <button
               onClick={handleOpenLogin}
               className="w-full max-w-sm bg-[#124b8a] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#0e3b6e] transition-all transform active:scale-95 text-lg"
             >
               Login or Sign Up
             </button>
          </div>

          {/* Info Links */}
          <div className="mt-6 border-t border-gray-100 pt-6">
             <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
               Information
             </h3>
             <div className="space-y-1">
                {[
                  { title: "About Us", icon: FiHelpCircle, link: "#" },
                  { title: "Help & Support", icon: FiHelpCircle, link: "#" },
                  { title: "Terms & Conditions", icon: FiShield, link: "#" }, // Typo in icon imports? Check imports
                  { title: "Privacy Policy", icon: FiLock, link: "#" },
                ].map((item, i) => (
                   <Link 
                     key={i} 
                     href={item.link}
                     className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 rounded-lg transition-colors group"
                   >
                     <div className="flex items-center gap-4">
                        <item.icon className="w-5 h-5 text-gray-400 group-hover:text-[#124b8a] transition-colors" />
                        <span className="text-gray-700 font-medium group-hover:text-gray-900">{item.title}</span>
                     </div>
                     <IoChevronForward className="w-5 h-5 text-gray-300" />
                   </Link>
                ))}
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20 lg:pt-10">
      <div className="container mx-auto px-4 max-w-screen-md">

        {/* USER CARD */}
        <div className="bg-white border rounded-2xl shadow-sm p-4 mb-6 flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex justify-center items-center">
              <FiUser className="text-emerald-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-[16px] font-semibold text-gray-800">{profile?.first_name + " " + profile?.last_name}</p>
              <p className="text-[13px] text-gray-500">{profile?.mobile}</p>
            </div>
          </div>

          <Link href="#">
             <IoChevronForward className="text-gray-500 w-5 h-5 hover:text-emerald-600" />
          </Link>
        </div>

        {/* DASHBOARD TITLE */}
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Account Dashboard</h2>

        {/* DASHBOARD CARDS (Mobile: 2 Col | Desktop: 3 Col) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {dashboardCards.map((item, idx) => (
            <Link
            href={item?.link}
              key={idx}
              className={`rounded-xl border shadow-sm p-4 bg-gradient-to-br ${item.gradient} 
                hover:shadow-lg transition-all duration-200 flex flex-col justify-between`}
            >
              <div className="mb-3">{item.icon}</div>
              <p className="text-[13px] font-semibold text-gray-800">
                {item.title}
              </p>
            </Link>
          ))}
        </div>

        {/* FEEDBACK SECTION */}
        <h2 className="text-lg font-semibold text-gray-800 mt-8 mb-3">
          Feedback & Informations
        </h2>

        <div className="space-y-3">
          <Link href="#" className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm">
            <div className="flex gap-3 items-center">
              <FiHelpCircle className="text-emerald-600 w-5 h-5" />
              <span className="text-[14px] font-medium text-gray-800">About My Azli Fresh</span>
            </div>
            <FiUser className="text-gray-500 w-4 h-4" />
          </Link>

          <Link href="#" className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm">
            <div className="flex gap-3 items-center">
              <FiStar className="text-yellow-500 w-5 h-5" />
              <span className="text-[14px] font-medium text-gray-800">Rate Us</span>
            </div>
          </Link>

          <Link href="#" className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm">
            <div className="flex gap-3 items-center">
              <FiHelpCircle className="text-indigo-600 w-5 h-5" />
              <span className="text-[14px] font-medium text-gray-800">Help & Support</span>
            </div>
          </Link>
        </div>

        {/* LOGOUT SECTION */}
        <div className="flex justify-center mt-10 mb-6">
            <button
              onClick={handleLogout}
              type="button"
              className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white 
                         font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
            >
              <FiLogOut className="w-5 h-5" />
              Logout
            </button>
        </div>

        <p className="text-center text-sm text-red-600 cursor-pointer mb-10">
          Delete My Account
        </p>
      </div>
    </div>
  );
}
