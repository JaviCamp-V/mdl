import { capitalCase } from 'change-case';
import * as yup from 'yup';
import { FieldModel } from '@/types/common/IForm';
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
    rows: 5
  }
};

// const advancedModel: FieldModel = {
//     priority: {},
//     rewatchValue: {},
//     rewatchCount: {},
//     startDate: {},
//     endDate: {},
// }

const generalModelSchema = yup.object().shape({
  watchStatus: yup.string().required(generalModel.watchStatus.errorMessages!.required),
  episodeWatched: yup.number(),
  rating: yup.number().typeError(generalModel.rating.errorMessages?.invalid!),
  notes: yup
    .string()
    .required(generalModel.notes.errorMessages?.required)
    .max(255, generalModel.notes.errorMessages?.max)
});

export type GeneralFormType = yup.InferType<typeof generalModelSchema>;
const generalDefaultValues = getDefaultValues(generalModel) as GeneralFormType;
export { generalModel, generalModelSchema, generalDefaultValues };
