import { TextFieldProps } from '@mui/material/TextField';

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
  | 'autocomplete'
  | 'media_select'
  | 'slider'
  | 'group'
  | 'radio'
  | 'multi_search';

interface Optionable {
  options?: { value: any; label: string; disabled?: boolean }[];
}

export interface CheckboxField extends Optionable {
  multiple?: boolean;
}

interface RatingsField {
  total?: number;
}

interface DateField {
  minDate?: Date;
  maxDate?: Date;
}

interface AsyncSearchField {
  searchFunction: (query: string) => Promise<any[]>;
  defaultResults: any[];
  renderResult: (data: any, props: any) => React.ReactNode;
  getOptionLabel: (option: any) => string;
  isEquals: (option: any, value: any) => boolean;
}
export interface Field extends CheckboxField, RatingsField, DateField, Optionable, Partial<AsyncSearchField> {
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
  disabled?: boolean;
  min?: number;
  max?: number;
  showInput?: boolean;
  InputLabelProps?: any;
  InputProps?: any;
  fields?: { [key: string]: Field };
}

export interface FieldGroup extends Field {
  fields?: { [key: string]: Field };
  FieldSelector: (field: Field) => JSX.Element;
}
export interface FieldModel {
  [key: string]: Field;
}
