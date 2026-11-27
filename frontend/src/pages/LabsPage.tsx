import { Stack, Typography } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { FileDownload, WidthFull } from "@mui/icons-material";

import type { Resolver } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type {
  InputLayout,
  LeftPanelProps,
  RightPanelProps,
  SchemaMode,
} from "../types/basic";
import { makeUserInputSchema } from "../types/users";
import type { NestedDictionary } from "../types/basic";
import { labInputSchema, type Lab, type LabInput } from "../types/labs";
import type { LabQuery } from "../api/lab";
import {
  getAllLabs,
  getLabById,
  createLab,
  updateLab,
  deleteLab,
} from "../api/lab";
import BasicPage from "../components/shared/BasicPage/BasicPage";

const labAdvancedSearchInfo: NestedDictionary = {
  idRangeChb: { minId: "number", maxId: "number" },
  labLeaderIdChb: { labLeaderId: "number" },
};

const labDisplayedColDef: GridColDef[] = [
  { field: "id", headerName: "Lab ID", width: 75 },
  { field: "labName", headerName: "Lab Name", width: 100 },
  { field: "description", headerName: "Description", width: 100 },
  { field: "labLeaderId", headerName: "Lab Leader ID", width: 100 },
];

const leftPanelProps: LeftPanelProps<Lab, LabQuery> = {
  entityName: "lab",
  entityAdvancedSearchInfo: labAdvancedSearchInfo,
  entityDisplayedColDef: labDisplayedColDef,
  getAllEntities: getAllLabs,
  getEntityById: getLabById,
};
const labLayout: InputLayout<LabInput>[] = [
  {
    inputKey: "labName",
    type: "string",
    required: true,
  },
  { inputKey: "description", type: "string" },
  { inputKey: "labLeaderId", type: "number" },
];

const labDefaultValues: LabInput = {
  labName: "Semiconductor Optics",
  description: "Studying optical properties of semiconductors",
  labLeaderId: 15,
};

// resolvers are different in the case of "add" and "update"
const labResolver = zodResolver(labInputSchema);
const rightPanelProps: RightPanelProps<Lab, LabInput> = {
  entityName: "lab",
  inputLayout: labLayout,
  inputDefaultValues: labDefaultValues,
  resolver: labResolver,
  createEntity: createLab,
  updateEntity: updateLab,
  deleteEntity: deleteLab,
};

export default function UsersPage() {
  return (
    <Stack>
      <BasicPage<Lab, LabQuery, LabInput>
        pageTitle="Lab"
        leftPanelProps={leftPanelProps}
        rightPanelProps={rightPanelProps}
      />
    </Stack>
  );
}
