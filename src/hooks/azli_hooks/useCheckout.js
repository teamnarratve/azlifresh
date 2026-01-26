import { useDispatch, useSelector } from "react-redux";
import { notifyError } from "@utils/toast";
import { fetchCartList } from "@redux/slices/cartSlice";
import {
  checkoutCOD,
  checkoutRazorpay,
  clearCheckout,
} from "@redux/slices/checkoutSlice";

export const useCheckout = () => {
  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector((state) => state.auth);

  const { razorpayLink, razorpayData, codData, loading, error } = useSelector(
    (state) => state.checkout
  );

  const handleCOD = async ({
    packing,
    delivery_options_id,
    delivery_time_period_id,
    payment_type,
    redeem_wallet,
    user_wallet_data,
    coupon_id,
    is_next_day_order
  }) => {
    if (!isLoggedIn) {
      notifyError("Please login to checkout");
      return false;
    }

    const res = await dispatch(
      checkoutCOD({
        packing,
        delivery_options_id,
        delivery_time_period_id,
        payment_type,
        redeem_wallet,
        user_wallet_data,
        coupon_id,
        is_next_day_order
      })
    );

    if (checkoutCOD.rejected.match(res)) {
      notifyError(res.payload || "Checkout failed");
      return false;
    }

    if (res.payload?.error === false) {
      await dispatch(fetchCartList());
      return {
        success: true,
        orderData: res.payload.data.order,
      };
    }

    return {
      success: false,
      message: res.payload?.message || "Checkout failed",
    };
  };

  const handleRazorPay = async ({
    deliveryTypeId,
  
       coupon,
        redeem_wallet,
        delivery_time_period_id,
        is_pickup_order,
        is_next_day_order,
        payment_type,
  }) => {
    if (!deliveryTypeId) {
      notifyError("Please select a delivery method");
      return { success: false, message: "Delivery method is required" };
    }

    if (!isLoggedIn) {
      notifyError("Please login to checkout");
      return { success: false, message: "Please login to checkout" };
    }

    const res = await dispatch(
      checkoutRazorpay({
        deliveryTypeId,
          coupon,
        redeem_wallet,
        delivery_time_period_id,
        is_pickup_order,
        is_next_day_order,
        payment_type,
      })
    );

    if (checkoutRazorpay.rejected.match(res)) {
      notifyError(res.payload || "Checkout failed");
      return { success: false, message: res.payload || "Checkout failed" };
    }

     

    const payload = res.payload;
    if (payload?.error === false || payload?.data?.id) {
      console.log("Razorpay checkout response", payload);
      return { success: true, paymentData: payload };
    }

    return {
      success: false,
      message: payload?.message || "Checkout failed",
    };
  };

  const handleClearCheckout = () => {
    dispatch(clearCheckout());
  };

  return {
    razorpayLink,
    razorpayData,
    codData,
    loading,
    error,
    isLoggedIn,
    handleCOD,
    handleRazorPay,
    handleClearCheckout,
  };
};
