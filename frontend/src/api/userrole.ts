import { ErrorOutline } from "@mui/icons-material";
import type { UserRole, UserRoleInput } from "../types/userroles";

export type UserRoleQuery = {
  userId?: number;
  roleId?: number;
  roleStartDateFrom?: string;
  roleStartDateTo?: string;
  roleEndDateFrom?: string;
  roleEndDateTo?: string;
};

const BASE = "http://localhost:5174";

export async function getAllUserRoles(
  q: UserRoleQuery = {},
): Promise<UserRole[]> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(q))
    if (value !== undefined && value !== null && value !== "")
      params.append(key, String(value));
  const qs = params.toString();
  const res = await fetch(`${BASE}/UserProjects${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error(`Failed to fetch userRoles: ${res.status}`);
  return res.json();
}

export async function getUserRoleById(
  uId: number,
  rId: number,
): Promise<UserRole> {
  const res = await fetch(`${BASE}/UserRoles/${uId}/${rId}`);
  if (!res.ok)
    throw new Error(
      `Failed to get userRole with user Id ${uId} and role Id ${rId}: ${res.status}`,
    );
  return res.json();
}

export async function createUserRole(data: UserRole): Promise<UserRole> {
  const res = await fetch(`${BASE}/UserRoles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok)
    throw new Error(`Failed to create a new userRole: ${res.status}`);
  return res.json();
}
export async function updateUserRole(
  uId: number,
  rId: number,
  data: UserRoleInput,
): Promise<UserRole> {
  const res = await fetch(`${BASE}/UserRoles/${uId}/${rId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok)
    throw new Error(
      `Failed to update userRole with user Id ${uId} and role Id ${rId}: ${res.status}`,
    );
  return res.json();
}

export async function deleteUserRole(uId: number, rId: number) {
  const res = await fetch(`${BASE}/UserRoles/${uId}/${rId}`, {
    method: "DELETE",
  });
  if (!res.ok)
    throw new Error(
      `Failed to delete userRole with user Id ${uId} and role Id ${rId}: ${res.status}`,
    );
}
