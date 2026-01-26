import { useDispatch, useSelector } from "react-redux";
import { notifyError } from "@utils/toast";
import {
  fetchSpecialAddonProducts,
  clearSpecialAddonProducts,
} from "@redux/slices/specialAddonSlice";

export const useSpecialAddonProducts = () => {
  const dispatch = useDispatch();

  const { items, loading, error } = useSelector(
    (state) => state.specialAddon
  );

  const handleFetchSpecialAddonProducts = async () => {
    const res = await dispatch(fetchSpecialAddonProducts());

    if (fetchSpecialAddonProducts.rejected.match(res)) {
      notifyError(res.payload || "Failed to load addon products");
      return false;
    }

    return true;
  };

  const handleClearSpecialAddonProducts = () => {
    dispatch(clearSpecialAddonProducts());
  };

  return {
    addonProducts: items,
    loading,
    error,
    handleFetchSpecialAddonProducts,
    handleClearSpecialAddonProducts,
  };
};
