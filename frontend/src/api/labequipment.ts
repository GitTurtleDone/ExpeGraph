import type { LabEquipment } from "../types/labequipment";

const BASE = "http://localhost:5174";

type LabEquipmentQuery = {
  labId?: number;
  equipmentId?: number;
};

export async function getAllLabEquipment(
  q: LabEquipmentQuery = {},
): Promise<LabEquipment[]> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(q)) {
    if (value !== undefined && value !== null)
      params.append(key, String(value));
  }
  const qs = params.toString();
  const res = await fetch(`${BASE}/LabEquipment${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error(`Failed to fetch labEquipment: ${res.status}`);
  return res.json();
}

export async function getLabEquipmentById(
  lId: number,
  eId: number,
): Promise<LabEquipment> {
  const res = await fetch(`${BASE}/LabEquipment/${lId}/${eId}`);
  if (!res.ok)
    throw new Error(`Failed to get labEquipment with 
        lab Id ${lId} an equipment Id ${eId}: ${res.status} `);
  return res.json();
}

export async function createLabEquipment(
  data: LabEquipment,
): Promise<LabEquipment> {
  const res = await fetch(`${BASE}/LabEquipment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok)
    throw new Error(`Failed to create a new labEquipment: ${res.status}`);
  return res.json();
}

export async function deleteLabEquipment(lId: number, eId: number) {
  const res = await fetch(`${BASE}/LabEquipment/${lId}/${eId}`, {
    method: "DELETE",
  });
  if (!res.ok)
    throw new Error(
      `Failed to delete lab Id ${lId} and equipment Id ${eId}: ${res.status}`,
    );
}
