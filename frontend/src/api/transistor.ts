import type { Transistor, TransistorInput } from "../types/transitors";

export type TransistorQuery = {
  minId?: number;
  maxId?: number;
  geometryType?: string;
  minGateWidthUm?: number;
  maxGateWidthUm?: number;
  minGateLengthUm?: number;
  maxGateLengthUm?: number;
  minGateInnerRadiusUm?: number;
  maxGateInnerRadiusUm?: number;
  minGateOuterRadiusUm?: number;
  maxGateOuterRadiusUm?: number;
  minCoverageSectorDegree?: number;
  maxCoverageSectorDegree?: number;
  minMobilityCm2Vs?: number;
  maxMobilityCm2Vs?: number;
  minOnOffRatio?: number;
  maxOnOffRatio?: number;
  minThresholdVoltageV?: number;
  maxThresholdVoltageV?: number;
  minSubthresholdSwingMvDec?: number;
  maxSubthresholdSwingMvDec?: number;
  minSgGapUm?: number;
  maxSgGapUm?: number;
  minDgGapUm?: number;
  maxDgGapUm?: number;
};

const BASE = "http://localhost:5174";

export async function getAllTransistors(
  q: TransistorQuery = {},
): Promise<Transistor[]> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(q))
    if (value !== undefined && value !== null && value !== "")
      params.append(key, String(value));
  const qs = params.toString();
  const res = await fetch(`${BASE}/Transistors${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error(`Failed to fetch transistors: ${res.status}`);
  return res.json();
}

export async function getTransistorById(id: number): Promise<Transistor> {
  const res = await fetch(`${BASE}/Transistors/${id}`);
  if (!res.ok) throw new Error(`Failed to get transistor ${id}: ${res.status}`);
  return res.json();
}

export async function createTransistor(
  data: TransistorInput,
): Promise<Transistor> {
  const res = await fetch(`${BASE}/Transistors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok)
    throw new Error(`Failed to create a new transistor: ${res.status}`);
  return res.json();
}

export async function updateTransistor(
  id: number,
  data: TransistorInput,
): Promise<Transistor> {
  const res = await fetch(`${BASE}/Transisotrs/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok)
    throw new Error(`Failed to update transistor ${id}: ${res.status}`);
  return res.json();
}

export async function deleteTransistor(id: number) {
  const res = await fetch(`${BASE}/Transistors/${id}`, {
    method: "DELETE",
  });
  if (!res.ok)
    throw new Error(`Failed to delete transistor ${id}: ${res.status}`);
}
