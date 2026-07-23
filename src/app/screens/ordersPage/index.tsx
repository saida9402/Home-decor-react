import { useState, SyntheticEvent, useEffect } from "react";
import { Box, Container, Input, Stack } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import FinishedOrders from "./FinishedOrders";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setPausedOrders, setProcessOrders, setFinishedOrders } from "./slice";
import { Order, OrderInquiry } from "../../../lib/types/order";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobals";
import "../../../css/order.css";
import { useHistory } from "react-router-dom";
import { serverApi } from "../../../lib/config";
import { MemberType } from "../../../lib/enums/member.enum";
import {
  MemberAvatar,
  SellerGlyph,
  UserBadgeGlyph,
} from "../../components/icons/UserIcons";

/** REDUX SLICE & SELECTOR **/
const actionDispatch = (dispatch: Dispatch) => ({
  setPausedOrders: (data: Order[]) => dispatch(setPausedOrders(data)),
  setProcessOrders: (data: Order[]) => dispatch(setProcessOrders(data)),
  setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data)),
});

export default function OrdersPage() {
  const { setPausedOrders, setProcessOrders, setFinishedOrders} =
    actionDispatch(useDispatch());
  const { orderBuilder, authMember} = useGlobals();  
  const history = useHistory();
  const [value, setValue] = useState("1");
  const [ orderInquiry, setOrderInquiry] = useState<OrderInquiry>({
    page: 1,
    limit: 5,
    orderStatus: OrderStatus.PAUSE,
  });

  useEffect(() => {
    const order = new OrderService();

    order
      .getMyOrders({...orderInquiry, orderStatus: OrderStatus.PAUSE})
      .then((data) => setPausedOrders(data))
      .catch((err) => console.log(err));
    
    order
      .getMyOrders({...orderInquiry, orderStatus: OrderStatus.PROCESS})
      .then((data) => setProcessOrders(data))
      .catch((err) => console.log(err));
      
    order
      .getMyOrders({...orderInquiry, orderStatus: OrderStatus.FINISH})
      .then((data) => setFinishedOrders(data))
      .catch((err) => console.log(err));  
  }, [orderInquiry, orderBuilder]);



  /** HANDLERS **/
  const handleChange = (e: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  if(!authMember) history.push("/");
  return (
    <div className={"order-page"}>
      <Container className="order-container">
        <Stack className={"order-left"}>
          <Box className={"order-page-title"}>Your orders</Box>
          <TabContext value={value}>
            <Box className={"order-nav-frame"}>
              <Box>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  className={"table-list"}
                >
                  <Tab label="PAUSED ORDERS" value={"1"} />
                  <Tab label="PROCESS ORDERS" value={"2"} />
                  <Tab label="FINISHED ORDERS" value={"3"} />
                </Tabs>
              </Box>
              </Box>
              <Stack className={"order-main-content"}>
                <PausedOrders setValue={setValue}/>
                <ProcessOrders setValue={setValue} />
                <FinishedOrders /> 
              </Stack>
          </TabContext>
        </Stack>

        <Stack className={"order-right"}>
          <Box className={"order-info-box"}>
            <Box className={"member-box"}>
              <div className={"order-user-image"}>
                <MemberAvatar
                  src={
                    authMember?.memberImage
                       ? `${serverApi}/${authMember.memberImage}`
                       : null
                      }
                  className={"order-user-avatar"}
                  glyphSize={34}
                />
                <div className={"order-user-icon-box"}>
                  {authMember?.memberType === MemberType.SELLER ? (
                    <SellerGlyph size={15} />
                  ) : (
                    <UserBadgeGlyph size={15} />
                  )}
                </div>
              </div>
              <span className={"order-user-name"}>
                {authMember?.memberNick}
              </span>
              <span className={"order-user-prof"}>
                {authMember?.memberType}
              </span>
            </Box>
            <Box className={"liner"}></Box>
            <Box className={"order-user-address"}>
              <div style={{ display: "flex"}}>
                <LocationOnOutlinedIcon />
              </div>
              <div className={"spec-address-text"}>
               {authMember?.memberAddress
                   ? authMember.memberAddress
                   : "No address on file"}
              </div>
            </Box>
          </Box>

          <Box className={"order-info-box"}>
            <Box className={"pay-head"}>
              <span className={"pay-title"}>Payment</span>
            </Box>
            <Box className={"member-box"}>
                <Box className={"card-input"}>
                  <Input
                    inputProps={{ pattern: "[0-9 ]*" }}
                    placeholder="Card number"
                    size="medium"
                    style={{ width: '100%' }}
                  />
                </Box>
                <Box className={"card-date-box"}>
                  <Box className={"card-half-input"}>
                    <Input placeholder="MM/YY" size="small" />
                  </Box>
                  <Box className={"card-half-input"}>
                    <Input placeholder="CVV" size="small" />
                  </Box>
                </Box>
                <Box className={"card-input"}>
                  <Input
                    placeholder="Name on card"
                    size="medium"
                    style={{ width: '100%' }}
                  />
                </Box>
            </Box>
            {/* the form is presentational only — nothing is captured,
                validated or transmitted, and no endpoint exists yet */}
            <p className={"pay-note"}>
              Card payment is not enabled yet. These fields are inactive.
            </p>
            <Box className={"cards-box"} >
              <Box>
                <img src={"/icons/western-card.svg"} alt="" />
              </Box>
              <Box>
                <img src={"/icons/paypal-card.svg"} alt="" />
              </Box>
              <Box>
                <img src={"/icons/visa-card.svg"} alt="" />
              </Box>
              <Box>
                <img src={"/icons/master-card.svg"} alt="" />
              </Box>
            </Box>
          </Box>

        </Stack>
      </Container>
    </div>
  );
}