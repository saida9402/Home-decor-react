import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import OrderService from "../services/OrderService";
import { Order, OrderInquiry, OrderStatus } from "../../lib/types/order";

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  fetchOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);
const orderService = new OrderService();

/**
 * The statuses order history is built from.
 *
 * This used to request OrderStatus.PENDING, which exists only in the
 * frontend enum — the backend enum and the Order schema allow PAUSE /
 * PROCESS / FINISH / DELETE with a PAUSE default, so no document could
 * ever match and the endpoint returned 200 with an empty array, silently.
 * DELETE is excluded deliberately: cancelled orders are not history.
 *
 * Each request keeps the shape GET /order/all already accepts —
 * page, limit and orderStatus. Only which statuses are asked for changed.
 */
const HISTORY_STATUSES: OrderStatus[] = [
  OrderStatus.PAUSE,
  OrderStatus.PROCESS,
  OrderStatus.FINISH,
];

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const batches = await Promise.all(
        HISTORY_STATUSES.map((orderStatus) => {
          const inquiry: OrderInquiry = {
            page: 1,
            limit: 10,
            orderStatus: orderStatus,
          };
          return orderService
            .getMyOrders(inquiry)
            .catch(() => [] as Order[]);
        })
      );

      // newest first, across all three statuses
      const merged = ([] as Order[])
        .concat(...batches)
        .sort(
          (a: Order, b: Order) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      setOrders(merged);
    } catch (err) {
      console.error("ORDER FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <OrderContext.Provider value={{ orders, loading, fetchOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used inside OrderProvider");
  }
  return context;
};
