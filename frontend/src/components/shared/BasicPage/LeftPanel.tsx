import React, { useState } from "react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Typography,
  Collapse,
  Stack,
  Box,
  Checkbox,
  OutlinedInput,
  Button,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Icon,
} from "@mui/material";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";

export default function LeftPanel<TEntity, TEntityQuery extends FieldValues>({
  leftPanelProps,
}) {
  const [expandAdvancedSearch, setExpandAdvancedSearch] =
    useState<boolean>(false);
  const { entityName, getAllEntities, getEntityById } = { ...leftPanelProps };
  return (
    <Stack>
      <Typography>Left Panel</Typography>
      <Box
        sx={{
          display: "flex",
        }}
      >
        <OutlinedInput
          type="string"
          placeholder={`Type to search for ${entityName}s`}
          size="small"
          fullWidth
        ></OutlinedInput>
        <IconButton>
          <SearchOutlinedIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={() => setExpandAdvancedSearch((prev) => !prev)}>
          {expandAdvancedSearch ? (
            <ExpandLessOutlinedIcon></ExpandLessOutlinedIcon>
          ) : (
            <ChevronRightOutlinedIcon></ChevronRightOutlinedIcon>
          )}
        </IconButton>

        <Typography>Advanced Search</Typography>
      </Box>
    </Stack>
  );
}
