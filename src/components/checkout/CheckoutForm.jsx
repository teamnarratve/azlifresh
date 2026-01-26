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

  return (
    <div className="min-h-screen bg-[#F6F7FB] w-full">
      {/* MAIN WRAPPER (Desktop Full Width) */}
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 pb-28">
        {/* HEADER */}
        <header className="flex items-center justify-between pt-6 pb-4">
          <div className="flex items-center gap-2">
            {/* <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
              <IoChevronBack className="text-lg text-gray-700" />
            </button> */}
            <h1 className="text-xl font-semibold text-gray-900">Checkout</h1>
          </div>

          {/* Express Delivery badge */}
          <div className="rounded-full bg-gradient-to-r from-[#0077FF] via-[#00B54A] to-[#FFD600] px-4 py-1 text-xs font-semibold text-white shadow">
            Express Delivery ⚡
          </div>
        </header>

        {/* ESTIMATED DELIVERY */}
        <div className="mb-4 rounded-xl bg-[#E4F7EA] px-4 py-2 text-center text-[14px] font-semibold text-[#118A3D]">
          Estimated Delivery Time:
        </div>

        {/* ===================== CONTENT ========================== */}
        <div className="space-y-5">
          {/* ADDRESS CARD */}
          <div
            className="rounded-2xl bg-white p-4 shadow-sm cursor-pointer"
            onClick={() => setAddressModalOpen(true)}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF7EB]">
                <FiMapPin className="text-xl text-[#26A541]" />
              </div>

              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <p className="text-[14px] font-medium text-gray-500">
                    Deliver to
                  </p>

                  <span className="rounded-full bg-[#FFF4E0] px-2 py-[2px] text-[11px] font-medium text-[#C48321]">
                    {selectedAddress?.address_type}
                  </span>
                </div>

                {/* 🔥 UPDATED ADDRESS TEXT (NO DESIGN CHANGE) */}
                {selectedAddress && (
                  <p className="text-[14px] font-medium text-gray-800 leading-5 line-clamp-2">
                    {`${selectedAddress?.street_location || ""}, ${
                      selectedAddress?.street || ""
                    }, ${selectedAddress?.district || ""}, ${
                      selectedAddress?.state || ""
                    } - ${selectedAddress?.pin_code || ""}`}
                  </p>
                )}
              </div>

              <FiChevronRight className="text-gray-400 text-xl" />
            </div>
          </div>

          {/* DELIVERY METHOD */}
          <div
            className="rounded-2xl bg-white p-4 shadow-sm cursor-pointer"
            onClick={() => setDeliveryModalOpen(true)}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF7EB]">
                <FiTruck className="text-xl text-[#26A541]" />
              </div>

              <div className="flex-1">
                <p className="text-[14px] font-medium text-gray-500">
                  Delivery Method
                </p>
                <p className="text-[14px] font-semibold text-gray-800">
                  {selectedDeliveryMethod
                    ? selectedDeliveryMethod.name +
                      (selectedDeliveryMethod.disable_time_slot
                        ? ""
                        : selectedTimeSlot
                        ? ` (${selectedTimeSlot.timing})`
                        : "")
                    : "Select Delivery Method"}
                </p>
              </div>

              <FiChevronRight className="text-gray-400 text-xl" />
            </div>
          </div>

          {/* SKIP BAG */}
          <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
            <button
              className={`mt-[3px] flex h-5 w-5 items-center justify-center rounded border 
      ${skipBag ? "border-green-600 bg-green-600" : "border-gray-400 bg-white"}
    `}
              onClick={() => setSkipBag(!skipBag)}
            >
              {skipBag && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>

            <div className="flex-1">
              <p className="text-[12px] text-gray-400">
                Every small choice helps the planet.
              </p>
              <p className="text-[14px] font-semibold text-gray-800">
                Skip the paper bag 🌱
              </p>
            </div>
          </div>

          {/* CART ITEM */}
          {cartItems.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              onIncrease={() => handleUpdateQuantity(item.id, item.qty + 1)}
              onDecrease={() => {
                // If quantity is 1, decreasing will remove the item (qty 0)
                if (item.qty > 0) {
                  handleUpdateQuantity(item.id, item.qty - 1);
                }
              }}
              onRemove={() => handleUpdateQuantity(item.id, 0)}
            />
          ))}

          {/* FORGOT SOMETHING */}
          <div className="flex items-center justify-between rounded-2xl bg-[#FFA726] px-4 py-3 text-white shadow">
            <p className="text-[15px] font-semibold">Forgot Something?</p>
            <Link href="/">
              {" "}
              <button className="rounded-xl bg-white px-4 py-2 text-[13px] font-semibold text-[#FFA726]">
                + Add more Items
              </button>
            </Link>
          </div>

          {showAddonSlider && (
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[14px] font-semibold text-gray-900">
                  You've Earned a Free Item!
                </p>
                <span className="rounded-full bg-[#E8F5E9] px-2 py-[2px] text-[11px] font-semibold text-[#2A8B45]">
                  Free Addon
                </span>
              </div>

              <Swiper
                spaceBetween={14}
                slidesPerView={1.15}
                breakpoints={{
                  640: { slidesPerView: 2.1 },
                  768: { slidesPerView: 2.4 },
                  1024: { slidesPerView: 3.2 },
                }}
                className="pb-8"
              >
                {addonProducts.map((product) => {
                  const isClaimed =
                    Boolean(product?.cartDetails?.id) ||
                    cartList?.some(
                      (item) => item.cart_product_data?.id === product?.id
                    );

                  return (
                  <SwiperSlide key={product.id}>
                    <div className="relative h-full rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
                      <span className="absolute left-2 top-2 rounded bg-[#FF2E63] px-2 py-[2px] text-[10px] font-semibold text-white">
                        FREE
                      </span>
                      <div className="flex items-center justify-center rounded-xl bg-[#F6F7FB] p-3">
                        <Image
                          src={product?.imgs?.[0]?.img || "/placeholder.png"}
                          alt={product?.name || "Addon product"}
                          width={160}
                          height={120}
                          className="h-24 w-auto object-contain"
                        />
                      </div>
                      <div className="mt-3">
                        <p className="text-[13px] font-semibold text-gray-900">
                          {product?.name}
                        </p>
                        <p className="text-[12px] text-gray-500">
                          {product?.weight}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleClaimAddon(product)}
                        disabled={isClaimed}
                        className={`mt-3 w-full rounded-xl border px-3 py-2 text-[12px] font-semibold ${
                          isClaimed
                            ? "border-gray-200 bg-gray-100 text-gray-500"
                            : "border-[#2A8B45] text-[#2A8B45]"
                        }`}
                      >
                        {isClaimed ? "Claimed" : "Claim"}
                      </button>
                    </div>
                  </SwiperSlide>
                  );
                })}
              </Swiper>

              <div className="mt-3 flex items-start gap-3 rounded-xl border border-gray-100 bg-[#FAFAFA] px-3 py-3 text-[12px] text-gray-600">
                <span className="mt-[2px] flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-[11px] font-semibold text-gray-500">
                  i
                </span>
                <p>
                  Add this free item to your order before placing it. If not
                  claimed, it will be canceled.
                </p>
              </div>
            </div>
          )}

          {/* COUPON */}
          <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF7E6]">
                <span className="text-xl">🎟️</span>
              </div>
              <div>
                <p className="text-[12px] text-gray-500">Got a Promo Code?</p>
                <p className="text-[14px] font-semibold text-[#26A541]">
                  Apply Coupon
                </p>
              </div>
            </div>
            <FiChevronRight className="text-gray-400 text-xl" />
          </div>

          {/* ORDER SUMMARY */}
          <OrderSummary
            subtotal={totalAmount}
            discount={discount}
            deliveryFee={0} // or dynamic delivery fee
            tax={0} // or dynamic tax if needed
            total={totalAmount} // or final amount after everything
          />
        </div>

        {/* ====================== ADDRESS MODAL ====================== */}
        <AddressSelectorModal
          open={isAddressModalOpen}
          onClose={() => setAddressModalOpen(false)}
          addresses={addressList}
          selectedId={selectedAddressId}
          onSelect={async (id) => {
            console.log("🟩 Address selected:", id);

            const ok = await handleSelectAddress(id); // 🔥 API CALL

            if (ok) {
              setSelectedAddressId(id); // update UI
              setAddressModalOpen(false);
            }
          }}
          onAddNew={() => {
            setAddressModalOpen(false);
            router.push("/address");
            console.log("Redirect to add address page");
          }}
        />

        {/* ====================== DELIVERY MODAL ====================== */}

        <DeliveryMethodModal
          open={isDeliveryModalOpen}
          onClose={() => setDeliveryModalOpen(false)}
          deliveryTypes={deliveryTypes} // <-- FEED API ARRAY
          selectedMethod={selectedDeliveryMethod}
          onSelectMethod={(method) => {
            console.log("Selected Method:", method);
            setSelectedDeliveryMethod(method);
          }}
          onSelectTimeSlot={(method) => {
            console.log("Selected Time Slot Method:", method);
            setSelectedDeliveryMethod(method);
            setDeliveryModalOpen(false);
            setTimeSlotModalOpen(true); // open slot picker
          }}
        />

        {/* ====================== TIME SLOT MODAL ====================== */}

        <PaymentModal
          open={isPaymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          totalAmount={totalAmount}
          walletBalance={profile?.user_wallet_data?.amount}
          onConfirmPayment={async (
            finalAmount,
            paymentMethod,
            walletDiscount
          ) => {
            const ok = await handleCheckout(
              paymentMethod,
              finalAmount,
              walletDiscount
            );
            if (ok) {
              setPaymentModalOpen(false);
            }
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

        <TimeSlotModal
          open={isTimeSlotModalOpen}
          onClose={() => setTimeSlotModalOpen(false)}
          selectedSlot={selectedTimeSlot}
          todaySlots={timeSlots.today_data}
          tomorrowSlots={timeSlots.next_day_data}
          onSelectSlot={(slot) => {
            // dispatch(handleSelectTimeSlot(slot));
            setSelectedTimeSlot(slot); // LOCAL STORE
          }}
          onConfirm={(slot) => {
            console.log("Selected Slot:", slot);
            setSelectedTimeSlot(slot);
            setTimeSlotModalOpen(false);
          }}
        />

        {/* ERROR MODAL */}
        {isErrorModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg relative">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Order Not Placed
              </h3>
              <p className="text-sm text-gray-700">{errorMessage}</p>
              <div className="mt-4 flex justify-end">
                <button
                  className="rounded-lg bg-[#2A8B45] px-4 py-2 text-sm font-semibold text-white"
                  onClick={() => setErrorModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* STICKY BOTTOM BAR */}
      {count > 0 && (
        <div className=" inset-x-0 bottom-0 z-20 flex justify-center bg-transparent pb-3">
          <div className="w-full max-w-screen-xl mx-auto px-4 md:px-10 lg:px-16 xl:px-20">
            <div className="rounded-2xl bg-white p-3 shadow-lg">
              <div className="flex items-center justify-between px-3 text-[13px] text-gray-600">
                <span>{count} item</span>
                <span className="font-semibold text-gray-800">
                  ₹ {totalAmount}
                </span>
              </div>
              <button
                className="mt-2 w-full rounded-2xl bg-[#2A8B45] py-3 text-[15px] font-semibold text-white"
                onClick={() => {
                  if (!selectedAddress) {
                    setAddressModalOpen(true);
                  } else if (!selectedDeliveryMethod) {
                    setDeliveryModalOpen(true);
                    console.log("delivery method not selected"); // You can add payment logic later
                  } else {
                    setPaymentModalOpen(true);
                    console.log("Proceed to checkout"); // You can add payment logic later
                  }
                }}
              >
                {buttonLabel}{" "}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;
