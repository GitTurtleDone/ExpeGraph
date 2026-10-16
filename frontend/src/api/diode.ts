import type { Diode, DiodeInput } from "../types/diodes";

export type DiodeQuery = {
  minId?: number;
  maxId?: number;
  geometryType?: string;
  minAnodeWidthUm?: number;
  materialaxAnodeWidthUm?: number;
  minAnodeLengthUm?: number;
  maxAnodeLengthUm?: number;
  minAnodeRadiusUm?: number;
  maxAnodeRadiusUm?: number;
  minChamferRadiusUm?: number;
  maxChamferRadiusUm?: number;
  minBarrierHeightEv?: number;
  maxBarrierHeightEv?: number;
  minIdealityFactor?: number;
  maxIdealityFactor?: number;
  minRecRatio?: number;
  maxRecRatio?: number;
  minBuiltInPotentialV?: number;
  maxBuiltInPotentialV?: number;
  minCarrierConcentration?: number;
  minMaxCurrentA?: number;
  maxMaxCurrentA?: number;
  minVoltageAtMaxCurrentV?: number;
  maxVoltageAtMaxCurrentV?: number;
  minBreakdownVoltageV?: number;
  maxBreakdownVoltageV?: number;
};

const BASE = "http://localhost:5174";

export async function getAllDiodes(q: DiodeQuery = {}): Promise<Diode[]> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(q))
    if (value !== undefined && value !== null && value !== "")
      params.append(key, String(value));
  const qs = params.toString();
  const res = await fetch(`${BASE}/Diodes${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error(`Failed to fetch diodes: ${res.status}`);
  return res.json();
}

export async function getDiodeById(id: number): Promise<Diode> {
  const res = await fetch(`${BASE}/Diodes/${id}`);
  if (!res.ok) throw new Error(`Failed to get diode ${id}: ${res.status}`);
  return res.json();
}

export async function createDiode(data: DiodeInput): Promise<Diode> {
  const res = await fetch(`${BASE}/Diodes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to create a new diode: ${res.status}`);
  return res.json();
}

export async function updateDiode(
  id: number,
  data: DiodeInput,
): Promise<Diode> {
  const res = await fetch(`${BASE}/Diodes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update diode ${id}: ${res.status}`);
  return res.json();
}

export async function deleteDiode(id: number) {
  const res = await fetch(`${BASE}/Diodes/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Failed to delete diode ${id}: ${res.status}`);
}
