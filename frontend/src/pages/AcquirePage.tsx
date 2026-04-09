import { useQuery } from "@tanstack/react-query"
import { getAllConnectedEquipment } from "../api/acquire"
import { getAllEquipment } from "../api/equipment"
import { Stack, Typography, Select, MenuItem } from "@mui/material"

export default function AcquirePage(){
	const connectedResources = useQuery({
		queryKey: ['connectedEquipment'],
    queryFn: getAllConnectedEquipment,
    staleTime: 1000 * 60 * 5,
	})
  const allEquipment = useQuery({
    queryKey: ['equipments'],
    queryFn: getAllEquipment,
    staleTime: 1000 * 60 * 5,
  })

  const connectedEquipment = allEquipment.data?.filter((eq) =>
    connectedResources.data?.includes(eq.connectingStr ?? "")
  ) ?? []

  return (
    <div>
      <Stack >
      <Typography variant='h2' mb={5}>Acquire</Typography>
        <Select>
        {connectedEquipment.map((eq) => (
          <MenuItem key={eq.equipmentId} value={eq.connectingStr ?? ""}>
            {eq.equipmentName}
          </MenuItem>
        ))}
        </Select>
      
      </Stack>
    </div>
    
  )
};

// function AcquirePage() {
//   return (
//     <div>
//       <h1>Acquire</h1>
//     </div>  
// )
// };
// export default AcquirePage;