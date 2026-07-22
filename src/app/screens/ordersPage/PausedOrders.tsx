import React from "react";
import { Box, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import TabPanel  from "@mui/lab/TabPanel";
import moment from "moment";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { Messages, serverApi } from "../../../lib/config";
import { retrievePausedOrders } from "./selector";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { T } from "../../../lib/types/common";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";

/** REDUX SLICE & SELECTOR **/
const pausedOrdersRetriever = createSelector(
  retrievePausedOrders,
  (pausedOrders) => ({ pausedOrders })
);

interface PausedOrdersProps {
  setValue: (input: string) => void;
}

export default function PausedOrders(props: PausedOrdersProps) {
  const {setValue} = props;
  const {authMember, setOrderBuilder} = useGlobals();
  const { pausedOrders } = useSelector(pausedOrdersRetriever);

/** HANDLERS **/

  const deleteOrderHandler = async (e: T) => {
    try {
      if(!authMember) throw new Error(Messages.error2);
      const orderId = e.target.value;
      const input: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.DELETE,
      };

      const confirmation = window.confirm("Do you want to delete thr order?");
      if(confirmation) {
        const order = new OrderService();
        await order.updateOrder(input);
        setOrderBuilder(new Date());
      }

    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();

    }
  };

  const processOrderHandler = async (e: T) => {
    try {
      if(!authMember) throw new Error(Messages.error2);
      //PAYMENT PROCESS

      const orderId = e.target.value;
      const input: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.PROCESS,
      };

      const confirmation = window.confirm(
        "Do you want to proceed with payment?"
      );
      if(confirmation) {
        const order = new OrderService();
        await order.updateOrder(input);
        setValue("2");
        setOrderBuilder(new Date());
      }

    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();

    }
  };



  return(
    <TabPanel value={"1"}>
        <Stack className={"order-list"}>
            {pausedOrders?.map((order: Order) => {
                return (
                    <Box key={order._id} className={"order-main-box is-pause"}>
                        <Box className={"order-card-head"}>
                            <span className={"order-status-label"}>Paused</span>
                            <span className={"order-date"}>
                              {moment(order.createdAt).format("D MMM YYYY")}
                            </span>
                        </Box>

                        <Box className={"order-box-scroll"}>
                            {order?.orderItems?.map((item: OrderItem) => {
                              // productData can be missing an entry if the
                              // product was deleted; skip rather than throw
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
                            <Box className={"order-actions"}>
                              <Button
                                value={order._id}
                                variant="contained"
                                color="secondary"
                                className={"cancel-button"}
                                onClick={deleteOrderHandler}
                              >
                                  Cancel
                              </Button>
                              <Button
                               variant="contained"
                               className={"pay-button"}
                               value={order._id}
                               onClick={processOrderHandler}
                               >
                                  Payment
                              </Button>
                            </Box>
                        </Box>
                    </Box>
                );
            })}

            {(!pausedOrders || pausedOrders.length === 0) && (
              <Box className={"order-empty"}>
                <span className={"order-empty-title"}>No paused orders</span>
                <p className={"order-empty-text"}>
                  Orders waiting for payment will appear here.
                </p>
              </Box>
            )}
        </Stack>
    </TabPanel>
  );
}
