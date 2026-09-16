import React, { useState } from "react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Typography, Collapse, Stack, IconButton, Box, Checkbox, OutlinedInput, Button, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";


import { useForm} from "react-hook-form";
import type { Path } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";
import { sampleSchema, sampleInputSchema, type Sample, type SampleInput  } from "../types/samples";

import { getAllSamples, createSample, updateSample, deleteSample } from "../api/sample";
import type { SampleQuery } from "../api/sample";
import { Preview } from "@mui/icons-material";

type SampleInputElementLayout = {
  label: string;
  optional:boolean;
  type: string;
  elementKey: Path<SampleInput>;
  disabled: boolean;
  multiline?: boolean | undefined;
};

type SearchCheckboxes = {
  idRangeChb: boolean,
  batchIdChb: boolean
}

type SampleRow = {
  id: number,
  sampleName: string,
  treatment: string,
  batchId: number
}
type SearchFields = {
  minId: string,
  maxId: string,
  batchId: string
}

export default function SamplesPage() {
  const sampleInputElementLayout: SampleInputElementLayout[] = [
    { label: "Name", optional: false, type: "string", elementKey: "sampleName", disabled: false},
    { label: "Description", optional: true, type: "string", elementKey: "description", disabled: false, multiline: true},
    { label: "Treatment", optional: true, type: "string", elementKey: "treatment", disabled: false, multiline: true},
    { label: "Properties", optional: true, type: "unknown", elementKey: "properties", disabled: false},
    { label: "Batch ID", optional: true, type: "number", elementKey: "batchId", disabled: false}
  ] 
  const sampleInputDefaultValue: SampleInput =  {
    sampleName: "Dev07",
    description: "3000 um in diameter diode",
    treatment: "Standard treatment",
    properties: "",
    batchId: 1
  }
  const [selectedId, setSelectedId] = useState(undefined);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchCheckboxes, setSearchCheckboxes] = useState<SearchCheckboxes>({
    idRangeChb: false,
    batchIdChb: false
  })
  const [searchText, setSearchText] = useState("");
  const [searchFilters, setSearchFilters] = useState<SearchFields>({
    minId: "",
    maxId: "",
    batchId: ""
  })
  const [filters, setFilters] = useState<SampleQuery>({})
  const [enableSearch, setEnableSearch] = useState(false);
  const {register, handleSubmit, reset, formState:{ errors, isSubmitting}} = useForm<SampleInput>({
    resolver: zodResolver(sampleInputSchema),
    defaultValues: sampleInputDefaultValue,
    
  }); 
  const onAddSample = async (data: SampleInput): Promise<Sample> => {
    createSample(data);
  } 
  const onUpdateSample = async (id: number, data: SampleInput): Promise<Sample> => {
    updateSample(id, data);
  }
  const onDeleteSample = async () => {
    if (selectedId && Number.isInteger(selectedId)){
      deleteSample(selectedId);
    } else {
      return (
        <Dialog
          open={openDeleteDialog}
          onClose={onCloseDeleteDialog}
        >
          <DialogTitle>
            Sample selected?
          </DialogTitle>
          <DialogContent>
            Did you select the sample to Delete?
          </DialogContent>
          <DialogActions>
            <Button
              type="outlined"
              onClick={onCloseDeleteDialog} 
              autoFocus
            >
            OK
            </Button>
          </DialogActions>
          
        </Dialog>
      )
    }
  }
  const onOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  }
  const onCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  }
   

  const sampleColumns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70},
    { field: "sampleName", headerName: "Sample Name", width: 140 },
    { field: "treatment", headerName: "Treatment", width: 140},
    { field: "batchId", headerName: "Batch ID", width: 70}
  ]
  // const allSamples = [
  //   {id: 1, sampleName: "Dev07", treatment: "Standard treatment", batchId: 1},
  //   {id: 2, sampleName: "Dev08", treatment: "Standard treatment", batchId: 1},
  //   {id: 3, sampleName: "Dev07", treatment: "Standard treatment", batchId: 1}
  // ]

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
  
  const allSamples = useQuery({
    queryKey: ["samples", filters],
    queryFn: () => getAllSamples(filters),
    enabled: enableSearch
  })

  const sampleRows: SampleRow[] = (allSamples.data ?? []).map((s) => ({
    id: s.sampleId, 
    sampleName: s.sampleName, 
    treatment: s.treatment, 
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
  const runSearch = () => {
    // build Search Filters
    setFilters(buildSearchFilters());
    console.log(searchFilters);
    setEnableSearch(true);

  }

 
  return (
    <Stack sx={{alignItems: "flex-start"}}>
      <Typography variant="h2" mb={4}>
        Samples
      </Typography>
      <Box sx={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5}}>
        {/* -- Lef panel--*/}
        <Stack gap={2}>
          <Box sx={{display:"grid", gridTemplateColumns: "9fr 1fr", gap: 1}}>
            <OutlinedInput 
              name="searchText"
              size="small" 
              placeholder="Search samples" 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") runSearch();
              }}
            />
            <IconButton onClick={runSearch}>
              <SearchOutlinedIcon fontSize="large"/>
            </IconButton>
          </Box>
          <Stack>
            <Box sx={{display:"flex", alignItems: "center", mt: 2}}>
              {showAdvancedSearch ? (
                <IconButton onClick={() => setShowAdvancedSearch(false)}>
                  <ExpandLessOutlinedIcon fontSize="large"/>
                </IconButton>
                
                ): (
                  <IconButton onClick={() => setShowAdvancedSearch(true)}>
                    <ChevronRightOutlinedIcon fontSize="large"/>
                  </IconButton>
              )}
              <Typography> Advanced Search</Typography>
            </Box>
            <Collapse
              in={showAdvancedSearch}
            >
              <Box sx={{display: "grid", gridTemplateColumns: "1fr 3fr 1fr 3fr 1fr 3fr", alignItems: "center", gap: "5px 5px"}}>
                <Checkbox 
                  name="idRangeChb" 
                  checked={searchCheckboxes.idRangeChb}
                  onChange={handleSearchChb}
                />
                <Typography sx={{fontWeight: "bold"}}>Id Range</Typography>
                <Typography>from</Typography>
                <OutlinedInput 
                  name="minId" 
                  value={searchFilters.minId} 
                  size="small"
                  onChange={handleSearchField}
                />
                <Typography>to</Typography>
                <OutlinedInput 
                  name="maxId" 
                  value={searchFilters.maxId} 
                  size="small"
                  onChange={handleSearchField}
                />

                <Checkbox 
                  name="batchIdChb" 
                  checked={searchCheckboxes.batchIdChb}
                  onChange={handleSearchChb}
                />
                <Typography sx={{fontWeight: "bold"}}>Batch Id</Typography>
                <Typography></Typography>
                <OutlinedInput 
                  name="batchId"
                  value={searchFilters.batchId} 
                  onChange={handleSearchField}
                  size="small"/>
                <Typography></Typography>
                <Typography></Typography>  
              </Box>
            </Collapse>
          </Stack>
          <Paper>
            <DataGrid 
              columns={sampleColumns}
              rows={sampleRows}
              initialState={{
                pagination: {
                  paginationModel: {pageSize: 5, page: 0}
                }
              }}
              pageSizeOptions={[5, 10, 100, {value: -1, label: "All"}]}
              checkboxSelection
              showToolbar
              label="List of found samples"
            />
          </Paper>  
        </Stack>
        {/* -- Right panel -- */}
        <Stack>
          <Box key="sampleId" display="grid" gridTemplateColumns="1fr 2fr" sx={{ gap: 4, alignItems: "center", pt:2}}>
            <Typography variant="h5">ID</Typography>
            <OutlinedInput type="number" size="small" disabled value={selectedId}></OutlinedInput>
          </Box>
            {sampleInputElementLayout.map((e) =>  
              <Box key={e.label} display="grid" gridTemplateColumns="1fr 2fr" sx={{ gap: 4, alignItems: "center", pt: 2}}>
                <Typography variant="h5">{e.label}{!e.optional ? "*": ""}</Typography>
                <Stack>
                  <OutlinedInput type={e.type} size="small" {...register(e.elementKey)}></OutlinedInput>
                  <ErrorMessage
                    errors={errors}
                    name={e.elementKey}
                    render={({message}) => <Typography variant="caption" color="error">{message}</Typography>}
                  />
                </Stack>
                
              </Box>
            )}
          <Typography variant="h6" mt={2} mb={3}>* = Required</Typography>
          <Box sx={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => reset(sampleInputDefaultValue)}
            >
              New
            </Button>
            <Button 
              variant="contained" 
              size="large" 
              disabled={isSubmitting ? true : false}
              onClick={handleSubmit(onAddSample)}
            >
              {isSubmitting ? "Adding new sample" : "Add"}
            </Button>
            
            <Button
              variant="contained"
              size="large"
              disabled= {selectedId ? false: true}
              onClick={handleSubmit(onUpdateSample)}
            >
              Update
            </Button>
            <Button
              variant="contained"
              size="large"
              color="error"
              disabled={selectedId ? false: true}
              onClick={onDeleteSample}
            >
              Delete
            </Button>
          </Box>
        </Stack>
      </Box>
    </Stack>

  );
}
