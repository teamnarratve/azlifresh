"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useOrder } from "@hooks/azli_hooks/useOrder";

const OrdersPage = () => {
  const [tab, setTab] = useState("ongoing");
  const { formattedOrders, loading, handleFetchOrderList } = useOrder();

  useEffect(() => {
    handleFetchOrderList();
  }, []);


  const listToShow =
    tab === "ongoing" ? formattedOrders.ongoing : formattedOrders.completed;




  return (
    <div className="min-h-screen bg-[#F6F7FB] w-full">
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 pb-10">

        <header className="pt-6 pb-2 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
            My Orders
          </h1>
        </header>

        <div className="flex gap-6 border-b border-gray-200 mt-3">
          <button
            onClick={() => setTab("ongoing")}
            className={`pb-2 text-sm font-semibold ${
              tab === "ongoing"
                ? "text-[#26A541] border-b-2 border-[#26A541]"
                : "text-gray-500"
            }`}
          >
            Ongoing Orders
          </button>
          <button
            onClick={() => setTab("completed")}
            className={`pb-2 text-sm font-semibold ${
              tab === "completed"
                ? "text-[#26A541] border-b-2 border-[#26A541]"
                : "text-gray-500"
            }`}
          >
            Completed Orders
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {listToShow.map((order) => (
            <div
              key={order.id}
              className="rounded-xl bg-white p-4 shadow-sm border hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {order.images.slice(0, 5).map((img, index) => (
                    <div
                      key={index}
                      className="w-10 h-10 rounded-md overflow-hidden bg-gray-100"
                    >
                      <Image
                        src={img}
                        alt="product"
                        width={40}
                        height={40}
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-1 font-semibold text-[16px] text-gray-800">
                  ₹ {order.price}
                  <span className="text-[18px] text-gray-500">&#8250;</span>
                </div>
              </div>

               {/* STATUS + DATE */}
              <div className="mt-3">
                <div className="flex items-center gap-2">
                  <p className="text-[15px] font-semibold text-gray-800">{order.status}</p>
                  <Image
                    src="/order/success.png"
                    width={18}
                    height={18}
                    alt="status"
                    unoptimized
                  />
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  Order Placed at {order.date}
                </p>
              </div>
            </div>
          ))}
        </div>

        {listToShow.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 mt-3">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
