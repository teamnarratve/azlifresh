import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orderService from "@services/azli_services/OrderService";

// ================== API THUNK ==================
export const fetchOrderList = createAsyncThunk(
  "order/fetchOrderList",
  async (_, { rejectWithValue }) => {
    try {
      const res = await orderService.getOrderList();
      return res.data; // array from API
    } catch (error) {
      return rejectWithValue(error?.message || "Something went wrong");
    }
  }
);

// ================== STATUS LOGIC ==================
const getOrderStatus = (o) => {
  if (o?.deliveredAt) return "Delivered";
  if (o?.cancelledAt) return "Cancelled";
  if (o?.returnedAt) return "Returned";
  if (o?.rejectedAt) return "Rejected";
  if(o?.shippedAt) return "Shipped";
  if(o?.readyToShipAt) return "Ready to Ship";  
    if(o?.packingAt) return "Packed";  
      if(o?.reviewAt) return "Processing"; 
            if(o?.workingAt) return "Processing";  
 


  return "Pending";
};

// ================== FORMATTER ==================
const formatOrders = (orders = []) =>
  orders.map((o) => ({
    id: o.id,
    status: getOrderStatus(o),
    price: o?.order_payment_details_data?.total_amount || o?.price || 0,
    date: o.createdAt,

    // ---------- Only 1 image per product ----------
    images:
      o.order_product_data
        ?.map((p) => p?.imgs?.[0]?.img)
        ?.filter(Boolean) || [],
  }));

// ================== REDUX SLICE ==================
const initialState = {
  orderList: [],
  formattedOrders: { ongoing: [], completed: [] },
  count: 0,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderList = [];
      state.formattedOrders = { ongoing: [], completed: [] };
      state.count = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderList.fulfilled, (state, action) => {
        state.loading = false;
        const rawOrders = action.payload || [];
        const formatted = formatOrders(rawOrders);

        state.orderList = rawOrders;
        state.count = rawOrders.length;

        state.formattedOrders = {
          ongoing: formatted.filter((o) => o.status === "Pending"),
          completed: formatted.filter((o) => o.status !== "Pending"),
        };
      })
      .addCase(fetchOrderList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
