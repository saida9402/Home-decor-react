import { Box, Container, Stack } from "@mui/material";
import { useHistory } from "react-router-dom";

import {
  FacebookGlyph,
  InstagramGlyph,
  TelegramGlyph,
  YouTubeGlyph,
} from "./SocialIcons";

import { Settings } from "./Settings";
import "../../../css/userPage.css";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import { MemberType } from "../../../lib/enums/member.enum";
import OrderHistory from "./order.history";

export default function UserPage() {
  const { authMember } = useGlobals();
  const history = useHistory();

  if (!authMember) {
    history.push("/login");
    return null;
  }

  return (
    <div className="user-page">
      <Container>
        <Stack className="my-page-frame">
          <Stack className="my-page-left">
            <Box display="flex" flexDirection="column">
              <Box className="menu-name">Member details</Box>
              <Box className="menu-content">
                <Settings />
              </Box>
            </Box>
          </Stack>

          <Stack className="my-page-right">
            <Box className="order-info-box">
              <Box className="profile-head">
                <div className="order-user-img">
                  <img
                    src={
                      authMember.memberImage
                        ? `${serverApi}/${authMember.memberImage}`
                        : "/icons/default-user.svg"
                    }
                    className="order-user-avatar"
                    alt=""
                  />
                  <div className="order-user-icon-box">
                    <img
                      src={
                        authMember.memberType === MemberType.SELLER
                          ? "/icons/restaurant.svg"
                          : "/icons/user-badge.svg"
                      }
                      alt=""
                    />
                  </div>
                </div>

                <span className="order-user-name">{authMember.memberNick}</span>
                <span className="order-user-prof">{authMember.memberType}</span>
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

            <Box className="order-history-box">
              <OrderHistory />
            </Box>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
