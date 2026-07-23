// import { Box, Button, Container, InputBase, Stack } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
// import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
// import Badge from "@mui/material/Badge";
// import Pagination from "@mui/material/Pagination";
// import PaginationItem from "@mui/material/PaginationItem";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// import { Dispatch } from "@reduxjs/toolkit";
// import { createSelector } from "reselect";
// import { retrieveProducts } from "./selector";
// import { Product, ProductInquiry } from "../../../lib/types/product";
// import { setProducts } from "./slice";
// import { useDispatch, useSelector } from "react-redux";
// import { ChangeEvent, useEffect, useState } from "react";
// import ProductService from "../../services/ProductService";
// import { ProductCollection } from "../../../lib/enums/product.enum";
// import { serverApi } from "../../../lib/config";
// import { useHistory } from "react-router-dom";
// import { CartItem } from "../../../lib/types/search";

// /** REDUX SLICE & SELECTOR **/
// const actionDispatch = (dispatch: Dispatch) => ({
//     setProducts: (data: Product[]) => dispatch(setProducts(data)),
// });
// const productsRetriever = createSelector(
//   retrieveProducts, (products) => ({
//     products,
// }));

// interface ProductsProps {
//     onAdd: (item: CartItem) => void;
// }

// export default function Products(props: ProductsProps) {
//     const { onAdd } = props;
//     const { setProducts } = actionDispatch(useDispatch());
//     const { products } = useSelector(productsRetriever);
//     const [productSearch, setProductSearch] = useState<ProductInquiry>({
//         page: 1,
//         limit: 8,
//         order: "createdAt",
//         productCollection: ProductCollection.DISH,
//         search: "",
//     });

// const [searchText, setSearchText] = useState<string>("");
// const history = useHistory();

//     useEffect(() => {
//         const product = new ProductService();
//         product
//           .getProducts(productSearch)
//           .then((data) => setProducts(data))
//           .catch((err) => console.log(err));
//     }, [productSearch])

//     useEffect(() => {
//         if(searchText === "") {
//             productSearch.search = "";
//             setProductSearch({ ...productSearch});
//         }
//     }, [searchText]);

// /** HANDLERS **/
// const searchCollectionHandler = (collection: ProductCollection) => {
//     productSearch.page = 1;
//     productSearch.productCollection = collection;
//     setProductSearch({ ...productSearch});
// };

// const serchOrderHandler = (order: string) => {
//     productSearch.page = 1;
//     productSearch.order = order;
//     setProductSearch({ ...productSearch});
// }

// const searchProductHandler = () => {
//     productSearch.search = searchText;
//     setProductSearch({ ...productSearch});
// };

// const paginationHandler = (e: ChangeEvent<any>, value: number) => {
//     productSearch.page = value;
//     setProductSearch({...productSearch});
// };

// const choseDishHandler = (id: string) => {
//     history.push(`/products/${id}`);
// }

//     return(
//         <div className="products">
//             <Container>
//                 <Stack flexDirection={"column"} alignItems={"center"}>
//                     <Stack className={"avatar-big-box"}>
//                         <Stack className={"top-text"}>
//                                 <p>Burak Restaurant</p>
//                                <Stack className="single-search-big-box">
//                                     <input
//                                     type={"search"}
//                                     className={"single-search-input"}
//                                     name={"singleResearch"}
//                                     placeholder={"Type here"}
//                                     value={searchText}
//                                     onChange={(e) => setSearchText(e.target.value)}
//                                     onKeyDown={(e) => {
//                                         if (e.key === "Enter") searchProductHandler();
//                                     }}
//                                     />
//                                     <Button
//                                       className="single-button-search"
//                                       variant="contained"
//                                       endIcon={<SearchOutlinedIcon />}
//                                       onClick={searchProductHandler}
//                                     >
//                                         Search
//                                     </Button>
//                                </Stack>
//                         </Stack>
//                     </Stack>

//                     <Stack className={"dishes-filter-section"}>
//                         <Stack className={"dishes-filter-box"}>
//                             <Button
//                               variant={"contained"}
//                               color={
//                                     productSearch.order === "createdAt"
//                                      ? "primary"
//                                      : "secondary"
//                                 }
//                               className={"order"}
//                               onClick={() => serchOrderHandler("createdAt")}
//                             >
//                                 New
//                             </Button>
//                             <Button
//                               variant={"contained"}
//                               color={
//                                     productSearch.order === "productPrice"
//                                      ? "primary"
//                                      : "secondary"
//                                 }
//                               className={"order"}
//                               onClick={() => serchOrderHandler("productPrice")}
//                             >
//                                 Price
//                             </Button>
//                             <Button
//                               variant={"contained"}
//                               color={
//                                     productSearch.order === "productView"
//                                      ? "primary"
//                                      : "secondary"
//                                 }
//                               className={"order"}
//                               onClick={() => serchOrderHandler("productViews")}
//                             >
//                                 Views
//                             </Button>
//                         </Stack>
//                     </Stack>

//                     <Stack className={"list-category-section"}>
//                         <Stack className={"product-category"}>
//                             <div className={"category-main"} >
//                                 <Button
//                                 variant={"contained"}
//                                 color={
//                                     productSearch.productCollection === ProductCollection.OTHER
//                                      ? "primary"
//                                      : "secondary"
//                                 }
//                                 onClick={() => searchCollectionHandler(ProductCollection.OTHER)}
//                                 >
//                                     Other
//                                 </Button>
//                                 <Button
//                                 variant={"contained"}
//                                 color={
//                                     productSearch.productCollection === ProductCollection.DESSERT
//                                      ? "primary"
//                                      : "secondary"
//                                 }
//                                 onClick={() => searchCollectionHandler(ProductCollection.DESSERT)}
//                                 >
//                                     Dessert
//                                 </Button>
//                                 <Button
//                                 variant={"contained"}
//                                 color={
//                                     productSearch.productCollection === ProductCollection.DRINK
//                                      ? "primary"
//                                      : "secondary"
//                                 }
//                                 onClick={() => searchCollectionHandler(ProductCollection.DRINK)}
//                                 >
//                                     Drink
//                                 </Button>
//                                 <Button
//                                 variant={"contained"}
//                                 color={
//                                     productSearch.productCollection === ProductCollection.SALAD
//                                      ? "primary"
//                                      : "secondary"
//                                 }
//                                 onClick={() => searchCollectionHandler(ProductCollection.SALAD)}
//                                 >
//                                     Salad
//                                 </Button>
//                                 <Button
//                                 variant={"contained"}
//                                 color={
//                                     productSearch.productCollection === ProductCollection.DISH
//                                      ? "primary"
//                                      : "secondary"
//                                 }
//                                 onClick={() => searchCollectionHandler(ProductCollection.DISH)}
//                                 >
//                                     Dish
//                                 </Button>
//                             </div>
//                         </Stack>

//                         <Stack className={"product-wrapper"}>
//                             {products.length !== 0 ? (
//                                 products.map((product: Product) => {
//                                     const imagePath = `${serverApi}/${product.productImages[0]}`;
//                                     const sizeVolume =
//                                         product.productCollection === ProductCollection.DRINK
//                                           ? product.productVolume + " litre "
//                                           : product.productSize + "size ";
//                                     return (
//                                         <Stack
//                                             key={product._id}
//                                             className={"product-card"}
//                                             onClick={() => choseDishHandler(product._id)}
//                                         >
//                                             <Stack
//                                              className={"product-img"}
//                                              sx={{
//                                                 backgroundImage: `url(${imagePath})`
//                                              }}
//                                             >
//                                                 <div className={"product-sale"}>{sizeVolume}</div>
//                                                 <Button
//                                                     className={"shop-btn"}
//                                                     onClick={(e) => {
//                                                             console.log("BUTTON PRESSED!");
//                                                             onAdd({
//                                                                 _id: product._id,
//                                                                 quantity: 1,
//                                                                 name: product.productName,
//                                                                 price: product.productPrice,
//                                                                 image: product.productImages[0],
//                                                             });
//                                                             e.stopPropagation();
//                                                         }}
//                                                 >

//                                                     <img
//                                                       src={"/icons/shopping-cart.svg"}
//                                                       style={{display: "flex"}}
//                                                     />
//                                                 </Button>
//                                                 <Button className={"view-btn"} sx={{ right: "36px"}}>
//                                                     <Badge badgeContent={product.productViews} color="secondary">
//                                                         <RemoveRedEyeIcon
//                                                           sx={{
//                                                             color: product.productViews === 0 ? "gray" : "white",
//                                                         }}
//                                                         />
//                                                     </Badge>
//                                                 </Button>
//                                             </Stack>
//                                             <Box className={"product-desc"}>
//                                                 <span className={"product-title"}>
//                                                     {product.productName}
//                                                 </span>
//                                                 <div className={"product-desc"}>
//                                                     <MonetizationOnIcon />
//                                                     {product.productPrice}
//                                                 </div>
//                                             </Box>
//                                         </Stack>
//                                     );
//                                 })
//                             ) : (
//                                 <Box className="no-data"> Products are not aviable!</Box>
//                             )}
//                         </Stack>
//                     </Stack>

//                     <Stack className={"pagination-section"}>
//                         <Pagination
//                           count={
//                             products.length !== 0
//                              ? productSearch.page + 1
//                              : productSearch.page
//                           }
//                           page={productSearch.page}
//                           renderItem={(item) => (
//                             <PaginationItem
//                               components={{
//                                 previous: ArrowBackIcon,
//                                 next: ArrowForwardIcon,
//                               }}
//                               {...item}
//                               color={"secondary"}
//                             />
//                           )}
//                           onChange={paginationHandler}
//                         />
//                     </Stack>
//                 </Stack>
//             </Container>

//             <div className={"brands-logo"}>
//                 <Container className={"family-brands"}>
//                     <Box className={"category-title"}>Our family-brands</Box>
//                     <Stack className={"brand-list"}>
//                         <Box className={"review-box"}>
//                             <img src={"/img/gurme.webp"} />
//                         </Box>
//                         <Box className={"review-box"}>
//                             <img src={"/img/sweets.webp"} />
//                         </Box>
//                         <Box className={"review-box"}>
//                             <img src={"/img/seafood.webp"} />
//                         </Box>
//                         <Box className={"review-box"}>
//                             <img src={"/img/doner.webp"} />
//                         </Box>
//                     </Stack>
//                 </Container>
//             </div>

//             <div className={"address"}>
//                 <Container>
//                     <Stack className={"address-area"}>
//                         <Box className={"title"}>Our Address</Box>
//                         <iframe
//                           style={{marginTop: "60px"}}
//                           src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13020.834418553352!2d129.082457!3d35.265169!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3568911565a23c0f%3A0xfb357dd0af17df78!2sNamsan!5e0!3m2!1sen!2skr!4v1690452712345!5m2!1sen!2skr"
//                           width="1320"
//                           height="500"
//                           referrerPolicy="no-referrer-when-downgrade"
//                         ></iframe>
//                     </Stack>
//                 </Container>
//             </div>
//         </div>
//     );
// }

import { Box, Button, Container, Stack } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { Dispatch } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { retrieveProducts } from "./selector";
import { Product, ProductInquiry } from "../../../lib/types/product";
import { setProducts } from "./slice";
import { useDispatch, useSelector } from "react-redux";
import { ChangeEvent, useEffect, useState } from "react";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { serverApi } from "../../../lib/config";
import { useHistory, useLocation } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";

/** URL QUERY SYNC **/
const PAGE_LIMIT = 8;
const PAGE_MAX = 10000;
const SEARCH_MAX = 100;
const DEFAULT_ORDER = "createdAt";
const DEFAULT_COLLECTION = ProductCollection.HOME;
const ALLOWED_ORDERS: string[] = [
  "createdAt",
  "productPrice",
  "productViews",
];

const isProductCollection = (value: string): value is ProductCollection =>
  (Object.values(ProductCollection) as string[]).includes(value);

/** Builds a fully validated inquiry from a query string. Anything missing or
 * malformed falls back to the default, so invalid input never reaches the API. */
const parseInquiry = (locationSearch: string): ProductInquiry => {
  const params = new URLSearchParams(locationSearch);

  const rawCollection = params.get("collection");
  const productCollection =
    rawCollection && isProductCollection(rawCollection)
      ? rawCollection
      : DEFAULT_COLLECTION;

  let page = 1;
  const rawPage = params.get("page");
  if (rawPage && /^[0-9]+$/.test(rawPage)) {
    const parsed = Number(rawPage);
    if (parsed >= 1 && parsed <= PAGE_MAX) page = parsed;
  }

  const rawOrder = params.get("order");
  const order =
    rawOrder && ALLOWED_ORDERS.includes(rawOrder) ? rawOrder : DEFAULT_ORDER;

  const rawSearch = params.get("search");
  const search = rawSearch ? rawSearch.trim().slice(0, SEARCH_MAX) : "";

  return { page, limit: PAGE_LIMIT, order, productCollection, search };
};

const buildQuery = (inquiry: ProductInquiry): string => {
  const params = new URLSearchParams();
  params.set("collection", inquiry.productCollection ?? DEFAULT_COLLECTION);
  params.set("page", String(inquiry.page));
  params.set("order", inquiry.order);
  if (inquiry.search) params.set("search", inquiry.search);
  return params.toString();
};

const sameInquiry = (a: ProductInquiry, b: ProductInquiry): boolean =>
  a.page === b.page &&
  a.limit === b.limit &&
  a.order === b.order &&
  a.productCollection === b.productCollection &&
  (a.search || "") === (b.search || "");

/** REDUX SLICE & SELECTOR **/
const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});
const productsRetriever = createSelector(retrieveProducts, (products) => ({
  products,
}));

interface ProductsProps {
  onAdd: (item: CartItem) => void;
}

export default function Products(props: ProductsProps) {
  const { onAdd } = props;
  const { setProducts } = actionDispatch(useDispatch());
  const { products } = useSelector(productsRetriever);
  const history = useHistory();
  const location = useLocation();

  // Initial state is derived from the URL synchronously, so the very first
  // fetch already reflects the query string instead of the defaults.
  const [productSearch, setProductSearch] = useState<ProductInquiry>(() =>
    parseInquiry(location.search)
  );
  const [searchText, setSearchText] = useState<string>(
    () => parseInquiry(location.search).search || ""
  );

  // Single place where state and the URL are updated together.
  const applyInquiry = (next: ProductInquiry) => {
    setProductSearch(next);
    history.push({ pathname: location.pathname, search: buildQuery(next) });
  };

  // Keeps browser back/forward working: the view follows location.search.
  useEffect(() => {
    const fromUrl = parseInquiry(location.search);
    setProductSearch((prev) => (sameInquiry(prev, fromUrl) ? prev : fromUrl));
    setSearchText((prev) =>
      prev === (fromUrl.search || "") ? prev : fromUrl.search || ""
    );
  }, [location.search]);

  useEffect(() => {
    const product = new ProductService();
    product
      .getProducts(productSearch)
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, [productSearch]);

  useEffect(() => {
    if (searchText === "" && productSearch.search !== "") {
      applyInquiry({ ...productSearch, search: "" });
    }
  }, [searchText]);

  /** HANDLERS **/
  const searchCollectionHandler = (collection: ProductCollection) => {
    applyInquiry({ ...productSearch, page: 1, productCollection: collection });
  };

  const serchOrderHandler = (order: string) => {
    applyInquiry({ ...productSearch, page: 1, order });
  };

  const searchProductHandler = () => {
    applyInquiry({ ...productSearch, page: 1, search: searchText.trim() });
  };

  const paginationHandler = (e: ChangeEvent<any>, value: number) => {
    applyInquiry({ ...productSearch, page: value });
  };

  const choseDishHandler = (id: string) => {
    history.push(`/products/${id}`);
  };

  return (
    <div className="products">
      <Container>
        <Stack flexDirection={"column"} alignItems={"center"}>
          <Stack className={"avatar-big-box"}>
            <Stack className={"top-text"}>
              <p>The Collection</p>
              <Stack className="single-search-big-box">
                <input
                  type={"search"}
                  className={"single-search-input"}
                  name={"singleResearch"}
                  placeholder={"Type here"}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") searchProductHandler();
                  }}
                />
                <Button
                  className="single-button-search"
                  variant="contained"
                  endIcon={<SearchOutlinedIcon />}
                  onClick={searchProductHandler}
                >
                  Search
                </Button>
              </Stack>
            </Stack>
          </Stack>

          {/* One control bar: collection selects the set, sort modifies it.
              Both groups keep their original classes, so the shared button
              skin and active state are untouched — this is position only. */}
          <Stack className={"list-category-section"}>
            <Stack className={"product-category"}>
              <div className={"filter-group"}>
                <span className={"filter-label"}>Collection</span>
                <div className={"category-main"}>
                  <Button
                    variant={"contained"}
                    color={
                      productSearch.productCollection === ProductCollection.HOME
                        ? "primary"
                        : "secondary"
                    }
                    onClick={() =>
                      searchCollectionHandler(ProductCollection.HOME)
                    }
                  >
                    Home
                  </Button>

                  <Button
                    variant={"contained"}
                    color={
                      productSearch.productCollection ===
                      ProductCollection.FURNITURE
                        ? "primary"
                        : "secondary"
                    }
                    onClick={() =>
                      searchCollectionHandler(ProductCollection.FURNITURE)
                    }
                  >
                    Furniture
                  </Button>

                  <Button
                    variant={"contained"}
                    color={
                      productSearch.productCollection ===
                      ProductCollection.TEXTILE
                        ? "primary"
                        : "secondary"
                    }
                    onClick={() =>
                      searchCollectionHandler(ProductCollection.TEXTILE)
                    }
                  >
                    Textile
                  </Button>
                </div>
              </div>

              <Stack className={"filter-group dishes-filter-section"}>
                <span className={"filter-label"}>Sort</span>
                <Stack className={"dishes-filter-box"}>
                  <Button
                    variant={"contained"}
                    color={
                      productSearch.order === "createdAt"
                        ? "primary"
                        : "secondary"
                    }
                    className={"order"}
                    onClick={() => serchOrderHandler("createdAt")}
                  >
                    New
                  </Button>
                  <Button
                    variant={"contained"}
                    color={
                      productSearch.order === "productPrice"
                        ? "primary"
                        : "secondary"
                    }
                    className={"order"}
                    onClick={() => serchOrderHandler("productPrice")}
                  >
                    Price
                  </Button>
                  <Button
                    variant={"contained"}
                    color={
                      productSearch.order === "productViews"
                        ? "primary"
                        : "secondary"
                    }
                    className={"order"}
                    onClick={() => serchOrderHandler("productViews")}
                  >
                    Views
                  </Button>
                </Stack>
              </Stack>
            </Stack>

            {/* Qolgan kodlar O‘ZGARTIRILMAGAN */}
            <Stack className={"product-wrapper"}>
              {products.length !== 0 ? (
                products.map((product: Product) => {
                  const imagePath = `${serverApi}/${product.productImages[0]}`;

                  const sizeVolume =
                    product.productSize || product.productVolume || "";

                  return (
                    <Stack
                      key={product._id}
                      className={"product-card"}
                      onClick={() => choseDishHandler(product._id)}
                    >
                      <Stack className={"product-img"}>
                        <div className={"product-img-well"}>
                          <img src={imagePath} alt="" />
                        </div>
                        <div className={"product-sale"}>{sizeVolume}</div>
                        <Button
                          className={"shop-btn"}
                          onClick={(e) => {
                            onAdd({
                              _id: product._id,
                              quantity: 1,
                              name: product.productName,
                              price: product.productPrice,
                              image: product.productImages[0],
                            });
                            e.stopPropagation();
                          }}
                        >
                          <img
                            src={"/icons/shopping-cart.svg"}
                            style={{ display: "flex" }}
                          />
                        </Button>
                      </Stack>
                      <Box className={"product-info"}>
                        <span className={"product-title"}>
                          {product.productName}
                        </span>
                        {product.productDesc ? (
                          <p className={"product-text"}>{product.productDesc}</p>
                        ) : null}
                        <div className={"product-meta"}>
                          <span className={"product-views"}>
                            <VisibilityOutlinedIcon sx={{ fontSize: 15 }} />
                            {product.productViews}
                          </span>
                          <span className={"product-price"}>
                            ${product.productPrice}
                          </span>
                        </div>
                      </Box>
                    </Stack>
                  );
                })
              ) : (
                <Box className="no-data"> Products are not available!</Box>
              )}
            </Stack>
          </Stack>

          <Stack className={"pagination-section"}>
            <Pagination
              count={
                products.length !== 0
                  ? productSearch.page + 1
                  : productSearch.page
              }
              page={productSearch.page}
              renderItem={(item) => (
                <PaginationItem
                  components={{
                    previous: ArrowBackIosNewIcon,
                    next: ArrowForwardIosIcon,
                  }}
                  {...item}
                  color={"secondary"}
                />
              )}
              onChange={paginationHandler}
            />
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
