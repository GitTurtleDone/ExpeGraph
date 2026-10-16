import type { UserLab, UserLabInput } from "../types/userlabs";

export type UserLabQuery = {
  userId?: number;
  labId?: number;
  role?: string;
  joinedAtFrom?: string;
  joinedAtTo?: string;
};

const BASE = "http://localhost:5174";

export async function getAllUserLabs(q: UserLabQuery = {}): Promise<UserLab[]> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(q))
    if (value !== undefined && value !== null && value !== "")
      params.append(key, String(value));
  const qs = params.toString();
  const res = await fetch(`${BASE}/UserLabs${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error(`Failed to fetch userLabs: ${res.status}`);
  return res.json();
}

export async function getUserLabById(
  uId: number,
  lId: number,
): Promise<UserLab> {
  const res = await fetch(`${BASE}/UserLabs/${uId}/${lId}`);
  if (!res.ok) throw new Error(`Failed to fetch userLabs: ${res.status}`);
  return res.json();
}

export async function createUserLab(data: UserLab): Promise<UserLab> {
  const res = await fetch(`${BASE}/UserLabs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to create a new userLab: ${res.status}`);
  return res.json();
}

export async function updateUserLab(
  uId: number,
  lId: number,
  data: UserLabInput,
): Promise<UserLab> {
  const res = await fetch(`${BASE}/UserLabs/${uId}/${lId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok)
    throw new Error(
      `Failed to update userLab with user Id ${uId} and lab Id ${lId}: ${res.status}`,
    );
  return res.json();
}

export async function deleteUserLab(uId: number, lId: number) {
  const res = await fetch(`${BASE}/${uId}/${lId}`, {
    method: "DELETE",
  });
  if (!res.ok)
    throw new Error(
      `Failed to delete userLab with user Id ${uId} and lab Id ${lId}: ${res.status}`,
    );
}
