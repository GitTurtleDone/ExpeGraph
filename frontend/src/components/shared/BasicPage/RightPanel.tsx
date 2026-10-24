import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { User, UserInput } from "../../../types/users";
import { userSchema, userInputSchema } from "../../../types/users";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


import {
  Stack,
  Typography,
  Box,
  OutlinedInput,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";

import { createUser, deleteUser, updateUser } from "../../../api/user";
import type { SampleInput } from "../../../types/samples";
import type { RightPanelProps } from "../../../types/basic";
import type { FieldValues } from "react-hook-form";
export default function RightPanel<
  TEntity,
  TEntityInput extends FieldValues,
  // TEntityQuery extends FieldValues,
>({ rightPanelProps }) {
  const {
    inputLayout,
    inputDefaultValues,
    resolver,
    getAllEntities,
    getEntityById,
    createEntity,
    updateEntity,
    deleteEntity,
  } = { ...rightPanelProps };
  const [selectedEntry, setSelectedEntry] = useState<TEntity | undefined>(
    undefined,
  );
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
  const [openDeleteWarningDialog, setOpenDeleteWarningDialog] = useState(false);
  const [openDeleteConfirmingDialog, setOpenDeleteConfirmingDialog] =
    useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TEntityInput>({
    defaultValues: inputDefaultValues,
    resolver: resolver,
  });
  const queryClient = useQueryClient();
  const onAddEntry = useMutation({
    mutationFn: createEntity,
    onSuccess: async (newEntry) => {
      setSelectedEntry(newEntry);
      setSelectedId(newEntry.userId);
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
  const onUpdateEntry = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TEntityInput }) =>
      updateEntity(id, data),
    onSuccess: async (updatedEntry) => {
      setSelectedEntry(updatedEntry);
      setSelectedId(updatedEntry.userId);
      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
  const onDeleteEntry = useMutation({
    mutationFn: (id: number) => deleteEntity(id),
    onSuccess: async () => {
      (setOpenDeleteConfirmingDialog(true),
        queryClient.invalidateQueries({ queryKey: ["users"] }));
    },
  });

  const onOpenDeleteWarningDialog = () => setOpenDeleteConfirmingDialog(true);
  const onCloseDeleteWarningDialog = () => setOpenDeleteConfirmingDialog(false);
  const onOpenDeleteConfirmingDialog = () =>
    setOpenDeleteConfirmingDialog(true);
  const onCloseDeleteConfirmingDialog = () =>
    setOpenDeleteConfirmingDialog(true);

  return (
    <Stack sx={{ gap: 2 }}>
      <Typography>Right Panel</Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 2fr" }}>
        <Typography>User ID</Typography>
        <OutlinedInput type="number" disabled={true} />
      </Box>
      {inputLayout.map((f) => (
        <Box
          key={f.label}
          sx={{ display: "grid", gridTemplateColumns: "1fr 2fr" }}
        >
          <Typography>{f.label}</Typography>
          <Stack>
            <OutlinedInput {...register(f.inputKey)} type={f.type} />

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
        <Button variant="contained" onClick={() => reset(inputDefaultValues)}>
          New
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit((data) => onAddEntry.mutate(data))}
        >
          Add
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit((data) =>
            onUpdateEntry.mutate(selectedId, data),
          )}
          disabled={true}
        >
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
      <Dialog
        open={openDeleteWarningDialog}
        onClose={onCloseDeleteWarningDialog}
      >
        <DialogTitle>Delete warning</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to delete Entry {selectedEntry}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onDeleteEntry.mutate(selectedId)}>Yes</Button>
          <Button onClick={onCloseDeleteWarningDialog}>No</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteConfirmingDialog}
        onClose={onCloseDeleteConfirmingDialog}
      >
        <DialogTitle>Deletion Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The entry {selectedEntry} was deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDeleteConfirmingDialog}>OK</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
