import type { FieldValues, FieldPath, Resolver, } from "react-hook-form";
export type InputLayout<TEntityInput extends FieldValues> = {
  label: string;
  inputKey: FieldPath<TEntityInput>; // Name
  required?: boolean; // The input that is required
  type: string;
  multiline?: boolean;
};

export type RightPanelProps<TEntity, TEntityInput extends FieldValues> = {
  inputLayout?: InputLayout<TEntityInput>[];
  inputDefaultValues: TEntityInput; 
  resolver: Resolver<TEntityInput>;
  createEntity: async function (data: TEntityInput): Promise<TEntity>;
};

export type BasicPageProps<TEntity, TEntityInput extends FieldValues> = {
  pageTitle: string;
  rightPanelProps: RightPanelProps<TEntity, TEntityInput>;
};