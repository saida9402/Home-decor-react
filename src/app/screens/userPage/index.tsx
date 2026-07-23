import { useState } from "react";
import { Box, Container, Stack } from "@mui/material";
import { useHistory } from "react-router-dom";

import {
  FacebookGlyph,
  InstagramGlyph,
  TelegramGlyph,
  YouTubeGlyph,
} from "./SocialIcons";
import {
  MemberAvatar,
  SellerGlyph,
  UserBadgeGlyph,
} from "../../components/icons/UserIcons";

import { Settings } from "./Settings";
import "../../../css/userPage.css";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import { MemberType } from "../../../lib/enums/member.enum";
import OrderHistory from "./order.history";

/** the two views this page switches between — client-side UI state only,
    no routing change, so back/forward and deep links are unaffected */
type MyPageTab = "info" | "orders";

export default function UserPage() {
  const { authMember } = useGlobals();
  const history = useHistory();
  const [tab, setTab] = useState<MyPageTab>("info");

  if (!authMember) {
    history.push("/login");
    return null;
  }

  return (
    <div className="user-page">
      <Container>
        <Stack className="my-page-frame">
          {/* left rail — styled like the site nav; becomes a horizontal
              tab bar on mobile. MY INFO is the default active tab. */}
          <Stack className="my-page-nav" role="tablist" aria-label="My page">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "info"}
              className={
                tab === "info" ? "my-page-tab is-active" : "my-page-tab"
              }
              onClick={() => setTab("info")}
            >
              My info
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "orders"}
              className={
                tab === "orders" ? "my-page-tab is-active" : "my-page-tab"
              }
              onClick={() => setTab("orders")}
            >
              Orders
            </button>
          </Stack>

          <Stack className="my-page-content">
            {tab === "info" ? (
              <Box className="my-info-grid">
                <Box className="my-info-details">
                  <Box className="menu-name">Member details</Box>
                  <Box className="menu-content">
                    <Settings />
                  </Box>
                </Box>

                <Box className="order-info-box">
                  <Box className="profile-head">
                    <div className="order-user-img">
                      <MemberAvatar
                        src={
                          authMember.memberImage
                            ? `${serverApi}/${authMember.memberImage}`
                            : null
                        }
                        className="order-user-avatar"
                        glyphSize={44}
                      />
                      <div className="order-user-icon-box">
                        {authMember.memberType === MemberType.SELLER ? (
                          <SellerGlyph size={15} />
                        ) : (
                          <UserBadgeGlyph size={15} />
                        )}
                      </div>
                    </div>

                    <span className="order-user-name">
                      {authMember.memberNick}
                    </span>
                    <span className="order-user-prof">
                      {authMember.memberType}
                    </span>
                  </Box>

                  <Box className="profile-meta">
                    <span className="meta-label">Address</span>
                    <span className="meta-value">
                      {authMember.memberAddress || "No address on file"}
                    </span>
                  </Box>

                  <p className="user-desc">
                    {authMember.memberDesc || "No description yet."}
                  </p>

                  <Box className="user-media-box">
                    <FacebookGlyph />
                    <InstagramGlyph />
                    <TelegramGlyph />
                    <YouTubeGlyph />
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box className="order-history-box">
                <OrderHistory />
              </Box>
            )}
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
