import { roleInputSchema, type Role, type RoleInput } from "../types/roles";

export type RoleQuery = {
  searchTxt?: string;
  minId?: number;
  maxId?: number;
};

const BASE = "http://localhost:5174";

export async function getAllRoles(q: RoleQuery = {}): Promise<Role[]> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(q))
    if (value !== undefined && value !== null && value !== "")
      params.append(key, String(value));
  const qs = params.toString();
  const res = await fetch(`${BASE}/Roles${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error(`Failed to fetch roles: ${res.status}`);
  return res.json();
}

export async function getRoleById(id: number): Promise<Role> {
  const res = await fetch(`${BASE}/Roles/${id}`);
  if (!res.ok) throw new Error(`Failed to get role ${id}: ${res.status}`);
  return res.json();
}

export async function createRole(data: RoleInput) {
  const res = await fetch(`${BASE}/Roles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to create a new role: ${res.status}`);
  return res.json();
}

export async function updateRole(id: number, data: RoleInput): Promise<Role> {
  const res = await fetch(`${BASE}/Roles/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/jso" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to udpate role ${id}: ${res.status}`);
  return res.json();
}

export async function deleteRole(id: number) {
  const res = await fetch(`${BASE}/Roles/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Failed to delete role ${id}: ${res.status}`);
}
