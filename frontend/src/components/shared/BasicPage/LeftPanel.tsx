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
  keyframes,
} from "@mui/material";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";

// <TEntity, TEntityAdvancedSearchCheckboxes, TEntityAdvancedSearchFields,TEntityDisplayedColumns, TEntityQuery extends FieldValues>
export default function LeftPanel<
  TEntity,
  TEntityAdvancedSearchCheckboxes,
  TEntityAdvancedSearchFields,
  TEntityDisplayedColumns,
  TEntityQuery extends FieldValues,
>({ leftPanelProps }) {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState<boolean>(false);
  const {
    entityName,
    entityAdvancedSearchCheckboxes,
    entityAdvancedSearchFields,
    entityDislayedColumns,
    getAllEntities,
    getEntityById,
  } = { ...leftPanelProps };
  console.log(entityAdvancedSearchCheckboxes);
  console.log(entityName);
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
        <IconButton onClick={() => setShowAdvancedSearch((prev) => !prev)}>
          {showAdvancedSearch ? (
            <ExpandLessOutlinedIcon></ExpandLessOutlinedIcon>
          ) : (
            <ChevronRightOutlinedIcon></ChevronRightOutlinedIcon>
          )}
        </IconButton>

        <Typography>Advanced Search</Typography>
      </Box>
      <Collapse in={showAdvancedSearch}>
        <Typography>{String(entityAdvancedSearchFields.isActive)}</Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 3fr 1fr 3fr 1fr 3fr",
            alignItems: "center",
            gap: "5px 5px",
          }}
        >
          {Object.entries(entityAdvancedSearchCheckboxes).map(
            ([key, _]) =>
              key === "idRangeChb" && (
              <Checkbox id={key}></Checkbox>
              
            ),
          )}
        </Box>
      </Collapse>
    </Stack>
  );
}
