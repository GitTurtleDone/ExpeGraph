import { Stack } from "@mui/material";

import BasicPage from "../components/shared/BasicPage/BasicPage";
import type { InputLayout, RightPanelProps } from "../types/basic";
import { userInputSchema, type User, type UserInput } from "../types/users";
import { zodResolver } from "@hookform/resolvers/zod";


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
  password: "HoangAnhGialai!19",
};

const rightPanelProps : RightPanelProps<User, UserInput>= {
  inputLayout: userLayout,
  inputDefaultValues: userDefaultValues,
  resolver: zodResolver(userInputSchema),
}

export default function UsersPage() {
  return (
    <Stack>
      <BasicPage 
        pageTitle="Users"
        rightPanelProps={rightPanelProps} />
    </Stack>
    
  )
  
}