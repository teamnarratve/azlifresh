"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { CartProvider } from "react-use-cart";
import { ToastContainer } from "react-toastify";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { SessionProvider } from "next-auth/react";

// internal imports
import { UserProvider } from "@context/UserContext";
import { SidebarProvider } from "@context/SidebarContext";
import { LanguageProvider } from "@context/LanguageContext";
import { store, persistor } from "@redux/store";  // <-- IMPORT persist store

let stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const Providers = ({ children, storeSetting }) => {
  stripePromise = loadStripe(
    storeSetting?.stripe_key || process.env.NEXT_PUBLIC_STRIPE_KEY
  );

  return (
    <>
      <ToastContainer />
      <SessionProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <LanguageProvider>
              <SidebarProvider>
                <UserProvider>
                  <Elements stripe={stripePromise}>
                    <CartProvider>{children}</CartProvider>
                  </Elements>
                </UserProvider>
              </SidebarProvider>
            </LanguageProvider>
          </PersistGate>
        </Provider>
      </SessionProvider>
    </>
  );
};

export default Providers;
