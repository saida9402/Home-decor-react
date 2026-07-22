import { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import moment from "moment";

import { useOrders } from "../../context/OrderProvider";
import { Order, OrderItem } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";

/** one flattened history line: an order item joined to its product */
interface HistoryRow {
  key: string;
  name: string;
  image: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  status: string;
  date: string;
}

export default function OrderHistory() {
  const { orders, loading } = useOrders();
  const [searchText, setSearchText] = useState<string>("");
  const [query, setQuery] = useState<string>("");

  /** debounce ~250ms so filtering does not run on every keystroke */
  useEffect(() => {
    const timer = setTimeout(() => setQuery(searchText), 250);
    return () => clearTimeout(timer);
  }, [searchText]);

  /** flatten orders -> rows once, not on every keystroke */
  const rows: HistoryRow[] = useMemo(() => {
    return orders.flatMap((order: Order) =>
      (order.orderItems || []).map((item: OrderItem) => {
        // productData can miss an entry if the product was deleted
        const product: Product | undefined = (order.productData || []).find(
          (ele: Product) => ele._id === item.productId
        );
        return {
          key: item._id,
          name: product?.productName ?? "Unavailable product",
          image: product?.productImages?.[0] ?? null,
          quantity: item.itemQuantity,
          unitPrice: item.itemPrice,
          lineTotal: item.itemQuantity * item.itemPrice,
          status: order.orderStatus,
          // the backend sends createdAt; Order declares it correctly
          date: moment(order.createdAt).format("D MMM YYYY"),
        };
      })
    );
  }, [orders]);

  /** client-side filter by product name — GET /order/all accepts only
      page, limit and orderStatus, so no request is involved here */
  const visible: HistoryRow[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => row.name.toLowerCase().includes(q));
  }, [rows, query]);

  return (
    <Box className={"order-history"}>
      <Box className={"history-head"}>
        <span className={"history-title"}>Order history</span>
        <span className={"history-count"}>
          {rows.length} {rows.length === 1 ? "item" : "items"}
        </span>
      </Box>

      <Box className={"history-search"}>
        <SearchOutlinedIcon className={"history-search-icon"} />
        <input
          type={"search"}
          className={"history-search-input"}
          placeholder={"Search by product name"}
          aria-label={"Search order history by product name"}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Box>

      {loading ? (
        <Box className={"history-state"}>
          <span className={"history-state-title"}>Loading your orders</span>
          <p className={"history-state-text"}>One moment.</p>
        </Box>
      ) : rows.length === 0 ? (
        <Box className={"history-state"}>
          <span className={"history-state-title"}>No orders yet</span>
          <p className={"history-state-text"}>
            Pieces you order will be listed here.
          </p>
        </Box>
      ) : visible.length === 0 ? (
        <Box className={"history-state"}>
          <span className={"history-state-title"}>Nothing matches</span>
          <p className={"history-state-text"}>
            No product name contains “{query.trim()}”.
          </p>
          <button
            type={"button"}
            className={"history-clear"}
            onClick={() => setSearchText("")}
          >
            Clear search
          </button>
        </Box>
      ) : (
        <Box className={"history-scroll"}>
          {visible.map((row) => (
            <Box key={row.key} className={"history-row"}>
              <div className={"history-thumb"}>
                {row.image ? (
                  <img src={`${serverApi}/${row.image}`} alt="" />
                ) : null}
              </div>

              <div className={"history-main"}>
                <span className={"history-name"}>{row.name}</span>
                <span className={"history-meta"}>
                  {row.quantity} × ${row.unitPrice}
                </span>
              </div>

              <div className={"history-side"}>
                <span className={"history-total"}>${row.lineTotal}</span>
                <span className={"history-meta"}>
                  {row.date}
                  <em className={`history-status is-${row.status}`}>
                    {row.status}
                  </em>
                </span>
              </div>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
