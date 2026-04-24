type SaveFormValues = {
  measurementId: number;
  deviceId: number;
  sampleId: number;
  equipmentId: number;
  userId: number;
  measurementType: string;
  measuredAt: time;
  temperatureK: number;
  filePath: string;
  humidityPercent: number;
  notes: string;
  dataFilePath: string;
};

import { Typography } from "@mui/material";

export default function SaveTab() {
  return (
    <div>
      <Typography variant="h4" sx={{ p: 3 }}>
        Save Measurements
      </Typography>
    </div>
  );
}
