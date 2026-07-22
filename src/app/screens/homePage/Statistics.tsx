import React from "react";
import { Box, Container, Stack } from "@mui/material";
import Divider from "../../components/divider";

/**
 * ⚠ PLACEHOLDER — THIS SECTION MUST NOT SHIP AS-IS.
 *
 * The four figures and the eyebrow are deliberately masked rather than
 * filled with plausible-looking numbers: a stat that reads as a real
 * claim can survive review and ship by accident, an em-dash cannot.
 *
 * To release this section, supply real, verified values for:
 *   1. the eyebrow      — currently "⚠ Placeholder copy" (was "Since 2008")
 *   2. Years of craft
 *   3. Artisan partners
 *   4. Pieces in the collection
 *   5. Homes furnished
 * …then replace each em-dash with the figure AND remove the
 * data-placeholder attribute from that element.
 *
 * Note that 1 and 2 are arithmetically linked — an eyebrow year implies
 * a specific "years of craft" figure.
 *
 * The captions themselves are approved copy and should be left alone.
 *
 * Guard for when CI exists — this must return no matches before deploy:
 *   grep -rn 'data-placeholder="true"' build/ src/
 */
export default function Statistics() {
    return (
        <div className={"static-frame"}>
            <Container>
                <Stack className="static-band">
                    <Box className="static-eyebrow is-placeholder">
                        ⚠ Placeholder copy
                    </Box>
                    <Stack className="info">
                        <Stack className="static-box">
                            <Box className="static-num" data-placeholder="true">
                                ——
                            </Box>
                            <Box className="static-text">Years of craft</Box>
                        </Stack>
                        <Divider height="56" width="1" bg="var(--line)" />
                        <Stack className="static-box">
                            <Box className="static-num" data-placeholder="true">
                                ——
                            </Box>
                            <Box className="static-text">Artisan partners</Box>
                        </Stack>
                        <Divider height="56" width="1" bg="var(--line)" />
                        <Stack className="static-box">
                            <Box className="static-num" data-placeholder="true">
                                ——
                            </Box>
                            <Box className="static-text">Pieces in the collection</Box>
                        </Stack>
                        <Divider height="56" width="1" bg="var(--line)" />
                        <Stack className="static-box">
                            <Box className="static-num" data-placeholder="true">
                                ——
                            </Box>
                            <Box className="static-text">Homes furnished</Box>
                        </Stack>
                    </Stack>
                </Stack>
            </Container>
        </div>
    );
}
