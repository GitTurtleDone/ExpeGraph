import type {DeviceParameter, DeviceParameterInput} from "../types/deviceparameters";

const BASE = "http://localhost:5174";

type DeviceParameterQuery = {
    minId: number;
    maxId: number;
    deviceId: number;
}

export async function getAllDeviceParameters (q: DeviceParameterQuery = {}): Promise<DeviceParameter[]>{
    const params = new URLSearchParams;
    for (const [key, value] of Object(q))
    {
        if (value !== undefined && value )
    }
    const res = await fetch(``)
}