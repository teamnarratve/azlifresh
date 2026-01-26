"use client";

import { Fragment, useState, useRef, useEffect } from "react";
import { Dialog, Transition, TransitionChild, DialogPanel } from "@headlessui/react";
import { X, ArrowLeft } from "lucide-react";
import { useAuth } from "@hooks/azli_hooks/useCustomAuth";
import { useForm } from "react-hook-form";
import { FiPhone } from "react-icons/fi";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { useRouter } from "next/navigation";

// Internal Components
import InputArea from "@components/form/InputArea";
import Error from "@components/form/Error";
import { Button } from "@components/ui/button";

const LoginBottomDrawer = ({ open, setOpen }) => {
  const router = useRouter();
  const {
    handleSendOtp,
    handleVerifyOtp,
    step,
    loading,
    isLoggedIn,
    phone,
    resetStep,
  } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // OTP State
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  // Resend Timer
  const resendWaitSeconds = 30;
  const [resendSecondsLeft, setResendSecondsLeft] = useState(0);

  // Reset drawer state when closed
  useEffect(() => {
    if (!open) {
      // Optional: resetStep(); // Decide if we want to reset step on close or keep state
    }
  }, [open]);

  // Handle Resend Timer
  useEffect(() => {
    if (step === "otp") {
      setResendSecondsLeft(resendWaitSeconds);
    } else {
        setResendSecondsLeft(0);
        setOtp(["", "", "", ""]); // Clear OTP on step change
    }
  }, [step]);

  useEffect(() => {
    if (step !== "otp" || resendSecondsLeft <= 0) return;
    const timer = setTimeout(() => {
      setResendSecondsLeft((s) => s - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [step, resendSecondsLeft]);


  // OTP Input Logic
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // Allow only last entered digit if multiple (paste scenario handled differently ideally, but simple for now)
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto Verify
    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === 4) {
       verifyOtpAction(combinedOtp);
       // Remove focus
       inputRefs.current[index]?.blur();
    }

    // Move to next input
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    // Handle Paste check if needed, but simple backspace nav is key
  };

  const handlePaste = (e) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text").slice(0, 4);
      if(!/^\d+$/.test(pastedData)) return; // Only digits

      const newOtp = [...otp];
      pastedData.split("").forEach((char, i) => {
          if (i < 4) newOtp[i] = char;
      });
      setOtp(newOtp);
      
      if(pastedData.length === 4) {
           verifyOtpAction(pastedData);
           inputRefs.current[3]?.focus();
      } else {
           const nextIndex = Math.min(pastedData.length, 3);
           inputRefs.current[nextIndex]?.focus();
      }
  };


  // Actions
  const onSubmitPhone = async (data) => {
    await handleSendOtp(data.phone);
  };

  const verifyOtpAction = async (enteredOtp) => {
    const ok = await handleVerifyOtp(enteredOtp);
    if (ok) {
        setOpen(false); // Close drawer on success
        // Router push not needed if we are just logging in to stay on page? 
        // User requested "Do not navigate to a new page".
        // useAuth handleVerifyOtp might reload or update state. 
        // Assuming it updates Redux state `isLoggedIn: true`.
    } else {
        setOtp(["", "", "", ""]); // Clear on error
        inputRefs.current[0]?.focus();
    }
  };

  const handleManualVerify = () => {
      verifyOtpAction(otp.join(""));
  }

  const handleResend = async () => {
      if (resendSecondsLeft > 0 || loading) return;
      await handleSendOtp(phone);
      setResendSecondsLeft(resendWaitSeconds);
  };

  const handleClose = () => {
      setOpen(false);
  }

  const handleBack = () => {
      if (step === 'otp') {
          resetStep(); // Go back to phone
          setOtp(["", "", "", ""]);
      } else {
          setOpen(false);
      }
  }


  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50 lg:hidden" onClose={setOpen}>
        <TransitionChild
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-x-0 bottom-0 z-50 flex min-h-full items-end justify-center text-center">
          <TransitionChild
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <DialogPanel className="relative w-full max-w-md transform overflow-hidden rounded-t-3xl bg-white shadow-2xl transition-all h-auto max-h-[60vh] flex flex-col">
              
              {/* Header */}
              <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-gray-50 bg-white shrink-0">
                <button 
                    type="button" 
                    onClick={handleBack} 
                    className="p-1 text-gray-500 hover:bg-gray-50 rounded-full cursor-pointer relative z-20"
                >
                   {step === 'otp' ? <ArrowLeft size={24} /> : <span className="w-6 h-6" />}
                </button>
                <h3 className="text-lg font-bold text-gray-900">
                    {step === 'phone' ? 'Login' : 'Verify OTP'}
                </h3>
                <button 
                    type="button" 
                    onClick={handleClose} 
                    className="p-1 text-gray-500 hover:bg-gray-50 rounded-full cursor-pointer relative z-20"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto">
                 
                 {/* Step 1: Phone */}
                 {step === 'phone' && (
                     <div className="w-full space-y-5">
                        <div className="text-left">
                            <h2 className="text-xl font-bold text-gray-900">Welcome</h2>
                            <p className="text-sm text-gray-500">Enter phone number to continue</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmitPhone)} className="space-y-5">
                            <div>
                                <InputArea
                                    register={register}
                                    name="phone"
                                    type="tel"
                                    placeholder="Mobile Number"
                                    Icon={FiPhone}
                                    className="h-14 text-lg"
                                />
                                <Error errorMessage={errors.phone?.message} />
                            </div>
                            <Button
                                disabled={loading}
                                isLoading={loading}
                                type="submit"
                                className="w-full h-14 text-base font-bold bg-[#124b8a] hover:bg-[#0e3b6e] text-white rounded-xl shadow-sm"
                            >
                                Continue
                            </Button>
                        </form>
                     </div>
                 )}

                 {/* Step 2: OTP */}
                 {step === 'otp' && (
                     <div className="w-full space-y-8">
                         <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Phone</h2>
                            <p className="text-gray-500">
                                Code sent to <span className="font-semibold text-gray-900">{phone}</span>
                            </p>
                            <button 
                                onClick={handleBack} 
                                className="text-sm text-[#124b8a] font-medium mt-1"
                            >
                                Change Number
                            </button>
                        </div>

                        <div className="flex justify-center gap-4">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text" // 'tel' might be better for numeric keyboard, or use inputMode
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onPaste={handlePaste}
                                    className="w-14 h-14 border-2 border-gray-200 rounded-xl text-center text-2xl font-bold text-gray-900 focus:border-[#124b8a] focus:ring-4 focus:ring-blue-50 outline-none transition-all caret-[#124b8a]"
                                />
                            ))}
                        </div>

                        <div className="space-y-4">
                             <Button
                                disabled={loading || otp.join("").length < 4}
                                isLoading={loading}
                                onClick={handleManualVerify}
                                className="w-full h-12 text-base font-semibold bg-[#124b8a] hover:bg-[#0e3b6e] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Verify & Continue
                            </Button>

                            <div className="text-center text-sm text-gray-600">
                                {resendSecondsLeft > 0 ? (
                                    <p>Resend code in <span className="font-semibold text-gray-900">{resendSecondsLeft}s</span></p>
                                ) : (
                                    <button 
                                       onClick={handleResend}
                                       disabled={loading}
                                       className="text-[#124b8a] font-semibold hover:underline"
                                    >
                                        Resend Code
                                    </button>
                                )}
                            </div>
                        </div>
                     </div>
                 )}

              </div>

            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default LoginBottomDrawer;
