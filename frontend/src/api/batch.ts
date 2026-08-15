import type { Batch, BatchInput } from "../types/batches";

export type BatchQuery = {
    searchText?: string,
    minId?: number,
    maxId?: number,
    fabricatedFrom?: string, //"YYYY-MM-DD"
    fabricatedTo?: string,
    projectId?: number,
    labId?: number,
    sort?: "batchName" | "fabrcicationDate",
    order?: "asc" | "desc"
}
const BASE = "http://localhost:5174"


export async function getAllBatches(q: BatchQuery = {}): Promise<Batch[]> {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(q)) {
        if (value !== undefined && value !== null && value !=="") {
            params.append(key, String(value));
        }
    }
    const qs = params.toString();
    const res = await fetch(`${BASE}/Batches${qs ? `?${qs}` : ""}`)
    if (!res.ok) throw new Error("Failed to fetch batches");
    return res.json();
}

export async function getBatchById(id: number): Promise<Batch> {
    const res = await fetch(`${BASE}/Batches`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
    })
    if (!res.ok) throw new Error
} 

export async function createBatch(
    data: BatchInput
): Promise<Batch> {
    const res = await fetch(
        `${BASE}/Batches`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    if (!res.ok) {
        const  message = await res.text() ;
        throw new Error(message || "Failed to create a batch");
    }
    
    return res.json();
}

export async function updateBatch(
    id: number,
    data: BatchInput
): Promise<Batch>{
    const res = await fetch(`${BASE}/Batches/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    if (!res.ok) {
        const message = await res.text();
        throw new Error(message || `Failed to update batch ${id}.`);
    }
    return res.json();
}

export async function deleteBatch(id: number) {
    const res = await fetch(`${BASE}/Equipment`, {
        method: "DELETE",
        headers: {"Content-Type" : "application/json"}
    })
    if (!res.ok) throw new Error(`Failed to delete batch ${id}`)
    else return 
} 