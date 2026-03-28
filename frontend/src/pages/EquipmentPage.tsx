import React from "react";
import { Stack, OutlinedInput, Typography} from "@mui/material"
function EquipmentPage(){
    type tableItem = {
        label: string;
        type: string;
    }
    const equipmentLayout: tableItem[] = [
        {label: 'Id', type: 'number'},
        {label: 'Name', type: 'text'},
        {label: 'Manufacturer', type: 'text'},
        {label: 'Model', type: 'text'},
        {label: 'Serial Number', type: 'text'},
        {label: 'Purchase Year', type: 'date'},
        {label: 'Calibration Due', type: 'date'},
        {label: 'Location', type: 'text'},
        {label: 'Connecting String', type: 'text'},
        {label: 'Notes', type: 'text'},
    ]
    return (
        <div>
            <h1>Equipment</h1>
            

              <Stack spacing={1.5}>
                {equipmentLayout.map(({ label, type }) => (
                  <Stack key={label} direction="row" alignItems="center" spacing={2}>
                    <Typography sx={{ width: 160, flexShrink: 0 }}>{label}</Typography>
                    <OutlinedInput type={type} id={label} size="small" fullWidth />
                  </Stack>
                ))}
              </Stack>

              
            
        </div>
    )

}

export default EquipmentPage;