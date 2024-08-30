import { getSearchKeyword, getSearchNetwork } from '@/features/media/service/tmdbService';
import Gender from '@/features/media/types/enums/Gender';
import SortType from '@/features/media/types/enums/SortType';
import Network from '@/features/media/types/interfaces/Network';
import { Tags } from '@/features/media/types/interfaces/Tags';
import { capitalCase } from 'change-case';
import { P } from 'pino';
import * as yup from 'yup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MediaType from '@/types/enums/IMediaType';
import getDefaultValues from '@/utils/getDefaultValues';
import countries from '@/libs/countries';
import allGenres, { without_genres } from '@/libs/genres';

const page = {
  name: 'page',
  type: 'number'
};

const query = {
  name: 'query',
  type: 'text',
  min: 3,
  max: 50,
  errorMessages: {
    invalid: 'must be a valid search',
    min: 'must be at least 3 characters',
    max: 'must be at most 50 characters'
  },
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
};

const type = {
  name: 'type',
  label: 'Type',
  type: 'select',
  placeholder: 'Select Type',
  options: Object.values(MediaType).map((value) => ({ value, label: value })),
  errorMessages: { invalid: 'must be a valid type' },
  breakpoints: { xs: 12 }
};

const country = {
  name: 'country',
  label: 'Country',
  type: 'checkbox',
  multiple: true,
  options: countries.map((country) => ({ value: country.code, label: country.fullName })),
  errorMessages: { invalid: 'must be a valid country' },
  breakpoints: { xs: 12 }
};

const nationality = {
  name: 'nationality',
  label: 'Nationality',
  type: 'checkbox',
  multiple: true,
  options: countries.map((country) => ({ value: country.code, label: country.nationality })),
  errorMessages: { invalid: 'must be a valid' },
  breakpoints: { xs: 12 }
};

const gender = {
  name: 'gender',
  label: 'Gender',
  type: 'select',
  placeholder: 'Select Gender',
  options: [
    { value: '0', label: 'Male' },
    { value: '1', label: 'Female' }
  ],
  errorMessages: { invalid: 'must be a valid a gender ' }
};

const genres = {
  name: 'genres',
  label: 'Genres',
  type: 'checkbox',
  multiple: true,
  options: allGenres
    .filter((genres) => !without_genres.includes(genres.id))
    .map((genre) => ({ value: genre.id, label: genre.name })),
  errorMessages: { invalid: 'must be a valid genre' },
  breakpoints: { xs: 12 }
};

const tags = {
  name: 'tags',
  label: 'Tags',
  type: 'multi_search',
  errorMessages: { invalid: 'must be a valid tag' },
  searchFunction: getSearchKeyword,
  placeholder: 'Search for tags to filter by',
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
};

const network = {
  name: 'network',
  label: 'Network',
  type: 'multi_search',
  placeholder: 'Search for networks to filter by',
  errorMessages: { invalid: 'must be a valid network' },
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
};

const maxYearValue = new Date().getFullYear() + 3;
const yearRange = Array.from({ length: maxYearValue - 1980 }, (_, i) => maxYearValue - i);
const yearOptions = yearRange.map((year) => ({ value: year, label: year.toString() }));

const releaseYear = {
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
};

const ratings = {
  name: 'ratings',
  label: 'Ratings',
  type: 'slider',
  min: 0,
  max: 10,
  errorMessages: { invalid: 'must be a valid rating' },
  options: ['0', '10'].map((value) => ({ value: parseInt(value), label: `${value}` })),
  breakpoints: { xs: 12 }
};

const contentSortBy = {
  name: 'contentSortBy',
  label: 'Sort By',
  type: 'select',
  placeholder: 'Select Sort By',
  options: Object.values(SortType).map((value) => ({ value, label: capitalCase(value) })),
  errorMessages: { invalid: 'must be a valid sort type' },
  breakpoints: { xs: 12 }
};

const personSortBy = {
  name: 'personSortBy',
  label: 'Sort By',
  type: 'select',
  placeholder: 'Select Sort By',
  options: [SortType.MOST_POPULAR, SortType.NAME].map((value) => ({ value, label: capitalCase(value) })),
  errorMessages: { invalid: 'must be a valid sort type' },
  breakpoints: { xs: 12 }
};

const querySchema = yup
  .string()
  .transform((x) => (x ? x : undefined))

  .min(query.min, query.errorMessages.min)
  .max(query.max, query.errorMessages.max)
  .optional();
const typeSchema = yup
  .mixed<MediaType>()
  .oneOf(
    type.options.map(({ value }) => value),
    type.errorMessages.invalid
  )
  .optional();

const commonSchema = yup.object().shape({
  query: querySchema,
  type: typeSchema,
  page: yup.number().optional()
});

const contentSchema = yup
  .object()
  .shape({
    country: yup
      .array()
      .of(
        yup.object().shape({
          value: yup.string().oneOf(
            country.options.map(({ value }) => value),
            country.errorMessages.invalid
          ),
          checked: yup.boolean().optional()
        })
      )
      .optional(),
    genres: yup
      .array()
      .of(
        yup.object().shape({
          value: yup.number().oneOf(
            genres.options.map(({ value }) => value),
            genres.errorMessages.invalid
          ),
          checked: yup.boolean().optional()
        })
      )
      .optional(),
    tags: yup.array().of(yup.mixed<Tags>().typeError(tags.errorMessages.invalid).required()),
    network: yup.array().of(yup.mixed<Network>().typeError(network.errorMessages.invalid).required()),
    releaseYear: yup.object().shape({
      minYear: yup
        .mixed()
        .transform((x) => (x ? x : undefined))

        .oneOf(releaseYear.fields.minYear.options.map(({ value }) => value))
        .optional(),
      maxYear: yup
        .mixed()
        .transform((x) => (x ? x : undefined))

        .oneOf(releaseYear.fields.maxYear.options.map(({ value }) => value))
        .optional()
    }),
    ratings: yup.array().of(yup.number().min(ratings.min).max(ratings.max)).optional(),
    contentSortBy: yup
      .mixed<SortType>()
      .transform((x) => (x ? x : undefined))

      .oneOf(
        contentSortBy.options.map(({ value }) => value),
        contentSortBy.errorMessages.invalid
      )
      .optional()
  })
  .concat(commonSchema);

const personSchema = yup
  .object()
  .shape({
    nationality: yup
      .array()
      .of(
        yup.object().shape({
          value: yup.string().oneOf(
            nationality.options.map(({ value }) => value),
            nationality.errorMessages.invalid
          ),
          checked: yup.boolean().optional()
        })
      )
      .optional(),
    gender: yup
      .string()
      .transform((x) => (x ? x : undefined))
      .oneOf(gender.options.map(({ value }) => value) as any[])
      .optional(),
    personSortBy: yup
      .mixed<SortType>()
      .transform((x) => (x ? x : undefined))

      .oneOf(
        personSortBy.options.map(({ value }) => value),
        personSortBy.errorMessages.invalid
      )
      .optional()
  })
  .concat(commonSchema)
  .test('query-required', 'query is required', (value, context) => {
    if (!value.type) return true;
    if (value.type !== MediaType.person) return true;
    const isValid = Boolean(value.query?.trim());
    if (isValid) return true;
    return context.createError({ message: 'Search query is required', path: 'query' });
  });

const formSchema = contentSchema.concat(personSchema);

const contentFormFields = { country, genres, tags, network, releaseYear, ratings, contentSortBy };
const personFormFields = { nationality, gender, sortBy: personSortBy };

type ContentAdvancedSearch = yup.InferType<typeof contentSchema>;
type PersonAdvancedSearch = yup.InferType<typeof personSchema>;
export type AdvancedSearchFormType = yup.InferType<typeof formSchema>;

const commonDefaultValues = getDefaultValues({ query, type }) as { query: string; type: MediaType };
const contentDefaultValues = getDefaultValues(contentFormFields) as ContentAdvancedSearch;
const personDefaultValues = getDefaultValues(personFormFields) as PersonAdvancedSearch;

const defaultValues = {
  ...commonDefaultValues,
  ...contentDefaultValues,
  ...personDefaultValues
} as AdvancedSearchFormType;

export {
  query as queryField,
  type,
  formSchema,
  contentFormFields,
  personFormFields,
  contentSchema,
  personSchema,
  contentDefaultValues,
  personDefaultValues,
  defaultValues
};