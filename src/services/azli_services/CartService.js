import { apiClient, API_ENDPOINTS } from "@services/api";

const cartService = {
  getCartList: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CART_LIST);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch cart list"
      );
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.MANAGE_CART}/${itemId}/${quantity}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update quantity"
      );
    }
  },

  // ⭐ NEW FUNCTION — Add to cart (product + option)
  addCartItem: async ({ product_id, product_option_id, quantity }) => {
    try {
      const formData = new FormData();
      formData.append("product_id", product_id);
      formData.append("product_option_id", product_option_id);
      formData.append("packing", "");
      formData.append("order_instruction", "");
      formData.append("quantity", quantity);

      const response = await apiClient.post(API_ENDPOINTS.ADD_CART, formData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to add item"
      );
    }
  },
};

export default cartService;
