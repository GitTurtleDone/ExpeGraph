type SaveFormValues = {
  measurementId: number;
  deviceId: number | null;
  sampleId: number | null;
  equipmentId: number;
  userId: number | null;
  measurementType: string;
  measuredAt: Date;
  temperatureK: number;
  filePath: string;
  humidityPercent: number;
  notes: string;
  dataFilePath: string;
};

import { Button, Stack, Typography } from "@mui/material";
import type { VoltageSweepBlock } from "../../types/AcquirePage/acquire";
import { useState } from "react";
export default function SaveTab(
  { running, selectedResource, runId, sweeps = [], voltages = [], currents = [] }:
  { running: boolean, selectedResource: string, runId: number, sweeps?: VoltageSweepBlock[], voltages?: number[], currents?: number[] }
) {
  const [saveFilePath, setSaveFilePath] = useState<string>('')  
  const save = async () => {
    try {
      const csv = sweeps.map((sweep, idx) =>
        `Sweep ${idx + 1}, Vstart, ${sweep.vsta}, Vstop, ${sweep.vsto}, Vstep, ${sweep.vste}\n`
      ).join("") +
        "Voltage,Current\n" +
        voltages.map((v, idx) => `${v},${currents[idx]}`).join("\n")
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: "measurement_data.csv",
        types: [
          { description: "CSV",  accept: { "text/csv":   [".csv"] } },
          { description: "TEXT", accept: { "text/plain": [".txt"] } },
        ],
      })
      const writable = await fileHandle.createWritable()
      await writable.write(csv)
      await writable.close()
      setSaveFilePath(fileHandle.name)
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return
      console.error("Save failed:", e)
      alert(`Save failed: ${e}`)
    }
  }
  return (
    <div>
      
      <Stack
        direction='column'
        gap={1.5}
      >
        { <Button
          sx={{width: 0.4}}
          variant="contained"
          disabled={running || runId === 0 || !selectedResource}
          onClick={save}

        >
          SAVE DATA TO .CSV
        </Button>
        }
        
        {(saveFilePath !== '') && (
          <Typography variant="body2">
            Data were saved to: {saveFilePath}
          </Typography>

        )}  
      </Stack> 
    </div>
  );
}
