import type { Equipment, CreateEquipmentRequest } from "../types/equipment";

const BASE = "http://localhost:5174";
const WINDOW_BASE = "http://172.31.80.1:8000";
export async function getAllEquipment(): Promise<Equipment[]> {
  const res = await fetch(`${BASE}/Equipment`);
  if (!res.ok) throw new Error("Failed to fetch equipment");
  return res.json();
}

export async function createEquipment(
  data: CreateEquipmentRequest,
): Promise<Equipment> {
  const res = await fetch(`${BASE}/Equipment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create equipment");
  return res.json();
}

export async function updateEquipment(
  id: number,
  data: CreateEquipmentRequest,
): Promise<Equipment> {
  const res = await fetch(`${BASE}/Equipment/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update equipment");
  return res.json();
}

export async function deleteEquipment(id: number) {
  const res = await fetch(`${BASE}/Equipment/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to delete equipment");
}

export async function getEquipmentByName(name: string): Promise<Equipment> {
  const res = await fetch(`${BASE}/Equipment/${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error(`Equipment with name "${name}" does not exist`);
  return res.json();
}

export async function connectEquipment(strConnecting: string) {
  const res = await fetch(`${WINDOW_BASE}/equipment/connect`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ resource_string: strConnecting }),
  });
  if (!res.ok)
    throw new Error(`Equipment could not be connected with the connecting \
		string ${strConnecting}`);
  return res.json();
}

export async function disconnectEquipment(strConnecting: string) {
	const res = await fetch(`${WINDOW_BASE}/equipment/disconnect`, {
	method: 'DELETE',
	headers: {'Content-Type': 'application/json'},
	body: JSON.stringify({resource_string: strConnecting})
	})
	if (!res.ok) throw new Error(`Disconnecting error occurred with the connecting \
		string ${strConnecting}`)
	return res.json()
}
