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
  IconButton,
} from "@mui/material";

import { capitalizeFirstLetter } from "../../../api/basicAPI";
import type { SchemaMode } from "../../../types/basic";

export default function RightPanel<TEntity, TEntityInput extends FieldValues>({
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
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [openDeleteWarningDialog, setOpenDeleteWarningDialog] = useState(false);
  const [openDeleteConfirmingDialog, setOpenDeleteConfirmingDialog] =
    useState(false);
  const schemaContext = useRef<{ mode: SchemaMode }>({ mode: "add" }).current;
  const {
    register,
    handleSubmit,
    reset,
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
      await queryClient.invalidateQueries({ queryKey: [entityName] });
    },
  });
  const onUpdateEntry = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TEntityInput }) =>
      updateEntity(id, data),
    onSuccess: async (updatedEntry) => {
      setSelectedEntry(updatedEntry);
      await queryClient.invalidateQueries({
        queryKey: [entityName],
      });
    },
  });
  const onDeleteEntry = useMutation({
    mutationFn: () => deleteEntity(Number(selectedId)),
    onSuccess: async () => {
      setOpenDeleteWarningDialog(false);
      setOpenDeleteConfirmingDialog(true);
      queryClient.invalidateQueries({ queryKey: [entityName] });
    },
  });
  return (
    <Stack sx={{ gap: 2 }}>
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
          onClick={() => {
            setOpenDeleteWarningDialog(true);
          }}
          color="error"
          disabled={selectedEntry === undefined}
        >
          Delete
        </Button>
      </Box>
      <Dialog
        open={openDeleteWarningDialog}
        // onClose={() => setOpenDeleteWarningDialog(false)}
      >
        <DialogTitle>Delete {capitalizeFirstLetter(entityName)}?</DialogTitle>
        <DialogContent>
          Do you really want to delete {capitalizeFirstLetter(entityName)} with
          Id {selectedId}?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              onDeleteEntry.mutate();
            }}
          >
            Yes
          </Button>
          <Button onClick={() => setOpenDeleteWarningDialog(false)} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteConfirmingDialog}>
        <DialogTitle>Deletion Confirmation</DialogTitle>
        <DialogContent>
          The {entityName} with Id:{" "}
          {selectedEntry && selectedEntry[entityName + "Id"]} was deleted.
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDeleteConfirmingDialog(false);
              setSelectedId();
              setSelectedEntry();
              reset(inputDefaultValues);
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
