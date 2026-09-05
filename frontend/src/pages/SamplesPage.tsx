import { Typography, Button, IconButton } from "@mui/material";
import { register } from "plotly.js";
import { useForm } from "react-hook-form";
type SampleInputElementLayout = {
  label: string;
  optionaltype: string;
  registered: boolean;
};
export default function SamplesPage() {
  const sampleInputElementLayout: SampleInputElementLayout[] = [
    { label: "ID", type: "number", registered: false },
    { label: "" },
  ];

  return (
    <Typography variant="h2" mb={4}>
      {" "}
      Samples{" "}
    </Typography>
    // -- Lef panel--
    // -- Right panel ---
  );
}
