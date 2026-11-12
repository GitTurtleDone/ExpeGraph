import type { GridColDef } from "@mui/x-data-grid";
import type { FieldValues, FieldPath, Resolver } from "react-hook-form";
export type InputLayout<TEntityInput extends FieldValues> = {
  label: string;
  inputKey: FieldPath<TEntityInput>; // Name
  required?: boolean; // The input that is required
  type: string;
  multiline?: boolean;
};

export type NestedDictionary = {
  [key: string]: { [key: string]: string };
};

export type LeftPanelProps<
  TEntity,
  // TEntityAdvancedSearchCheckboxes,
  // TEntityAdvancedSearchFields,
  // TEntityDislayedColumnsDef,
  TEntityQuery extends FieldValues,
> = {
  entityName: string;
  // entityAdvancedSearchCheckboxes: TEntityAdvancedSearchCheckboxes,
  // entityAdvancedSearchFields: TEntityAdvancedSearchFields,
  entityAdvancedSearchInfo: NestedDictionary;
  // entityDisplayedColDef: GridColDef[];
  entityDisplayedColDef: GridColDef[];
  getAllEntities: (q: TEntityQuery) => Promise<TEntity[]>;
  getEntityById?: (id1?: number, id2?: number) => Promise<TEntity>;
};
export type RightPanelProps<TEntity, TEntityInput extends FieldValues> = {
  entityName: string,
  inputLayout?: InputLayout<TEntityInput>[];
  inputDefaultValues: TEntityInput;
  resolver: Resolver<TEntityInput>;
  createEntity: (data: TEntityInput) => Promise<TEntity>;
  updateEntity: (id: number, data: TEntityInput) => Promise<TEntity>;
  deleteEntity: (id: number) => void;
};

export type BasicPageProps<TEntity, TEntityInput extends FieldValues> = {
  pageTitle: string;
  rightPanelProps: RightPanelProps<TEntity, TEntityInput>;
};
