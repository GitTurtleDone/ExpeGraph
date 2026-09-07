import { Typography, Stack, Box, Checkbox, OutlinedInput, Button, Paper } from "@mui/material";
//import { register } from "plotly.js";
import { sampleSchema, sampleInputSchema, type Sample, type SampleInput  } from "../types/samples";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
type SampleInputElementLayout = {
  label: string;
  optional:boolean;
  type: string;
  elementKey: Path<SampleInput>;
  disabled: boolean;
  multiline?: boolean | undefined;
};
export default function SamplesPage() {
  const sampleInputElementLayout: SampleInputElementLayout[] = [
    { label: "Name", optional: false, type: "string", elementKey: "sampleName", disabled: false},
    { label: "Description", optional: true, type: "string", elementKey: "description", disabled: false, multiline: true},
    { label: "Treatment", optional: true, type: "string", elementKey: "treatment", disabled: false, multiline: true},
    { label: "Properties", optional: true, type: "unknown", elementKey: "properties", disabled: false},
    { label: "BatchId", optional: true, type: "number", elementKey: "batchId", disabled: false}
  ] 
  const sampleInputDefaultValue: SampleInput =  {
    sampleName: "Dev10",
    description: "10/140 IrOx/Ir",
    treatment: "Standard treatment",
    batchId: 15
  }
  const {register, handleSubmit, reset, formState:{ errors, isSubmitting}} = useForm<SampleInput>({
    resolver: zodResolver(sampleInputSchema),
    defaultValues: sampleInputDefaultValue,
    
  });  

  return (
    <Stack sx={{alignItems: "flex-start"}}>
      <Typography variant="h2" mb={4}>
        Samples
      </Typography>
      <Box sx={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5}}>
        {/* -- Lef panel--*/}
        <Stack>
          <OutlinedInput></OutlinedInput>
        </Stack>
        {/* -- Right panel -- */}
        <Stack>
          <Box></Box>
          <Box sx={{display: "grid", gridAutoColumns: "1fr 1fr 1fr 1fr" }}></Box>

        </Stack>
      </Box>
    </Stack>

  );
}
