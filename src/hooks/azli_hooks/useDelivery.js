import { useDispatch, useSelector } from "react-redux";
import {
  fetchDeliveryTypes,
  fetchTimeSlots,
  setSelectedDeliveryType,
  setSelectedSlot,
} from "@redux/slices/deliverySlice";
import { notifyError, notifySuccess } from "@utils/toast";

export const useDelivery = () => {
  const dispatch = useDispatch();

  const {
    deliveryTypes,
    timeSlots,
    selectedDeliveryType,
    selectedSlot,
    loading,
    error,
  } = useSelector((state) => state.delivery);

  /* ===========================================================
     ⭐ FETCH DELIVERY TYPES
  ============================================================ */
  const handleFetchDeliveryTypes = async () => {
    const res = await dispatch(fetchDeliveryTypes());

    if (fetchDeliveryTypes.rejected.match(res)) {
      notifyError(res.payload || "Failed to fetch delivery methods");
      return false;
    }

    return true;
  };

  /* ===========================================================
     ⭐ FETCH TIME SLOTS
  ============================================================ */
  const handleFetchTimeSlots = async () => {
    const res = await dispatch(fetchTimeSlots());

    if (fetchTimeSlots.rejected.match(res)) {
      notifyError(res.payload || "Failed to fetch time slots");
      return false;
    }

    return true;
  };

  /* ===========================================================
     ⭐ SELECT DELIVERY TYPE
  ============================================================ */
  const handleSelectDeliveryType = (type) => {
    dispatch(setSelectedDeliveryType(type));
    notifySuccess(`Delivery method: ${type} selected`);
  };

  /* ===========================================================
     ⭐ SELECT TIME SLOT
  ============================================================ */
  const handleSelectTimeSlot = (slotObj) => {
    dispatch(setSelectedSlot(slotObj));
  };

  return {
    deliveryTypes,
    timeSlots,
    selectedDeliveryType,
    selectedSlot,
    loading,
    error,

    handleFetchDeliveryTypes,
    handleFetchTimeSlots,
    handleSelectDeliveryType,
    handleSelectTimeSlot,
  };
};
