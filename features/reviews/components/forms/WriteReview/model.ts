import * as yup from 'yup';
import { FieldModel } from '@/types/common/IForm';
import getDefaultValues from '@/utils/getDefaultValues';

const formFields: FieldModel = {
  headline: {
    name: 'headline',
    type: 'text',
    label: 'Headline',
    placeholder: 'Enter headline for review here',
    errorMessages: { required: 'Headline is required', max: 'Headline should not exceed 255 characters' },
    max: 255,
    breakpoints: { xs: 12 }
  },
  hasSpoilers: {
    name: 'hasSpoilers',
    type: 'checkbox',
    label: 'This review contains spoilers',
    showLabel: true,
    breakpoints: { xs: 12 }
  },
  hasCompleted: {
    name: 'hasCompleted',
    type: 'checkbox',
    label: 'I have finished watching this title',
    showLabel: true,
    breakpoints: { xs: 12 }
  },
  storyRating: {
    name: 'storyRating',
    type: 'ratings',
    label: 'Story Rating',
    errorMessages: {
      required: 'Story rating is required',
      max: 'Story rating should not exceed 10',
      min: 'Story rating should not be less than 0.5'
    },

    breakpoints: { xs: 12 },
    min: 0.5,
    max: 10,
    showInput: false
  },
  actingRating: {
    name: 'actingRating',
    type: 'ratings',
    label: 'Acting Rating',
    min: 0.5,
    max: 10,
    errorMessages: {
      required: 'Acting rating is required',
      max: 'Acting rating should not exceed 10',
      min: 'Acting rating should not be less than 0.5'
    },
    breakpoints: { xs: 12 },
    showInput: false
  },
  musicRating: {
    name: 'musicRating',
    type: 'ratings',
    label: 'Music Rating',
    min: 0.5,
    max: 10,
    errorMessages: {
      required: 'Music rating is required',
      max: 'Music rating should not exceed 10',
      min: 'Music rating should not be less than 0.5'
    },
    breakpoints: { xs: 12 },
    showInput: false
  },
  rewatchValueRating: {
    name: 'rewatchValueRating',
    type: 'ratings',
    label: 'Rewatch Value Rating',
    min: 0.5,
    max: 10,
    errorMessages: {
      required: 'Rewatch value rating is required',
      max: 'Rewatch value rating should not exceed 10',
      min: 'Rewatch value rating should not be less than 0.5'
    },
    breakpoints: { xs: 12 },
    showInput: false
  },
  overallRating: {
    name: 'overallRating',
    type: 'ratings',
    label: 'Overall Rating',
    min: 0.5,
    max: 10,
    errorMessages: {
      required: 'Overall rating is required',
      max: 'Overall rating should not exceed 10',
      min: 'Overall rating should not be less than 0.5'
    },
    breakpoints: { xs: 12 },
    showInput: false
  },
  content: {
    name: 'content',
    type: 'text',
    label: 'Review',
    placeholder: 'Enter review here',
    errorMessages: { required: 'Review is required' },
    multiline: true,
    minRows: 10,
    breakpoints: { xs: 12 }
  }
};

const {
  headline,
  hasSpoilers,
  hasCompleted,
  storyRating,
  actingRating,
  musicRating,
  rewatchValueRating,
  overallRating,
  content
} = formFields;

const formSchema = yup.object().shape({
  headline: yup.string().required().max(headline.max!, headline?.errorMessages?.max),
  hasSpoilers: yup.boolean(),
  hasCompleted: yup.boolean(),
  storyRating: yup
    .number()
    .required()
    .min(storyRating.min!, storyRating?.errorMessages?.min)
    .max(storyRating.max!, storyRating?.errorMessages?.max),
  actingRating: yup
    .number()
    .required()
    .min(actingRating.min!, actingRating?.errorMessages?.min)
    .max(actingRating.max!, actingRating?.errorMessages?.max),
  musicRating: yup
    .number()
    .required()
    .min(musicRating.min!, musicRating?.errorMessages?.min)
    .max(musicRating.max!, musicRating?.errorMessages?.max),
  rewatchValueRating: yup
    .number()
    .required()
    .min(rewatchValueRating.min!, rewatchValueRating?.errorMessages?.min)
    .max(rewatchValueRating.max!, rewatchValueRating?.errorMessages?.max),
  overallRating: yup
    .number()
    .required()
    .min(overallRating.min!, overallRating?.errorMessages?.min)
    .max(overallRating.max!, overallRating?.errorMessages?.max),
  content: yup.string().required()
});

export type FormType = yup.InferType<typeof formSchema>;

const formDefaultValues = getDefaultValues(formFields) as FormType;

export { formFields, formSchema, formDefaultValues };
