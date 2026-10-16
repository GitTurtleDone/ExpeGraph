import { RssFeed } from "@mui/icons-material";
import type { User, UserInput } from "../types/users";

export type UserQuery = {
  searchTxt?: string;
  minId?: number;
  maxId?: number;
  isActive?: boolean;
  lastLoginFrom?: string;
  lastLoginTo?: string;
};

const BASE = "http://localhost:5174";

export async function getAllUsers(q: UserQuery): Promise<User[]> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(q))
    if (value !== undefined && value !== null && value !== "")
      params.append(key, String(value));
  const qs = params.toString();
  const res = await fetch(`${BASE}/Users${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error(`Failed to fethc users: ${res.status}`);
  return res.json();
}

export async function getUserById(id: number): Promise<User> {
  const res = await fetch(`${BASE}/Users/${id}`);
  if (!res.ok) throw new Error(`Failed to get user ${id}: ${res.status}`);
  return res.json();
}

export async function createUser(data: UserInput): Promise<User> {
  const res = await fetch(`${BASE}/Users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to create a new user: ${res.status}`);
  return res.json();
}

export async function updateUser(id: number, data: UserInput): Promise<User> {
  const res = await fetch(`${BASE}/Users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update user ${id}: ${res.status}`);
  return res.json();
}

export async function deleteUser(id: number) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Failed to delete user ${id}: ${res.status}`);
}
