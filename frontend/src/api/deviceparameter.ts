import type {
  DeviceParameter,
  DeviceParameterInput,
} from "../types/deviceparameters";

const BASE = "http://localhost:5174";

type DeviceParameterQuery = {
  minId?: number;
  maxId?: number;
  deviceId?: number;
};

export async function getAllDeviceParameters(
  q: DeviceParameterQuery = {},
): Promise<DeviceParameter[]> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(q)) {
    if (value !== undefined && value !== null && typeof value !== "number")
      params.append(key, String(value));
  }
  const qs = params.toString();
  const res = await fetch(`${BASE}/DeviceParameters${qs ? `?${qs}` : ""} }`);
  if (!res.ok)
    throw new Error(`Failed to fetch device-parameters: ${res.status}`);
  return res.json();
}

export async function getDeviceParameterById(
  id: number,
): Promise<DeviceParameter> {
  const res = await fetch(`${BASE}/DeviceParameters/${id}`);
  if (!res.ok)
    throw new Error(`Failed to get deviceparameter ${id}: ${res.status}`);
  return res.json();
}

export async function createDeviceParameter(
  data: DeviceParameterInput,
): Promise<DeviceParameter> {
  const res = await fetch(`${BASE}/DeviceParameters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok)
    throw new Error(`Failed to create a new DeviceParameter: ${res.status}`);
  return res.json();
}

export async function updateDeviceParameter(
  id: number,
  data: DeviceParameterInput,
): Promise<DeviceParameter> {
  const res = await fetch(`${BASE}/DeviceParameters/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok)
    throw new Error(`Failed to update DeviceParameter ${id}: ${res.status}`);
  return res.json();
}

export async function deleteDeviceParameter(id: number) {
  const res = await fetch(`${BASE}/DeviceParameters/{id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok)
    throw new Error(`Failed to delete deviceParameter ${id}: ${res.status}`);
}
