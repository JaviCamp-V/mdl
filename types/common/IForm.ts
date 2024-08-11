import { RHFElementsType } from '@/components/RHFElements';

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
  total?: number;
  options?: { value: any; label: string; disabled: boolean }[];
}

export interface FieldModel {
  [key: string]: Field;
}
