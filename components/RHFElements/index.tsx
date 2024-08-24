import { number } from 'yup';
import { Field } from '@/types/common/IForm';
import AutoCompleteField from './AutoCompleteField';
import CheckBoxField from './CheckBoxField';
import DatePickerField from './DatePickerField';
import MediaField from './MediaField';
import PasswordField from './PasswordField';
import RatingsField from './RatingsField';
import ResponsiveSearchField from './ResponsiveSearchField';
import SelectField from './SelectField';
import TextField from './TextField';

const RHFElements = {
  text: TextField,
  email: TextField,
  password: PasswordField,
  search: ResponsiveSearchField,
  checkbox: CheckBoxField,
  select: SelectField,
  autocomplete: AutoCompleteField,
  ratings: RatingsField,
  number: TextField,
  date: DatePickerField,
  media_select: MediaField
};

export type RHFElementsType = keyof typeof RHFElements;

const elementsSelector = (type: keyof typeof RHFElements) => RHFElements[type] ?? TextField;
const RHFElementsSelector = (field: Field) => {
  const Component = elementsSelector(field.type);
  return <Component {...(field as any)} />;
};

export default RHFElementsSelector;
export { TextField, PasswordField, ResponsiveSearchField as SearchField, CheckBoxField };