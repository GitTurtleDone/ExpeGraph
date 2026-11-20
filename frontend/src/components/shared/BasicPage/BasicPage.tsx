import { Typography, Stack, Box } from "@mui/material";
import React, { useState } from "react";
import type { FieldValues } from "react-hook-form";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import type { LeftPanelProps, RightPanelProps } from "../../../types/basic";
import type { BasicPageProps } from "../../../types/basic";
import type { GridColDef } from "@mui/x-data-grid";
export default function BasicPage<
  TEntity,
  TEntityQuery extends FieldValues,
  TEntityInput extends FieldValues,
>({
  pageTitle,
  leftPanelProps,
  rightPanelProps,
}: {
  pageTitle: string;
  leftPanelProps: LeftPanelProps<TEntity, TEntityQuery>;
  rightPanelProps: RightPanelProps<TEntity, TEntityInput>;
}) {
  const [selectedId, setSelectedId] = useState<number>();
  const [selectedEntry, setSelectedEntry] = useState<TEntity>();
  return (
    <Stack>
      <Typography variant="h2" mb={4}>
        {pageTitle}
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "60% 40%", gap: 5 }}>
        {/*-- Left Panel --*/}
        <LeftPanel
          leftPanelProps={leftPanelProps}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          selectedEntry={selectedEntry}
          setSelectedEntry={setSelectedEntry}
        />
        {/*-- Right Panel --*/}
        <RightPanel
          rightPanelProps={rightPanelProps}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          selectedEntry={selectedEntry}
          setSelectedEntry={setSelectedEntry}
        />
      </Box>
    </Stack>
  );
}
