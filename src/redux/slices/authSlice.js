// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "@services/azli_services/AuthService";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

const initialState = {
  token:
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null,
  isLoggedIn:
    typeof window !== "undefined" ? !!localStorage.getItem("authToken") : false,

  loading: false,
  // isLoggedIn: false,
  otpKey: null, // ✅ add this

  phone: null,
  user: null,
  // token: null,
  step: "phone",
  error: null,
  profile: null,
};

// Send OTP
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (phone, { rejectWithValue }) => {
    try {
      const res = await authService.sendOtp(phone);
      if (res.error) throw new Error(res.message || "Failed to send OTP");
      return { phone, otpKey: res.data.otpKey }; // ✅ capture otpKey
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Verify OTP
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ otpKey, otp }, { rejectWithValue }) => {
    try {
      const res = await authService.verifyOtp(otpKey, otp);

      if (res.error) throw new Error(res.message || "Invalid OTP");

      // ✅ return data (which contains the api-key)
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ New thunk for signup
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (form, { rejectWithValue }) => {
    try {
      const res = await authService.register(form);
      if (res.error) throw new Error(res.message || "Registration failed");
      return { phone: form.phone, otpKey: res.data?.otpKey || null };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      state.phone = null;
      state.step = "phone";
      state.profile = null;
    },
    resetStep: (state) => {
      state.step = "phone";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send OTP
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.phone = action.payload.phone;
        state.otpKey = action.payload.otpKey; // ✅ store otpKey

        state.step = "otp";
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action?.payload?.v;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;

        // ✅ store the token
        state.token = action.payload["api-key"]; // note the key name
        state.user = action.payload.user || null; // optional if your backend sends user data

        // Optionally, clear the otpKey since it's now used
        state.otpKey = null;
        state.step = "phone";
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.phone = action.payload.phone;
        state.otpKey = action.payload.otpKey;
        state.step = "otp"; // move to OTP verify screen
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});



export const { logout, resetStep } = authSlice.actions;

/* ============================================================
   🔥 PERSIST CONFIG
============================================================ */
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["profile", "token", "isLoggedIn"],
};

/* ============================================================
   🔥 EXPORT PERSISTED CART REDUCER
============================================================ */
export default persistReducer(authPersistConfig, authSlice.reducer);

