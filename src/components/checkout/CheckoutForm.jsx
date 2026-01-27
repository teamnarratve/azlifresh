"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { IoChevronBack, IoClose } from "react-icons/io5";
import { FiMapPin, FiTruck, FiChevronRight } from "react-icons/fi";
import AddressSelectorModal from "./AddressModal";
import Link from "next/link";
import { useAddress } from "@hooks/azli_hooks/useAddress";
import { useRouter } from "next/navigation";
import DeliveryMethodModal from "./DeliveryMethodModal";
import TimeSlotModal from "./TimeSlotModal";
import { useDelivery } from "@hooks/azli_hooks/useDelivery";
import CartItemCard from "./CartItems";
import { useCart } from "@hooks/azli_hooks/useCart";
import OrderSummary from "./OrderSummary";
import PaymentModal from "./PaymentModal";
import { useCheckout } from "@hooks/azli_hooks/useCheckout";
import OrderSuccessModal from "./OrderSuceesModal";
import { useAuth } from "@hooks/azli_hooks/useCustomAuth";
import { useRazorpay } from "react-razorpay";
import { useSpecialAddonProducts } from "@hooks/azli_hooks/useSpecialAddonProducts";
import { useOnlinePayment } from "@hooks/azli_hooks/useOnlinePayment";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
// Modal Component

const CheckoutForm = () => {
  const router = useRouter();
  const {
    addressList,
    defaultAddressId,
    handleFetchAddressList,
    handleSelectAddress,
  } = useAddress();

  const {
    deliveryTypes,
    timeSlots,

    handleFetchDeliveryTypes,
    handleFetchTimeSlots,
    handleSelectDeliveryType,
    handleSelectTimeSlot,
  } = useDelivery();

  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

  // 👉 1. First define local UI state
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddressId);
  // DELIVERY METHOD STATE - FULL OBJECT
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(null);
  // TIME SLOT STATE -FULL OBJECT
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [isDeliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [isTimeSlotModalOpen, setTimeSlotModalOpen] = useState(false);
  const [skipBag, setSkipBag] = useState(false);

  // 👉 2. Fetch address list on first load
  useEffect(() => {
    handleFetchAddressList();
    handleFetchTimeSlots();
  }, []);

  useEffect(() => {
    handleFetchDeliveryTypes();
  }, []);

  // 👉 3. Sync when default address from API updates
  useEffect(() => {
    if (defaultAddressId) {
      setSelectedAddressId(defaultAddressId);
    }
  }, [defaultAddressId]);
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);

  const selectedAddress = addressList.find((a) => a.id === selectedAddressId);

  const {
    cartList,
    totalAmount,
    addonTotalAmount,
    discount,
    count,
    loading,
    error,

    handleFetchCartList,
    handleUpdateQuantity,
    handleAddItem,
    handleClearCart,
  } = useCart();

  const {
    razorpayLink,

    isLoggedIn,

    handleCOD,
    handleRazorPay,

    handleClearCheckout,
  } = useCheckout();

  const { addonProducts, handleFetchSpecialAddonProducts } =
    useSpecialAddonProducts();

  const { onlinePaymentSettings, handleFetchOnlinePaymentSettings } =
    useOnlinePayment();

  useEffect(() => {
    if (!cartList || cartList.length === 0) {
      handleFetchCartList();
    }
  }, []); // ❗ remove cartList dependency

  useEffect(() => {
    handleFetchOnlinePaymentSettings();
    handleFetchSpecialAddonProducts();
  }, []);

  const buttonLabel = !selectedDeliveryMethod
    ? "Select Delivery Method"
    : !selectedAddress
    ? "Select Address"
    : "Checkout";

  // Convert API → UI-friendly structure
  const cartItems = cartList?.map((item) => ({
    id: item.id,
    name: item.cart_product_data?.name,
    cut: item.cart_product_option_data?.name,
    weight: item.cart_product_option_data?.un_cleaned_weight,
    qty: item.quantity,
    img:
      item.cart_product_option_data?.img ||
      item.cart_product_data?.imgs?.[0]?.img ||
      "",
    price: item.cart_product_option_data?.total_price || 0,
    isAddon: Boolean(item.cart_product_data?.is_special_addon_product),
  }));

  const handleClaimAddon = async (product) => {
    const productId = product?.id;
    if (!productId) return;

    const productOptionId =
      product?.product_option_id ||
      product?.default_option_id ||
      productId;

    await handleAddItem({
      product_id: productId,
      product_option_id: productOptionId,
      quantity: 1,
      redirect: "/checkout",
    });
  };

  const minimumFreeAddonAmount =
    onlinePaymentSettings?.minimum_amount_for_free_product ?? null;
  const qualifiesForFreeAddon =
    minimumFreeAddonAmount !== null &&
    Number(totalAmount) >= Number(minimumFreeAddonAmount);
  const showAddonSlider = qualifiesForFreeAddon && addonProducts?.length > 0;

  const handleCheckout = async (paymentMethod, finalAmount, walletDiscount) => {
    const deliveryTypeId = selectedDeliveryMethod?.id;
    const deliveryTimePeriodId = selectedTimeSlot?.id;
    const isWallet = walletDiscount > 0;
    const isNextDayOrder = selectedTimeSlot?.day === "tomorrow";
    const couponId = null;

    if (paymentMethod === "cod") {
      const response = await handleCOD({
        packing: "ok",
        delivery_options_id: deliveryTypeId,
        delivery_time_period_id: deliveryTimePeriodId,
        payment_type: "cod",
        redeem_wallet: isWallet,
        user_wallet_data: false,
        coupon_id: couponId,
        paper_bag_needed: skipBag,
        is_next_day_order: isNextDayOrder,
      });

      if (response?.success) {
        setOrderDetails(response.orderData);
        setOrderSuccess(true);
        return true;
      } else {
        setErrorMessage(response?.message || "Order could not be placed");
        setErrorModalOpen(true);
        return false;
      }
    }

    if (paymentMethod === "online") {
      const response = await handleRazorPay({
        deliveryTypeId,
        coupon: couponId,
        redeem_wallet: isWallet,
        delivery_time_period_id: deliveryTimePeriodId,
        is_pickup_order: false,
        is_next_day_order: isNextDayOrder,
        payment_type: "online",
      });
      console.log("response::::::::::;", response);
      if (response?.success && response.paymentData) {
        const opened = await openRazorpayCheckout(response.paymentData);
        if (opened) {
          setOrderDetails(response.paymentData?.data);
          return true;
        }
        return false;
      }

      setErrorMessage(
        response?.message ||
          response?.paymentData?.message ||
          "Unable to start online payment"
      );
      setErrorModalOpen(true);
      return false;
    }

    return false;
  };

  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const { profile, handleFetchProfile } = useAuth();
  const walletBalance = profile?.user_wallet_data?.amount ?? 0;
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { Razorpay } = useRazorpay();

  useEffect(() => {
    if (isLoggedIn && (!profile || Object.keys(profile).length === 0)) {
      handleFetchProfile();
    }
  }, [isLoggedIn, profile]);

  useEffect(() => {
    if (profile?.user_wallet_data?.amount !== undefined) {
      console.log("Wallet amount:", profile.user_wallet_data.amount);
    }
  }, [profile]);

  const ensureRazorpayScriptReady = async () => {
    if (typeof window === "undefined") {
      return false;
    }

    if (window.Razorpay) {
      return true;
    }

    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const openRazorpayCheckout = async (orderPayload) => {
    const orderData = orderPayload?.data;
    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY;

    if (!razorpayKey) {
      setErrorMessage("Missing Razorpay key configuration");
      setErrorModalOpen(true);
      return false;
    }

    if (!orderData?.id) {
      setErrorMessage("Invalid Razorpay order details");
      setErrorModalOpen(true);
      return false;
    }

    const scriptReady = await ensureRazorpayScriptReady();
    if (!scriptReady || typeof window === "undefined" || !window.Razorpay) {
      setErrorMessage("Razorpay SDK failed to load");
      setErrorModalOpen(true);
      return false;
    }

    const options = {
      key: razorpayKey,
      amount: orderData?.amount,
      currency: orderData?.currency || "INR",
      name: "Pay Now",
      order_id: orderData?.id,
      retry: { enabled: true, max_count: 1 },
      send_sms_hash: true,
      prefill: {
        contact:
          profile?.mobile ||
          profile?.user_profile_data?.mobile ||
          orderData?.notes?.mobile ||
          "",
        email:
          profile?.email ||
          profile?.user_profile_data?.email ||
          orderData?.notes?.email ||
          "",
      },
      handler: async (paymentResponse) => {
        console.log("Razorpay payment success", paymentResponse);
        await handleFetchCartList();
      },
      modal: {
        ondismiss: () => {
          console.log("Razorpay payment popup closed");
        },
      },
      notes: orderData?.notes,
    };

    try {
      const RazorpayConstructor = Razorpay || window.Razorpay;
      const rzpay = new RazorpayConstructor(options);
      rzpay.open();
      return true;
    } catch (error) {
      console.error("Failed to open Razorpay checkout", error);
      setErrorMessage("Unable to start online payment");
      setErrorModalOpen(true);
      return false;
    }
  };

  // 4. Custom Sticky Header (replaces global header)
  const CheckoutHeader = () => (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 h-14 flex items-center gap-3 shadow-sm">
      <button 
        onClick={() => router.back()}
        className="p-1 -ml-1 text-gray-700 hover:bg-gray-50 rounded-full"
      >
        <IoChevronBack className="w-6 h-6" />
      </button>
      <h1 className="text-lg font-bold text-gray-900">Checkout</h1>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F6F7FB] w-full pb-32">
        <CheckoutHeader />

        <div className="max-w-screen-xl mx-auto px-4 pt-4 space-y-4">
            
            {/* 1. DELIVERY ADDRESS */}
            <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-100" onClick={() => setAddressModalOpen(true)}>
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Delivery Address</h2>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        {selectedAddress?.address_type || 'Select'}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-orange-50 p-2 rounded-full shrink-0">
                        <FiMapPin className="text-orange-600 w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                         {selectedAddress ? (
                            <p className="text-sm font-medium text-gray-800 leading-tight line-clamp-2">
                                {`${selectedAddress?.street_location || ""}, ${selectedAddress?.street || ""}, ${selectedAddress?.district || ""}`}
                            </p>
                         ) : (
                             <p className="text-sm text-gray-400">Select a delivery address</p>
                         )}
                    </div>
                    <FiChevronRight className="text-gray-400" />
                </div>
            </section>

            {/* 2. DELIVERY METHOD */}
            <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-100" onClick={() => setDeliveryModalOpen(true)}>
                 <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Delivery Method</h2>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-full shrink-0">
                        <FiTruck className="text-blue-600 w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                             {selectedDeliveryMethod ? selectedDeliveryMethod.name : "Select Method"}
                        </p>
                        {selectedTimeSlot && (
                            <p className="text-xs text-gray-500 mt-0.5">
                                {selectedTimeSlot.timing}
                            </p>
                        )}
                         {!selectedDeliveryMethod && <p className="text-xs text-gray-400">Choose delivery type</p>}
                    </div>
                    <FiChevronRight className="text-gray-400" />
                </div>
            </section>

            {/* 3. SUSTAINABILITY (SKIP BAG) */}
            <section className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center gap-3" onClick={() => setSkipBag(!skipBag)}>
                 <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${skipBag ? "bg-green-600 border-green-600" : "border-gray-300 bg-white"}`}>
                    {skipBag && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                 </div>
                 <div className="flex-1">
                     <p className="text-sm font-semibold text-gray-800">Skip paper bag 🌱</p>
                     <p className="text-xs text-gray-500">Every small choice helps the planet.</p>
                 </div>
            </section>

            {/* 4. ORDER ITEMS */}
            <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Items ({count})</h2>
                <div className="space-y-4">
                    {cartItems.map((item) => (
                        <CartItemCard
                            key={item.id}
                            item={item}
                            onIncrease={() => handleUpdateQuantity(item.id, item.qty + 1)}
                            onDecrease={() => {
                                if (item.qty > 0) handleUpdateQuantity(item.id, item.qty - 1);
                            }}
                            onRemove={() => handleUpdateQuantity(item.id, 0)}
                        />
                    ))}
                </div>
                
                 {/* Forgot Something */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link href="/" className="flex items-center justify-between group">
                        <span className="text-sm font-medium text-gray-600 group-hover:text-green-600 transition">Forgot something?</span>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg group-hover:bg-green-100 transition">
                            + Add Items
                        </span>
                    </Link>
                </div>
            </section>

            {/* 5. FREE ADDONS */}
            {showAddonSlider && (
                <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 overflow-hidden">
                     <div className="flex items-center gap-2 mb-3">
                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">FREE</span>
                        <h2 className="text-sm font-bold text-gray-900">Claim Free Gift</h2>
                     </div>
                     <Swiper
                        spaceBetween={12}
                        slidesPerView={1.2}
                        className="w-full"
                      >
                        {addonProducts.map((product) => {
                             const isClaimed = Boolean(product?.cartDetails?.id) || cartList?.some((item) => item.cart_product_data?.id === product?.id);
                             return (
                                <SwiperSlide key={product.id}>
                                    <div className="border border-gray-100 rounded-lg p-2 flex gap-3 items-center bg-gray-50">
                                         <div className="bg-white p-1 rounded-md border border-gray-100 shrink-0">
                                             <Image src={product?.imgs?.[0]?.img || "/placeholder.png"} alt={product.name} width={40} height={40} className="w-10 h-10 object-contain" />
                                         </div>
                                         <div className="flex-1 min-w-0">
                                             <p className="text-xs font-semibold text-gray-900 truncate">{product.name}</p>
                                             <p className="text-[10px] text-gray-500">{product.weight}</p>
                                         </div>
                                         <button 
                                            onClick={() => handleClaimAddon(product)}
                                            disabled={isClaimed}
                                            className={`text-xs font-bold px-2 py-1 rounded-md ${isClaimed ? 'text-gray-400 bg-gray-200' : 'text-white bg-red-500'}`}
                                         >
                                             {isClaimed ? '✓' : 'ADD'}
                                         </button>
                                    </div>
                                </SwiperSlide>
                             )
                        })}
                      </Swiper>
                </section>
            )}

            {/* 6. COUPON */}
            <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between" onClick={() => {/* Coupon expansion logic */}}>
                 <div className="flex items-center gap-3">
                     <div className="bg-purple-50 p-2 rounded-full text-purple-600">
                         <span className="text-lg">🎟️</span>
                     </div>
                     <div>
                         <p className="text-sm font-semibold text-gray-900">Apply Coupon</p>
                     </div>
                 </div>
                 <span className="text-xs font-bold text-green-600">Select</span>
            </section>

             {/* 7. ORDER SUMMARY */}
             <div className="pb-4">
                <OrderSummary
                    subtotal={totalAmount}
                    discount={discount}
                    deliveryFee={0}
                    tax={0}
                    total={totalAmount}
                />
             </div>
        </div>

        {/* MODALS */}
        <AddressSelectorModal
          open={isAddressModalOpen}
          onClose={() => setAddressModalOpen(false)}
          addresses={addressList}
          selectedId={selectedAddressId}
          onSelect={async (id) => {
            const ok = await handleSelectAddress(id);
            if (ok) {
              setSelectedAddressId(id);
              setAddressModalOpen(false);
            }
          }}
          onAddNew={() => {
            setAddressModalOpen(false);
            router.push("/address");
          }}
        />

        <DeliveryMethodModal
          open={isDeliveryModalOpen}
          onClose={() => setDeliveryModalOpen(false)}
          deliveryTypes={deliveryTypes}
          selectedMethod={selectedDeliveryMethod}
          onSelectMethod={(method) => setSelectedDeliveryMethod(method)}
          onSelectTimeSlot={(method) => {
            setSelectedDeliveryMethod(method);
            setDeliveryModalOpen(false);
            setTimeSlotModalOpen(true);
          }}
        />

        <TimeSlotModal
          open={isTimeSlotModalOpen}
          onClose={() => setTimeSlotModalOpen(false)}
          selectedSlot={selectedTimeSlot}
          todaySlots={timeSlots.today_data}
          tomorrowSlots={timeSlots.next_day_data}
          onSelectSlot={(slot) => setSelectedTimeSlot(slot)}
          onConfirm={(slot) => {
            setSelectedTimeSlot(slot);
            setTimeSlotModalOpen(false);
          }}
        />

        <PaymentModal
          open={isPaymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          totalAmount={totalAmount}
          walletBalance={profile?.user_wallet_data?.amount}
          onConfirmPayment={async (amount, method, wallet) => {
            const ok = await handleCheckout(method, amount, wallet);
            if (ok) setPaymentModalOpen(false);
          }}
        />

        <OrderSuccessModal
          open={orderSuccess}
          order={orderDetails}
          onClose={() => {
            setOrderSuccess(false);
            router.push("/my-orders");
          }}
        />
        
        {/* Error Modal */}
        {isErrorModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Notice</h3>
              <p className="text-sm text-gray-700">{errorMessage}</p>
              <div className="mt-4 flex justify-end">
                <button
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white"
                  onClick={() => setErrorModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      {/* 8. STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] z-40">
           <div className="max-w-screen-xl mx-auto flex items-center gap-4">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">To Pay</span>
                    <span className="text-xl font-bold text-gray-900">₹{totalAmount}</span>
                </div>
                <button
                    onClick={() => {
                         if (!selectedAddress) {
                            setAddressModalOpen(true);
                        } else if (!selectedDeliveryMethod) {
                            setDeliveryModalOpen(true);
                        } else {
                            setPaymentModalOpen(true);
                        }
                    }}
                    className="flex-1 bg-green-600 text-white h-12 rounded-xl font-bold shadow-lg shadow-green-100 hover:bg-green-700 active:scale-[0.98] transition-transform"
                >
                    Place Order
                </button>
           </div>
      </div>

    </div>
  );
};

export default CheckoutForm;
