"use client";

export default function TimeSlotModal({
  open,
  onClose,
  todaySlots = [],
  tomorrowSlots = [],
  selectedSlot,
  onSelectSlot,
  onConfirm,
}) {
  if (!open) return null;

  const isSelected = (slot, day) =>
    selectedSlot &&
    selectedSlot.id === slot.id &&
    selectedSlot.day === day;

  const renderSlotButton = (slot, day) => {
    const disabled = slot.enabled === 0;
    const slotWithDay = { ...slot, day };

    return (
      <button
        key={`${day}-${slot.id}`}
        disabled={disabled}
        className={`p-3 text-sm rounded-xl border transition 
          ${disabled
            ? "border-gray-300 text-gray-400 bg-gray-100 opacity-60 cursor-not-allowed"
            : isSelected(slot, day)
            ? "bg-green-600 text-white border-green-600"
            : "border-gray-300 text-gray-700"
          }
        `}
        onClick={() => !disabled && onSelectSlot(slotWithDay)}
      >
        {slot.timing}
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className="w-full max-w-md bg-white rounded-t-3xl p-6 animate-slide-up">

        <h2 className="text-xl font-semibold mb-3">Select Your Delivery Time Slot</h2>
        <p className="text-sm text-gray-500 mb-4">
          Choose a convenient time slot for your delivery.
        </p>

        {/* TODAY */}
        <p className="font-semibold mb-2">Today's Slots:</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {todaySlots.map((slot) => renderSlotButton(slot, "today"))}
        </div>

        {/* TOMORROW */}
        <p className="font-semibold mb-2">Tomorrow's Slots:</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {tomorrowSlots.map((slot) => renderSlotButton(slot, "tomorrow"))}
        </div>

        <button
          className={`w-full py-3 rounded-xl font-semibold ${
            selectedSlot
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          onClick={() => onConfirm(selectedSlot)}
          disabled={!selectedSlot}
        >
          Confirm Slot
        </button>

        <div
          className="mt-4 w-12 h-1.5 bg-gray-300 rounded-full mx-auto cursor-pointer"
          onClick={onClose}
        ></div>
      </div>
    </div>
  );
}
