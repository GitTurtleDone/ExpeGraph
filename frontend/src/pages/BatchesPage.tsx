import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Typography, Collapse, Stack, IconButton, Box, Checkbox, OutlinedInput, Button, InputAdornment, Paper } from "@mui/material";
import { useForm } from "react-hook-form";
import { ErrorMessage} from "@hookform/error-message";
import type { Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AddIcon from "@mui/icons-material/Add";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from "@mui/x-data-grid";
import { getAllBatches, getBatchById, createBatch, updateBatch, deleteBatch } from "../api/batch";
import * as z from "zod";

import  { batchSchema, batchInputSchema, type Batch, type BatchInput} from "../types/batches"
import {  OutletTwoTone } from "@mui/icons-material";

type BatchInputElementLayout = {
  label: string, optional: boolean, type: string, elementKey: Path<BatchInput>,  disabled: boolean, multiline?: Boolean | undefined
}

type BatchRow = {
  id: number,
  batchName: string,
  fabricationDate: string,
  treatment?: string,
}

export default function BatchesPage() {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [foundBatches, setFoundBatches] = useState<BatchRow[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch>();
  const [selectedId, setSelectedId] = useState<string|number>("");
  const batchDefaultValues = {
    batchName: "IrOxNewSM",
    description: "IrOx SBDs using new milled shadow masks",
    fabricationDate: "2024-12-01", // ISO demands YYYY-MM-DD
    treatment: "Standard treatment: Ohmic 450 C, 3min, N2, furnace. IrOx/Ir 40/40 nm",
    projectId:"",
    labId: "",
  }
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BatchInput>({
    resolver: zodResolver(batchInputSchema),
    defaultValues: batchDefaultValues,
  })
  
  const batchInputElementLayout : BatchInputElementLayout[] = [
    
    {label: "Batch Name", optional: false, type: "string", elementKey: "batchName", disabled: false },
    {label: "Description", optional: true, type: "string", elementKey: "description",  disabled: false },
    {label: "Fabrication Date", optional: false, type: "Date", elementKey: "fabricationDate", disabled: false },
    {label: "Treatment", optional: true, type: "string", elementKey: "treatment", disabled: false, multiline: true },
    {label: "Project ID", optional: true, type: "string", elementKey: "projectId", disabled: false }, 
    {label: "Lab ID", optional: true, type: "string", elementKey: "labId", disabled: false }, 
  ]
  const queryClient = useQueryClient()
  const allBatches = useQuery({
    queryKey: ["batches"],
    queryFn: getAllBatches
  })
  const onCreateBatch  = useMutation({
    mutationFn: createBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["batches"],
      });
      reset(batchDefaultValues);
    }
  })

  const onUpdateBatch = useMutation({
    mutationFn: ({ id, data }: { id: number; data: BatchInput }) => updateBatch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["batches"],
      });
    }
  })

  const addBatch = (data: BatchInput) => onCreateBatch.mutate(data);
  const batchColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70},
    { field: 'batchName', headerName: 'Batch Name', width: 140},
    { field: 'fabricationDate', headerName: 'Fabrication Date', width: 150},
    { field: 'treatment', headerName: 'Treatment', width: 100},
  ];

  const setBatchRows = () => {
    if (allBatches.data) {
      setFoundBatches(
        allBatches.data.map((b) => ({
            id: b.batchId, 
            batchName: b.batchName, 
            fabricationDate: b.fabricationDate, 
            treatment: b.treatment,
        }))
      );
    } 
  };
  
  const paginationModel = { page: 0, pageSize: 5};
  return (
    <Stack sx={{ alignItems: "flex-start"}}>
      <Typography variant="h2" mb={4}>Batches</Typography>
      <Box sx={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5}}>
        {/* Left Panel */}
        <Stack gap={2}>
          <Box sx={{display: "flex", gap: 1}}>
            <OutlinedInput 
              key="TextSearch" 
              sx={{width: "80%"}}
              placeholder="Search batches" 
              size="small"
            />
            <IconButton onClick={() => 
              setBatchRows()
            }
            >
              <SearchOutlinedIcon fontSize="large"></SearchOutlinedIcon>
            </IconButton>
          </Box>
          <Stack>
            <Box sx={{display:"flex", alignItems: "center"}}>
              <IconButton onClick={()=>setShowAdvancedSearch(!showAdvancedSearch)}>
                {showAdvancedSearch ?
                  <ExpandLessOutlinedIcon fontSize="large"/> 
                : <ChevronRightOutlinedIcon fontSize="large"/>}  
              </IconButton>
              <Typography>
                Addvanced search
              </Typography>
            </Box>
            <Collapse sx={{mt: 0}}in={showAdvancedSearch}>
              <Box sx={{display: "grid", gridTemplateColumns: "1fr 3fr 1fr 3fr 1fr 3fr", alignItems: "center", gap: "5px 5px"}}>
                <Checkbox defaultValue="false" />
                <Typography sx={{fontWeight: "bold"}} >ID range</Typography>
                <Typography> from </Typography>
                <OutlinedInput size="small" />
                <Typography sx={{marginLeft: 1.5}}>to</Typography>
                <OutlinedInput  size="small" />
                
                <Checkbox defaultValue="false" />
                <Typography sx={{fontWeight: "bold"}} >Fabrication date </Typography>
                <Typography> from </Typography>
                <OutlinedInput type="date" size="small" />
                <Typography sx={{marginLeft: 1.5}}>to</Typography>
                <OutlinedInput type="date"  size="small" />
              </Box>
            </Collapse>
          </Stack>
          
          
          
          {/* <Typography variant="h4" sx={{mt: 3}}>List of batches</Typography> */}
          <Paper sx={{height: "80%", width: "100%"}}>
            <DataGrid
              rows={foundBatches}
              columns={batchColumns}
              initialState={{ pagination: { paginationModel: {
                pageSize: 5, 
              }}}}
              pageSizeOptions= {[5, 10, 50]}
              checkboxSelection
              showToolbar
              label="List of found batches"
              onRowClick={(params)=>{
                setSelectedId(params.row.id)
                const batch = allBatches.data?.find((b) => b.batchId === params.row.id)
                setSelectedBatch(batch)
                if (!batch) return;
                reset({
                  batchName: batch.batchName,
                  description: batch.description ?? "",
                  fabricationDate: batch.fabricationDate,
                  treatment: batch.treatment ?? "",
                  projectId: batch.projectId ?? undefined,
                  labId: batch.labId ?? undefined,
                })

              }}
              sx={{ border: 0}}
            />

          </Paper>
            
        </Stack>
        {/* Left Panel */}
        
        {/* Right Panel */}
        <Stack>
          <Box key="batchId" display="grid" gridTemplateColumns="1fr 2fr" sx={{gap: 4, alignItems: "center", pt: 2}}>
            <Typography variant="h5" mb={2}>Batch ID</Typography>
            <OutlinedInput type="number" size="small" disabled value={selectedId} /> 
          
          </Box>
          { batchInputElementLayout.map((e) => 
            <Box key={e.label} display="grid" gridTemplateColumns="1fr 2fr" sx={{gap: 4, alignItems: "center", pt: 2}}>
              <Typography variant="h5" mb={2}>{e.label} {e.optional ? " " : " * "}</Typography>
              <Stack>
                <OutlinedInput  {...register(e.elementKey)} type={e.type} size="small" disabled={e.disabled} multiline={e.multiline} minRows={e.multiline ? 3 : 0}/>
                {/* Error message for each field */}
                <ErrorMessage 
                  errors={errors}
                  name={e.elementKey}
                  render={({message}) => (<Typography variant="caption" color="error">{message}</Typography>)}
                />
              </Stack>
              
            </Box>       
          )}
          <Typography variant="h6" pt={2}> * = Required</Typography>
          <Box sx={{display: "flex", gap: 5}}>
            <Button variant="contained" sx={{mt:3}} size="large" onClick={() =>{
                reset(batchDefaultValues)
                setSelectedId("")
              } 
              
              }> New 
            </Button>
            <Button variant="contained" sx={{mt:3}} size="large" onClick={handleSubmit(addBatch)}>
              {onCreateBatch.isPending ? "Adding ..." : "Add"}</Button>
            <Button
              variant="contained" sx={{mt:3}} size="large"
              disabled={selectedId === ""}
              onClick={handleSubmit((formData) =>
                onUpdateBatch.mutate({ id: Number(selectedId), data: formData })
              )}
            >
              {onUpdateBatch.isPending ? "Updating ..." : "Update"}
            </Button>
            <Button variant="contained" sx={{mt:3}} size="large" color="error" > Delete </Button>
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

  )
}


