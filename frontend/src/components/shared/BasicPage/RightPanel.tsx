import { useState, useEffect, useRef } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { useMutation, useQueryClient } from "@tanstack/react-query";
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

import { camelToTitle, capitalizeFirstLetter } from "../../../api/basicAPI";
import type {
  RightPanelProps,
  SelectionProps,
  SchemaMode,
} from "../../../types/basic";

export default function RightPanel<TEntity, TEntityInput extends FieldValues>({
  rightPanelProps,
  selectedId,
  setSelectedId,
  selectedEntry,
  setSelectedEntry,
}: {
  rightPanelProps: RightPanelProps<TEntity, TEntityInput>;
} & SelectionProps<TEntity>) {
  const {
    entityName,
    inputLayout,
    inputDefaultValues,
    resolver,
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
    formState: { errors },
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
    );
    // for users case "password" is not returned, so password take "" from inputDefaultValues
  }, [selectedEntry]);
  const queryClient = useQueryClient();
  const onAddEntry = useMutation({
    mutationFn: createEntity,
    onSuccess: async (newEntry) => {
      setSelectedEntry(newEntry);
      setSelectedId(newEntry[entityName + "Id"]);
      await queryClient.invalidateQueries({ queryKey: [entityName] });
    },
  });
  const onUpdateEntry = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
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
      <Box
        key="sampleId"
        display="grid"
        gridTemplateColumns="1fr 2fr"
        sx={{ gap: 1, alignItems: "center" }}
      >
        <Typography variant="h5" mb={2}>
          {capitalizeFirstLetter(entityName)} ID
        </Typography>
        <OutlinedInput
          type="number"
          disabled={true}
          value={selectedId ?? ""}
          size="small"
        />
      </Box>
      {inputLayout.map((f) => (
        <Box
          key={f.inputKey}
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: 1,
            alignItems: "center",
          }}
        >
          <Typography variant="h5" mb={2}>
            {camelToTitle(f.inputKey)}{" "}
            {(f.required ||
              (f.inputKey === "password" && selectedEntry === undefined)) &&
              "*"}{" "}
            {}
          </Typography>
          <Stack>
            {f.type !== "password" && (
              <OutlinedInput
                {...register(f.inputKey)}
                type={f.type}
                size="small"
              />
            )}
            {f.type === "password" && (
              <OutlinedInput
                size="small"
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

      <Typography variant="h6" pt={2} mb={3}>
        {" "}
        * = Required
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 5,
        }}
      >
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            setSelectedEntry(undefined);
            setSelectedId(undefined);
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
              setSelectedId(undefined);
              setSelectedEntry(undefined);
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
