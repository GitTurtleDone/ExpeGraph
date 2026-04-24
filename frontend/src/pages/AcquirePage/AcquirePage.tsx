import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getAllConnectedEquipment } from "../../api/acquire";
import { getAllEquipment } from "../../api/equipment";
import {
  Stack,
  Typography,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Box,
  Button,
  OutlinedInput,
  IconButton,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Plot from "react-plotly.js";
import { runMeasurement } from "../../api/acquire";
import { TrendingUp } from "@mui/icons-material";

type VoltageSweepBlock = {
  vsta: number;
  vsto: number;
  vstep: number;
};

type SetupFormValues = {
  sweeps: VoltageSweepBlock[];
  xAxisMode: "Auto" | "Manual";
  xAxisScale: "Linear" | "Log";
  yAxisMode: "Auto" | "Manual";
  yAxisScale: "Linear" | "Log";
};

const VLabel = ({ pre, sub }: { pre: string; sub: string }) => (
  <Typography sx={{ width: 60, flexShrink: 0 }}>
    {pre}
    <sub>{sub}</sub>
  </Typography>
);

const SectionBlock = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Paper variant="outlined" sx={{ p: 3 }}>
    <Typography variant="h6" mb={2}>
      {title}
    </Typography>
    {children}
  </Paper>
);

export default function AcquirePage() {
  const [tab, setTab] = useState(0);
  const [voltages, setVoltages] = useState<number[]>([]);
  const [currents, setCurrents] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const [selectedResource, setSelectedResource] = useState("");
  const [runId, setRunId] = useState(0);

  const { register, control, getValues, watch } = useForm<SetupFormValues>({
    defaultValues: {
      sweeps: [{ vsta: 0, vsto: 0, vstep: 0 }],
      xAxisMode: "Auto",
      xAxisScale: "Linear",
      yAxisMode: "Auto",
      yAxisScale: "Linear",
    },
  });
  const [xAxisMode, xAxisScale, yAxisMode, yAxisScale] = watch([
    "xAxisMode",
    "xAxisScale",
    "yAxisMode",
    "yAxisScale",
  ]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sweeps",
  });

  const connectedResources = useQuery({
    queryKey: ["connectedEquipment"],
    queryFn: getAllConnectedEquipment,
    staleTime: 0,
  });
  const allEquipment = useQuery({
    queryKey: ["equipments"],
    queryFn: getAllEquipment,
    staleTime: 1000 * 60 * 5,
  });

  const connectedEquipment =
    allEquipment.data?.filter((eq) =>
      connectedResources.data?.includes(eq.connectingStr ?? ""),
    ) ?? [];

  return (
    <div>
      <Typography variant="h2" mb={3}>
        Acquire
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tab}
          onChange={(_, newTab) => {
            setTab(newTab);
            if (newTab === 0) connectedResources.refetch();
          }}
        >
          <Tab label="Setup" />
          <Tab label="Run" />
          <Tab label="Save" />
        </Tabs>
      </Box>

      {/* Setup Tab */}
      {tab === 0 && (
        <Stack spacing={3}>
          {/* Equipment selector */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography sx={{ width: 160, flexShrink: 0 }}>
              Connected Equipment
            </Typography>
            <Select
              size="small"
              displayEmpty
              sx={{ minWidth: 240 }}
              value={selectedResource}
              onChange={(e) => setSelectedResource(e.target.value)}
            >
              <MenuItem value="" disabled>
                Select equipment
              </MenuItem>
              {connectedEquipment.map((eq) => (
                <MenuItem key={eq.equipmentId} value={eq.connectingStr ?? ""}>
                  {eq.equipmentName}
                </MenuItem>
              ))}
            </Select>
          </Stack>

          {/* Measurement Range */}
          <SectionBlock title="Measurement Range">
            <Stack spacing={2}>
              {fields.map((field, index) => (
                <Stack
                  key={field.id}
                  direction="row"
                  alignItems="center"
                  spacing={2}
                >
                  <Paper variant="outlined" sx={{ p: 1.5, flexGrow: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <VLabel pre="V" sub="start" />
                      <OutlinedInput
                        {...register(`sweeps.${index}.vsta`, {
                          valueAsNumber: true,
                        })}
                        size="small"
                        type="number"
                        sx={{ width: 120 }}
                      />
                      <VLabel pre="V" sub="stop" />
                      <OutlinedInput
                        {...register(`sweeps.${index}.vsto`, {
                          valueAsNumber: true,
                        })}
                        size="small"
                        type="number"
                        sx={{ width: 120 }}
                      />
                      <VLabel pre="V" sub="step" />
                      <OutlinedInput
                        {...register(`sweeps.${index}.vstep`, {
                          valueAsNumber: true,
                        })}
                        size="small"
                        type="number"
                        sx={{ width: 120 }}
                      />
                    </Stack>
                  </Paper>

                  {index === 0 ? (
                    <IconButton
                      onClick={() => append({ vsta: 0, vsto: 0, vstep: 0 })}
                    >
                      <AddIcon />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => remove(index)}>
                      <RemoveIcon />
                    </IconButton>
                  )}
                </Stack>
              ))}
            </Stack>
          </SectionBlock>

          {/* Display Setup */}
          <SectionBlock title="Display Setup">
            <Stack spacing={2}>
              {(["X", "Y"] as const).map((axis) => (
                <Stack
                  key={axis}
                  direction="row"
                  alignItems="center"
                  spacing={3}
                >
                  <Typography sx={{ width: 60, flexShrink: 0 }}>
                    {axis} Axis
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      Mode
                    </Typography>
                    <Controller
                      control={control}
                      name={axis === "X" ? "xAxisMode" : "yAxisMode"}
                      render={({ field }) => (
                        <Select {...field} size="small" sx={{ width: 120 }}>
                          <MenuItem value="Auto">Auto</MenuItem>
                          <MenuItem value="Manual">Manual</MenuItem>
                        </Select>
                      )}
                    />
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      Scale
                    </Typography>
                    <Controller
                      {...register(axis === "X" ? "xAxisScale" : "yAxisScale")}
                      control={control}
                      name={axis === "X" ? "xAxisScale" : "yAxisScale"}
                      render={({ field }) => (
                        <Select {...field} size="small" sx={{ width: 120 }}>
                          <MenuItem value="Linear">Linear</MenuItem>
                          <MenuItem value="Log">Log</MenuItem>
                        </Select>
                      )}
                    />
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </SectionBlock>
        </Stack>
      )}

      {/* Run Tab */}
      {tab === 1 && (
        <Stack spacing={3}>
          <Box>
            <Button
              variant="contained"
              size="large"
              disabled={running || !selectedResource}
              onClick={() => {
                setVoltages([]);
                setCurrents([]);
                setRunId((id) => id + 1);
                setRunning(true);
                runMeasurement(
                  selectedResource,
                  getValues("sweeps"),
                  (v, i) => {
                    setVoltages((prev) => [...prev, v]);
                    setCurrents((prev) => [...prev, i]);
                  },
                  () => setRunning(false),
                );
              }}
            >
              Run
            </Button>
          </Box>
          {/* <Box sx={{ width: "100%", height: 500, border: "1px dashed grey", borderRadius: 1,
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography color="text.secondary">Graph will appear here</Typography>
          </Box> */}
          <Plot
            data={[
              {
                x: voltages,
                y: currents,
                type: "scatter",
                mode: "lines+markers",
                name: "I-V",
              },
            ]}
            layout={{
              title: { text: "I-V Curve" },
              uirevision: running ? undefined : runId,
              xaxis: {
                title: { text: "Voltage (V)" },
                ...(xAxisMode === "Auto" && { autorange: true }),
                type: xAxisScale === "Log" ? "log" : "linear",
              },
              yaxis: {
                title: { text: "Current (A)" },
                ...(yAxisMode === "Auto" && { autorange: true }),
                type: yAxisScale === "Log" ? "log" : "linear",
              },
              autosize: true,
            }}
            style={{ width: "100%", height: "500px" }}
            useResizeHandler
          ></Plot>
        </Stack>
      )}
    </div>
  );
}
