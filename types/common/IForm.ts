export type RHFElementsType =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'ratings'
  | 'date'
  | 'search'
  | 'autocomplete';
export interface Field {
  name: string;
  label?: string | React.ReactNode;
  placeholder?: string;
  type: RHFElementsType;
  pattern?: RegExp;
  errorMessages?: {
    required?: string;
    invalid?: string;
    min?: string;
    max?: string;
  };
  breakpoints?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
  minRows?: number;
  maxRows?: number;
  total?: number;
  options?: { value: any; label: string; disabled: boolean }[];
  disabled?: boolean;
  min?: number;
  max?: number;
  maxDate?: Date;
  minDate?: Date;
  showInput?: boolean;
}

export interface FieldModel {
  [key: string]: Field;
}
