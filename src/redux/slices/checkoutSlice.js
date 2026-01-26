import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import checkoutService from "@services/azli_services/CheckoutService";

export const checkoutCOD = createAsyncThunk(
  "checkout/checkoutCOD",
  async (
    {
      packing,
      delivery_options_id,
      delivery_time_period_id,
      payment_type,
      redeem_wallet,
      user_wallet_data,
      coupon_id,
      is_next_day_order
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await checkoutService.checkoutCOD({
        packing,
        delivery_options_id,
        delivery_time_period_id,
        payment_type,
        redeem_wallet,
        user_wallet_data,
        coupon_id,
        is_next_day_order
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkoutRazorpay = createAsyncThunk(
  "checkout/checkoutRazorpay",
  async (
    { deliveryTypeId,     coupon,
        redeem_wallet,
        delivery_time_period_id,
        is_pickup_order,
        is_next_day_order,
        payment_type,},
    { rejectWithValue }
  ) => {
    try {
      const response = await checkoutService.checkoutRazorpay({
        deliveryTypeId,
         coupon,
        redeem_wallet,
        delivery_time_period_id,
        is_pickup_order,
        is_next_day_order,
        payment_type,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  razorpayLink: null,
  razorpayData: null,
  codData: null,
  loading: false,
  error: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    clearCheckout: (state) => {
      state.razorpayLink = null;
      state.razorpayData = null;
      state.codData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkoutRazorpay.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutRazorpay.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.razorpayData = action.payload;
      })
      .addCase(checkoutRazorpay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || null;
      })
      .addCase(checkoutCOD.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutCOD.fulfilled, (state, action) => {
        state.loading = false;
        state.codData = action.payload;
      })
      .addCase(checkoutCOD.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || null;
      });
  },
});

export const { clearCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
