import React from 'react';
import MuiTextField, { TextFieldProps  as MuiTextFieldProps} from '@mui/material/TextField';

export type TextFieldProps = MuiTextFieldProps & {
  name: string;
  label?: string;
  placeholder?: string;
};

const TextField: React.FC<TextFieldProps> = (props) => {
  return (
    <div>
      <MuiTextField  {...props} />
    </div>
  );
};

export default TextField;
