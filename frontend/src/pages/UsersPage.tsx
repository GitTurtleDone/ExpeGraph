import { Stack } from "@mui/material";

import BasicPage from "../components/shared/BasicPage/BasicPage";
import type { InputLayout, LeftPanelProps, RightPanelProps } from "../types/basic";
import { userInputSchema, type User, type UserInput } from "../types/users";
import type { UserQuery } from "../api/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../api/user";


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

const rightPanelProps : RightPanelProps<User, UserInput>= {
  inputLayout: userLayout,
  inputDefaultValues: userDefaultValues,
  resolver: zodResolver(userInputSchema),
  // getAllEntities: getAllUsers,
  // getEntityById: getUserById,
  createEntity: createUser,
  updateEntity: updateUser,
  deleteEntity: deleteUser,
}

const leftPanelProps: LeftPanelProps<User, UserQuery> = {
  entityName: "user",
  getAllEntities: getAllUsers,
  getEntityById: getUserById,
}

export default function UsersPage() {
  return (
    <Stack>
      <BasicPage 
        pageTitle="Users"
        leftPanelProps= {leftPanelProps}
        rightPanelProps= {rightPanelProps} />
    </Stack>
    
  )
  
}