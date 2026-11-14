import React, { useState } from "react";

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
} from "@tanstack/react-query";
import type { UserQuery } from "../../../api/user";
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

import { camelToTitle } from "../../../api/basicAPI";

// function to return inputs in the advanced search
export function ReturnAdvancedSearchFields({
  searchFields,
  searchFilters,
  setSearchFilters,
  searchChbKey,
  searchChbVal,
}) {
  const handleAdvancedSearchFilters = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {};
  // console.log(`${searchChbKey}: ${searchChbVal}`);
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
          key={"searchField_" + searchField}
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

          <OutlinedInput
            name={searchField}
            type={searchFieldType}
            size="small"
            onChange={(e) => {
              searchChbVal &&
                setSearchFilters((prev) => ({
                  ...prev,
                  [searchField]: e.target.value,
                }));
            }}
            disabled={!searchChbVal}
          />
        </Box>
      ))}
    </Box>
  );
}
export default function LeftPanel<TEntity, TEntityQuery extends FieldValues>({
  leftPanelProps,
  selectedId,
  setSelectedId,
  selectedEntry,
  setSelectedEntry,
}) {
  const {
    entityName,

    entityAdvancedSearchInfo,
    entityDisplayedColDef,
    getAllEntities,
    getEntityById,
  } = { ...leftPanelProps };
  const [showAdvancedSearch, setShowAdvancedSearch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState({ searchTxt: "" });
  const [searchFilters, setSearchFilters] = useState<{
    [key: string]: string | boolean | number | undefined;
  }>({ searchTxt: "" });
  const searchChb: { [key: string]: boolean } = {};
  Object.entries(entityAdvancedSearchInfo).map(
    ([searchBoxKey, _]) => (searchChb[searchBoxKey] = false),
  );
  const [entitySearchChb, setEntitySearchChb] = useState<{
    [key: string]: boolean;
  }>(searchChb);

  const [searchTxt, setSearchTxt] = useState<string>("");
  const [enableSearch, setEnableSearch] = useState<boolean>(false);

  const handleSearchChb = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEntitySearchChb((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));
  };

  const queryClient = useQueryClient();
  const buildSearchQuery = () => {
    const q = { searchTxt: searchTxt.trim() ?? "" };
    Object.entries(entityAdvancedSearchInfo).map(([chb, searchFields]) => {
      entitySearchChb[chb] === true &&
        Object.entries(searchFields).map(([searchField, searchValue]) => {
          searchFilters[searchField] &&
            searchFilters[searchField] !== "" &&
            (q[searchField] = searchFilters[searchField]);
        });
    });
    setSearchQuery(q);
    return q;
  };

  const allEntities = useQuery({
    queryKey: [entityName, searchQuery],
    queryFn: () => getAllEntities(searchQuery),
    enabled: enableSearch,
  });

  const entityRows = (allEntities.data ?? []).map((ent) => {
    const col = { id: ent[entityName + "Id"] };
    entityDisplayedColDef.map((f) => {
      {
        f["field"] !== "id" && (col[f.field] = ent[f.field]);
      }
    });
    return col;
  });

  return (
    <Stack gap={2}>
      <Box
        sx={{
          display: "flex",
        }}
      >
        <OutlinedInput
          name="searchTxt"
          type="string"
          placeholder={`Type to search for ${entityName}s`}
          value={searchTxt}
          onChange={(e) => setSearchTxt(e.target.value)}
          size="small"
          fullWidth
        />
        <IconButton
          aria-label="Search"
          onClick={() => {
            setSelectedId();
            setSelectedEntry();
            setSearchQuery(buildSearchQuery());
            setEnableSearch(true);
          }}
        >
          <SearchOutlinedIcon />
        </IconButton>
      </Box>
      <Stack>
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
          {Object.entries(entityAdvancedSearchInfo).map(
            ([chb, searchFields]) => (
              <Box
                key={"advancedSearchChb_" + chb}
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
                <Typography>{camelToTitle(chb.slice(0, -3))}</Typography>
                <ReturnAdvancedSearchFields
                  searchFields={searchFields}
                  searchFilters={searchFilters}
                  setSearchFilters={setSearchFilters}
                  searchChbKey={chb}
                  searchChbVal={entitySearchChb[chb]}
                ></ReturnAdvancedSearchFields>
              </Box>
            ),
          )}
        </Collapse>
      </Stack>

      <Paper sx={{ height: "80%", width: "100%" }}>
        <DataGrid
          columns={entityDisplayedColDef}
          rows={entityRows}
          loading={allEntities.isFetching}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
                page: 0,
              },
            },
          }}
          pageSizeOptions={[5, 10, 100, { value: -1, label: "All" }]}
          showToolbar
          label={`List of found ${entityName}s`}
          onRowClick={(row) => {
            setSelectedId(row.id);
            (allEntities.data ?? []).map(
              (ent) => ent["userId"] === row.id && setSelectedEntry(ent),
            );
          }}
        />
      </Paper>
    </Stack>
  );
}
