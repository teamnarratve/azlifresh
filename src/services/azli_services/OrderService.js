import { apiClient, API_ENDPOINTS } from "@services/api";

const orderService = {
  getOrderList: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ORDER_LIST);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch order list"
      );
    }
  },

 
};

export default orderService;
