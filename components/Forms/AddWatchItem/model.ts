import { capitalCase } from 'change-case';
import * as yup from 'yup';
import { FieldModel } from '@/types/common/IForm';
import PriorityLevel from '@/types/watchlist/PriorityLevel';
import RewatchValue from '@/types/watchlist/RewatchValue';
import WatchStatus from '@/types/watchlist/WatchStatus';
import getDefaultValues from '@/utils/getDefaultValues';


const generalModel: FieldModel = {
  watchStatus: {
    name: 'watchStatus',
    label: 'Status',
    type: 'select',
    options: Object.values(WatchStatus).map((status) => ({
      value: status,
      label: capitalCase(status),
      disabled: false
    })),
    errorMessages: { required: 'Status is required' },
    breakpoints: { xs: 12 }
  },
  episodeWatched: {
    name: 'episodeWatched',
    label: 'Episodes Watched',
    type: 'number',
    errorMessages: {
      required: 'Episodes watched is required',
      max: 'Episodes watched cannot be more than released episodes'
    },
    breakpoints: { xs: 12 }
  },
  rating: {
    name: 'rating',
    label: 'Rating',
    type: 'ratings',
    total: 10,
    errorMessages: { invalid: 'Must be a valid rating' },
    breakpoints: { xs: 12 }
  },
  notes: {
    name: 'notes',
    label: 'Notes',
    type: 'text',
    errorMessages: { max: 'Notes cannot exceed 255 characters' },
    breakpoints: { xs: 12 },
    multiline: true,
    rows: 3
  }
};

const advancedModel: FieldModel = {
  priority: {
    name: 'priority',
    label: 'Priority',
    type: 'select',
    options: Object.values(PriorityLevel).map((priority) => ({
      value: priority,
      label: capitalCase(priority),
      disabled: false
    })),
    errorMessages: { invalid: 'Must be a valid priority level' },
    breakpoints: { xs: 12 }
  },
  rewatchValue: {
    name: 'rewatchValue',
    label: 'Rewatch Value',
    type: 'select',
    options: Object.values(RewatchValue).map((value) => ({ value, label: capitalCase(value), disabled: false })),
    errorMessages: { invalid: 'Must be a valid rewatch value' },
    breakpoints: { xs: 12 }
  },
  rewatchCount: {
    name: 'rewatchCount',
    label: 'Rewatch Count',
    type: 'number',
    errorMessages: { invalid: 'Must be a valid number' },
    breakpoints: { xs: 12 }
  },
  startDate: {
    name: 'startDate',
    label: 'Start Date',
    type: 'date',
    errorMessages: { invalid: 'Must be a valid date' },
    breakpoints: { xs: 12 }
  },
  endDate: {
    name: 'endDate',
    label: 'End Date',
    type: 'date',
    errorMessages: { invalid: 'Must be a valid date' },
    breakpoints: { xs: 12 }
  }
};

const generalModelSchema = yup.object().shape({
  watchStatus: yup
    .mixed<WatchStatus>()
    .required(generalModel.watchStatus.errorMessages!.required)
    .oneOf(
      generalModel.watchStatus.options?.map((option) => option.value) as WatchStatus[],
      generalModel.watchStatus.errorMessages!.invalid
    ),
  episodeWatched: yup.number(),
  rating: yup
    .number()
    .transform((x) => (x ? Number(x) : undefined))
    .typeError(generalModel.rating.errorMessages?.invalid!),
  notes: yup
    .string()
    .max(255, generalModel.notes.errorMessages?.max)
    .transform((x) => (!x ? undefined : x))
});

const advancedModelSchema = yup.object().shape({
  priority: yup
    .mixed<PriorityLevel>()
    .oneOf(
      advancedModel?.priority?.options?.map((option) => option.value) as PriorityLevel[],
      advancedModel?.priority?.errorMessages!.invalid
    )
    .transform((x) => (!x ? undefined : x)),
  rewatchValue: yup
    .mixed<RewatchValue>()
    .oneOf(
      advancedModel?.rewatchValue?.options?.map((option) => option.value) as RewatchValue[],
      advancedModel?.rewatchValue?.errorMessages!.invalid
    )
    .transform((x) => (!x ? undefined : x)),
  rewatchCount: yup.number().transform((x) => (!x ? undefined : x)),
  // .typeError(advancedModel.rewatchCount.errorMessages?.invalid!),
  startDate: yup
    .date()
    .transform((x) => (!x ? undefined : x))
    .typeError(advancedModel.startDate.errorMessages?.invalid!),
  endDate: yup
    .date()
    .transform((x) => (!x ? undefined : x))
    .typeError(advancedModel.endDate.errorMessages?.invalid!)
});

export type GeneralFormType = yup.InferType<typeof generalModelSchema>;
export type AdvancedFormType = yup.InferType<typeof advancedModelSchema>;

const generalDefaultValues = getDefaultValues(generalModel) as GeneralFormType;
const advancedDefaultValues = getDefaultValues(advancedModel) as AdvancedFormType;

const formSchema = generalModelSchema.concat(advancedModelSchema);
export type FormType = GeneralFormType & AdvancedFormType;
const defaultValues = { ...generalDefaultValues, ...advancedDefaultValues };

export {
  generalModel,
  generalModelSchema,
  generalDefaultValues,
  advancedModel,
  advancedModelSchema,
  advancedDefaultValues,
  defaultValues,
  formSchema
};