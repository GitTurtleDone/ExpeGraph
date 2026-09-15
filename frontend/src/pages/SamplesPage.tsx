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

type SampleInputElementLayout = {
  label: string;
  optional:boolean;
  type: string;
  elementKey: Path<SampleInput>;
  disabled: boolean;
  multiline?: boolean | undefined;
};

type SearchCheckboxes = {
  idRange: boolean,
  batchIdRange: boolean
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
    idRange: false,
    batchIdRange: false
  })
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
  const handleSearchChb = () => {

  }
 
  return (
    <Stack sx={{alignItems: "flex-start"}}>
      <Typography variant="h2" mb={4}>
        Samples
      </Typography>
      <Box sx={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5}}>
        {/* -- Lef panel--*/}
        <Stack>
          <Box sx={{display:"grid", gridTemplateColumns: "9fr 1fr", gap: 1}}>
            <OutlinedInput size="small" placeholder="Search samples" />
            <IconButton>
              <SearchOutlinedIcon fontSize="large"/>
            </IconButton>
          </Box>
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
              <Checkbox id="idRangeCheckBox" onClick={() => setAdvancedSearchCheckBoxValues()}checked={advancedSearchCheckBoxValues.idRange}/>
              <Typography>Id Range</Typography>
              <Typography>from</Typography>
              <OutlinedInput size="small"/>
              <Typography>to</Typography>
              <OutlinedInput size="small"/>

              <Checkbox 
                id="batchIdRange" 
                checked={advancedSearchCheckBoxValues.batchIdRange}
                onChange={}
              />
              <Typography>Batch Id Range</Typography>
              <Typography>from</Typography>
              <OutlinedInput size="small"/>
              <Typography>to</Typography>
              <OutlinedInput size="small"/>

              
            </Box>
          </Collapse>
        
          
          
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
