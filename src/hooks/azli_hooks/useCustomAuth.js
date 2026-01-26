// src/hooks/useAuth.js
import { useDispatch, useSelector } from "react-redux";
import {
  sendOtp,
  verifyOtp,
  logout,
  resetStep,
  registerUser,
  fetchProfile,
} from "@redux/slices/authSlice";
import { notifyError, notifySuccess } from "@utils/toast";
import Cookies from "js-cookie";
import { clearCart } from "@redux/slices/cartSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { loading, step, otpKey, phone, isLoggedIn, error, profile } =
    useSelector((state) => state.auth);

  const handleSendOtp = async (phone) => {
    const res = await dispatch(sendOtp(phone));
    if (sendOtp.rejected.match(res)) notifyError(res.payload);
    else notifySuccess("OTP sent successfully");
  };

  const handleFetchProfile = async () => {
    const res = await dispatch(fetchProfile());
    if (fetchProfile.rejected.match(res)) {
      return false;
    }
    return true;
  };

  const handleRegister = async (form) => {
    const res = await dispatch(registerUser(form));
    if (registerUser.rejected.match(res)) {
      notifyError(res.payload);
      return false;
    }
    notifySuccess("OTP sent to your mobile number");
    return true;
  };

  const handleVerifyOtp = async (otp) => {
    if (!otpKey) {
      notifyError("Missing OTP key. Please request a new OTP.");
      return false;
    }

    const res = await dispatch(verifyOtp({ otpKey, otp }));

    if (verifyOtp.fulfilled.match(res)) {
      dispatch(clearCart()); // 🔥 Clear guest cart after login
      await dispatch(fetchProfile());

      return true;
    }

    if (verifyOtp.rejected.match(res)) {
      notifyError(res.payload);
      return false;
    }

    notifySuccess("Login successful!");

    return true; // <-- important
  };

  return {
    loading,
    step,
    phone,
    otpKey,
    isLoggedIn,
    error,
    profile,
    handleSendOtp,
    handleFetchProfile,
    handleRegister,
    handleVerifyOtp,
    resetStep: () => dispatch(resetStep()),
    logout: () => dispatch(logout()),
  };
};
