// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./slices/authSlice";
import catReducer from "./slices/catSlice";
import productReducer from "./slices/productSlice";
import bannerReducer from "./slices/bannerSlice";
import cartReducer from "./slices/cartSlice"; // already persisted inside slice
import addressReducer from "./slices/addressSlice";
import deliveryReducer from "./slices/deliverySlice";
import checkoutReducer from "./slices/checkoutSlice";
import orderReducer from "./slices/orderSlice";
import specialAddonReducer from "./slices/specialAddonSlice";
import onlinePaymentReducer from "./slices/onlinePaymentSlice";

// 🔥 Persist Auth (optional but recommended)
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["isLoggedIn", "token", "user"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    category: catReducer,
    products: productReducer,
    banners: bannerReducer,
    cart: cartReducer,       // already persisted inside slice
    address: addressReducer,
    delivery: deliveryReducer,
        checkout: checkoutReducer,
                order: orderReducer,
    specialAddon: specialAddonReducer,
    onlinePayment: onlinePaymentReducer,


  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // IMPORTANT for redux-persist
    }),
});

export const persistor = persistStore(store);
