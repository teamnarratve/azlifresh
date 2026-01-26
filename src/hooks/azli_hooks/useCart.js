import { useDispatch, useSelector } from "react-redux";
import { notifyError } from "@utils/toast";
import {
  fetchCartList,
  clearCart,
  updateCartItemQuantity,
  addCartItemThunk,
} from "@redux/slices/cartSlice";
import { useRouter } from "next/navigation";

export const useCart = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { isLoggedIn } = useSelector((state) => state.auth); // 👈 NEW
  const {
    cartList,
    totalAmount,
    addonTotalAmount,
    discount,
    loading,
    count,
    error,
  } = useSelector((state) => state.cart);

  // ⭐ Add item to cart
  const handleAddItem = async ({
    product_id,
    product_option_id,
    quantity,
    redirect,
  }) => {
    if (!isLoggedIn) {
      notifyError("Please login to add items");
      router.push(
        `/auth/login?redirect=${encodeURIComponent(redirect || "/")}`
      );
      return false;
    }

    const res = await dispatch(
      addCartItemThunk({ product_id, product_option_id, quantity })
    );

    if (addCartItemThunk.rejected.match(res)) {
      notifyError(res.payload);
      return false;
    }

    await dispatch(fetchCartList());
    return true;
  };

  const handleFetchCartList = async () => {
    if (!isLoggedIn) {
      // do not hit API
      return true;
    }

    const res = await dispatch(fetchCartList());
    if (fetchCartList.rejected.match(res)) {
      return false;
    }
    return true;
  };

  const handleUpdateQuantity = async (id, quantity) => {
    if (!isLoggedIn) {
      notifyError("Login to update cart");
      return;
    }

    const res = await dispatch(updateCartItemQuantity({ id, quantity }));

    if (updateCartItemQuantity.rejected.match(res)) {
      notifyError("Update failed");
      return;
    }

    await dispatch(fetchCartList());
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return {
    cartList,
    totalAmount,
    addonTotalAmount,
    discount,
    count,
    loading,
    error,
    isLoggedIn, // 👈 expose login state

    handleFetchCartList,
    handleUpdateQuantity,
    handleAddItem,
    handleClearCart,
  };
};
