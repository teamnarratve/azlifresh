import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import addonService from "@services/azli_services/addonService";

export const fetchSpecialAddonProducts = createAsyncThunk(
  "specialAddon/fetchSpecialAddonProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await addonService.getSpecialAddonProducts();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const specialAddonSlice = createSlice({
  name: "specialAddon",
  initialState,
  reducers: {
    clearSpecialAddonProducts: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpecialAddonProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpecialAddonProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.data || [];
      })
      .addCase(fetchSpecialAddonProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSpecialAddonProducts } = specialAddonSlice.actions;
export default specialAddonSlice.reducer;
