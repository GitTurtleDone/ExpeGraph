import type { RolePermission } from "../types/rolepermissions";
import type { Role } from "../types/roles";

export type RolePermissionQuery = {
  roleId?: number;
  permissionId?: number;
};

const BASE = "http://localhost:5174";

export async function getAllRolePermissions(
  q: RolePermissionQuery = {},
): Promise<RolePermission[]> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(q))
    if (value !== undefined && value !== null)
      params.append(key, String(value));
  const qs = params.toString();
  const res = await fetch(`${BASE}/RolePermissions${qs ? `?${qs}` : ""} `);
  if (!res.ok)
    throw new Error(`Failed to fetch rolePermissions: ${res.status}`);
  return res.json();
}

export async function getRolePermissionById(
  rId: number,
  pId: number,
): Promise<RolePermission> {
  const res = await fetch(`${BASE}/RolePermissions/${rId}/${pId}`);
  if (!res.ok)
    throw new Error(`Failed to get rolePermission with role Id ${rId}
        and permission Id ${pId}: ${res.status}`);
  return res.json();
}

export async function createRolePermission(
  data: RolePermission,
): Promise<RolePermission> {
  const res = await fetch(`${BASE}/RolePermissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok)
    throw new Error(`Failed to create a new rolePermission: ${res.status}`);
  return res.json();
}

export async function updateRolePermission(
  id: number,
  data: RolePermission,
): Promise<RolePermission> {
  const res = await fetch(`${BASE}/RolePermissions/${id}`, {
    method: "PUT",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update rolePermission ${id}`);
  return res.json();
}

export async function deleteRolePermission(id: number) {
  const res = await fetch(`${BASE}/RolePermissions/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Failed to delete rolePermission ${id}`);
}
