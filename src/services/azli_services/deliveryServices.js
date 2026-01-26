import { apiClient, API_ENDPOINTS } from "@services/api";

const deliveryService = {
  getDeliveryType: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.DELIVERY_TYPE);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch delivery types"
      );
    }
  },


   getTimeSlot: async () => {
    try {
   const response = await apiClient.get(API_ENDPOINTS.DELIVERY_TIME, {
      params: { today: true },   // 🔥 Always sends ?today=true
    });
    
    return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch time slot "
      );
    }
  },

}
export default deliveryService;
