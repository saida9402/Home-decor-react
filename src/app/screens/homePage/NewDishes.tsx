import { Box, Container, Stack } from "@mui/material";
import  AspectRatio  from "@mui/joy/AspectRatio";
import Card from '@mui/joy/Card';
import CardOverflow  from "@mui/joy/CardOverflow";
import Typography from '@mui/joy/Typography';
import { CssVarsProvider } from "@mui/joy/styles";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Divider  from "../../components/divider";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useHistory } from "react-router-dom";
import { retrieveNewDishes } from "./selector";
import { Product } from "../../../lib/types/product";
import { CartItem } from "../../../lib/types/search";
import { serverApi } from "../../../lib/config";

/** REDUX SLICE & SELECTOR **/
const newDishesRetriever = createSelector(
    retrieveNewDishes,
    (newDishes) => ({ newDishes })
);

interface NewDishesProps {
    onAdd: (item: CartItem) => void;
}

export default function NewDishes(props: NewDishesProps) {
    const { onAdd } = props;
    const  { newDishes } = useSelector(newDishesRetriever);
    const history = useHistory();

    /** HANDLERS **/
    const choseDishHandler = (id: string) => {
        history.push(`/products/${id}`);
    };

    console.log("newDishes:", newDishes);
    return (
        <div className="new-products-frame">
            <Container>
                <Stack className={"main"}>
                    <Box className="category-title">New Arrivals</Box>
                    <Stack className="cards-frame">
                       <CssVarsProvider>
                        {newDishes.length !== 0 ? ( 
                            newDishes.map((product: Product ) => {
                            const imagePath = `${serverApi}/${product.productImages[0]}`;
                            const sizeVolume =
                            product.productSize || product.productVolume || "";
                            return (
                                <Card
                                  key={product._id}
                                  variant="outlined"
                                  className={"card"}
                                  onClick={() => choseDishHandler(product._id)}
                                >
                                    <CardOverflow className="card-media">
                                        <div className="product-sale">{sizeVolume}</div>
                                        {/* plain <button>: a Material Button here
                                            would resolve its styles against the Joy
                                            theme supplied by the CssVarsProvider
                                            above and throw on palette.grey[300] */}
                                        <button
                                          type="button"
                                          className={"shop-btn"}
                                          aria-label={`Add ${product.productName} to basket`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onAdd({
                                              _id: product._id,
                                              quantity: 1,
                                              name: product.productName,
                                              price: product.productPrice,
                                              image: product.productImages[0],
                                            });
                                          }}
                                        >
                                          <img
                                            src={"/icons/shopping-cart.svg"}
                                            alt=""
                                            style={{ display: "flex" }}
                                          />
                                        </button>
                                        <AspectRatio ratio="1" className={"media-well"}>
                                            <img src={imagePath} alt="" />
                                        </AspectRatio>
                                    </CardOverflow>

                                    <CardOverflow variant="soft" className="product-detail">
                                        <Stack className="info">
                                            <Stack className="name-row" flexDirection={"row"} alignItems={"center"}>
                                                <Typography className={"title"}>
                                                    {product.productName}
                                                </Typography>
                                                <Divider width="1" height="16" bg="var(--line)"  />
                                                <Typography className={"price"}>${product.productPrice}</Typography>
                                            </Stack>
                                            <Stack>
                                                <Typography className={"views"}>
                                                    {product.productViews}
                                                    <VisibilityOutlinedIcon
                                                     sx={{ fontSize: 15, marginLeft: "5px"}}
                                                    />
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </CardOverflow>
                                </Card>
                            );
                         })
                        ) : (
                            <Box className="no-data">New products are not aviable!</Box>
                        )}
                       </CssVarsProvider>
                    </Stack>
                </Stack>
            </Container>
        </div>
    );
}
