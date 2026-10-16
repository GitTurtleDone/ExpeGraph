import type { Lab, LabInput } from "../types/labs";

const BASE = "http://localhost:5174";

export type LabQuery = {
  searchTxt?: string;
  minId?: number;
  maxId?: number;
  labLeaderId?: number;
};

export async function getAllLabs(q: LabQuery = {}): Promise<Lab[]> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(q)) {
    if (value !== undefined && value !== null && value !== "")
      params.append(key, String(value));
  }
  const qs = params.toString();
  const res = await fetch(`${BASE}/Labs${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error(`Failed to fetch labs: ${res.status}`);
  return res.json();
}

export async function getLabById(id: number): Promise<Lab> {
  const res = await fetch(`${BASE}/Labs/${id}`);
  if (!res.ok) throw new Error(`Failed to get lab ${id}: ${res.status}`);
  return res.json();
}

export async function createLab(data: LabInput): Promise<Lab> {
  const res = await fetch(`${BASE}/Labs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to create a new lab: ${res.status}`);
  return res.json();
}

export async function updateLab(id: number, data: LabInput): Promise<Lab> {
  const res = await fetch(`${BASE}/Labs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update lab ${id}: ${res.status}`);
  return res.json();
}

export async function deleteLab(id: number) {
  const res = await fetch(`${BASE}/Labs`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Failed to delete lab ${id}`);
}
