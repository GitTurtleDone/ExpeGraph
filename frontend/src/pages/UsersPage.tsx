import { Stack } from "@mui/material";

import BasicPage from "../components/shared/BasicPage/BasicPage";
import type { InputLayout } from "../types/basic";
import type { UserInput } from "../types/users";

const userLayout: InputLayout[] = [
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

export default function UsersPage() {
  return (
    <Stack>
      <BasicPage 
        pageTitle="Users"
        rightPanelProps={{inputLayout: userLayout, inputDefaultValues: userDefaultValues}} />
    </Stack>
    
  )
  
}