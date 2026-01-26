import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { categoryService } from "@services/azli_services/CategoryService"; // adjust the import path
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

// Initial state
const initialState = {
  loading: false,
  categories: [],
  error: null,
  message: null,
};

// ✅ Thunk to fetch categories
export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (page = 1, { rejectWithValue }) => {
    try {
      const res = await categoryService.getCategoryList(page);
      // console.log("Fetched categories response:", res);
      if (res.error)
        throw new Error(res.message || "Failed to fetch categories");
      return res; // full API response
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ Slice
const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    resetCategories: (state) => {
      state.categories = [];
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data || []; // map your API’s data field
        // console.log("Categories in state after fetch:", action.payload.data);
        state.message =
          action.payload.message || "Categories loaded successfully";
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch categories";
      });
  },
});



export const { resetCategories } = categorySlice.actions;

/* ============================================================
   🔥 PERSIST CONFIG
============================================================ */
const catPersistConfig = {
  key: "category",
  storage,
  whitelist: ["categories"], 
};

/* ============================================================
   🔥 EXPORT PERSISTED CART REDUCER
============================================================ */
export default persistReducer(catPersistConfig, categorySlice.reducer);
