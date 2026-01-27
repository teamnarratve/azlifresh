"use client";

import Link from "next/link";
import { 
  FiUser, FiShoppingBag, FiBell, FiCreditCard, FiRefreshCcw, 
  FiMapPin, FiShare2, FiStar, FiHelpCircle, FiLogOut, FiShield, FiLock, FiChevronRight, FiEdit2
} from "react-icons/fi";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { IoChevronForward } from "react-icons/io5"; // Keep for Guest view compatibility or replace
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
    dispatch(logout());
    localStorage.removeItem("authToken");
    document.cookie = "api_key=; Max-Age=0; path=/";
    router.push("/auth/login");
  };

  const handleOpenLogin = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("openAuthModal"));
    }
  };

  // Guest View
  if (!isLoggedIn) {
    return (
      <div className="bg-white min-h-screen pb-20 pt-4 lg:pt-10">
        <div className="container mx-auto px-4 max-w-screen-md">
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

          <div className="mt-6 border-t border-gray-100 pt-6">
             <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
               Information
             </h3>
             <div className="space-y-1">
                {[
                  { title: "About Us", icon: FiHelpCircle, link: "#" },
                  { title: "Help & Support", icon: FiHelpCircle, link: "#" },
                  { title: "Terms & Conditions", icon: FiShield, link: "#" },
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

  // Define Sections
  const primaryActions = [
    { title: "My Orders", icon: FiShoppingBag, link: "/my-orders", subtitle: "Track, return, or buy again" },
    { title: "Addresses", icon: FiMapPin, link: "/address", subtitle: "Manage delivery locations" },
  ];

  const paymentActions = [
    { title: "Wallet", icon: FiCreditCard, link: "#" },
    { title: "Refunds", icon: FiRefreshCcw, link: "#" },
    { title: "Refer & Earn", icon: FiShare2, link: "#" },
  ];

  const supportActions = [
    { title: "Help & Support", icon: FiHelpCircle, link: "#" },
    { title: "Rate Us", icon: FiStar, link: "#" },
    { title: "About My Azli Fresh", icon: FiShield, link: "/user/about" },
  ];

  const ListItem = ({ item, isDanger = false, onClick }) => {
    const Component = onClick ? "button" : Link;
    const props = onClick ? { onClick, type: "button" } : { href: item.link };

    return (
      <Component 
        {...props}
        className={`w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors bg-white ${isDanger ? 'text-red-600' : 'text-gray-800'}`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDanger ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-[#124b8a]'}`}>
            <item.icon className="w-5 h-5" />
          </div>
          <div className="text-left">
             <span className={`block font-medium ${isDanger ? 'text-red-600' : 'text-gray-900'}`}>{item.title}</span>
             {item.subtitle && <span className="block text-xs text-gray-500 mt-0.5">{item.subtitle}</span>}
          </div>
        </div>
        {!isDanger && <FiChevronRight className="w-5 h-5 text-gray-300" />}
      </Component>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24 lg:pt-10">
      <div className="container mx-auto max-w-screen-md">
        
        {/* Profile Header */}
        <div className="bg-white p-6 mb-2 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#124b8a]/10 flex items-center justify-center text-[#124b8a]">
                    <FiUser className="w-8 h-8" />
                </div>
                <div>
                   <h1 className="text-xl font-bold text-gray-900">
                     {profile?.first_name ? `${profile?.first_name} ${profile?.last_name || ''}` : 'User'}
                   </h1>
                   <p className="text-sm text-gray-500 font-medium">{profile?.mobile}</p>
                </div>
            </div>
            <Link href="/user/update-profile" className="p-2 text-gray-400 hover:text-[#124b8a] transition-colors">
               <FiEdit2 className="w-5 h-5" />
            </Link>
        </div>

        {/* Primary Actions */}
        <div className="bg-white mb-2 divide-y divide-gray-50 border-y border-gray-100">
            {primaryActions.map((item, idx) => (
               <ListItem key={idx} item={item} />
            ))}
        </div>

        {/* Payments & Rewards */}
        <div className="bg-white mb-2 border-y border-gray-100">
             <div className="px-4 py-2 bg-gray-50/50 border-b border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payments & Rewards</h3>
             </div>
             <div className="divide-y divide-gray-50">
                {paymentActions.map((item, idx) => (
                   <ListItem key={idx} item={item} />
                ))}
             </div>
        </div>

        {/* Support & About */}
        <div className="bg-white mb-6 border-y border-gray-100">
             <div className="px-4 py-2 bg-gray-50/50 border-b border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Support & About</h3>
             </div>
             <div className="divide-y divide-gray-50">
                {supportActions.map((item, idx) => (
                   <ListItem key={idx} item={item} />
                ))}
             </div>
        </div>

        {/* Danger Zone */}
        <div className="px-4 space-y-4">
             <button 
                onClick={handleLogout}
                className="w-full bg-white border border-gray-200 text-gray-600 font-semibold py-3.5 rounded-xl shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
             >
                <FiLogOut className="w-5 h-5" />
                Logout
             </button>
             {/* Delete Account button moved to About page */}
        </div>

      </div>
    </div>
  );
}
