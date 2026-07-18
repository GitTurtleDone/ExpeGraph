import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Typography, Collapse, Stack, IconButton, Box, OutlinedInput, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import type { Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AddIcon from "@mui/icons-material/Add";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import { createBatch } from "../api/batch";
import * as z from "zod";

import  { batchSchema, batchInputSchema, type Batch, type BatchInput} from "../types/batches"

type BatchInputElementLayout = {
  label: string, optional: boolean, type: string, elementKey: Path<BatchInput> | string, registered: boolean, disabled: boolean, multiline?: Boolean | undefined
}

export default function BatchesPage() {
  const [showAddBatch, setShowAddBatch] = useState(false);
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
  
  const {onCreateBatch } = useMutation({
    mutationFn: createBatch,


  })
  

  
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
            : <ChevronRightOutlinedIcon fontSize="large"/>
          }
        </IconButton>
        <Typography variant="h4"> Add a batch</Typography>
      </Box>
      <Collapse in={showAddBatch}>
          {/* <Typography> Show some thing here</Typography> */}
          <Stack
          ></Stack>
          { batchInputElementLayout.map((e) => 
            <Box key={e.label} display="grid" gridTemplateColumns="1fr 2fr"sx={{gap: 4, alignItems: "center", pt: 2}}>
              <Typography variant="h5" mb={2}>{e.label} {e.optional ? " " : " * "}</Typography>
              <OutlinedInput  {...(e.registered ? register(e.elementKey) : {})} type={e.type} size="small" disabled={e.disabled} multiline={e.multiline} minRows={e.multiline ? 3 : 0}/>
            </Box>       
          )}
          <Typography variant="h6" pt={2}> * = Required</Typography>
          <Button variant="outlined" sx={{mt:3}} size="large" onClick={handleSubmit(onCreateBatch)}>Insert the batch</Button>
      </Collapse>
      

      {/* Find a batch by Fabrication Date, Treatment, ProjectId, Keyword */}
    </Stack>

  )
}


// Great question — and the key insight is that these two patterns don't compete; they stack. They solve different layers:

// Layer	Equipment (old)	Batches (new)
// Form state + validation	manual useState + manual onChange	react-hook-form + zod
// Server communication	useQuery / useMutation	useQuery / useMutation (unchanged)
// So you keep useQuery/useMutation exactly as in Equipment. React-hook-form just replaces the useState blob and the manual onChange wiring — the part of Equipment that was verbose and unvalidated. The bridge between the two is handleSubmit: it runs zod validation first, and only calls your mutation if the data is valid.

// The pattern

// // 1. QUERY — same as Equipment: list batches
// const batches = useQuery({ queryKey: ["batches"], queryFn: getAllBatches });

// // 2. MUTATION — same as Equipment: create a batch
// const queryClient = useQueryClient();
// const addBatch = useMutation({
//   mutationFn: createBatch,
//   onSuccess: () => {
//     queryClient.invalidateQueries({ queryKey: ["batches"] });
//     reset();                       // clear the form (from useForm)
//   },
// });

// // 3. FORM — replaces useState + onChange, adds zod validation
// const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
//   useForm<BatchInput>({ resolver: zodResolver(batchInputSchema), defaultValues: {...} });

// // 4. BRIDGE — validated data flows into the mutation
// const onSubmit = (data: BatchInput) => addBatch.mutate(data);
// Then the JSX wraps the fields in a <form> and the button becomes a submit:


// <form onSubmit={handleSubmit(onSubmit)}>
//   {batchInputElementLayout.map((e) => (
//     <Box key={e.elementKey} display="grid" gridTemplateColumns="1fr 2fr" sx={{ gap: 4 }}>
//       <Typography variant="h5">{e.label} {e.optional ? "" : "*"}</Typography>
//       <OutlinedInput
//         {...(e.registered ? register(e.elementKey) : {})}
//         type={e.type}
//         size="small"
//         disabled={e.disabled}
//         error={!!errors[e.elementKey as keyof BatchInput]}
//       />
//     </Box>
//   ))}
//   <Button type="submit" variant="contained" disabled={isSubmitting || addBatch.isPending}>
//     {addBatch.isPending ? "Adding…" : "Add"}
//   </Button>
// </form>
// What changed vs. Equipment, concretely
// No more useState(equipment) and no manual onChange — register(field) wires each input to RHF automatically.
// The Add button is no longer an onClick that reads state and calls mutate. Instead it's type="submit", and handleSubmit(onSubmit) gates it: zod runs first, invalid fields populate errors, and onSubmit (with the mutation) only fires when validation passes. In Equipment, nothing stopped a bad payload from hitting the server.
// useMutation is unchanged — mutationFn: createBatch, onSuccess invalidates the query. Same as addEquipment.
// Two things to decide
// Loading/pending state now has two flags: isSubmitting (RHF, during the async submit handler) and addBatch.isPending (the mutation). Disable the button on either, as above.

// Your empty projectId/labId strings — recall the FK issue from earlier. Since your defaultValues use "", add a zod transform so empty becomes undefined/null before it reaches createBatch, e.g.:


// projectId: z.coerce.number().int().positive().optional().or(z.literal("").transform(() => undefined))
// That way validation itself cleans the payload, instead of hand-massaging it like the || undefined dance all over the Equipment Add button.

// Bottom line: use RHF+zod for the form, keep useQuery/useMutation for the network — and let handleSubmit be the seam between them.

// Your batch.ts is currently empty, by the way. Want me to scaffold it (mirroring equipment.ts with getAllBatches/createBatch/etc.) and wire up BatchesPage.tsx with this pattern?