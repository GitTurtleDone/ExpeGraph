// const BASE = "http://localhost:5174";
const WINDOW_BASE = "http://172.31.80.1:8000";
export async function getAllConnectedEquipment():Promise<string[]>{
	const res = await fetch(`${WINDOW_BASE}/equipment`)
	if (!res.ok) throw new Error('Failed to get connected devices')
	const data = await res.json()
	console.log(data)
	return data
}

export function runMeasurement(
	resourceString: str, 
	sweeps: {vsta: number, vsto: number, vstep: number}[],
	onPoint: (voltage: number, current: number) => void,
	onDone: () => void
) {
	// SSE uses EventSource -> can't use fetch for streaming
	// -> Need to POST first then listen
	fetch(`${WINDOW_BASE}/measurement/run`, {
		method: 'POST',
		headers: {'Content-Type':'application/json'},
		body: JSON.stringify({ resource_string: resourceString, sweeps })
	}).then(async(res) => {
		const reader = res.body!.getReader()
		const decoder = new TextDecoder()
		while (true) {
			const { done, value } = await reader.read()
			if (done) { onDone(); break}
			const text = decoder.decode(value)
			// returned SSE lines format: "data: {...}\n\n"
			text.split("\n").forEach((line) => {
				if (line.startsWith("data: ")) {
					const point = JSON.parse(line.slice(6))
					onPoint(point.voltage, point.current)
				}
			})	 
		}
	})
}