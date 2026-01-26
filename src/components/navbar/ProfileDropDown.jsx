"use client";

import { Fragment, useEffect } from "react";
import Link from "next/link";
import { Transition, Menu, MenuButton } from "@headlessui/react";
import { FiUser } from "react-icons/fi";
import Image from "next/image";

//internal imports
import { getUserSession } from "@lib/auth-client";
import { useSelector } from "react-redux";
import { useAuth } from "@hooks/azli_hooks/useCustomAuth";

const ProfileDropDown = () => {




  return (
    <>
 

              <Link
            href="/user/dashboard"
         
            className="-m-1.5 flex items-center p-1.5"
          >

            <FiUser className="h-6 w-6 text-gray-900" aria-hidden="true" />
          </Link>
        
     

 
    </>
  );
};

export default ProfileDropDown;
