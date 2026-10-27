import type { FieldValues, FieldPath, Resolver, } from "react-hook-form";
export type InputLayout<TEntityInput extends FieldValues> = {
  label: string;
  inputKey: FieldPath<TEntityInput>; // Name
  required?: boolean; // The input that is required
  type: string;
  multiline?: boolean;
};

export type LeftPanelProps<TEntity, TEntityQuery extends FieldValues> = {
  entityName: string;     
  getAllEntities: (q: TEntityQuery) => Promise<TEntity[]>; 
  getEntityById?: (id1?: number, id2?: number) => Promise<TEntity>;
}
export type RightPanelProps<TEntity, TEntityInput extends FieldValues> = {
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