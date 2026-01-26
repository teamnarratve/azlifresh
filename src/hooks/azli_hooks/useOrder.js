import { useDispatch, useSelector } from "react-redux";
import { fetchOrderList, clearOrder } from "@redux/slices/orderSlice";

export const useOrder = () => {
  const dispatch = useDispatch();

  const { formattedOrders, orderList, loading, error, count } = useSelector(
    (state) => state.order
  );

  const handleFetchOrderList = () => dispatch(fetchOrderList());
  const handleClearOrder = () => dispatch(clearOrder());

  return {
    formattedOrders,
    orderList,
    loading,
    error,
    count,
    handleFetchOrderList,
    handleClearOrder,
  };
};
