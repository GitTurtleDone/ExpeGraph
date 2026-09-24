import { Typography, Stack, Box } from "@mui/material";
import React, {useState} from "react";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";

export default function ({pageTitle, righPanelProps}) {
    return (
        
        <Stack>
            <Typography variant="h2" mb={4}> 
                {pageTitle}
            </Typography>
            <Box sx={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5}}>
                {/*-- Left Panel --*/}
                <LeftPanel />
                {/*-- Right Panel --*/}
                {/* <RightPanel props = rightPanelProps /> */}
            </Box>
            
        </Stack>
    )
}