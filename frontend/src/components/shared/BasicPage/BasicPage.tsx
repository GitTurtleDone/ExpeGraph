import { Typography, Stack, Box } from "@mui/material";
import React, { useState } from "react";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import type { RightPanelProps } from "../../../types/basic";
import type { BasicPageProps } from "../../../types/basic";
import type { FieldValues } from "react-hook-form";
import type { GridColDef } from "@mui/x-data-grid";
export default function BasicPage<TEntity, TEntityInput>({
  pageTitle,
  leftPanelProps,
  rightPanelProps,
}) {
  
  const [selectedId, setSelectedId] = useState<number>();
  const [selectedEntry, setSelectedEntry] = useState<any>();
  
  console.log(`In Basic Page: ${selectedId}; ${selectedEntry && selectedEntry["firstName"] && (selectedEntry["firstName"] ??  "nothing")}`);
  return (
    <Stack>
      <Typography variant="h2" mb={4}>
        {pageTitle}
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "60% 40%", gap: 5 }}>
        {/*-- Left Panel --*/}
        <LeftPanel 
          leftPanelProps={leftPanelProps}
          selectedId = {selectedId}
          setSelectedId = {setSelectedId}
          selectedEntry = {selectedEntry}
          setSelectedEntry = {setSelectedEntry} />
        {/*-- Right Panel --*/}
        <RightPanel 
          rightPanelProps={rightPanelProps}
          selectedId = {selectedId}
          setSelectedId = {setSelectedId}
          selectedEntry = {selectedEntry}
          setSelectedEntry = {setSelectedEntry}
           />
        {/* <Typography>{String(leftPanelProps.entityAdvancedSearchFields.isActive)}</Typography> */}
        {/* <RightPanel props = rightPanelProps /> */}
      </Box>
    </Stack>
  );
}
