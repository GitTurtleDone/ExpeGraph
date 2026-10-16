import type { Tlm, TlmInput } from "../types/tlms";

export type TlmQuery = {
  minId?: number;
  maxId?: number;
  geometryType?: string;
  MinSheetResistanceOhmSq?: number;
  MaxSheetResistanceOhmSq?: number;
  MinContactResistanceOhm?: number;
  MaxContactResistanceOhm?: number;
  MinTransferLengthCm?: number;
  MaxTransferLengthCm?: number;
};

const BASE = "http://localhost:5174";

export async function getAllTlms(q: TlmQuery = {}): Promise<Tlm[]> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(q))
    if (value !== undefined && value !== null && value !== "")
      params.append(key, String(value));
  const qs = params.toString();
  const res = await fetch(`${BASE}/Tlms${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error(`Failed to fetch tlms: ${res.status}`);
  return res.json();
}

export async function getTlmById(id: number): Promise<Tlm> {
  const res = await fetch(`${BASE}/Tlms/${id}`);
  if (!res.ok) throw new Error(`Failed to get tlm ${id}: ${res.status}`);
  return res.json();
}

export async function createTlm(data: TlmInput): Promise<Tlm> {
  const res = await fetch(`${BASE}/Tlms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to create a new tlm: ${res.status}`);
  return res.json();
}

export async function updateTlm(id: number, data: TlmInput): Promise<Tlm> {
  const res = await fetch(`${BASE}/Tlms/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update tlm ${id}: ${res.status}`);
  return res.json();
}

export async function deleteTlm(id: number) {
  const res = await fetch(`${BASE}/Tlms/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Failed to delete tlm ${id}: ${res.status}`);
}
