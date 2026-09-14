import React, { useState } from "react";
import { Typography, Stack, Box, Checkbox, OutlinedInput, Button, Paper } from "@mui/material";
//import { register } from "plotly.js";
import { sampleSchema, sampleInputSchema, type Sample, type SampleInput  } from "../types/samples";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAllSamples, createSample, updateSample, deleteSample } from "../api/sample";
import { ErrorMessage } from "@hookform/error-message";
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
  const {register, handleSubmit, reset, formState:{ errors, isSubmitting}} = useForm<SampleInput>({
    resolver: zodResolver(sampleInputSchema),
    defaultValues: sampleInputDefaultValue,
    
  }); 
  const onCreateSample = async (data: SampleInput): Promise<Sample> => {
    console.log(data)
    createSample(data)
  } 

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
              onClick={handleSubmit(onCreateSample)}
            >
              {isSubmitting ? "Adding new sample" : "Add"}
            </Button>
            
            <Button
              variant="contained"
              size="large"
              disabled= {isSubmitting ? true: false}
            >
              Update
            </Button>
            <Button
              variant="contained"
              size="large"
              color="error"
            >
              Delete
            </Button>
          </Box>

        </Stack>
      </Box>
    </Stack>

  );
}
