import { apiClient, API_ENDPOINTS } from "@services/api";

const checkoutService = {
  checkoutRazorpay: async ({
    deliveryTypeId,
        coupon,
        redeem_wallet = false,
        delivery_time_period_id,
        is_pickup_order,
        is_next_day_order,
        payment_type,
  }) => {
    if (!deliveryTypeId) {
      throw new Error("deliveryTypeId is required to checkout with Razorpay");
    }

    try {
      const query = new URLSearchParams();
      query.set("redeem_wallet", redeem_wallet);

      if (coupon !== undefined && coupon !== null) {
        query.set("coupon", coupon);
      }

      if (delivery_time_period_id) {
        query.set("delivery_time_period_id", delivery_time_period_id);
      }

     
        query.set("is_pickup_order", is_pickup_order);
      
  

        query.set("is_next_day_order", is_next_day_order);
     
      query.set("payment_type", payment_type);      

      const url = `${API_ENDPOINTS.CHECKOUT_RAZORPAY}/${deliveryTypeId}?${query.toString()}`;
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to checkout with Razorpay"
      );
    }
  },

  checkoutCOD: async ({
    packing,
    delivery_options_id,
    delivery_time_period_id,
    payment_type,
    redeem_wallet,
    user_wallet_data,
    coupon_id,
    is_next_day_order
  }) => {
    try {
      const formData = new FormData();
      formData.append("packing", packing);
      formData.append("delivery_options_id", delivery_options_id);

      if (delivery_time_period_id) {
        formData.append("delivery_time_period_id", delivery_time_period_id);
      }

      if (is_next_day_order) {
        formData.append("is_next_day_order", is_next_day_order);
      }

      formData.append("payment_type", payment_type);
      formData.append("redeem_wallet", redeem_wallet);
      formData.append("user_wallet_data", user_wallet_data);

      if (coupon_id) {
        formData.append("coupon", coupon_id);
      }

      const response = await apiClient.post(
        API_ENDPOINTS.CHECKOUT_COD,
        formData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to checkout with COD"
      );
    }
  },
};

export default checkoutService;
