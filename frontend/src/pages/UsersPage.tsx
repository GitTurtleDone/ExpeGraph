import { Stack, Typography } from "@mui/material";

import BasicPage from "../components/shared/BasicPage/BasicPage";

import type { GridColDef } from "@mui/x-data-grid";

import type {
  InputLayout,
  LeftPanelProps,
  RightPanelProps,
} from "../types/basic";
import { userInputSchema } from "../types/users";
import type {
  User,
  UserAdvancedSearchCheckboxes,
  UserAdvancedSearchFields,
  UserDisplayedColumns,
  UserInput,
} from "../types/users";
import type { UserQuery } from "../api/user";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../api/user";
import type { NestedDictionary } from "../types/basic";
import { FileDownload, WidthFull } from "@mui/icons-material";

const userAdvancedSearchCheckboxes: UserAdvancedSearchCheckboxes = {
  idRangeChb: false,
  isActiveChb: false,
  lastLoginRangeChb: false,
};

const userAdvancedSearchFields: UserAdvancedSearchFields = {
  minId: "",
  maxId: "",
  isActive: false,
  lastLoginFrom: "",
  lastLoginTo: "",
};

const userAdvancedSearchInfo: NestedDictionary = {
  idRangeChb: { minId: "number", maxId: "number" },
  isActiveChb: { isActive: "boolean" },
  lastLoginRangeChb: { lastLoginFrom: "date", lastLoginTo: "date" },
};

const userDisplayedColDef: GridColDef[] = [
  { field: "id", headerName: "User ID", width: 75 },
  { field: "username", headerName: "Username", width: 100 },
  { field: "email", headerName: "Email", width: 100 },
  { field: "firstName", headerName: "First Name", width: 100 },
  { field: "lastName", headerName: "Last Name", width: 100 },
  {
    field: "lastLoginAt",
    headerName: "Last Login",
    width: 100,
    type: "date",
    valueGetter: (value) => value ? new Date(value) : null,
    valueFormatter: (value: Date | null) => {
      if (!value) return '';
      return value.toLocaleDateString()
    }
  },
];

const leftPanelProps: LeftPanelProps<User, UserQuery> = {
  entityName: "user",
  entityAdvancedSearchInfo: userAdvancedSearchInfo,
  entityDisplayedColDef: userDisplayedColDef,
  getAllEntities: getAllUsers,
  getEntityById: getUserById,
};
const userLayout: InputLayout<UserInput>[] = [
  {
    label: "Username",
    inputKey: "username",
    type: "string",
    required: true,
  },
  { label: "Email", inputKey: "email", type: "string" },
  { label: "Password", inputKey: "password", type: "password" },
  {
    label: "First Name",
    inputKey: "firstName",
    type: "string",
  },
  {
    label: "Last Name",
    inputKey: "lastName",
    type: "string",
  },
];

const userDefaultValues: UserInput = {
  username: "gtd19",
  email: "giang.dang@canterbury.ac.nz",
  firstName: "Giang",
  lastName: "Dang",
  password: "",
};

const rightPanelProps: RightPanelProps<User, UserInput> = {
  entityName: "user",
  inputLayout: userLayout,
  inputDefaultValues: userDefaultValues,
  resolver: zodResolver(userInputSchema),
  // getAllEntities: getAllUsers,
  // getEntityById: getUserById,
  createEntity: createUser,
  updateEntity: updateUser,
  deleteEntity: deleteUser,
};

export default function UsersPage() {
  return (
    <Stack>
      <BasicPage
        pageTitle="User"
        leftPanelProps={leftPanelProps}
        rightPanelProps={rightPanelProps}
      />
    </Stack>
  );
}
