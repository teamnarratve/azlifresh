//internal import

import CheckoutMobile from "@components/checkout/CheckoutForm";
import CheckoutForm from "@components/checkout/CheckoutForm";
import OrdersListing from "@components/Orders/OrderPage";
import { getShippingAddress } from "@services/CustomerServices";

export const metadata = {
  title: "Orders | Azli",
  description:
    "Complete your purchase securely and quickly with our checkout process.",
  keywords: ["checkout", "payment", "shipping", "order"],
  // You can also add more advanced metadata here
  openGraph: {
    title: "Orders | Azli",
    description:
      "Complete your purchase securely and quickly with our checkout process.",
    url: "https://kachabazar-store-nine.vercel.app/checkout",
    images: [
      {
        // url: "https://kachabazar-store-nine.vercel.app/og-image.jpg",
        width: 800,
        height: 600,
        alt: "Order Page",
      },
    ],
  },
};

const OrdersPage = async () => {
  return (
    <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
      <OrdersListing />
    </div>
  );
};

export default OrdersPage;
