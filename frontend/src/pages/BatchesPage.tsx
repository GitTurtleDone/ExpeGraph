import { useState } from "react";
import { Typography, Collapse, Stack, IconButton, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";

import * as z from "zod";

import  { batchSchema, batchInputSchema, type Batch, type BatchInput} from "../types/batches"

type BatchInputElementLayout = {
  label: string, optional: boolean, type: string, registered: boolean, disabled: boolean
}

export default function BatchesPage() {
  const [showAddBatch, setShowAddBatch] = useState(false);
  const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<BatchInput>({
    resolver: zodResolver(batchInputSchema),
    defaultValues: {
      batchName: "IrOxNewSM",
      description: "IrOx SBDs using new milled shadow masks",
      fabricationDate: "01/12/2024",
      treatment: "Standard treatment: Ohmic 450 C, 3min, N2, furnace. IrOx/Ir 40/40 nm",
      projectId: "",
      labId: ""
    }
  })
  const batchInputElementLayout : BatchInputElementLayout[] = [
    {label: "Batch ID", optional: true, type: "string", registered: false, disabled: true },
    {label: "Batch Name", optional: false, type: "string", registered: true, disabled: false },
    {label: "Description", optional: true, type: "string", registered: true, disabled: false },
    {label: "Fabrication Date", optional: true, type: "LocalDate", registered: true, disabled: false },
    {label: "Treatment", optional: true, type: "LocalDate", registered: true, disabled: false },
    {label: "Project ID", optional: true, type: "LocalDate", registered: true, disabled: false }, 
    {label: "Lab ID", optional: true, type: "LocalDate", registered: true, disabled: false }, 
  ]
    

  
  return (
    <Stack sx={{ alignItems: "flex-start"}}>
      <Typography variant="h2" mb={4}>Batches</Typography>
      {/*  Add a batch */}
      <Box sx={{display: "flex", alignItems: "center"}}>
        <IconButton
          onClick={() => setShowAddBatch(!showAddBatch)}
        >
          {showAddBatch 
            ? <ExpandLessOutlinedIcon fontSize="large"/>
            : <ArrowForwardIosOutlinedIcon fontSize="large"/>
          }
        </IconButton>
        <Typography variant="h4"> Add a batch</Typography>
      </Box>
      <Collapse in={showAddBatch}>
          <Typography> Show some thing here</Typography>
      </Collapse>
      

      {/* Find a batch by Fabrication Date, Treatment, ProjectId, Keyword */}
    </Stack>

  )
}