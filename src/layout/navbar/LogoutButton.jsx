"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { FiUnlock, FiUser } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@redux/slices/authSlice";
import { useRouter } from "next/navigation";

const LogoutButton = ({ storeCustomization }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { isLoggedIn } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());          // clear redux auth
    localStorage.removeItem("authToken"); // remove token
    document.cookie = "api_key=; Max-Age=0; path=/"; // remove cookie
    router.push("/user/dashboard");  // redirect to login
  };

  return (
    <>
      {/* My Account Button */}
      {/* <Link
        href={isLoggedIn ? "/user/my-account" : "/auth/login"}
                          onClick={(e) => e.preventDefault()}

        className="font-medium hover:text-emerald-600"
      >
        My Account
      </Link> */}

      <span className="mx-2">|</span>

      {/* Login / Logout Button */}
      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          type="button"
          className="flex items-center font-medium hover:text-emerald-600"
        >
          <span className="mr-1">
            <FiUnlock />
          </span>
          Logout
        </button>
      ) : (
        <Link
          href="/auth/login"
          className="flex items-center font-medium hover:text-emerald-600"
        >
          <span className="mr-1">
            <FiUser />
          </span>
          Login
        </Link>
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(LogoutButton), { ssr: false });
