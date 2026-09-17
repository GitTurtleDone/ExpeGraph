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
} from "@mui/material";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";



import { useForm, type Path} from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";
import { 
  sampleSchema, 
  sampleInputSchema, 
  type Sample, 
  type SampleInput  
} from "../types/samples";

import { 
  getAllSamples, 
  createSample, 
  updateSample, 
  deleteSample 
} from "../api/sample";
import type { SampleQuery } from "../api/sample";
import { isNumber } from "@mui/x-data-grid/internals";


type SampleInputElementLayout = {
  label: string;
  optional:boolean;
  type: string;
  elementKey: Path<SampleInput>;
  disabled: boolean;
  multiline?: boolean | undefined;
};

// For displaying in a GridData
type SampleRow = {
  id: number,
  sampleName: string,
  description: string,
  batchId: number
}

type SearchCheckboxes = {
  idRangeChb: boolean,
  batchIdChb: boolean
}

type SearchFields = {
  minId: string,
  maxId: string,
  batchId: string
}

export default function SamplesPage() {
  // useStates
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [selectedSample, setSelectedSample] = useState<Sample | undefined>();
    // seaching
  const [searchText, setSearchText] = useState("");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchCheckboxes, setSearchCheckboxes] = useState<SearchCheckboxes>({
    idRangeChb: false,
    batchIdChb: false
  })
  const [searchFilters, setSearchFilters] = useState<SearchFields>({
    minId: "",
    maxId: "",
    batchId: ""
  })
  const [filters, setFilters] = useState<SampleQuery>({})
  const [enableSearch, setEnableSearch] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({ 
    type: 'include', ids: new Set()
  })
  const [openDeleteWarningDialog, setOpenDeleteWarningDialog] = useState(false);
  const [openDeleteConfirmingDialog, setOpenDeleteConfirmingDialog] = useState(false);

  //Right panel parameters
  const sampleInputElementLayout: SampleInputElementLayout[] = [
    { 
      label: "Name", 
      optional: false, 
      type: "string", 
      elementKey: "sampleName", 
      disabled: false
    },
    { 
      label: "Description", 
      optional: true, 
      type: "string", 
      elementKey: "description", 
      disabled: false, 
      multiline: true
    },
    { 
      label: "Treatment", 
      optional: true, type: "string", 
      elementKey: "treatment", 
      disabled: false, 
      multiline: true},
    { 
      label: "Properties", 
      optional: true, 
      type: "unknown", 
      elementKey: "properties", 
      disabled: false},
    { 
      label: "Batch ID", 
      optional: true, 
      type: "number", 
      elementKey: "batchId", 
      disabled: false}
  ] 
  const sampleInputDefaultValues: SampleInput =  {
    sampleName: "Dev07",
    description: "3000 um in diameter diode",
    treatment: "Standard treatment",
    properties: "",
    batchId: 1
  }
  
  const {
    register, 
    handleSubmit, 
    reset, 
    formState:{ errors, isSubmitting},
  } = useForm<SampleInput>({
    resolver: zodResolver(sampleInputSchema),
    defaultValues: sampleInputDefaultValues,
  }); 
  
  const sampleColumns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 75},
    { field: "sampleName", headerName: "Sample Name", width: 100},
    { field: "description", headerName: "Description", width: 250},
    { field: "batchId", headerName: "Batch ID", width: 75}
  ]

  // GET
  
  
  const allSamples = useQuery({
    queryKey: ["samples", filters],
    queryFn: () => getAllSamples(filters),
    enabled: enableSearch
  })
  const sampleRows: SampleRow[] = (allSamples.data ?? []).map((s) => ({
    id: s.sampleId, 
    sampleName: s.sampleName, 
    description: s.description, 
    batchId: s.batchId}))
  const handleSearchChb = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCheckboxes((prev) => ({
      ...prev,
      [event.target.name]: event.target.checked
    }))
  }
  const handleSearchField = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilters((prev) => ({
      ...prev, 
      [event.target.name]: event.target.value
    }))
  }
  const buildSearchFilters = ():SampleQuery => {
    const f: SampleQuery = {};
    if (searchText.trim()) f.search = searchText.trim();
    if (searchCheckboxes.idRangeChb) {
      if (searchFilters.minId !== "") f.minId = Number(searchFilters.minId);
      if (searchFilters.maxId !== "") f.maxId = Number(searchFilters.maxId);
    }
    if (searchCheckboxes.batchIdChb && searchFilters.batchId !== "") 
      f.batchId = Number(searchFilters.batchId);
    return f;
  };
  const runSearch = () => {
    setFilters(buildSearchFilters());
    setEnableSearch(true);
  }

  const queryClient = useQueryClient()
  
  // CREATE
  const onCreateSample = useMutation({
    mutationFn: createSample,
    onSuccess: async (newSample) =>{
      setSelectedSample(newSample);
      setSelectedId(newSample.sampleId);
      setRowSelectionModel({type: 'include', ids: new Set()})
      await queryClient.invalidateQueries({
        queryKey: ["samples"]
      });
    }
  }) 

  // UPDATE
  const onUpdateSample = useMutation({
    mutationFn: ({ id, data}: {id: number, data: SampleInput}) => updateSample(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["samples"]
      });
    }
  })
  
  const onDeleteSample = useMutation({
    mutationFn: async () => await deleteSample(Number(selectedId)),
    onSuccess: async () => {
      onOpenDeleteConfirmingDialog();
      await queryClient.invalidateQueries({queryKey: ["samples"]});
      
    }
  })
  const onOpenDeleteWarningDialog = () => {
    setOpenDeleteWarningDialog(true);
  }
  const onCloseDeleteWarningDialog = () => {
    setOpenDeleteWarningDialog(false);
  }
  const onOpenDeleteConfirmingDialog = () => {
    setOpenDeleteConfirmingDialog(true);
  }
  const onCloseDeleteConfirmingDialog = () => {
    setOpenDeleteConfirmingDialog(false);
  }
 
  return (
    <Stack sx={{alignItems: "flex-start"}}>
      <Typography variant="h2" mb={4}>
        Samples
      </Typography>
      <Box sx={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5}}>
        {/* -- Lef panel--*/}
        <Stack gap={2}>
          <Box sx={{display:"flex", gap: 1}}>
            <OutlinedInput 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") runSearch();
              }}
              sx={{width: "80%"}}
              placeholder="Search samples" 
              size="small" 
            />
            <IconButton onClick={runSearch}>
              <SearchOutlinedIcon fontSize="large"/>
            </IconButton>
          </Box>
          <Stack>
            <Box sx={{display:"flex", alignItems: "center"}}>
              <IconButton
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              >
                {showAdvancedSearch ? (
                  <ExpandLessOutlinedIcon fontSize="large" />
                ) : (
                  <ChevronRightOutlinedIcon fontSize="large" />
                )}
              </IconButton>
              <Typography> Advanced Search</Typography>
            </Box>
            <Collapse
              in={showAdvancedSearch}
            >
              <Box sx={{
                display: "grid", 
                gridTemplateColumns: "1fr 3fr 1fr 3fr 1fr 3fr", 
                alignItems: "center", 
                gap: "5px 5px"
              }}>
                <Checkbox 
                  name="idRangeChb" 
                  checked={searchCheckboxes.idRangeChb}
                  onChange={handleSearchChb}
                />
                <Typography sx={{fontWeight: "bold"}}>Id Range</Typography>
                <Typography>from</Typography>
                <OutlinedInput 
                  size="small"
                  type="number"
                  name="minId" 
                  value={searchFilters.minId} 
                  onChange={handleSearchField}
                  disabled={!searchCheckboxes.idRangeChb}
                />
                <Typography sx={{ marginLeft: 1.5 }}>to</Typography>
                <OutlinedInput 
                  size="small"
                  type="number"
                  name="maxId" 
                  value={searchFilters.maxId} 
                  onChange={handleSearchField}
                  disabled={!searchCheckboxes.batchIdChb}
                />
                <Checkbox 
                  name="batchIdChb" 
                  checked={searchCheckboxes.batchIdChb}
                  onChange={handleSearchChb}
                />
                <Typography sx={{fontWeight: "bold"}}>Batch Id</Typography>
                <Typography></Typography>
                <OutlinedInput 
                  size="small"
                  type="number"
                  name="batchId"
                  value={searchFilters.batchId} 
                  onChange={handleSearchField}
                  disabled={!searchCheckboxes.batchIdChb}
                  />
                <Typography></Typography>
                <Typography></Typography>  
              </Box>
            </Collapse>
          </Stack>
          <Paper sx={{ height: "80%", width: "100%" }}>
            <DataGrid 
              columns={sampleColumns}
              rows={sampleRows}
              loading={allSamples.isFetching}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5, 
                    page: 0
                  }
                }
              }}
              pageSizeOptions={[5, 10, 100, {value: -1, label: "All"}]}
              checkboxSelection
              showToolbar
              label="List of found samples"
              onRowClick={(params) => {
                setSelectedId(params.row.id)
                const sample = allSamples.data?.find(
                  (s) => s.sampleId === params.row.id
                );
                if (!sample) return;
                reset({
                  sampleName: sample.sampleName,
                  description: sample.description ?? "",
                  treatment: sample.treatment ?? "",
                  properties: sample.properties ?? undefined,
                  batchId: sample.batchId ?? undefined,
                })
              }}
              rowSelectionModel={rowSelectionModel}
              onRowSelectionModelChange={(newRowSelectionModel) => {
                setRowSelectionModel(newRowSelectionModel)
              }}
            />
          </Paper>  
        </Stack>
        {/* -- Right panel -- */}
        <Stack>
          <Box 
            key="sampleId" 
            display="grid" 
            gridTemplateColumns="1fr 2fr" 
            sx={{ gap: 4, alignItems: "center", pt:2}}
          >
            <Typography variant="h5"> 
              Sample ID
            </Typography>
            <OutlinedInput 
              type="number" 
              size="small" 
              disabled 
              value={selectedId}
              />
          </Box>
          {sampleInputElementLayout.map((e) =>  
            <Box 
              key={e.label} 
              display="grid" 
              gridTemplateColumns="1fr 2fr" 
              sx={{ gap: 4, alignItems: "center", pt: 2}}
            >
              <Typography variant="h5" mb={2}>
                {e.label}{e.optional ? "": "*"}
              </Typography>
              <Stack>
                <OutlinedInput 
                  {...register(e.elementKey)} 
                  type={e.type} 
                  size="small" 
                  multiline={e.multiline}
                  minRows={e.multiline ? 3 : 0}
                />
                <ErrorMessage
                  errors={errors}
                  name={e.elementKey}
                  render={({message}) => 
                    <Typography variant="caption" color="error">
                      {message}
                    </Typography>}
                />
              </Stack>
              
            </Box>
          )}
          <Typography variant="h6" pt={2} mb={3} >
            {" "}
            * = Required
          </Typography>
          <Box sx={{display: "flex", gap: 5 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                reset(sampleInputDefaultValues);
                setSelectedId("");
                setSelectedSample(undefined);
                setRowSelectionModel({type: 'include', ids: new Set()});
              }}  
            >
              New
            </Button>
            <Button 
              variant="contained" 
              size="large" 
              disabled={isSubmitting ? true : false}
              onClick={handleSubmit((formData) => {
                onCreateSample.mutate(formData)
              })}
            >
              {onCreateSample.isPending ? "Adding ..." : "Add"}
            </Button>
            <Button
              variant="contained"
              size="large"
              disabled= {selectedId ? false: true}
              onClick={handleSubmit((formData) => {
                onUpdateSample.mutate({
                  id: Number(selectedId),
                  data: formData
                })
              })}
            >
              {onUpdateSample.isPending ? "Updating ..." : "Update"}
            </Button>
            <Button
              variant="contained"
              size="large"
              color="error"
              disabled={selectedId ? false: true}
              onClick={onOpenDeleteWarningDialog}
            >
              Delete
            </Button>
          </Box>
          {/* Right Panel */}
        </Stack>
      </Box>
      <Dialog
          open={openDeleteWarningDialog}
          onClose={onCloseDeleteWarningDialog}
        >
          <DialogTitle>
            Delete Sample?
          </DialogTitle>
          <DialogContent>
            Do you really want to delete sample {selectedId} ?
          </DialogContent>
          
          <DialogActions>
            <Button
              onClick={onCloseDeleteWarningDialog} 
              autoFocus
            >
            No
            </Button>
            <Button
              onClick={() => {
                onCloseDeleteWarningDialog();
                onDeleteSample.mutate();
              }} 
            >
            Yes
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openDeleteConfirmingDialog}
          onClose={onCloseDeleteConfirmingDialog}
        >
        <DialogTitle>Confirming Delete Sample</DialogTitle>
        <DialogContent>Sample {selectedId} was deleted.</DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              onCloseDeleteConfirmingDialog();
              setSelectedId("");
              setSelectedSample(undefined);
              setRowSelectionModel({
                type: 'include', 
                ids: new Set()
              });
              reset(sampleInputDefaultValues);
            }}
          >
            OK
          </Button>
        </DialogActions>
        </Dialog> 
    </Stack>
  );
}
