import * as yup from 'yup';
import { FieldModel } from '@/types/common/IForm';
import getDefaultValues from '@/utils/getDefaultValues';


const formModel: FieldModel = {
  username: {
    name: 'username',
    label: 'Username',
    placeholder: 'Enter your username',
    type: 'text',
    errorMessages: {
      required: 'Username is required'
    },
    breakpoints: { xs: 12 }
  },
  password: {
    name: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password',
    errorMessages: {
      required: 'Password is required'
    },
    breakpoints: { xs: 12 }
  },
  rememberMe: {
    name: 'rememberMe',
    label: 'Remember Me',
    type: 'checkbox',
    showLabel: true,
    breakpoints: { xs: 12 }
  }
};

const formSchema = yup.object().shape({
  username: yup.string().required(formModel.username.errorMessages!.required),
  password: yup.string().required(formModel.password.errorMessages!.required)
  //
});

export type FormType = yup.InferType<typeof formSchema>;

const formDefaultValues = getDefaultValues(formModel) as FormType;

export { formModel, formSchema, formDefaultValues };