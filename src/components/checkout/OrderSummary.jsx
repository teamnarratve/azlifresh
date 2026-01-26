"use client";

const OrderSummary = ({
  subtotal = 0,
  discount = 0,
  deliveryFee = 0,
  tax = 0,
  total = 0,
}) => {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <h3 className="mb-3 text-[16px] font-semibold text-gray-900">
        Order Summary
      </h3>

      <div className="space-y-3 text-[14px]">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>₹ {subtotal}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Discount</span>
          <span>₹ {discount}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Delivery Fee</span>
          <span className="text-[#26A541]">
            {deliveryFee === 0 ? "Free" : `₹ ${deliveryFee}`}
          </span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Tax</span>
          <span>₹ {tax}</span>
        </div>

        <div className="mt-2 flex justify-between border-t pt-3 text-[15px] font-semibold text-gray-900">
          <span>Total</span>
          <span>₹ {total}</span>
        </div>
      </div>
    </section>
  );
};

export default OrderSummary;
