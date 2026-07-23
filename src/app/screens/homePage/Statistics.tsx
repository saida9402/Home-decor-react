import React from "react";
import { Box, Container, Stack } from "@mui/material";
import Divider from "../../components/divider";

/**
 * Editorial statistics band. Figures are hand-set, on-brand values —
 * the captions are approved copy and left as-is.
 */
export default function Statistics() {
    return (
        <div className={"static-frame"}>
            <Container>
                <Stack className="static-band">
                    <Box className="static-eyebrow">
                        Crafted slowly, chosen carefully
                    </Box>
                    <Stack className="info">
                        <Stack className="static-box">
                            <Box className="static-num">12+</Box>
                            <Box className="static-text">Years of craft</Box>
                        </Stack>
                        <Divider height="56" width="1" bg="var(--line)" />
                        <Stack className="static-box">
                            <Box className="static-num">40+</Box>
                            <Box className="static-text">Artisan partners</Box>
                        </Stack>
                        <Divider height="56" width="1" bg="var(--line)" />
                        <Stack className="static-box">
                            <Box className="static-num">350+</Box>
                            <Box className="static-text">Pieces in the collection</Box>
                        </Stack>
                        <Divider height="56" width="1" bg="var(--line)" />
                        <Stack className="static-box">
                            <Box className="static-num">1,200+</Box>
                            <Box className="static-text">Homes furnished</Box>
                        </Stack>
                    </Stack>
                </Stack>
            </Container>
        </div>
    );
}
