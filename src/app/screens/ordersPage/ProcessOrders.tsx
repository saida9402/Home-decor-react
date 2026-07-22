import React from "react";
import { Box, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import TabPanel  from "@mui/lab/TabPanel";
import moment from "moment";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { Messages, serverApi } from "../../../lib/config";
import { retrieveProcessOrders } from "./selector";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { useGlobals } from "../../hooks/useGlobals";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { T } from "../../../lib/types/common";

/** REDUX SLICE & SELECTOR **/
const processOrdersRetriever = createSelector(
  retrieveProcessOrders,
  (processOrders) => ({ processOrders })
);

interface ProcessOrdersProps {
  setValue: (input: string) => void;
}

export default function ProcessOrders(props: ProcessOrdersProps) {
    const {setValue} = props;
    const {authMember, setOrderBuilder} = useGlobals();
    const { processOrders } = useSelector(processOrdersRetriever);

    /** HANDLERS **/

    const finishOrderHandler = async (e: T) => {
    try {
        if(!authMember) throw new Error(Messages.error2);

        const orderId = e.target.value;
        const input: OrderUpdateInput = {
            orderId: orderId,
            orderStatus: OrderStatus.FINISH,
        };

        const confirmation = window.confirm(
        "Have you received your order??"
        );
        if(confirmation) {
        const order = new OrderService();
        await order.updateOrder(input);
        setValue("3");
        setOrderBuilder(new Date());
        }

    } catch (err) {
        console.log(err);
        sweetErrorHandling(err).then();

    }
    };

  return(
    <TabPanel value={"2"}>
        <Stack className={"order-list"}>
            {processOrders?.map((order: Order) => {
                return (
                    <Box key={order._id} className={"order-main-box is-process"}>
                        <Box className={"order-card-head"}>
                            <span className={"order-status-label"}>In progress</span>
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
                            <Box className={"order-actions"}>
                              <Button
                               variant="contained"
                               className={"verify-button"}
                               value={order._id}
                               onClick={finishOrderHandler}>
                                  Verify to Fulfil
                              </Button>
                            </Box>
                        </Box>
                    </Box>
                );
            })}

            {(!processOrders || processOrders.length === 0) && (
                <Box className={"order-empty"}>
                  <span className={"order-empty-title"}>Nothing in progress</span>
                  <p className={"order-empty-text"}>
                    Paid orders on their way to you will appear here.
                  </p>
                </Box>
            )}
        </Stack>
    </TabPanel>
  );
}
