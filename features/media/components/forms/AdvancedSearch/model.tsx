import { getSearchKeyword, getSearchNetwork } from '@/features/media/service/tmdbService';
import Network from '@/features/media/types/interfaces/Network';
import { Tags } from '@/features/media/types/interfaces/Tags';
import { release } from 'os';
import * as yup from 'yup';
import { Box, Button, Typography } from '@mui/material';
import { FieldModel } from '@/types/common/IForm';
import MediaType from '@/types/enums/IMediaType';
import getDefaultValues from '@/utils/getDefaultValues';
import countries from '@/libs/countries';
import genres, { without_genres } from '@/libs/genres';

const maxYearValue = new Date().getFullYear() + 3;
const yearRange = Array.from({ length: maxYearValue - 1980 }, (_, i) => maxYearValue - i);
const yearOptions = yearRange.map((year) => ({ value: year, label: year.toString() }));
const formFields: FieldModel = {
  query: {
    name: 'query',
    type: 'text',
    errorMessages: { invalid: 'must be a valid search' },
    breakpoints: { xs: 12 },
    InputProps: {
      startAdornment: (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Button
            type="submit"
            color="info"
            sx={{
              textTransform: 'capitalize',
              color: 'info.contrastText',
              borderRadius: 0,
              borderRight: '1px solid hsla(210, 8%, 51%, .13)'
            }}
          >
            Search
          </Button>
        </Box>
      )
    }
  },
  type: {
    name: 'type',
    label: 'Type',
    type: 'select',
    options: Object.values(MediaType).map((value) => ({ value, label: value })),
    errorMessages: { invalid: 'must be a valid type' },
    breakpoints: { xs: 12 }
  },
  country: {
    name: 'country',
    label: 'Country',
    type: 'checkbox',
    multiple: true,
    options: countries.map((country) => ({ value: country.code, label: country.fullName })),
    errorMessages: { invalid: 'must be a valid country' },
    breakpoints: { xs: 12 }
  },
  nationality: {
    name: 'nationality',
    label: 'Nationality',
    type: 'checkbox',
    multiple: true,
    options: countries.map((country) => ({ value: country.code, label: country.nationality })),
    errorMessages: { invalid: 'must be a valid' },
    breakpoints: { xs: 12 }
  },
  genres: {
    name: 'genres',
    label: 'Genres',
    type: 'checkbox',
    multiple: true,
    options: genres
      .filter((genres) => !without_genres.includes(genres.id))
      .map((genre) => ({ value: genre.id, label: genre.name })),
    errorMessages: { invalid: 'must be a valid genre' },
    breakpoints: { xs: 12 }
  },
  tags: {
    name: 'tags',
    label: 'Tags',
    type: 'multi_search',
    searchFunction: getSearchKeyword,
    defaultResults: [] as Tags[],
    renderResult: (data: Tags, props: any) => (
      <Typography
        {...props}
        component="li"
        fontSize={14}
        textTransform={'capitalize'}
        sx={{ whiteSpace: 'nowrap', lineStyle: 'none' }}
      >
        {data.name}
      </Typography>
    ),
    getOptionLabel: (option: Tags) => option.name,
    isEquals: (option: Tags, value: Tags) => option.id === value.id,
    breakpoints: { xs: 12 }
  },
  network: {
    name: 'network',
    label: 'Network',
    type: 'multi_search',
    searchFunction: getSearchNetwork,
    defaultResults: [] as Network[],
    renderResult: (data: Network, props: any) => (
      <Typography
        {...props}
        component="li"
        fontSize={14}
        textTransform={'capitalize'}
        sx={{ whiteSpace: 'nowrap', lineStyle: 'none' }}
      >
        {data.name}
      </Typography>
    ),
    getOptionLabel: (option: Network) => option.name,
    isEquals: (option: Network, value: Network) => option.id === value.id,
    breakpoints: { xs: 12 }
  },
  releaseYear: {
    name: 'releaseYear',
    label: 'Release Year',
    type: 'group',
    breakpoints: { xs: 12 },
    fields: {
      minYear: {
        name: 'minYear',
        type: 'autocomplete',
        placeholder: 'From: ',
        options: yearOptions,
        errorMessages: { invalid: 'must be a valid year' },
        breakpoints: { xs: 6 }
      },
      maxYear: {
        name: 'maxYear',
        type: 'autocomplete',
        placeholder: 'To: ',
        options: yearOptions,
        errorMessages: { invalid: 'must be a valid year' },
        breakpoints: { xs: 6 }
      }
    }
  },
  ratings: {
    name: 'ratings',
    label: 'Ratings',
    type: 'slider',
    min: 0,
    max: 10,
    errorMessages: { invalid: 'must be a valid rating' },
    options: ['0', '10'].map((value) => ({ value: parseInt(value), label: value })),
    breakpoints: { xs: 12 }
  }
};

const { query, type, country } = formFields;

const formSchema = yup.object().shape({
  query: yup.string().optional(),
  type: yup
    .mixed<MediaType>()
    .oneOf(country?.options?.map(({ value }) => value) ?? [], country?.errorMessages?.invalid)
    .optional(),
  country: yup
    .array()
    .of(yup.string().oneOf(countries.map(({ code }) => code)))
    .optional(),
  nationality: yup
    .array()
    .of(yup.string().oneOf(countries.map(({ code }) => code)))
    .optional(),
  genres: yup
    .array()
    .of(yup.number().oneOf(genres.map(({ id }) => id)))
    .optional(),
  tags: yup.array().of(yup.object<Tags>()).optional(),
  network: yup.array().of(yup.object<Network>()).optional(),
  releaseYear: yup.object().shape({
    minYear: yup.number().optional(),
    maxYear: yup.number().optional()
  }),
  ratings: yup.array().of(yup.number()).optional()
});

export type FormType = yup.InferType<typeof formSchema>;

const defaultValues = getDefaultValues(formFields) as FormType;
export { formFields, formSchema, defaultValues };
