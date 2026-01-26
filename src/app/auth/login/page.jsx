"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiPhone, FiLock } from "react-icons/fi";
import { useRouter } from "next/navigation";

// Internal imports
import InputArea from "@components/form/InputArea";
import Error from "@components/form/Error";
import { Button } from "@components/ui/button";
import BottomNavigation from "@components/login/BottomNavigation";
import { useAuth } from "@hooks/azli_hooks/useCustomAuth";

export default function Login() {
  const router = useRouter();
  const resendWaitSeconds = 30;
  const [resendSecondsLeft, setResendSecondsLeft] = useState(0);
  const {
    handleSendOtp,
    handleVerifyOtp,
    step,
    loading,
    isLoggedIn,
    otpKey,
    phone,
  } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // ✅ Redirect user after successful login
  useEffect(() => {
    if (isLoggedIn) {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect");

      if (redirect) {
        router.replace(redirect);
      } else {
        router.replace("/"); // fallback
      }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (step === "otp") {
      setResendSecondsLeft(resendWaitSeconds);
      return;
    }
    setResendSecondsLeft(0);
  }, [step, resendWaitSeconds]);

  useEffect(() => {
    if (step !== "otp" || resendSecondsLeft <= 0) return;
    const timer = setTimeout(() => {
      setResendSecondsLeft((seconds) => Math.max(seconds - 1, 0));
    }, 1000);
    return () => clearTimeout(timer);
  }, [step, resendSecondsLeft]);

  // ✅ Handle form submit
  const onSubmit = async (data) => {
    if (step === "phone") {
      await handleSendOtp(data.phone);
    } else {
         // ⚡ Show loader immediately
      const ok = await handleVerifyOtp(data.otp);
      if (ok) {
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("redirect");

        router.replace(redirect || "/");
      }
    }
  };

  const canResendOtp =
    step === "otp" && resendSecondsLeft === 0 && !loading && !!phone;

  const handleResendOtp = async () => {
    if (!canResendOtp) return;
    setResendSecondsLeft(resendWaitSeconds);
    await handleSendOtp(phone);
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white dark:bg-zinc-800 shadow-md rounded-lg mt-12 mb-12">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
        {step === "phone" ? "Login" : "Verify OTP"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Step 1: Phone Input */}
        {step === "phone" && (
          <div>
            <InputArea
              register={register}
              name="phone"
              label="Phone Number"
              type="text"
              placeholder="Enter phone number"
              Icon={FiPhone}
            />
            <Error errorMessage={errors.phone?.message} />
          </div>
        )}

        {/* Step 2: OTP Input */}
        {step === "otp" && (
          <div>
            <InputArea
              register={register}
              name="otp"
              label="OTP"
              type="text"
              placeholder="Enter OTP"
              Icon={FiLock}
            />
            <Error errorMessage={errors.otp?.message} />

            {/* Optional: show OTP key for debugging */}
            {/* {otpKey && (
              <p className="text-xs text-gray-500 mt-2 break-all">
                OTP Key (debug): <span className="font-mono">{otpKey}</span>
              </p>
            )} */}
          </div>
        )}

        {/* Submit Button */}
        <Button
          disabled={loading}
          isLoading={loading}
          type="submit"
          className="w-full mt-3"
        >
          {loading
            ? "Processing..."
            : step === "phone"
            ? "Send OTP"
            : "Verify OTP"}
        </Button>
      </form>

      {/* Info for user */}
      <div className="text-center text-sm text-gray-500 mt-4">
        {step === "otp"
          ? `OTP sent to ${phone || "your phone number"}.`
          : "Enter your phone number to receive an OTP."}
      </div>

      {step === "otp" && (
        <div className="text-center text-sm text-gray-500 mt-2">
          Didn't receive the OTP?{" "}
          {canResendOtp ? (
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Resend
            </button>
          ) : (
            <span className="text-gray-400">
              Resend in {resendSecondsLeft}s
            </span>
          )}
        </div>
      )}

      <BottomNavigation
        or={true}
        route={"/auth/signup"}
        pageName={"Sign Up"}
        loginTitle="Login"
      />
    </div>
  );
}
