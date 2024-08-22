import * as yup from 'yup';
import { FieldModel } from '@/types/common/IForm';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import getDefaultValues from '@/utils/getDefaultValues';

const formModel: FieldModel = {
  suggested: {
    name: 'suggested',
    label: 'Similar to',
    type: 'media_select',
    errorMessages: {
      required: 'Please add a suggestion',
      invalid: 'Please add a valid suggestion'
    },
    breakpoints: { xs: 12 }
  },
  reason: {
    name: 'reason',
    label: 'Why do you recommend it?',
    type: 'text',
    placeholder: 'Enter Reason Here',
    errorMessages: { required: 'Review is required' },
    multiline: true,
    minRows: 10,
    breakpoints: { xs: 12 },
    InputLabelProps: { shrink: true }
  }
};

const { suggested, reason } = formModel;

const formSchema = yup.object().shape({
  suggested: yup
    .mixed<MediaDetailsProps & { poster_path: string | null }>()
    .required(suggested?.errorMessages?.required)
    .typeError(suggested?.errorMessages?.invalid!),
  reason: yup.string().required(reason.errorMessages?.required)
});

export type FormType = yup.InferType<typeof formSchema>;

const formDefaultValues = getDefaultValues(formModel) as FormType;

export { formModel as formFields, formSchema, formDefaultValues };
