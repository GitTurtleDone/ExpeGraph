import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Typography,
  Collapse,
  Stack,
  IconButton,
  Box,
  Checkbox,
  OutlinedInput,
  Button,
  InputAdornment,
  Paper,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import type { Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AddIcon from "@mui/icons-material/Add";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import {
  getAllBatches,
  getBatchById,
  createBatch,
  updateBatch,
  deleteBatch,
  type BatchQuery,
} from "../api/batch";
import * as z from "zod";

import {
  batchSchema,
  batchInputSchema,
  type Batch,
  type BatchInput,
} from "../types/batches";
import { OutletTwoTone } from "@mui/icons-material";

type BatchInputElementLayout = {
  label: string;
  optional: boolean;
  type: string;
  elementKey: Path<BatchInput>;
  disabled: boolean;
  multiline?: Boolean | undefined;
};

type BatchRow = {
  id: number;
  batchName: string;
  fabricationDate: string;
  treatment?: string;
};

type SearchCheckboxes = {
  idRangeChb: boolean;
  fabricationDateRangeChb: boolean;
  projectIdChb: boolean;
  labIdChb: boolean;
};

// Raw text of the advanced-search inputs. Kept as strings because that is what
// <OutlinedInput> gives back; converted to numbers only in buildSearchFilters().
type SearchFields = {
  minId: string;
  maxId: string;
  fabricatedFrom: string;
  fabricatedTo: string;
  projectId: string;
  labId: string;
};

export default function BatchesPage() {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch>();
  const [selectedId, setSelectedId] = useState<string | number>("");
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<BatchQuery>({});
  const [searchCheckboxes, setSearchCheckboxes] = useState<SearchCheckboxes>({
    idRangeChb: false,
    fabricationDateRangeChb: false,
    projectIdChb: false,
    labIdChb: false,
  });
  const [searchFields, setSearchFields] = useState<SearchFields>({
    minId: "",
    maxId: "",
    fabricatedFrom: "",
    fabricatedTo: "",
    projectId: "",
    labId: "",
  });
  const batchDefaultValues = {
    batchName: "IrOxNewSM",
    description: "IrOx SBDs using new milled shadow masks",
    fabricationDate: "2024-12-01", // ISO demands YYYY-MM-DD
    treatment:
      "Standard treatment: Ohmic 450 C, 3min, N2, furnace. IrOx/Ir 40/40 nm",
    projectId: "",
    labId: "",
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BatchInput>({
    resolver: zodResolver(batchInputSchema),
    defaultValues: batchDefaultValues,
  });

  const batchInputElementLayout: BatchInputElementLayout[] = [
    {
      label: "Batch Name",
      optional: false,
      type: "string",
      elementKey: "batchName",
      disabled: false,
    },
    {
      label: "Description",
      optional: true,
      type: "string",
      elementKey: "description",
      disabled: false,
    },
    {
      label: "Fabrication Date",
      optional: false,
      type: "Date",
      elementKey: "fabricationDate",
      disabled: false,
    },
    {
      label: "Treatment",
      optional: true,
      type: "string",
      elementKey: "treatment",
      disabled: false,
      multiline: true,
    },
    {
      label: "Project ID",
      optional: true,
      type: "string",
      elementKey: "projectId",
      disabled: false,
    },
    {
      label: "Lab ID",
      optional: true,
      type: "string",
      elementKey: "labId",
      disabled: false,
    },
  ];
  const queryClient = useQueryClient();
  const allBatches = useQuery({
    queryKey: ["batches", filters],
    queryFn: () => getAllBatches(filters),
  });
  const onCreateBatch = useMutation({
    mutationFn: createBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["batches"],
      });
      reset(batchDefaultValues);
    },
  });

  const onUpdateBatch = useMutation({
    mutationFn: ({ id, data }: { id: number; data: BatchInput }) =>
      updateBatch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["batches"],
      });
    },
  });

  const addBatch = (data: BatchInput) => onCreateBatch.mutate(data);
  const batchColumns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "batchName", headerName: "Batch Name", width: 140 },
    { field: "fabricationDate", headerName: "Fabrication Date", width: 150 },
    { field: "treatment", headerName: "Treatment", width: 100 },
  ];

  // Grid rows are derived straight from the query result: the server already
  // applied "filters", so there is nothing left to filter on the client.
  const batchRows: BatchRow[] = (allBatches.data ?? []).map((b) => ({
    id: b.batchId,
    batchName: b.batchName,
    fabricationDate: b.fabricationDate,
    treatment: b.treatment,
  }));

  const handleSearchChb = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCheckboxes((prev) => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));
  };

  const handleSearchField = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFields((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  // A field only reaches the query string when its checkbox is ticked AND it is
  // non-empty. An absent key means "do not filter on this".
  const buildSearchFilters = (): BatchQuery => {
    const f: BatchQuery = {};
    if (searchText.trim()) f.search = searchText.trim();
    if (searchCheckboxes.idRangeChb) {
      if (searchFields.minId !== "") f.minId = Number(searchFields.minId);
      if (searchFields.maxId !== "") f.maxId = Number(searchFields.maxId);
    }
    if (searchCheckboxes.fabricationDateRangeChb) {
      if (searchFields.fabricatedFrom)
        f.fabricatedFrom = searchFields.fabricatedFrom;
      if (searchFields.fabricatedTo) f.fabricatedTo = searchFields.fabricatedTo;
    }
    if (searchCheckboxes.projectIdChb && searchFields.projectId !== "") {
      f.projectId = Number(searchFields.projectId);
    }
    if (searchCheckboxes.labIdChb && searchFields.labId !== "") {
      f.labId = Number(searchFields.labId);
    }

    return f;
  };

  // Setting "filters" changes the queryKey, which is what makes TanStack refetch.
  const runSearch = () => setFilters(buildSearchFilters());

  return (
    <Stack sx={{ alignItems: "flex-start" }}>
      <Typography variant="h2" mb={4}>
        Batches
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
        {/* Left Panel */}
        <Stack gap={2}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <OutlinedInput
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") runSearch();
              }}
              sx={{ width: "80%" }}
              placeholder="Search batches"
              size="small"
            />
            <IconButton onClick={runSearch}>
              <SearchOutlinedIcon fontSize="large"></SearchOutlinedIcon>
            </IconButton>
          </Box>
          <Stack>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              >
                {showAdvancedSearch ? (
                  <ExpandLessOutlinedIcon fontSize="large" />
                ) : (
                  <ChevronRightOutlinedIcon fontSize="large" />
                )}
              </IconButton>
              <Typography>Addvanced search</Typography>
            </Box>
            <Collapse sx={{ mt: 0 }} in={showAdvancedSearch}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 3fr 1fr 3fr 1fr 3fr",
                  alignItems: "center",
                  gap: "5px 5px",
                }}
              >
                <Checkbox
                  name="idRangeChb"
                  checked={searchCheckboxes.idRangeChb}
                  onChange={handleSearchChb}
                />
                <Typography sx={{ fontWeight: "bold" }}>ID range</Typography>
                <Typography> from </Typography>
                <OutlinedInput
                  size="small"
                  type="number"
                  name="minId"
                  value={searchFields.minId}
                  onChange={handleSearchField}
                  disabled={!searchCheckboxes.idRangeChb}
                />
                <Typography sx={{ marginLeft: 1.5 }}>to</Typography>
                <OutlinedInput
                  size="small"
                  type="number"
                  name="maxId"
                  value={searchFields.maxId}
                  onChange={handleSearchField}
                  disabled={!searchCheckboxes.idRangeChb}
                />
                <Checkbox
                  name="fabricationDateRangeChb"
                  checked={searchCheckboxes.fabricationDateRangeChb}
                  onChange={handleSearchChb}
                />
                <Typography sx={{ fontWeight: "bold" }}>
                  Fabrication date range
                </Typography>
                <Typography> from </Typography>
                <OutlinedInput
                  type="date"
                  size="small"
                  name="fabricatedFrom"
                  value={searchFields.fabricatedFrom}
                  onChange={handleSearchField}
                  disabled={!searchCheckboxes.fabricationDateRangeChb}
                />
                <Typography sx={{ marginLeft: 1.5 }}>to</Typography>
                <OutlinedInput
                  type="date"
                  size="small"
                  name="fabricatedTo"
                  value={searchFields.fabricatedTo}
                  onChange={handleSearchField}
                  disabled={!searchCheckboxes.fabricationDateRangeChb}
                />
                <Checkbox
                  name="projectIdChb"
                  checked={searchCheckboxes.projectIdChb}
                  onChange={handleSearchChb}
                />
                <Typography sx={{ fontWeight: "bold" }}>Project Id</Typography>
                <Typography></Typography>{" "}
                {/*  empty element to meet grid layout */}
                <OutlinedInput
                  size="small"
                  type="number"
                  name="projectId"
                  value={searchFields.projectId}
                  onChange={handleSearchField}
                  disabled={!searchCheckboxes.projectIdChb}
                />
                <Typography></Typography>
                <Typography></Typography>
                <Checkbox
                  name="labIdChb"
                  checked={searchCheckboxes.labIdChb}
                  onChange={handleSearchChb}
                />
                <Typography sx={{ fontWeight: "bold" }}>Lab Id</Typography>
                <Typography></Typography>{" "}
                {/*  empty element to meet grid layout */}
                <OutlinedInput
                  size="small"
                  type="number"
                  name="labId"
                  value={searchFields.labId}
                  onChange={handleSearchField}
                  disabled={!searchCheckboxes.labIdChb}
                />
                <Typography></Typography>
                <Typography></Typography>
              </Box>
            </Collapse>
          </Stack>

          {/* <Typography variant="h4" sx={{mt: 3}}>List of batches</Typography> */}
          <Paper sx={{ height: "80%", width: "100%" }}>
            <DataGrid
              rows={batchRows}
              columns={batchColumns}
              loading={allBatches.isFetching}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5, 10, 50]}
              checkboxSelection
              showToolbar
              label="List of found batches"
              onRowClick={(params) => {
                setSelectedId(params.row.id);
                const batch = allBatches.data?.find(
                  (b) => b.batchId === params.row.id,
                );
                setSelectedBatch(batch);
                if (!batch) return;
                reset({
                  batchName: batch.batchName,
                  description: batch.description ?? "",
                  fabricationDate: batch.fabricationDate,
                  treatment: batch.treatment ?? "",
                  projectId: batch.projectId ?? undefined,
                  labId: batch.labId ?? undefined,
                });
              }}
              sx={{ border: 0 }}
            />
          </Paper>
        </Stack>
        {/* Left Panel */}

        {/* Right Panel */}
        <Stack>
          <Box
            key="batchId"
            display="grid"
            gridTemplateColumns="1fr 2fr"
            sx={{ gap: 4, alignItems: "center", pt: 2 }}
          >
            <Typography variant="h5" mb={2}>
              Batch ID
            </Typography>
            <OutlinedInput
              type="number"
              size="small"
              disabled
              value={selectedId}
            />
          </Box>
          {batchInputElementLayout.map((e) => (
            <Box
              key={e.label}
              display="grid"
              gridTemplateColumns="1fr 2fr"
              sx={{ gap: 4, alignItems: "center", pt: 2 }}
            >
              <Typography variant="h5" mb={2}>
                {e.label} {e.optional ? " " : " * "}
              </Typography>
              <Stack>
                <OutlinedInput
                  {...register(e.elementKey)}
                  type={e.type}
                  size="small"
                  disabled={e.disabled}
                  multiline={e.multiline}
                  minRows={e.multiline ? 3 : 0}
                />
                {/* Error message for each field */}
                <ErrorMessage
                  errors={errors}
                  name={e.elementKey}
                  render={({ message }) => (
                    <Typography variant="caption" color="error">
                      {message}
                    </Typography>
                  )}
                />
              </Stack>
            </Box>
          ))}
          <Typography variant="h6" pt={2}>
            {" "}
            * = Required
          </Typography>
          <Box sx={{ display: "flex", gap: 5 }}>
            <Button
              variant="contained"
              sx={{ mt: 3 }}
              size="large"
              onClick={() => {
                reset(batchDefaultValues);
                setSelectedId("");
              }}
            >
              {" "}
              New
            </Button>
            <Button
              variant="contained"
              sx={{ mt: 3 }}
              size="large"
              onClick={handleSubmit(addBatch)}
            >
              {onCreateBatch.isPending ? "Adding ..." : "Add"}
            </Button>
            <Button
              variant="contained"
              sx={{ mt: 3 }}
              size="large"
              disabled={selectedId === ""}
              onClick={handleSubmit((formData) =>
                onUpdateBatch.mutate({
                  id: Number(selectedId),
                  data: formData,
                }),
              )}
            >
              {onUpdateBatch.isPending ? "Updating ..." : "Update"}
            </Button>
            <Button
              variant="contained"
              sx={{ mt: 3 }}
              size="large"
              color="error"
            >
              {" "}
              Delete{" "}
            </Button>
          </Box>
          {/* Right Panel */}
        </Stack>
      </Box>

      {/*  Add a batch */}
      {/* <Box sx={{display: "flex", alignItems: "center"}}>
        <IconButton
          onClick={() => setShowAddBatch(!showAddBatch)}
        >
          {showAddBatch 
            ? <ExpandLessOutlinedIcon fontSize="large"/>
            : <ChevronRightOutlinedIcon fontSize="large"/>
          }
        </IconButton>
        <Typography variant="h4"> Add a batch</Typography>
      </Box> */}

      {/* Find a batch by Fabrication Date, Treatment, ProjectId, Keyword */}
    </Stack>
  );
}
