import { apiClient, API_ENDPOINTS } from "@services/api";

const addressService = {
  getAdrressList: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADDRESS_LIST);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch address list"
      );
    }
  },

  selectAddress: async ({ address_id }) => {
    try {
      const formData = new FormData();
      formData.append("address_id", address_id);

      const response = await apiClient.post(
        API_ENDPOINTS.ADDRESS_SELECT,
        formData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to select item"
      );
    }
  },

  createAddress: async ({
    full_name,
    ph_number,
    pin_code,
    house_building_number,
    street_location,
    district,
    state,
    address_type,
    location_lat,
    location_log,
    apartment_name,
    phase,
    block,
    floor_number,
    room_number,
    lift_floor_number,
    landmark,
    receiver_name,
    receiver_number,
  }) => {
    try {
      const formData = new FormData();

      formData.append("full_name", full_name);
      formData.append("ph_number", ph_number);
      formData.append("pin_code", pin_code);
      formData.append("house_building_number", house_building_number);
      formData.append("street", street_location);
      formData.append("district", district);
      formData.append("state", state);
      formData.append("address_type", address_type);
      formData.append("location_lat", location_lat || "");
      formData.append("location_log", location_log || "");
      formData.append("apartment_name", apartment_name);
      formData.append("phase", phase);
      formData.append("block", block);
      formData.append("floor_number", floor_number);
      formData.append("room_number", room_number);
      formData.append("lift_floor_number", lift_floor_number);
      formData.append("landmark", landmark || "");
      formData.append("receiver_name", full_name || "");
      formData.append("receiver_number", ph_number || "");

      const response = await apiClient.post(
        API_ENDPOINTS.ADDRESS_CREATE,
        formData
      );

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to add address"
      );
    }
  },

  updateAddress: async ({
    id,
    full_name,
    ph_number,
    pin_code,
    house_building_number,
    street,
    district,
    state,
    address_type,
    location_lat,
    location_log,
    apartment_name,
    phase,
    block,
    floor_number,
    room_number,
    lift_floor_number,
  }) => {
    try {
      const formData = new FormData();

      formData.append("id", id);
      formData.append("full_name", full_name);
      formData.append("ph_number", ph_number);
      formData.append("pin_code", pin_code);
      formData.append("house_building_number", house_building_number);
      formData.append("street", street);
      formData.append("district", district);
      formData.append("state", state);
      formData.append("address_type", address_type);
      formData.append("location_lat", location_lat || "");
      formData.append("location_log", location_log || "");
      formData.append("apartment_name", apartment_name || "");
      formData.append("phase", phase || "");
      formData.append("block", block || "");
      formData.append("floor_number", floor_number || "");
      formData.append("room_number", room_number || "");
      formData.append("lift_floor_number", lift_floor_number || "");

      const response = await apiClient.post(
        API_ENDPOINTS.ADDRESS_UPDATE,
        formData
      );

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update address"
      );
    }
  },

  deleteAddress: async (id) => {
    try {
      const response = await apiClient.delete(
        `${API_ENDPOINTS.ADDRESS_DELETE}/${id}`
      );

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete address"
      );
    }
  },
};

export default addressService;
