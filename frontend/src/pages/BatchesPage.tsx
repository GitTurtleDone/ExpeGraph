import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Typography, Collapse, Stack, IconButton, Box, Checkbox, OutlinedInput, Button, InputAdornment } from "@mui/material";
import { useForm } from "react-hook-form";
import type { Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AddIcon from "@mui/icons-material/Add";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { createBatch } from "../api/batch";
import * as z from "zod";

import  { batchSchema, batchInputSchema, type Batch, type BatchInput} from "../types/batches"
import {  OutletTwoTone } from "@mui/icons-material";

type BatchInputElementLayout = {
  label: string, optional: boolean, type: string, elementKey: Path<BatchInput> | string, registered: boolean, disabled: boolean, multiline?: Boolean | undefined
}

export default function BatchesPage() {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BatchInput>({
    resolver: zodResolver(batchInputSchema),
    defaultValues: {
      batchName: "IrOxNewSM",
      description: "IrOx SBDs using new milled shadow masks",
      fabricationDate: "2024-12-01", // ISO demands YYYY-MM-DD
      treatment: "Standard treatment: Ohmic 450 C, 3min, N2, furnace. IrOx/Ir 40/40 nm",
      projectId: "",
      labId: ""
    }
  })
  const batchInputElementLayout : BatchInputElementLayout[] = [
    {label: "Batch ID", optional: true, type: "string", elementKey: "batchId", registered: false, disabled: true },
    {label: "Batch Name", optional: false, type: "string", elementKey: "batchName", registered: true, disabled: false },
    {label: "Description", optional: true, type: "string", elementKey: "description", registered: true, disabled: false },
    {label: "Fabrication Date", optional: true, type: "date", elementKey: "fabricationDate", registered: true, disabled: false },
    {label: "Treatment", optional: true, type: "string", elementKey: "treatment", registered: true, disabled: false, multiline: true },
    {label: "Project ID", optional: true, type: "string", elementKey: "projectId", registered: true, disabled: false }, 
    {label: "Lab ID", optional: true, type: "string", elementKey: "labId", registered: true, disabled: false }, 
  ]
  const queryClient = useQueryClient()
  const onCreateBatch  = useMutation({
    mutationFn: createBatch,
    onSuccess: () => {
      queryClient.invalidateQueries()
    }


  })
  
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
            />
            <IconButton>
              <SearchOutlinedIcon fontSize="large"></SearchOutlinedIcon>
            </IconButton>
          </Box>
          
          <Box sx={{display:"flex", alignItems: "center"}}>
            <IconButton onClick={()=>setShowAdvancedSearch(!showAdvancedSearch)}>
              {showAdvancedSearch ?
                <ExpandLessOutlinedIcon fontSize="large"/> 
              : <ChevronRightOutlinedIcon fontSize="large"/>}  
            </IconButton>
            <Typography variant="h6">
              Addvanced search by: 
            </Typography>
          </Box>
          
          <Collapse in={showAdvancedSearch}>
            <Box sx={{display: "grid", gridTemplateColumns: "1fr 3fr 1fr 3fr 1fr 3fr", alignItems: "center", gap: "5px 5px"}}>
              <Checkbox defaultValue="false"></Checkbox>
              <Typography sx={{fontWeight: "bold"}} >ID range</Typography>
              <Typography> from </Typography>
              <OutlinedInput size="small"></OutlinedInput>
              <Typography sx={{marginLeft: 1.5}}>to</Typography>
              <OutlinedInput  size="small"></OutlinedInput>
              
              <Checkbox defaultValue="false"></Checkbox>
              <Typography sx={{fontWeight: "bold"}} >Fabrication date </Typography>
              <Typography> from </Typography>
              <OutlinedInput type="date" size="small"></OutlinedInput>
              <Typography sx={{marginLeft: 1.5}}>to</Typography>
              <OutlinedInput type="date"  size="small"></OutlinedInput>  
            </Box>
            
          </Collapse>
           
            
        </Stack>
        {/* Left Panel */}
        
        {/* Right Panel */}
        <Stack>
          { batchInputElementLayout.map((e) => 
            <Box key={e.label} display="grid" gridTemplateColumns="1fr 2fr"sx={{gap: 4, alignItems: "center", pt: 2}}>
              <Typography variant="h5" mb={2}>{e.label} {e.optional ? " " : " * "}</Typography>
              <OutlinedInput  {...(e.registered ? register(e.elementKey) : {})} type={e.type} size="small" disabled={e.disabled} multiline={e.multiline} minRows={e.multiline ? 3 : 0}/>
            </Box>       
          )}
          <Typography variant="h6" pt={2}> * = Required</Typography>
          <Box sx={{display: "flex", gap: 5}}>
            <Button type="submit" variant="contained" sx={{mt:3}} size="large" > New </Button>
            <Button type="submit" variant="contained" sx={{mt:3}} size="large" onClick={handleSubmit(onCreateBatch)}>Add</Button>
            <Button type="submit" variant="contained" sx={{mt:3}} size="large" > Update </Button>
            <Button type="submit" variant="contained" sx={{mt:3}} size="large" color="error" > Delete </Button>
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


