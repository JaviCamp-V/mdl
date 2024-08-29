import * as yup from 'yup';
import { FieldModel } from '@/types/common/IForm';
import getDefaultValues from '@/utils/getDefaultValues';

const formFields = {
  content: {
    name: 'content',
    type: 'text',
    placeholder: 'Post a comment ...',
    min: 3,
    max: 10000,
    errorMessages: {
      required: 'Comment is required',
      min: 'Comment should be at least 3 characters',
      max: 'Comment should not exceed 10000 characters'
    },
    multiline: true,
    minRows: 3
  },
  hasSpoilers: {
    name: 'hasSpoilers',
    type: 'checkbox',
    label: 'This comment contains spoilers',
    showLabel: true
  }
};

const formSchema = yup.object().shape({
  content: yup
    .string()
    .required(formFields?.content?.errorMessages.required)
    .min(formFields.content.min!, formFields?.content?.errorMessages?.min)
    .max(formFields.content.max!, formFields?.content?.errorMessages?.max),
  hasSpoilers: yup
    .boolean()
    .transform((x) => (x ? x : undefined))
    .optional()
});

export type FormType = yup.InferType<typeof formSchema>;

const formDefaultValues = getDefaultValues(formFields) as FormType;

export { formFields, formSchema, formDefaultValues };
