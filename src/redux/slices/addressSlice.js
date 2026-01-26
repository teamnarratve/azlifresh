import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import addressService from "@services/azli_services/AddressService";

/* =========================================================
   ⭐ 1) GET ADDRESS LIST
   ========================================================= */
export const fetchAddressList = createAsyncThunk(
  "address/fetchAddressList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await addressService.getAdrressList();
      return response; // response.data already returned from service
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* =========================================================
   ⭐ 2) SELECT ADDRESS (POST)
   ========================================================= */
export const selectAddressThunk = createAsyncThunk(
  "address/selectAddress",
  async ({ address_id }, { rejectWithValue }) => {
    try {
      const response = await addressService.selectAddress({ address_id });
      return { address_id, data: response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* =========================================================
   ⭐ 3) CREATE ADDRESS
   ========================================================= */
export const createAddressThunk = createAsyncThunk(
  "address/createAddress",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await addressService.createAddress(payload);
      return response; // created address data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* =========================================================
   ⭐ 4) UPDATE ADDRESS
   ========================================================= */
export const updateAddressThunk = createAsyncThunk(
  "address/updateAddress",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await addressService.updateAddress(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* =========================================================
   ⭐ 5) DELETE ADDRESS
   ========================================================= */
export const deleteAddressThunk = createAsyncThunk(
  "address/deleteAddress",
  async (id, { rejectWithValue }) => {
    try {
      const response = await addressService.deleteAddress(id);
      return { id, data: response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* =========================================================
   INITIAL STATE
   ========================================================= */
const initialState = {
  addressList: [],
  defaultAddressId: null,

  loading: false,
  error: null,
};

/* =========================================================
   SLICE
   ========================================================= */
const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    clearAddressState: (state) => {
      state.addressList = [];
      state.defaultAddressId = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* =====================================================
         FETCH ADDRESS LIST
      ===================================================== */
      .addCase(fetchAddressList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddressList.fulfilled, (state, action) => {
        state.loading = false;

        // API returns { data: [...] }
        const list = action.payload?.data || action.payload || [];

        state.addressList = list;

        // Find default address (selected: 1)
        const selected = list.find((a) => a.selected === 1);

        state.selectedAddressId = selected ? selected.id : null;
      })
      .addCase(fetchAddressList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* =====================================================
         SELECT ADDRESS
      ===================================================== */
      .addCase(selectAddressThunk.fulfilled, (state, action) => {
        state.defaultAddressId = action.payload.address_id;
      })

      /* =====================================================
         CREATE ADDRESS
      ===================================================== */
      .addCase(createAddressThunk.fulfilled, (state) => {
        state.loading = false;
      })

      /* =====================================================
         UPDATE ADDRESS
      ===================================================== */
      .addCase(updateAddressThunk.fulfilled, (state) => {
        state.loading = false;
      })

      /* =====================================================
         DELETE ADDRESS
      ===================================================== */
      .addCase(deleteAddressThunk.fulfilled, (state, action) => {
        const deleteId = action.payload.id;
        state.addressList = state.addressList.filter(
          (item) => item.id !== deleteId
        );
      });
  },
});

export const { clearAddressState } = addressSlice.actions;
export default addressSlice.reducer;
