import { Box, CircularProgress, Typography } from "@mui/material";
import moment from "moment";
import { useOrders } from "../../context/OrderProvider";

export default function OrderHistory() {
  const { orders, loading } = useOrders();

  if (loading) return <CircularProgress />;

  if (!orders.length) {
    return <Typography>No orders yet</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Order History
      </Typography>

      {orders.map((order: any) => (
        <Box
          key={order._id}
          sx={{
            border: "1px solid #ddd",
            padding: "12px",
            marginBottom: "12px",
            borderRadius: "6px",
          }}
        >
          <Typography>Total: ${order.orderTotal}</Typography>
          <Typography>Status: {order.orderStatus}</Typography>
          <Typography>
            Date: {moment(order.createdAt).format("YYYY-MM-DD")}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
