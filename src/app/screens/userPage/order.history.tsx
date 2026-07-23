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
  year: string;
}

export default function OrderHistory() {
  const { orders, loading } = useOrders();
  const [searchText, setSearchText] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  // "all" = no year filtering; otherwise a 4-digit year string
  const [year, setYear] = useState<string>("all");

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
          year: moment(order.createdAt).format("YYYY"),
        };
      })
    );
  }, [orders]);

  /** the years actually present in the order data, newest first — the
      dropdown options are derived from this, never hardcoded */
  const years: string[] = useMemo(() => {
    const set = new Set(rows.map((row) => row.year));
    return Array.from(set).sort((a, b) => Number(b) - Number(a));
  }, [rows]);

  /** client-side filter — name search AND year combine (AND logic).
      GET /order/all accepts only page, limit and orderStatus, so no
      request is involved here. */
  const visible: HistoryRow[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesText = !q || row.name.toLowerCase().includes(q);
      const matchesYear = year === "all" || row.year === year;
      return matchesText && matchesYear;
    });
  }, [rows, query, year]);

  return (
    /* The head sits outside the card so it reads at the same section rung as
       "Member details" — order history leads this page, so it cannot be the
       only block whose heading is card-scale. */
    <Box className={"order-history-section"}>
      <Box className={"history-head"}>
        <span className={"history-title"}>Order history</span>
        <span className={"history-count"}>
          {rows.length} {rows.length === 1 ? "item" : "items"}
        </span>
      </Box>

      <Box className={"order-history"}>
        <Box className={"history-filters"}>
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

          <select
            className={"history-year"}
            aria-label={"Filter order history by year"}
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value={"all"}>All years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
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
            <span className={"history-state-title"}>No orders found</span>
            <p className={"history-state-text"}>
              Nothing matches the current search and year.
            </p>
            <button
              type={"button"}
              className={"history-clear"}
              onClick={() => {
                setSearchText("");
                setYear("all");
              }}
            >
              Clear filters
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
    </Box>
  );
}
