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
  minor,
} from "@mui/material";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { userAdvancedSearchFieldSchema } from "../../../types/users";
import { gridAdditionalRowGroupsSelector } from "@mui/x-data-grid/internals";

// <TEntity, TEntityAdvancedSearchCheckboxes, TEntityAdvancedSearchFields,TEntityDisplayedColumns, TEntityQuery extends FieldValues>
export function ReturnSearchFields({ searchFields }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        gap: "5px 5px",
      }}
    >
      {Object.entries(searchFields).map(([searchField, searchFieldType]) => (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 3fr",
            alignItems: "center",
            gap: "5px 5px",
          }}
        >
          {(searchField.includes("min") || searchField.includes("From")) && (
            <Typography>from</Typography>
          )}
          {(searchField.includes("max") || searchField.includes("To")) && (
            <Typography>to</Typography>
          )}
          {!(
            searchField.includes("max") ||
            searchField.includes("To") ||
            searchField.includes("min") ||
            searchField.includes("From")
          ) && <Typography></Typography>}

          <OutlinedInput type={searchFieldType} size="small" />
        </Box>
      ))}
    </Box>
  );
}
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
    entityAdvancedSearchInfo,
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
        {Object.entries(entityAdvancedSearchInfo).map(([chb, searchFields]) => (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 3fr 6fr",
              alignItems: "center",
              gap: "5px 5px",
            }}
          >
            <Checkbox id={chb}></Checkbox>
            <Typography>{chb}</Typography>
            <ReturnSearchFields
              searchFields={searchFields}
            ></ReturnSearchFields>
          </Box>
        ))}
      </Collapse>
    </Stack>
  );
}
