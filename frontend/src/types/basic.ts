import type { FieldValues, FieldPath, Resolver, } from "react-hook-form";
export type InputLayout<TInput extends FieldValues> = {
  label: string;
  inputKey: FieldPath<TInput>; // Name
  required?: boolean; // The input that is required
  type: string;
  multiline?: boolean;
};

export type RightPanelProps<TInput extends FieldValues> = {
  inputLayout?: InputLayout[];
  inputDefaultValues: TInput; 
}

export type BasicPageProps<RightPanelProps> = {
  pageTitle: string;
  rightPanelProps: RightPanelProps;
}