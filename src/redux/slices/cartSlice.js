import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartService from "@services/azli_services/CartService";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// ⭐ NEW THUNK — Add item
export const addCartItemThunk = createAsyncThunk(
  "cart/addCartItem",
  async ({ product_id, product_option_id, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartService.addCartItem({
        product_id,
        product_option_id,
        quantity,
      });
      return response; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ---------------- existing code BELOW unchanged ----------------
export const fetchCartList = createAsyncThunk(
  "cart/fetchCartList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCartList();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartService.updateQuantity(id, quantity);
      return { id, quantity, cart: response.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  cartList: [],
  totalAmount: 0,
  addonTotalAmount: 0,
  count: 0,
  discount: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartList = [];
      state.totalAmount = 0;
      state.count = 0;
      state.addonTotalAmount = 0;
      state.discount = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch cart
      .addCase(fetchCartList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartList.fulfilled, (state, action) => {
        state.loading = false;
        const cartData = action.payload;

        state.cartList = cartData.items || [];
        state.count = cartData.items?.length || 0; 
        state.totalAmount = cartData.total_amount || 0;
        state.addonTotalAmount = cartData._total?.addon_total_amount || 0;
        state.discount = cartData.discount || 0;
      })
      .addCase(fetchCartList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ⭐ addCartItem success
      .addCase(addCartItemThunk.fulfilled, (state) => {
        state.loading = false;
      })

      // update qty
      .addCase(updateCartItemQuantity.fulfilled, (state) => {
        state.loading = false;
      });
  },
});


export const { clearCart } = cartSlice.actions;

/* ============================================================
   🔥 PERSIST CONFIG
============================================================ */
const cartPersistConfig = {
  key: "cart",
  storage,
  whitelist: ["cartList", "count", "totalAmount"], 
};

/* ============================================================
   🔥 EXPORT PERSISTED CART REDUCER
============================================================ */
export default persistReducer(cartPersistConfig, cartSlice.reducer);
