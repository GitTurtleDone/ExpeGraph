import type { Project, ProjectInput } from "../types/projects";

export type ProjectQuery = {
  searchTxt?: string;
  minId?: number;
  maxId: number;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
};

const BASE = "http://localhost:5174";

export async function getAllProjects(q: ProjectQuery = {}): Promise<Project[]> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(q)) {
    if (value !== undefined && value !== nule && value != "")
      params.append(key, String(value));
  }
  const qs = params.toString();
  const res = await fetch(`${BASE}/Projects${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`);
  return res.json();
}

export async function getProjectById(id: number): Promise<Project> {
  const res = await fetch(`${BASE}/Projects/${id}`);
  if (!res.ok) throw new Error(`Failed to get project ${id}: ${res.status}`);
  return res.json();
}

export async function createProject(data: ProjectInput): Promise<Project> {
  const res = await fetch(`${BASE}/Projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to create a new project: ${res.status}`);
  return res.json();
}

export async function updateProject(
  id: number,
  data: ProjectInput,
): Promise<Project> {
  const res = await fetch(`${BASE}/Projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update project ${id}: ${res.status}`);
  return res.json();
}

export async function deleteProject(id: number) {
  const res = await fetch(`${BASE}/Projects/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Failed to delete project ${id}: ${res.status}`);
}
