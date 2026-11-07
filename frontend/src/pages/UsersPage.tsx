import { Stack, Typography } from "@mui/material";

import BasicPage from "../components/shared/BasicPage/BasicPage";

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

const userAdvancedSearchCheckboxes: UserAdvancedSearchCheckboxes = {
  idRangeChb: false,
  isActiveChb: false,
  lastLoginRangeChb: false,
}

const userAdvancedSearchFields: UserAdvancedSearchFields = {
  minId: "",
  maxId: "",
  isActive: false,
  lastLoginFrom: "",
  lastLoginTo: "",
}

const userAdvancedSearchInfo: NestedDictionary = {
  idRangeChb: {minId: "string", maxId: "string"},
  isActiveChb: {isActive: "boolean"},
  lastLoginRangeChb: {lastLoginFrom: "string", lastLoginTo: "string"}
}

const userDisplayedColumns: UserDisplayedColumns = {
  userId: 1,
  userName: "",
  email: "",
  firstName: "",
  lastName: "",
  lastLoginAt: "",
}


const leftPanelProps: LeftPanelProps<
  User,
  UserAdvancedSearchCheckboxes,
  UserAdvancedSearchFields,
  UserDisplayedColumns,
  UserQuery
> = {
  entityName: "user",
  entityAdvancedSearchCheckboxes: userAdvancedSearchCheckboxes,
  entityAdvancedSearchFields: userAdvancedSearchFields,
  entityAdvancedSearchInfo: userAdvancedSearchInfo,
  entityDislayedColumns: userDisplayedColumns,
  getAllEntities: getAllUsers,
  getEntityById: getUserById,
};
const userLayout: InputLayout<UserInput>[] = [
  {
    label: "User Name",
    inputKey: "userName",
    type: "string",
    required: true,
  },
  { label: "Email", inputKey: "email", type: "string" },
  { label: "Password", inputKey: "password", type: "string" },
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
  userName: "gtd19",
  email: "giang.dang@canterbury.ac.nz",
  firstName: "Giang",
  lastName: "Dang",
  password: "",
};

const rightPanelProps: RightPanelProps<User, UserInput> = {
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
        pageTitle="Users"
        leftPanelProps={leftPanelProps}
        rightPanelProps={rightPanelProps}
        
      />

      
    </Stack>
  );
}
