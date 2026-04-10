import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getAllConnectedEquipment } from "../api/acquire"
import { getAllEquipment } from "../api/equipment"
import { Stack, Typography, Select, MenuItem, Tabs, Tab, Box, Button } from "@mui/material"

export default function AcquirePage() {
  const [tab, setTab] = useState(0)

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
      <Typography variant="h2" mb={3}>Acquire</Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)}>
          <Tab label="Setup" />
          <Tab label="Run" />
        </Tabs>
      </Box>

      {/* Setup Tab */}
      {tab === 0 && (
        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography sx={{ width: 160, flexShrink: 0 }}>Equipment</Typography>
            <Select size="small" displayEmpty sx={{ minWidth: 240 }}>
              <MenuItem value="" disabled>Select equipment</MenuItem>
              {connectedEquipment.map((eq) => (
                <MenuItem key={eq.equipmentId} value={eq.connectingStr ?? ""}>
                  {eq.equipmentName}
                </MenuItem>
              ))}
            </Select>
          </Stack>
          {/* Measurement and graph display settings go here */}
        </Stack>
      )}

      {/* Run Tab */}
      {tab === 1 && (
        <Stack spacing={3}>
          <Box>
            <Button variant="contained" size="large">Run</Button>
          </Box>
          {/* Graph goes here */}
          <Box sx={{ width: "100%", height: 500, border: "1px dashed grey", borderRadius: 1,
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography color="text.secondary">Graph will appear here</Typography>
          </Box>
        </Stack>
      )}
    </div>
  )
}