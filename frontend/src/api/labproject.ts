import type { LabEquipment } from "../types/labequipment";
import type { LabProject } from "../types/labprojects";

const BASE = "http://localhost:5174";

type LabProjectQuery = {
  labId?: number;
  projectId?: number;
};

export async function getAllLabProjects(
  q: LabProjectQuery = {},
): Promise<LabProject[]> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(q)) {
    if (value !== undefined && value !== null)
      params.append(key, String(value));
  }
  const qs = params.toString();
  const res = await fetch(`${BASE}/LabProjects${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error(`Failed to fetch labProjects: ${res.status}`);
  return res.json();
}

export async function getLabProjectById(
  lId: number,
  pId: number,
): Promise<LabProject> {
  const res = await fetch(`${BASE}/LabProjects/${lId}/${pId}`);
  if (!res.ok)
    throw new Error(`Failed to get labProject with 
        lab Id ${lId} and project Id ${pId}: ${res.status}`);
  return res.json();
}

export async function createLabProject(data: LabProject): Promise<LabProject> {
  const res = await fetch(`${BASE}/LabProjects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok)
    throw new Error(`Failed to create a new labProject: ${res.status}`);
  return res.json();
}

export async function deleteLabProject(lId: number, pId: number) {
  const res = await fetch(`${BASE}/LabProjects/${lId}/${pId}`, {
    method: "DELETE",
  });
  if (!res.ok)
    throw new Error(`Failed to delete lab project with 
        lab Id ${lId} and project Id ${pId}: ${res.status}`);
}
