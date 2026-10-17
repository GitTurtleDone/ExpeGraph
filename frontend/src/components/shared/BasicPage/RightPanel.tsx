import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { User, UserInput } from "../../../types/users";
import { userSchema, userInputSchema } from "../../../types/users";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";

import { Stack, Typography, Box, OutlinedInput, Button } from "@mui/material";
import { createUser, deleteUser, updateUser } from "../../../api/user";
import type { SampleInput } from "../../../types/samples";

type InputLayout = {
  label: string;
  inputKey: keyof UserInput; // Name
  required?: boolean; // The input that is required
  type: string;
  multiline?: boolean;
};


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

const entryDefaultValues: UserInput = {
  userName: "gtd19",
  email: "giang.dang@canterbury.ac.nz",
  firstName: "Giang",
  lastName: "Dang",
  password: "HoangAnhGialai!19",
};

export default function () {
  const {selectedEntry, setSelectedEntry} = useState<User | undefined>(undefined);
  const { selectedId, setSelectedId} = useState<number | undefined> (undefined);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserInput>({
    defaultValues: entryDefaultValues,
    resolver: zodResolver(userInputSchema),
  });
  const queryClient = new QueryClient();
  const onAddEntry = useMutation({
    mutationFn: createUser,
    onSuccess: async (newEntry) => {
      setSelectedEntry(newEntry);
      setSelectedId(newEntry.userId)
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
  const onUpdateEntry = useMutation({
    mutationFn: ({id, data}: {id: number, data: UserInput}) => updateUser(id, data),
    onSuccess: async (updatedEntry) => {
      setSelectedEntry(updatedEntry);
      setSelectedId(updatedEntry.userId);
      await queryClient.invalidateQueries({
        queryKey: ["users"]
      })
    }
  });
  const onDeleteEntry = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: async () => {
      queryClient.invalidateQueries({queryKey: ["users"]})
    }
  })

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
              {...register(f.inputKey)}
              type={f.type}
            />

            <ErrorMessage
              errors={errors}
              name={f.inputKey}
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
        <Button variant="contained" onClick={() => reset(entryDefaultValues)}>
          New
        </Button>
        <Button variant="contained" onClick={handleSubmit((data) => onAddEntry.mutate(data))}>
          Add
        </Button>
        <Button variant="contained" onClick={handleSubmit((data) => onUpdateEntry.mutate(selectedId, data))} disabled={true}>
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
