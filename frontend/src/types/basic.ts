export type InputLayout = {
  label: string;
  inputKey: keyof UserInput; // Name
  required?: boolean; // The input that is required
  type: string;
  multiline?: boolean;
};