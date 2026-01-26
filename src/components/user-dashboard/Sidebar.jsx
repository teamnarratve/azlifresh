"use client";
import Link from "next/link";

//internal import
import {
  ChevronDown,
  ChevronUp,
  File,
  Grid,
  Home,
  List,
  LockOpen,
  Settings,
  Star,
  User,
} from "lucide-react";
import useUtilsFunction from "@hooks/useUtilsFunction";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useSetting } from "@context/SettingContext";
import { getUserSession } from "@lib/auth-client";
import { FiUser } from "react-icons/fi";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { storeCustomization } = useSetting();

  const userInfo = getUserSession();

  const dashboard = storeCustomization?.dashboard;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { showingTranslateValue } = useUtilsFunction();

  const handleLogOut = () => {
    signOut();
    Cookies.remove("couponInfo");
    router.push("/");
  };

  const userSidebar = [
    {
      title: showingTranslateValue(dashboard?.dashboard_title),
      href: "/user/dashboard",
      icon: Grid,
    },

    {
      title: showingTranslateValue(dashboard?.my_order),
      href: "/user/my-orders",
      icon: List,
    },
    {
      title: "My Review",
      href: "/user/my-reviews",
      icon: Star,
    },
    {
      title: "My Account",
      href: "/user/my-account",
      icon: User,
    },
    // {
    //   title: "Shipping Address",
    //   href: "/user/shipping-address",
    //   icon: Home,
    // },
    {
      title: showingTranslateValue(dashboard?.update_profile),
      href: "/user/update-profile",
      icon: Settings,
    },
    {
      title: showingTranslateValue(dashboard?.change_password),
      href: "/user/change-password",
      icon: File,
    },
  ];

  return (
<></>
  );
};

export default Sidebar;
