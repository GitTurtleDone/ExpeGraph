import type { UserProject, UserProjectInput } from "../types/userprojects";

export type UserProjectQuery = {
  userId?: number;
  projectId?: number;
  role?: string;
  joinedAtFrom?: string;
  joinedAtTo?: string;
};

const BASE = "http://localhost:5174";

export async function getAllUserProjects(
  q: UserProjectQuery = {},
): Promise<UserProject[]> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(q))
    if (value !== undefined && value !== null && value !== "")
      params.append(key, String(value));
  const qs = params.toString();
  const res = await fetch(`${BASE}/UserProjects${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error(`Failed to fetch userProjects: ${res.status}`);
  return res.json();
}

export async function getUserProjectById(
  uId: number,
  pId: number,
): Promise<UserProject> {
  const res = await fetch(`${BASE}/UserProjects/${uId}/${pId}`);
  if (!res.ok)
    throw new Error(
      `Failed to get userProject with user Id ${uId} and project Id ${pId}`,
    );
  return res.json();
}

export async function createUserProjec(
  data: UserProjectInput,
): Promise<UserProject> {
  const res = await fetch(`${BASE}/UserProjects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok)
    throw new Error(`Failed to create a new userProject: ${res.status}`);
  return res.json();
}

export async function updateUserProject(
  uId: number,
  pId: number,
  data: UserProjectInput,
): Promise<UserProject> {
  const res = await fetch(`${BASE}/UserProjects/${uId}/${pId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok)
    throw new Error(
      `Failed to update userProject with user Id ${uId} and project Id ${pId}: ${res.status}`,
    );
  return res.json();
}

export async function deleteUserProject(uId: number, pId: number) {
  const res = await fetch(`${BASE}/UserProjects/${uId}/${pId}`, {
    method: "DELETE",
  });
  if (!res.ok)
    throw new Error(
      `Failed to delete userProject with user Id ${uId} and project Id ${pId}: ${res.status}`,
    );
}
