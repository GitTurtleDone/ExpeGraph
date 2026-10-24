import { Stack, Typography, Box, OutlinedInput,  } from "@mui/material";
import { Search, ExpandLess, ArrowRight } from "@mui/icons-material";
// import { Search} from "@mui/icons-material/Search";
// import { ExpandLess } from "@mui/icons-material/ExpandLess";
// import { ArrowRight } from "@mui/icons-material/ArrowRight";

import React, {useState} from "react";
import { gridAdditionalRowGroupsSelector } from "@mui/x-data-grid/internals";


export default function LeftPanel<TEntity, TEntityQuery extends FieldValues>({leftPanelProps}) {
    
    return (
        <Stack>
            <Typography>
                Left Panel
            </Typography>
            <Box sx={{display: "grid", gridTemplateColumns: "8fr 2fr"}}>
                <OutlinedInput 
                type="string"
                placeholder={`Type to search for ${typeof TEntity} `} ></OutlinedInput>
            </Box>
            
        </Stack>
    )
}
