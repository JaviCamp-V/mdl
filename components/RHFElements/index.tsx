import { RiceBowl } from '@mui/icons-material';
import { Field } from '@/types/common/IForm';
import AutoCompleteField from './AutoCompleteField';
import CheckBoxField from './CheckBoxField';
import DatePickerField from './DatePickerField';
import FileUpload from './FIleUpload';
import GroupField from './GroupField';
import ImageUpload from './ImageUpload';
import MediaField from './MediaField';
import MultiSearchField from './MultiSearchField';
import PasswordField from './PasswordField';
import RatingsField from './RatingsField';
import ResponsiveSearchField from './ResponsiveSearchField';
import RichTextField from './RichTextField';
import SelectField from './SelectField';
import SliderField from './SliderField';
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
  media_select: MediaField,
  multi_search: MultiSearchField,
  group: GroupField,
  slider: SliderField,
  file: FileUpload,
  image: ImageUpload,
  rich_text: RichTextField
};

export type RHFElementsType = keyof typeof RHFElements;

const elementsSelector = (type: keyof typeof RHFElements) => RHFElements[type] ?? TextField;
const RHFElementsSelector = (field: Field) => {
  const Component = field.type in RHFElements ? elementsSelector(field.type as RHFElementsType) : TextField;
  const props = { ...field, ...(field.type === 'group' ? { FieldSelector: RHFElementsSelector } : {}) };
  return <Component {...(props as any)} />;
};

export default RHFElementsSelector;
export {
  TextField,
  PasswordField,
  ResponsiveSearchField as SearchField,
  CheckBoxField,
  SelectField,
  AutoCompleteField,
  RatingsField,
  DatePickerField,
  MediaField,
  MultiSearchField,
  GroupField,
  SliderField
};
