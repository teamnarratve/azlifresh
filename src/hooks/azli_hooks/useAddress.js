import { useDispatch, useSelector } from "react-redux";
import { notifyError, notifySuccess } from "@utils/toast";

import {
  fetchAddressList,
  selectAddressThunk,
  createAddressThunk,
  updateAddressThunk,
  deleteAddressThunk,
} from "@redux/slices/addressSlice";

export const useAddress = () => {
  const dispatch = useDispatch();

  const { addressList, defaultAddressId, loading, error } = useSelector(
    (state) => state.address
  );

  /* ============================================================
     ⭐ FETCH ADDRESS LIST
  ============================================================ */
  const handleFetchAddressList = async () => {
    const res = await dispatch(fetchAddressList());

    if (fetchAddressList.rejected.match(res)) {
      notifyError(res.payload || "Failed to fetch addresses");
      return false;
    }

    // If API marks "selected:1", set it automatically
    const data = res.payload?.data || res.payload;

    if (Array.isArray(data)) {
      const selected = data.find((a) => a.selected === 1);
      if (selected) {
        dispatch(selectAddressThunk({ address_id: selected.id }));
      }
    }

    return true;
  };

  /* ============================================================
     ⭐ SELECT ADDRESS
  ============================================================ */
  const handleSelectAddress = async (address_id) => {
    const res = await dispatch(selectAddressThunk({ address_id }));

    if (selectAddressThunk.rejected.match(res)) {
      notifyError("Failed to select address");
      return false;
    }

    notifySuccess("Address selected");
    return true;
  };

  /* ============================================================
     ⭐ CREATE ADDRESS
  ============================================================ */
  const handleCreateAddress = async (data) => {

    console.log("📩 Incoming Create Address Payload:", data);



    const res = await dispatch(createAddressThunk(data));


console.log("📨 createAddressThunk Result:", res);

    if (createAddressThunk.rejected.match(res)) {
      notifyError(res.payload || "Failed to create address");
      return false;
    }

    await handleFetchAddressList();
    notifySuccess("Address added");
    return true;
  };

  /* ============================================================
     ⭐ UPDATE ADDRESS
  ============================================================ */
  const handleUpdateAddress = async (data) => {
    const res = await dispatch(updateAddressThunk(data));

    if (updateAddressThunk.rejected.match(res)) {
      notifyError(res.payload || "Failed to update address");
      return false;
    }

    await handleFetchAddressList();
    notifySuccess("Address updated");
    return true;
  };

  /* ============================================================
     ⭐ DELETE ADDRESS
  ============================================================ */
  const handleDeleteAddress = async (id) => {
    const res = await dispatch(deleteAddressThunk(id));

    if (deleteAddressThunk.rejected.match(res)) {
      notifyError(res.payload || "Failed to delete address");
      return false;
    }

    await handleFetchAddressList();
    notifySuccess("Address deleted");
    return true;
  };

  return {
    addressList,
    defaultAddressId,
    loading,
    error,

    handleFetchAddressList,
    handleSelectAddress,
    handleCreateAddress,
    handleUpdateAddress,
    handleDeleteAddress,
  };
};
