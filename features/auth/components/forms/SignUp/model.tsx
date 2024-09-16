import Link from 'next/link';
import * as yup from 'yup';
import { Typography } from '@mui/material';
import { FieldModel } from '@/types/common/IForm';
import getDefaultValues from '@/utils/getDefaultValues';
import routes from '@/libs/routes';

const formModel: FieldModel = {
  username: {
    name: 'username',
    label: 'Username',
    placeholder: 'Enter your username',
    pattern: /^\w{1,15}$/i,
    type: 'text',
    errorMessages: {
      required: 'Username is required',
      invalid: 'Username must be valid'
    },
    breakpoints: { xs: 12 }
  },
  email: {
    name: 'email',
    label: 'Email Address',
    placeholder: 'Eg: example@example.com',
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
    type: 'email',
    errorMessages: {
      required: 'Email is required',
      invalid: 'Email must be a well-formed email'
    },
    breakpoints: { xs: 12 }
  },
  password: {
    name: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password',
    autocomplete: 'new-password',
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/,
    errorMessages: {
      required: 'Password is required',
      invalid:
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character'
    },
    breakpoints: { xs: 12 }
  },
  hasAgreeToTerms: {
    name: 'hasAgreeToTerms',
    showLabel: true,
    label: (
      <Typography fontSize={14} sx={{ display: 'flex', gap: 0.5 }}>
        {`I agree to the `}
        <Link href={routes.terms} target="_blank" style={{ textDecoration: 'none' }}>
          <Typography color="primary" fontSize={14}>
            terms and conditions
          </Typography>
        </Link>
        {' and'}
        <Link href={routes.privacy} target="_blank" style={{ textDecoration: 'none' }}>
          <Typography color="primary" fontSize={14}>
            privacy policy
          </Typography>
        </Link>
      </Typography>
    ),
    type: 'checkbox',
    errorMessages: {
      required: 'You must agree to the terms and conditions'
    },
    breakpoints: { xs: 12 }
  }
};

const formSchema = yup.object().shape({
  username: yup
    .string()
    .required(formModel.username.errorMessages!.required)
    .matches(formModel.username.pattern!, formModel.username.errorMessages!.invalid),
  email: yup
    .string()
    .required(formModel.email.errorMessages!.required)
    .email(formModel.email.errorMessages!.invalid)
    .matches(formModel.email.pattern!, formModel.email.errorMessages!.invalid),
  password: yup
    .string()
    .required(formModel.password.errorMessages!.required)
    .matches(formModel.password.pattern!, formModel.password.errorMessages!.invalid),
  hasAgreeToTerms: yup.boolean().oneOf([true], formModel.hasAgreeToTerms.errorMessages!.required)
});

export type FormType = yup.InferType<typeof formSchema>;

const formDefaultValues = getDefaultValues(formModel) as FormType;

export { formModel, formSchema, formDefaultValues };
