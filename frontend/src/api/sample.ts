// import { PostAdd } from "@mui/icons-material";
import type { Sample, SampleInput} from "../types/samples";
export type SampleQuery = {
    search?: string,
    minId?: number,
    maxId?: number,
    batchId?: number,
    sort?: "sampleName"
    order?: "asc" | "desc"

}

const BASE = "http://localhost:5174/samples"

export async function getAllSamples (q: SampleQuery = {}): Promise<Sample[]> {
    const params = new URLSearchParams();
    for (const [key,value] of Object.entries(q)) {
        if (value !== undefined && value !== null && value !== "")
            params.append(key, String(value));
    }
    const qs = params.toString();
    const res = await fetch(`${BASE}/Samples${qs ? `?${qs}`: ""}`);
    if (!res.ok) throw new Error("Failed to fetch samples");
    return res.json();
}

export async function createSample (data: SampleInput) : Promise<Sample> {
    
    const  res = await fetch(`${BASE}/Samples`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create a new Sample');
    return res.json();
}

export async function updateSample (id: number, data: SampleInput) : Promise<Sample> {
    const res = await fetch(`${BASE}/Samples/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })

    if (!res.ok) throw new Error(`Failed to update the sample ${id}`)
    return res.json();
}

export async function deleteSample(id: number) {
    const res = await fetch (`${BASE}/Samples/${id}`, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"}
    })
    if (!res.ok) throw new Error(`Failed to delete sample ${id}`)

    
}

