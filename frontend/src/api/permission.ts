import type { Permission, PermissionInput } from "../types/permissions";

const BASE = "http://localhost:5174";

type PermissionQuery = {
  searchTxt?: string;
  minId?: number;
  maxId?: number;
};

export async function getAllPermissions(
  q: PermissionQuery = {},
): Promise<Permission[]> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(q))
    if (value != undefined && value !== null && value !== "")
      params.append(key, String(value));
  const qs = params.toString();
  const res = await fetch(`${BASE}/Permissions${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error(`Failed to fetch permissions: ${res.status}`);
  return res.json();
}

export async function getPermissionById(id: number): Promise<Permission> {
  const res = await fetch(`${BASE}/Permissions/${id}`);
  if (!res.ok) throw new Error(`Failed to get permission ${id}: ${res.status}`);
  return res.json();
}

export async function createPermission(
  data: PermissionInput,
): Promise<Permission> {
  const res = await fetch(`${BASE}/Permissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok)
    throw new Error(`Failed to create a new permission: ${res.status}`);
  return res.json();
}

export async function updatePermission(
  id: number,
  data: PermissionInput,
): Promise<Permission> {
  const res = await fetch(`${BASE}/Permissions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "applicatin/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok)
    throw new Error(`Failed to update permission ${id}: ${res.status}`);
  return res.json();
}

export async function deletePermission(id: number) {
  const res = await fetch(`${BASE}/Permissions/${id}`, {
    method: "DELETE",
  });
  if (!res.ok)
    throw new Error(`Failed to delete permission ${id}: ${res.status}`);
}
