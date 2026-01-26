import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import deliveryService from "@services/azli_services/deliveryServices";

/* =========================================================
   ⭐ 1) GET DELIVERY METHODS
   ========================================================= */
export const fetchDeliveryTypes = createAsyncThunk(
  "delivery/fetchDeliveryTypes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await deliveryService.getDeliveryType();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* =========================================================
   ⭐ 2) GET TIME SLOTS (today)
   ========================================================= */
export const fetchTimeSlots = createAsyncThunk(
  "delivery/fetchTimeSlots",
  async (_, { rejectWithValue }) => {
    try {
      const response = await deliveryService.getTimeSlot();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* =========================================================
   INITIAL STATE
   ========================================================= */
const initialState = {
  deliveryTypes: [],
  timeSlots: {
    today_data: [],
    next_day_data: [],
  },

  selectedDeliveryType: null,
  selectedSlot: null,

  loading: false,
  error: null,
};

/* =========================================================
   SLICE
   ========================================================= */
const deliverySlice = createSlice({
  name: "delivery",
  initialState,
  reducers: {
    setSelectedDeliveryType: (state, action) => {
      state.selectedDeliveryType = action.payload;
    },

    setSelectedSlot: (state, action) => {
      state.selectedSlot = action.payload;
    },

    clearDeliveryState: (state) => {
      state.deliveryTypes = [];
      state.timeSlots = { today_data: [], next_day_data: [] };
      state.selectedDeliveryType = null;
      state.selectedSlot = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* =====================================================
         FETCH DELIVERY TYPES
      ===================================================== */
      .addCase(fetchDeliveryTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeliveryTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveryTypes = action.payload?.data || [];
      })
      .addCase(fetchDeliveryTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* =====================================================
         FETCH TIME SLOTS
      ===================================================== */
      .addCase(fetchTimeSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimeSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.timeSlots = action.payload?.data || {
          today_data: [],
          next_day_data: [],
        };
      })
      .addCase(fetchTimeSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearDeliveryState,
  setSelectedDeliveryType,
  setSelectedSlot,
} = deliverySlice.actions;

export default deliverySlice.reducer;
