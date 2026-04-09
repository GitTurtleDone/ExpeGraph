
// const BASE = "http://localhost:5174";
const WINDOW_BASE = "http://172.31.80.1:8000";
export async function getAllConnectedEquipment():Promise<string[]>{
	const res = await fetch(`${WINDOW_BASE}/equipment`)
	if (!res.ok) throw new Error('Failed to get connected devices')
	const data = await res.json()
	console.log(data)
	return data
}