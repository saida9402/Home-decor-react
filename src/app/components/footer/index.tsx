import React from "react";
import { Box, Container } from "@mui/material";
import { Link } from "react-router-dom";

/** Brand wordmark — inline SVG, inherits currentColor from the token set. */
const Wordmark = () => (
  <svg
    className={"brand-wordmark"}
    width="208"
    height="22"
    role="img"
    aria-label="Home Decor"
  >
    <text x="1" y="17">HOME DECOR</text>
  </svg>
);

export default function Footer() {
  const authMember = null;

  return (
    <footer className={"site-footer"}>
      <Container>
        <Box className={"footer-grid"}>
          {/* brand */}
          <Box className={"footer-brand"}>
            <Wordmark />
            <Box className={"foot-desc-txt"}>
              Furniture, lighting and textiles for the considered home —
              made in small batches from materials that age well.
            </Box>
          </Box>

          {/* navigation */}
          <Box>
            <Box className={"foot-category-title"}>Explore</Box>
            <Box className={"foot-category-link"}>
              <Link to="/">Home</Link>
              <Link to="/products">Products</Link>
              {authMember && <Link to="/orders">Orders</Link>}
              <Link to="/help">Help</Link>
            </Box>
          </Box>

          {/* contact */}
          <Box>
            <Box className={"foot-category-title"}>Contact</Box>
            <Box className={"foot-category-link"}>
              <Box className={"find-us"}>
                <span>Studio</span>
                <div>[STREET ADDRESS], [CITY]</div>
              </Box>
              <Box className={"find-us"}>
                <span>Phone</span>
                <div>[PHONE NUMBER]</div>
              </Box>
              <Box className={"find-us"}>
                <span>Email</span>
                <div>[EMAIL ADDRESS]</div>
              </Box>
              <Box className={"find-us"}>
                <span>Hours</span>
                <div>[OPENING HOURS]</div>
              </Box>
            </Box>
          </Box>

          {/* social */}
          <Box>
            <Box className={"foot-category-title"}>Follow</Box>
            <Box className="sns-context">
              <a href="[FACEBOOK URL]" aria-label="Facebook">
                <img src={"/icons/facebook.svg"} alt="" />
              </a>
              <a href="[TWITTER URL]" aria-label="Twitter">
                <img src={"/icons/twitter.svg"} alt="" />
              </a>
              <a href="[INSTAGRAM URL]" aria-label="Instagram">
                <img src={"/icons/instagram.svg"} alt="" />
              </a>
              <a href="[YOUTUBE URL]" aria-label="YouTube">
                <img src={"/icons/youtube.svg"} alt="" />
              </a>
            </Box>
          </Box>
        </Box>

        <Box className={"footer-rule"} />

        <Box className={"footer-bottom"}>
          <Box className={"copyright-txt"}>
            © {new Date().getFullYear()} Home Decor. All rights reserved.
          </Box>
        </Box>
      </Container>
    </footer>
  );
}
