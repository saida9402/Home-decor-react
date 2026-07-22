import { Box, Container, Stack } from "@mui/material";
import { CssVarsProvider } from "@mui/joy/styles";
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import CardOverflow  from "@mui/joy/CardOverflow";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DescriptionOutlinedIcon  from "@mui/icons-material/DescriptionOutlined";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useHistory } from "react-router-dom";
import { retrievePopularDishes } from "./selector";
import { Product } from "../../../lib/types/product";
import { CartItem } from "../../../lib/types/search";
import { serverApi } from "../../../lib/config";

/** REDUX SLICE & SELECTOR **/
const popularDishesRetriever = createSelector(
  retrievePopularDishes,
  (popularDishes) => ({ popularDishes })
);

interface PopularDishesProps {
  onAdd: (item: CartItem) => void;
}

export default function PopularDishes(props: PopularDishesProps) {
  const { onAdd } = props;
  const { popularDishes } = useSelector(popularDishesRetriever);
  const history = useHistory();

  /** HANDLERS **/
  const choseDishHandler = (id: string) => {
    history.push(`/products/${id}`);
  };

    return (
        <div className="popular-products-frame">
            <Container>
                <Stack className="popular-section">
                    <Box className="category-title">Signature Pieces</Box>
                    <Stack className="cards-frame">
                      {popularDishes.length !== 0 ? (
                        popularDishes.map((product: Product) => {
                         const imagePath = `${serverApi}/${product.productImages[0]}`; 
                         return (
                            <CssVarsProvider key={product._id}>
                                <Card
                                  className={"card"}
                                  onClick={() => choseDishHandler(product._id)}
                                >
                                    <CardCover className={"card-image"}>
                                       <img src={imagePath} alt="" />
                                    </CardCover>
                                    <CardCover className={"card-cover"} />
                                    {/* plain <button>: a Material Button here would
                                        resolve its styles against the Joy theme
                                        supplied by the CssVarsProvider above and
                                        throw on theme.palette.grey[300] */}
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
                                    <CardContent sx={{ justifyContent: 'flex-end' }}>
                                        <Stack
                                          className={"card-headline"}
                                          flexDirection={"row"}
                                          justifyContent={"space-between"}
                                          alignItems={"flex-end"}
                                        >
                                          <Typography
                                            level="h2"
                                            className={"product-name"}
                                          >
                                           {product.productName}
                                          </Typography>
                                          <Typography className={"product-views"}>
                                            {product.productViews}
                                            <VisibilityOutlinedIcon
                                              sx={{ fontSize: 15, marginLeft: "5px" }}
                                            />
                                          </Typography>
                                        </Stack>
                                    </CardContent>
                                   <CardOverflow className={"card-caption"}>
                                    <Typography
                                      className={"product-desc"}
                                      startDecorator={< DescriptionOutlinedIcon className={"desc-icon"} />}
                                    >
                                        <span className={"desc-text"}>{product.productDesc}</span>
                                    </Typography>
                                   </CardOverflow>
                                </Card>
                           </CssVarsProvider>
                         );
                       })
                      ) :( 
                        <Box className="no-data">New products are not aviable!</Box>
                      )}   
                    </Stack>
                </Stack>
            </Container>
        </div>
    );
}