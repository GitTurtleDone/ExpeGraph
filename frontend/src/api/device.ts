import type { Device, DeviceInput } from "../types/devices";

const BASE = "http://localhost:5174";

export type DeviceQuery = {
  searchTxt?: string;
  deviceType?: string;
  minId?: number;
  maxId?: number;
  sampleId?: number;
};

export async function getAllDevices(q: DeviceQuery = {}): Promise<Device[]> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(q)) {
    if (value !== undefined && value !== null && value !== "")
      params.append(key, String(value));
  }
  const qs = params.toString();
  const res = await fetch(`${BASE}/Devices${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error(`Failed to retrieve devices: ${res.status}`);
  return res.json();
}

export async function getDeviceById(id: number): Promise<Device> {
  const res = await fetch(`${BASE}/Devices/${id}`);
  if (!res.ok) throw new Error(`Failed to get device ${id}: ${res.status}`);
  return res.json();
}

export async function createDevice(data: DeviceInput): Promise<Device> {
  const res = await fetch(`${BASE}/Devices`, {
    method: "POST",
    headers: { "Content-Types": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Failed to create a new Device: ${res.status}`);
  }
  return res.json();
}

export async function updateDevice(
  id: number,
  data: DeviceInput,
): Promise<Device> {
  const res = await fetch(`${BASE}/Devices/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update device ${id}: ${res.status}`);
  return res.json();
}

export async function deleteDevice(id: number) {
  const res = await fetch(`${BASE}/Devices/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Failed to delete device ${id}: ${res.status}`);
}
