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
import { userInputSchema, makeUserInputSchema } from "../types/users";
import type { NestedDictionary } from "../types/basic";
import type {
  User,
  UserAdvancedSearchCheckboxes,
  UserAdvancedSearchFields,
  UserDisplayedColumns,
  UserInput,
} from "../types/users";
import type { UserQuery } from "../api/user";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../api/user";
import BasicPage from "../components/shared/BasicPage/BasicPage";

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
    valueGetter: (value) => (value ? new Date(value) : null),
    valueFormatter: (value: Date | null) => {
      if (!value) return "";
      return value.toLocaleDateString();
    },
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

// resolvers are different in the case of "add" and "update"
const userResolver: Resolver<UserInput, { mode: SchemaMode }> = (
  values,
  context,
  options,
) =>
  zodResolver(makeUserInputSchema(context?.mode ?? "add"))(
    values,
    context,
    options,
  );
const rightPanelProps: RightPanelProps<User, UserInput> = {
  entityName: "user",
  inputLayout: userLayout,
  inputDefaultValues: userDefaultValues,
  resolver: userResolver,
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
