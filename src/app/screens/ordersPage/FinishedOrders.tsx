import React from "react";
import { Box, Stack } from "@mui/material";
import TabPanel  from "@mui/lab/TabPanel";
import moment from "moment";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { serverApi } from "../../../lib/config";
import { retrieveFinishedOrders } from "./selector";
import { Order, OrderItem } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";

/** REDUX SLICE & SELECTOR **/
const finishedOrdersRetriever = createSelector(
  retrieveFinishedOrders,
  (finishedOrders) => ({ finishedOrders })
);


export default function FinishedOrders() {
  const { finishedOrders } = useSelector(finishedOrdersRetriever);
  return(
    <TabPanel value={"3"}>
        <Stack className={"order-list"}>
            {finishedOrders?.map((order: Order) => {
                return (
                    <Box key={order._id} className={"order-main-box is-finish"}>
                        <Box className={"order-card-head"}>
                            <span className={"order-status-label"}>Fulfilled</span>
                            <span className={"order-date"}>
                              {moment(order.createdAt).format("D MMM YYYY")}
                            </span>
                        </Box>

                        <Box className={"order-box-scroll"}>
                            {order?.orderItems?.map((item: OrderItem) => {
                              const product: Product | undefined =
                                order.productData?.find(
                                  (ele: Product) => item.productId === ele._id
                                );
                              if (!product) return null;
                              const imagePath = product.productImages?.[0]
                                ? `${serverApi}/${product.productImages[0]}`
                                : undefined;
                                return (
                                    <Box key={item._id} className={"order-name-price"}>
                                        <div className={"order-dish-img"}>
                                          {imagePath ? (
                                            <img src={imagePath} alt="" />
                                          ) : null}
                                        </div>
                                        <p className={"title-dish"}>{product.productName}</p>
                                        <Box className={"price-box"}>
                                            <span className={"unit"}>${item.itemPrice}</span>
                                            <span className={"times"}>&times;</span>
                                            <span className={"qty"}>{item.itemQuantity}</span>
                                            <span className={"line-total"}>
                                              ${item.itemQuantity * item.itemPrice}
                                            </span>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>

                        <Box className={"total-price-box"}>
                            <Box className={"box-total"}>
                                <span className={"t-label"}>Subtotal</span>
                                <span className={"t-value"}>
                                  ${order.orderTotal - order.orderDelivery}
                                </span>
                                <span className={"t-label"}>Delivery</span>
                                <span className={"t-value"}>${order.orderDelivery}</span>
                                <span className={"t-label is-strong"}>Total</span>
                                <span className={"t-value is-strong"}>${order.orderTotal}</span>
                            </Box>
                        </Box>
                    </Box>
                );
            })}

            {(!finishedOrders || finishedOrders.length === 0) && (
              <Box className={"order-empty"}>
                <span className={"order-empty-title"}>No fulfilled orders</span>
                <p className={"order-empty-text"}>
                  Completed orders are kept here for your records.
                </p>
              </Box>
            )}
        </Stack>
    </TabPanel>
  );
}
