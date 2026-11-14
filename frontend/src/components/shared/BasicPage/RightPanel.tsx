import React, { useState, useEffect, use, useRef } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { User, UserInput } from "../../../types/users";
import { userSchema, userInputSchema } from "../../../types/users";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

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
  TextField,
  Icon,
  IconButton,
} from "@mui/material";

import { createUser, deleteUser, updateUser } from "../../../api/user";
import type { SampleInput } from "../../../types/samples";
import type { RightPanelProps, SchemaMode } from "../../../types/basic";
import type { FieldValues } from "react-hook-form";
import { Preview, Visibility, VisibilityOff } from "@mui/icons-material";
import { capitalizeFirstLetter } from "../../../api/basicAPI";

export default function RightPanel<
  TEntity,
  TEntityInput extends FieldValues,
  // TEntityQuery extends FieldValues,
>({
  rightPanelProps,
  selectedId,
  setSelectedId,
  selectedEntry,
  setSelectedEntry,
}) {
  const {
    entityName,
    inputLayout,
    inputDefaultValues,
    resolver,
    getAllEntities,
    getEntityById,
    createEntity,
    updateEntity,
    deleteEntity,
  } = { ...rightPanelProps };
  console.log(`In Right Panel: ${selectedId}`);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [openDeleteWarningDialog, setOpenDeleteWarningDialog] = useState(false);
  const [openDeleteConfirmingDialog, setOpenDeleteConfirmingDialog] =
    useState(false);
  const schemaContext = useRef<{ mode: SchemaMode }>({ mode: "add" }).current;
  const {
    register,
    handleSubmit,
    reset,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<TEntityInput>({
    defaultValues: inputDefaultValues,
    resolver: resolver,
    context: schemaContext,
  });
  useEffect(() => {
    reset(
      selectedEntry
        ? { ...inputDefaultValues, ...selectedEntry }
        : inputDefaultValues,
    ); // for users case "password" is not returned, so password take "" from inputDefaultValues
  }, [selectedEntry]);
  const queryClient = useQueryClient();
  const onAddEntry = useMutation({
    mutationFn: createEntity,
    onSuccess: async (newEntry) => {
      setSelectedEntry(newEntry);
      setSelectedId(newEntry.userId);
      await queryClient.invalidateQueries({ queryKey: [entityName + "s"] });
    },
  });
  const onUpdateEntry = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TEntityInput }) =>
      updateEntity(id, data),
    onSuccess: async (updatedEntry) => {
      setSelectedEntry(updatedEntry);
      await queryClient.invalidateQueries({
        queryKey: [entityName + "s"],
      });
    },
  });
  const onDeleteEntry = useMutation({
    mutationFn: (id: number) => deleteEntity(id),
    onSuccess: async () => {
      (setOpenDeleteConfirmingDialog(true),
        queryClient.invalidateQueries({ queryKey: [entityName + "s"] }));
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
      <Typography>{`Right Panel ${typeof TEntity}`} </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 2fr" }}>
        <Typography>{capitalizeFirstLetter(entityName)} ID</Typography>
        <OutlinedInput type="number" disabled={true} value={selectedId ?? ""} />
      </Box>
      {inputLayout.map((f) => (
        <Box
          key={f.label}
          sx={{ display: "grid", gridTemplateColumns: "1fr 2fr" }}
        >
          <Typography>{f.label}</Typography>
          <Stack>
            {f.type !== "password" && (
              <OutlinedInput
                {...register(f.inputKey)}
                type={f.type}
                // value={selectedEntry && (selectedEntry[f.inputKey] ?? "")}
                // onChange={(e) => setSelectedEntry((prev) => ({...prev, [{f.inputKey !== "password" ? f}] : e.target.value})}
              />
            )}
            {f.type === "password" && (
              <OutlinedInput
                {...register(f.inputKey)}
                type={showPassword ? "text" : f.type}
                endAdornment={
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <VisibilityOffOutlinedIcon />
                    ) : (
                      <VisibilityOutlinedIcon />
                    )}
                  </IconButton>
                }
              />
            )}
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
        <Button
          variant="contained"
          onClick={() => {
            setSelectedEntry();
            setSelectedId();
          }}
        >
          New
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            schemaContext.mode = "add";
            handleSubmit((data) => {
              onAddEntry.mutate(data);
            })();
          }}
          disabled={selectedEntry !== undefined}
        >
          {onAddEntry.isPending ? "Adding ..." : "Add"}
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            schemaContext.mode = "update";
            handleSubmit((data) =>
              onUpdateEntry.mutate({ id: Number(selectedId), data: data }),
            )();
          }}
          disabled={selectedEntry === undefined}
        >
          {onUpdateEntry.isPending ? "Updating ..." : "Update"}
        </Button>
        <Button
          variant="contained"
          onClick={() => {setOpenDeleteWarningDialog(true)}}
          color="error"
          disabled={selectedEntry === undefined}
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
            The entry with Id{" "}
            {selectedEntry && selectedEntry[entityName + "Id"]} was deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDeleteConfirmingDialog}>OK</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
