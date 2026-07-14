import type { Batch, BatchInput } from "../types/batches";

const BASE = "http://localhost:5174"

export async function getAllBatches(): Promise<Batch[]> {
    const res = await fetch(`${BASE}/Batches`)
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
    if (!res.ok) throw new Error("Failed to create a batch");
    return res.json();
}

export async function updateBatch(
    id: number,
    data: BatchInput
): Promise<Batch>{
    const res = await fetch(`{BASE}/Batches`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error(`Failed to update batch ${id}.`)
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