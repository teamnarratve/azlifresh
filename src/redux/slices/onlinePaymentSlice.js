import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import addonService from "@services/azli_services/addonService";

export const fetchOnlinePaymentSettings = createAsyncThunk(
  "onlinePayment/fetchOnlinePaymentSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await addonService.getOnlinePaymentSettings();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  settings: null,
  loading: false,
  error: null,
};

const onlinePaymentSlice = createSlice({
  name: "onlinePayment",
  initialState,
  reducers: {
    clearOnlinePaymentSettings: (state) => {
      state.settings = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOnlinePaymentSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOnlinePaymentSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload?.data || null;
      })
      .addCase(fetchOnlinePaymentSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOnlinePaymentSettings } = onlinePaymentSlice.actions;
export default onlinePaymentSlice.reducer;
