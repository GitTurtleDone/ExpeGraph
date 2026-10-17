import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { User, UserInput } from "../../../types/users";
import { userSchema, userInputSchema } from "../../../types/users";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";

import { Stack, Typography, Box, OutlinedInput, Button } from "@mui/material";
import { createUser } from "../../../api/user";
import type { SampleInput } from "../../../types/samples";


type FieldLayout = {
  label: string;
  fieldName: keyof UserInput;
  type: string;
  disabled: boolean;
  required?: boolean;
};
const userInputDefaultValues: UserInput = {
  userName: "gtd19",
  email: "giang.dang@canterbury.ac.nz",
  firstName: "Giang",
  lastName: "Dang",
  password: "HoangAnhGialai!19",
};

const userLayout: FieldLayout[] = [
  {
    label: "User Name",
    fieldName: "userName",
    type: "string",
    disabled: false,
    required: true,
  },
  { label: "Email", fieldName: "email", type: "string", disabled: false },
  { label: "Password", fieldName: "password", type: "string", disabled: false },
  {
    label: "First Name",
    fieldName: "firstName",
    type: "string",
    disabled: false,
  },
  {
    label: "Last Name",
    fieldName: "lastName",
    type: "string",
    disabled: false,
  },
];

export default function () {
  //   const {selectedItem, setSelectedItem} = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<UserInput>({
    defaultValues: userInputDefaultValues,
    resolver: zodResolver(userInputSchema),
  });
  const queryClient = new QueryClient();
  const onCreate = useMutation({
    mutationFn: createUser,
    onSuccess: () => {queryClient.invalidateQueries({queryKey:["users"]})},
  });
  const onAdd = async (data: SampleInput) => onCreate.mutate(data);
  return (
    <Stack sx={{ gap: 2 }}>
      <Typography>Right Panel</Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 2fr" }}>
        <Typography>User ID</Typography>
        <OutlinedInput type="number" disabled={true} />
      </Box>
      {userLayout.map((f) => (
        <Box
          key={f.label}
          sx={{ display: "grid", gridTemplateColumns: "1fr 2fr" }}
        >
          <Typography>{f.label}</Typography>
          <Stack>
            <OutlinedInput
              {...register(f.fieldName)}
              type={f.type}
              disabled={f.disabled}
            />

            <ErrorMessage
              errors={errors}
              name={f.fieldName}
              render={({ message }) => (
                <Typography variant="caption" color="error">
                  {message}
                </Typography>
              )}
            />
          </Stack>
        </Box>
      ))}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "10%",
        }}
      >
        <Button variant="contained" onClick={() => {}}>
          New
        </Button>
        <Button variant="contained" onClick={handleSubmit(onAdd)}>
          Add
        </Button>
        <Button variant="contained" onClick={() => {}} disabled={true}>
          Update
        </Button>
        <Button
          variant="contained"
          onClick={() => {}}
          color="error"
          disabled={true}
        >
          Delete
        </Button>
      </Box>
    </Stack>
  );
}
