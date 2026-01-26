import { apiClient, API_ENDPOINTS } from "@services/api";

const addonService = {
  getSpecialAddonProducts: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SPECIAL_ADDON_PRODUCTS, {
        params: { is_special_addon_product: true },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch special addon products"
      );
    }
  },

  getOnlinePaymentSettings: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ONLINE_PAYMENT);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch online payment settings"
      );
    }
  },
};

export default addonService;
