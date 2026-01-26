import { useDispatch, useSelector } from "react-redux";
import { notifyError } from "@utils/toast";
import {
  fetchOnlinePaymentSettings,
  clearOnlinePaymentSettings,
} from "@redux/slices/onlinePaymentSlice";

export const useOnlinePayment = () => {
  const dispatch = useDispatch();

  const { settings, loading, error } = useSelector(
    (state) => state.onlinePayment
  );

  const handleFetchOnlinePaymentSettings = async () => {
    const res = await dispatch(fetchOnlinePaymentSettings());

    if (fetchOnlinePaymentSettings.rejected.match(res)) {
      notifyError(res.payload || "Failed to load payment settings");
      return false;
    }

    return true;
  };

  const handleClearOnlinePaymentSettings = () => {
    dispatch(clearOnlinePaymentSettings());
  };

  return {
    onlinePaymentSettings: settings,
    loading,
    error,
    handleFetchOnlinePaymentSettings,
    handleClearOnlinePaymentSettings,
  };
};
