//internal import

import CheckoutMobile from "@components/checkout/CheckoutForm";
import CheckoutForm from "@components/checkout/CheckoutForm";
import { getShippingAddress } from "@services/CustomerServices";

export const metadata = {
  title: "Checkout | Azli",
  description:
    "Complete your purchase securely and quickly with our checkout process.",
  keywords: ["checkout", "payment", "shipping", "order"],
  // You can also add more advanced metadata here
  openGraph: {
    title: "Checkout",
    description:
      "Complete your purchase securely and quickly with our checkout process.",
    url: "",
    images: [
      {
        // url: "https://kachabazar-store-nine.vercel.app/og-image.jpg",
        width: 800,
        height: 600,
        alt: "Checkout Page",
      },
    ],
  },
};

const Checkout = async () => {
  return (
    <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
      <CheckoutForm />
    </div>
  );
};

export default Checkout;
