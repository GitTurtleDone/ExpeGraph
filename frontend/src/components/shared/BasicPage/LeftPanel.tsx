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
import { userAdvancedSearchFieldSchema } from "../../../types/users";
import { gridAdditionalRowGroupsSelector } from "@mui/x-data-grid/internals";
import { Preview } from "@mui/icons-material";

// <TEntity, TentitySearchChb, TEntityAdvancedSearchFields,TEntityDisplayedColumns, TEntityQuery extends FieldValues>
export function ReturnAdvancedSearchFields({ searchFields }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        gap: "2px 10px",
      }}
    >
      {Object.entries(searchFields).map(([searchField, searchFieldType]) => (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "2fr 8fr",
            alignItems: "center",
            gap: "2px 5px",
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
  // TentitySearchChb,
  // TEntityAdvancedSearchFields,
  TEntityDisplayedColumns,
  TEntityQuery extends FieldValues,
>({ leftPanelProps }) {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState<boolean>(false);
  const {
    entityName,
    // entitySearchChb,
    // entityAdvancedSearchFields,
    entityAdvancedSearchInfo,
    entityDislayedColumns,
    getAllEntities,
    getEntityById,
  } = { ...leftPanelProps };
  
  const [searchFilters, setSearchFilters] = useState<{[key: string]: string | boolean | number | undefined}>({searchTxt: ""});
  const searchChb: {[key: string]: boolean} = {};
  Object.entries(entityAdvancedSearchInfo).map(([searchBoxKey, _]) => searchChb[searchBoxKey] = false);
  const [entitySearchChb, setEntitySearchChb] = useState<{[key:string]:boolean}>(searchChb);
  console.log(entitySearchChb);
  const handleSearchTxt= (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilters((prev) => ({...prev, ["searchTxt"]: e.target.value}));
    
  }
  const handleSearchChb = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEntitySearchChb((prev) => ({...prev, [e.target.name]: e.target.checked}));
    console.log(entitySearchChb);
  }

  // console.log(entitySearchChb);
  // console.log(entityName);
  return (
    <Stack>
      <Typography>Left Panel</Typography>
      <Box
        sx={{
          display: "flex",
        }}
      >
        <OutlinedInput
          name="searchTxt"
          type="string"
          placeholder={`Type to search for ${entityName}s`}
          value={searchFilters.searchTxt}
          onChange={handleSearchTxt}
          size="small"
          fullWidth
        />
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
              gridTemplateColumns: "0.5fr 2.5fr 7fr",
              alignItems: "center",
              gap: "5px 0px",
            }}
          >
            <Checkbox 
              name={chb} 
              checked={entitySearchChb[chb]}
              onChange={handleSearchChb}
            />
            <Typography>{chb}</Typography>
            <ReturnAdvancedSearchFields
              searchFields={searchFields}
            ></ReturnAdvancedSearchFields>
          </Box>
        ))}
      </Collapse>
    </Stack>
  );
}
