import { Typography, Stack, Box } from "@mui/material";
import React, {useState} from "react";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import type { RightPanelProps } from "../../../types/basic";
import type { BasicPageProps } from "../../../types/basic";
import type { FieldValues } from "react-hook-form";

export default function BasicPage({pageTitle, leftPanelProps, rightPanelProps}) {
    return (
        
        <Stack>
            <Typography variant="h2" mb={4}> 
                {pageTitle}
            </Typography>
            <Box sx={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5}}>
                {/*-- Left Panel --*/}
                <LeftPanel leftPanelProps={leftPanelProps}/>
                {/*-- Right Panel --*/}
                <RightPanel rightPanelProps = {rightPanelProps} />
                {/* <RightPanel props = rightPanelProps /> */}
            </Box>
        </Stack>
    )
}