import * as yup from 'yup';
import { FieldModel } from '@/types/common/IForm';
import getDefaultValues from '@/utils/getDefaultValues';


const formFields = {
  avatar: {
    name: 'avatar',
    label: 'Avatar',
    type: 'image',
    errorMessages: {
      invalid: 'Avatar is must be an image file'
    },
    breakpoints: { xs: 12 }
  },
  displayName: {
    name: 'displayName',
    label: 'Display Name',
    type: 'text',
    max: 255,
    errorMessages: {
      required: 'Display Name is required',
      invalid: 'Display Name is invalid'
    },
    sx: { width: '80%' },
    breakpoints: { xs: 12 }
  },
  username: {
    name: 'username',
    label: 'Username',
    type: 'text',
    pattern: /^\w{1,15}$/i,
    errorMessages: {
      required: 'Username is required',
      invalid: 'Username is invalid'
    },
    sx: { width: '80%' },

    breakpoints: { xs: 12 },
    disabled: true
  },
  email: {
    name: 'email',
    label: 'Email',
    type: 'email',
    errorMessages: {
      required: 'Email is required',
      invalid: 'Email is invalid'
    },
    sx: { width: '80%' },

    breakpoints: { xs: 12 },
    disabled: true
  },
  location: {
    name: 'location',
    label: 'Location',
    type: 'text',
    max: 255,
    sx: { width: '80%' },

    errorMessages: { max: 'Location must be less than 255 characters' },
    breakpoints: { xs: 12 }
  },
  birthday: {
    name: 'birthday',
    label: 'Birthday',
    type: 'date',
    sx: { width: '80%' },

    breakpoints: { xs: 12 }
  },
  bio: {
    name: 'bio',
    label: 'Bio',
    type: 'rich_text',
    multiline: true,
    minRows: 3,
    breakpoints: { xs: 12 }
  }
};

const formSchema = yup.object().shape({
  avatar: yup.mixed<File>().optional().nullable().typeError(formFields.avatar.errorMessages.invalid),
  displayName: yup.string().optional().max(formFields.displayName.max, formFields.displayName.errorMessages.invalid),
  username: yup
    .string()
    .required(formFields.username.errorMessages.required)
    .matches(formFields.username.pattern, formFields.username.errorMessages.invalid),
  email: yup.string().required(formFields.email.errorMessages.required).email(formFields.email.errorMessages.invalid),
  location: yup.string().optional().nullable().max(formFields.location.max, formFields.location.errorMessages.max),
  birthday: yup.date().optional().nullable(),
  bio: yup.string().optional().nullable()
});

export type FormType = yup.InferType<typeof formSchema>;
const formDefaultValues = getDefaultValues(formFields);
export { formFields, formSchema, formDefaultValues };