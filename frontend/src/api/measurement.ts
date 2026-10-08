import { QuizSharp } from "@mui/icons-material";
import type { Measurement, MeasurementInput } from "../types/measurements";

type MeasurementQuery = {
  minId?: number;
  maxId?: number;
  deviceId?: number;
  equipmentId?: number;
  userId?: number;
  measurementType?: string;
  measuredAtFrom?: string;
  measuredAtTo?: string;
  minTemperatureK?: number;
  maxTemperatureK?: number;
  minHumidityPercent?: number;
  maxHumidityPercent?: number;
};
const BASE = "http://localhost:5174";

export async function getAllMeasurements(
  q: MeasurementQuery = {},
): Promise<Measurement[]> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(q))
    if (value !== undefined && value !== null && value !== "")
      params.append(key, String(value));
  const qs = params.toString();
  const res = await fetch(`${BASE}/Measurements${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error(`Failed to fetch measurements: ${res.status}`);
  return res.json();
}

export async function getMeasurementById(id: number): Promise<Measurement> {
  const res = await fetch(`${BASE}/Measurements/${id}`);
  if (!res.ok)
    throw new Error(`Failed to get measurement ${id}: ${res.status}`);
  return res.json();
}

export async function createMeasurement(
  data: MeasurementInput,
): Promise<Measurement> {
  const res = await fetch(`${BASE}/Measurements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok)
    throw new Error(`Failed to create a new measurement: ${res.status}`);
  return res.json();
}

export async function updateMeasurement(
  id: number,
  data: MeasurementInput,
): Promise<Measurement> {
  const res = await fetch(`${BASE}/Measurements/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok)
    throw new Error(`Failed to update measurement ${id}: ${res.status}`);
  return res.json();
}

export async function deleteMeasurement(id: number) {
  const res = await fetch(`${BASE}/Measurements/${id}`, {
    method: "DELETE",
  });
  if (!res.ok)
    throw new Error(`Failed to delete measurement ${id}: ${res.status}`);
}
