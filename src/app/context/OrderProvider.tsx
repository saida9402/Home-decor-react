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

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const inquiry: OrderInquiry = {
        page: 1,
        limit: 10,
        orderStatus: OrderStatus.PENDING,
      };

      const data = await orderService.getMyOrders(inquiry);
      setOrders(data);
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
