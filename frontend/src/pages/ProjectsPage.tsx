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
import {
  projectInputSchema,
  type Project,
  type ProjectInput,
} from "../types/projects";
import type { ProjectQuery } from "../api/project";
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../api/project";
import BasicPage from "../components/shared/BasicPage/BasicPage";

const projectAdvancedSearchInfo: NestedDictionary = {
  idRangeChb: { minId: "number", maxId: "number" },
  startDateChb: { startDateFrom: "date", startDateTo: "date" },
  endDateChb: { endDateFrom: "date", endDateTo: "date" },
};

const projectDisplayedColDef: GridColDef[] = [
  { field: "id", headerName: "Project ID", width: 75 },
  { field: "projectName", headerName: "Project Name", width: 100 },
  { field: "description", headerName: "Description", width: 200 },
  { field: "funding", headerName: "Funding", width: 80 },
  { field: "startDate", headerName: "Start Date", width: 80 },
  { field: "endDate", headerName: "End Date", width: 80 },
];

const leftPanelProps: LeftPanelProps<Project, ProjectQuery> = {
  entityName: "project",
  entityAdvancedSearchInfo: projectAdvancedSearchInfo,
  entityDisplayedColDef: projectDisplayedColDef,
  getAllEntities: getAllProjects,
  getEntityById: getProjectById,
};
const projectLayout: InputLayout<ProjectInput>[] = [
  {
    inputKey: "projectName",
    type: "string",
    required: true,
  },
  { inputKey: "description", type: "string" },
  { inputKey: "funding", type: "string" },
  { inputKey: "startDate", type: "date" },
  { inputKey: "endDate", type: "date" },
];

const projectDefaultValues: ProjectInput = {
  projectName: "Ga2O3",
  description: "Fabrication of Ga2O3 high-power devices",
  funding: "NZ MBIE",
  startDate: "01/01/2023",
  endDate: "31/03/2026",
};

// resolvers are different in the case of "add" and "update"
const projectResolver = zodResolver(projectInputSchema);
const rightPanelProps: RightPanelProps<Project, ProjectInput> = {
  entityName: "project",
  inputLayout: projectLayout,
  inputDefaultValues: projectDefaultValues,
  resolver: projectResolver,
  createEntity: createProject,
  updateEntity: updateProject,
  deleteEntity: deleteProject,
};

export default function UsersPage() {
  return (
    <Stack>
      <BasicPage<Project, ProjectQuery, ProjectInput>
        pageTitle="Project"
        leftPanelProps={leftPanelProps}
        rightPanelProps={rightPanelProps}
      />
    </Stack>
  );
}
