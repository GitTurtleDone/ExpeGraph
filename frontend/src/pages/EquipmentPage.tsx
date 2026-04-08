import React from "react";
import {
  Stack,
  OutlinedInput,
  Typography,
  Button,
  MenuItem,
  List,
  ListItemButton,
  FormLabel,
} from "@mui/material";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllEquipment,
  createEquipment,
  updateEquipment,
  getEquipmentByName,
  deleteEquipment,
  connectEquipment,
} from "../api/equipment";
import type { CreateEquipmentRequest, Equipment } from "../types/equipment";
import { useState } from "react";
function EquipmentPage() {
  const [equipment, setEquipment] = useState({
    equipmentId: 0,
    equipmentName: "",
    manufacturer: "",
    model: "",
    serialNumber: "",
    purchaseYear: "" as number | string,
    calibrationDue: "",
    location: "",
    connectingStr: "",
    notes: "",
  });
  type TableItem = {
    label: string;
    type: string;
    field: keyof typeof equipment;
  };
  const equipmentLayout: TableItem[] = [
    { label: "Id", type: "number", field: "equipmentId" },
    { label: "Name", type: "text", field: "equipmentName" },
    { label: "Manufacturer", type: "text", field: "manufacturer" },
    { label: "Model", type: "text", field: "model" },
    { label: "Serial Number", type: "text", field: "serialNumber" },
    { label: "Purchase Year", type: "number", field: "purchaseYear" },
    { label: "Calibration Due", type: "date", field: "calibrationDue" },
    { label: "Location", type: "text", field: "location" },
    { label: "Connecting String", type: "text", field: "connectingStr" },
    { label: "Notes", type: "text", field: "notes" },
  ];
  // Fetch all equipments - runs automatically on mount
  const allEquipment = useQuery({
    queryKey: ["equipments"],
    queryFn: getAllEquipment,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Mutate - runs when mutate() is called
  const queryClient = useQueryClient();
  const addEquipment = useMutation({
    mutationFn: createEquipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
    },
  })
  const udtEquipment = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateEquipmentRequest }) =>
      updateEquipment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
    },
  })
  const delEquipment = useMutation({
    mutationFn: deleteEquipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
      setEquipment({
        equipmentId: 0,
        equipmentName: "",
        manufacturer: "",
        model: "",
        serialNumber: "",
        purchaseYear: "",
        calibrationDue: "",
        location: "",
        connectingStr: "",
        notes: "",
      })
    },
  })
  const conEquipment = useMutation({
	  mutationFn: (strConnecting: string) => connectEquipment(strConnecting),
	  onSuccess: () => {
		  queryClient.invalidateQueries({ queryKey: ['equipments']})
	  },
  })

  return (
    <div>
      <Typography variant="h2" sx={{ mb: 4 }}>
        Equipment
      </Typography>
      <Stack direction="row" spacing={5}>
        <Stack spacing={1.5} width="50%" mb={4}>
          {/* <Select sx={{minWidth: 200, width: "50%"}} size="small">
                  <MenuItem value="5">First 5 Equipment</MenuItem>
                  <MenuItem value="10">First 10 Equipment</MenuItem>
                  <MenuItem value="50">First 50 Equipment</MenuItem>
               </Select> */}
          <Typography variant="h4" sx={{ mb: 3 }}>
            {" "}
            All{" "}
          </Typography>
          <List dense>
            <ListItemButton 
                key="new" 
                selected={equipment.equipmentId === 0}
                onClick={() => setEquipment({
                    equipmentId: 0,
                    equipmentName: "",
                    manufacturer: "",
                    model: "",
                    serialNumber: "",
                    purchaseYear: "",
                    calibrationDue: "",
                    location: "",
                    connectingStr: "",
                    notes: "",
                })}
            >New</ListItemButton>
            {allEquipment.data?.slice().sort((a, b) => a.equipmentId - b.equipmentId).map((eq) => (
              <ListItemButton
                key={eq.equipmentId}
                selected={equipment.equipmentId === eq.equipmentId}
                onClick={() =>
                  setEquipment({
                    equipmentId: eq.equipmentId,
                    equipmentName: eq.equipmentName,
                    manufacturer: eq.manufacturer ?? "",
                    model: eq.model ?? "",
                    serialNumber: eq.serialNumber ?? "",
                    purchaseYear: eq.purchaseYear || "",
                    calibrationDue: eq.calibrationDue ?? "",
                    location: eq.location ?? "",
                    connectingStr: eq.connectingStr ?? "",
                    notes: eq.notes ?? "",
                  })
                }
              >
                {eq.equipmentName}
              </ListItemButton>
            ))}
          </List>
          <Button 
              variant="contained"
              onClick={() => conEquipment.mutate(equipment.connectingStr)}
            >
            Connect Equipment
            </Button>
        </Stack>
        <Stack spacing={1.5} width="50%" mb={5}>
          {equipmentLayout.map(({ label, type, field }) => (
            <Stack key={label} direction="row" alignItems="center" spacing={2}>
              <Typography sx={{ width: 160, flexShrink: 0 }}>
                {label}
              </Typography>
              <OutlinedInput
                onChange={(e) =>
                  setEquipment({ ...equipment, [field]: e.target.value })
                }
                value={equipment[field]}
                type={type}
                id={label}
                size="small"
                fullWidth
                disabled={label === "Id"}
              />
            </Stack>
          ))}
          <Stack direction="row" pt={5} gap={5}>
            <Button
              variant="contained"
              color="primary"
              disabled={addEquipment.isPending}
              onClick={() =>
                addEquipment.mutate({
                  equipmentName: equipment.equipmentName,
                  manufacturer: equipment.manufacturer || undefined,
                  model: equipment.model || undefined,
                  serialNumber: equipment.serialNumber || undefined,
                  purchaseYear: equipment.purchaseYear
                    ? Number(equipment.purchaseYear)
                    : undefined,
                  calibrationDue: equipment.calibrationDue || undefined,
                  location: equipment.location || undefined,
                  connectingStr: equipment.connectingStr || undefined,
                  notes: equipment.notes || undefined,
                })
              }
            >
              {addEquipment.isPending ? "Add..." : "Add"}
            </Button>
            <Button
              onClick={() =>
                udtEquipment.mutate({
                  id: equipment.equipmentId,
                  data: {
                    equipmentName: equipment.equipmentName,
                    manufacturer: equipment.manufacturer || undefined,
                    model: equipment.model || undefined,
                    serialNumber: equipment.serialNumber || undefined,
                    purchaseYear: equipment.purchaseYear
                      ? Number(equipment.purchaseYear)
                      : undefined,
                    calibrationDue: equipment.calibrationDue || undefined,
                    location: equipment.location || undefined,
                    connectingStr: equipment.connectingStr || undefined,
                    notes: equipment.notes || undefined,
                  },
                })
              }
              variant="contained"
            >
              {udtEquipment.isPending ? 'Updating...' : 'Update'}
            </Button>
            <Button onClick={() => delEquipment.mutate(equipment.equipmentId)}
              variant="contained"
              color="error"
              disabled={delEquipment.isPending}
            >
              {delEquipment.isPending ? "Delete..." : "Delete"}
            </Button>
            
          </Stack>
        </Stack>
      </Stack>
    </div>
  )
}
export default EquipmentPage;
