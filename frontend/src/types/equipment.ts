export type Equipment = {
    equipmentId: number,
    equipmentName: string,
    manufacturer: string | null,
    model: string | null,
    serialNumber: string | null,
    purchaseYear: number | null,
    calibrationDue: string | null,
    location: string | null,
    connectingStr: string | null,
    notes: string | null,
}

export type CreateEquipmentRequest = {
    equipmentName: string,
    manufacturer?: string,
    model?: string,
    serialNumber?: string,
    purchaseYear?: number,
    calibrationDue?: string,
    location?: string,
    connectingStr?: string,
    notes?: string,
}