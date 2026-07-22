import { Box, Container, Stack } from "@mui/material";
import Card from "@mui/joy/Card";
import { CssVarsProvider, Typography } from "@mui/joy";
import CardOverflow from "@mui/joy/CardOverflow";
import AspectRatio from "@mui/joy/AspectRatio";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveTopUsers } from "./selector";
import { serverApi } from "../../../lib/config";
import { Member } from "../../../lib/types/member";

/** REDUX SLICE & SELECTOR **/
const topUsersRetriever = createSelector(retrieveTopUsers, (topUsers) => ({ 
    topUsers, 
}));


export default function ActiveUsers() {
    const {topUsers} = useSelector(topUsersRetriever);
    return (
        <div className={"active-users-frame"}>
            <Container>
                <Stack className={"main"}>
                    <Box className={"category-title"}>Our Community</Box>
                    <Stack className={"cards-frame"}>
                        <CssVarsProvider>
                          {topUsers.length !== 0 ? (
                            topUsers.map((member: Member) => {
                                const imagePath = `${serverApi}/${member.memberImage}`;
                                return (
                                    <Card
                                        key={member._id} 
                                        variant="outlined" 
                                        className={"card"}
                                    >
                                    <CardOverflow className={"card-media"}>
                                        <AspectRatio ratio="1" className={"media-well"}>
                                            <img src={imagePath} alt="" />
                                        </AspectRatio>
                                    </CardOverflow>

                                    <CardOverflow variant="soft" className="product-detail">
                                        <Stack className="info">
                                            <Stack flexDirection={"row"}>
                                                <Typography className={"member-nickname"}>
                                                    {member.memberNick}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </CardOverflow>
                                </Card>
                                );
                            })
                        ) : (
                            <Box className="no-data">
                                Our community is just getting started.
                            </Box>
                        )}  
                        </CssVarsProvider>
                    </Stack>
                </Stack>
            </Container>
        </div>
    );
}