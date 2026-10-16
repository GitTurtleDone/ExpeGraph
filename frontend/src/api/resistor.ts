import type { Resistor, ResistorInput } from "../types/resistors";

export type ResistorQuery = {
  minId?: number;
  maxId?: number;
  geometryType?: string;
  minWidthUm?: number;
  maxWidthUm?: number;
  minGapUm?: number;
  maxGapUm?: number;
  minInnerRadiusUm?: number;
  maxInnerRadiusUm?: number;
  minOuterRadiusUm?: number;
  maxOuterRadiusUm?: number;
  minResistanceOhm?: number;
  maxResistanceOhm?: number;
  tlmId?: number;
};

const BASE = "http://localhost:5174";

export async function getAllResistors(
  q: ResistorQuery = {},
): Promise<Resistor[]> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(q))
    if (value !== undefined && value !== null && value !== "")
      params.append(key, String(value));
  const qs = params.toString();
  const res = await fetch(`${BASE}/Resistors${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error(`Failed to fetch resistors: ${res.status}`);
  return res.json();
}

export async function getResistorById(id: number): Promise<Resistor> {
  const res = await fetch(`${BASE}/Resistors/${id}`);
  if (!res.ok) throw new Error(`Failed to get resistor ${id}: ${res.status}`);
  return res.json();
}

export async function createResistor(data: ResistorInput): Promise<Resistor> {
  const res = await fetch(`${BASE}/Resistors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok)
    throw new Error(`Failed to create a new Resistor: ${res.status}`);
  return res.json();
}

export async function updateResistor(
  id: number,
  data: ResistorInput,
): Promise<Resistor> {
  const res = await fetch(`${BASE}/Resistors`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok)
    throw new Error(`Failed to update resistor ${id}: ${res.status}`);
  return res.json();
}

export async function deleteResistor(id: number) {
  const res = await fetch(`${BASE}/Resistors/${id}`, {
    method: "DELETE",
  });
  if (!res.ok)
    throw new Error(`Failed to delete resistor ${id}: ${res.status}`);
}
