import Values from '@/types/common/Values';
import MediaType from '@/types/enums/IMediaType';
import { AdvancedSearchFormType, defaultValues } from '../components/forms/AdvancedSearch/model';
import SortType from '../types/enums/SortType';

const keys = [
  { form: 'type', param: 'type' },
  { form: 'query', param: 'query' },
  { form: 'country', param: 'with_origin_country' },
  { form: 'nationality', param: 'with_place_of_birth' },
  { form: 'gender', param: 'with_gender' },
  { form: 'genres', param: 'with_genres' },
  { form: 'tags', param: 'with_keywords' },
  { form: 'network', param: 'with_companies' },
  {
    form: 'releaseYear',
    params: {
      minYear: { tv: 'first_air_date.gte', movie: 'release_date.gte' },
      maxYear: { tv: 'first_air_date.lte', movie: 'release_date.lte' }
    }
  },
  { form: 'ratings', params: { min: 'vote_average.gte', max: 'vote_average.lte' } },
  { form: 'contentSortBy', param: 'sort_by' },
  { form: 'personSortBy', param: 'sort_by' }
];

const sortKeys = [
  {
    sort: SortType.MOST_POPULAR,
    label: 'Most Popular',
    value: {
      [MediaType.tv]: 'popularity.desc',
      [MediaType.movie]: 'popularity.desc',
      [MediaType.person]: 'popularity.desc'
    }
  },
  {
    sort: SortType.NAME,
    label: 'Name',
    value: {
      [MediaType.tv]: 'name.asc',
      [MediaType.movie]: 'title.asc',
      [MediaType.person]: 'name.asc'
    }
  },
  {
    sort: SortType.RELEASE_DATE,
    label: 'Release Date',
    value: {
      [MediaType.tv]: 'first_air_date.desc',
      [MediaType.movie]: 'release_date.desc',
      [MediaType.person]: null
    }
  },
  {
    sort: SortType.TOP_RATED,
    label: 'Top Rated',
    value: {
      [MediaType.tv]: 'vote_average.desc',
      [MediaType.movie]: 'vote_average.desc',
      [MediaType.person]: null
    }
  }
];

const formToParams = (form: AdvancedSearchFormType): Values => {
  const { type } = form;
  return keys.reduce((acc, { form: formKey, param, params }) => {
    const value = form[formKey as keyof AdvancedSearchFormType];
    if (!value) return acc;

    if (params && formKey === 'releaseYear') {
      const { minYear, maxYear } = (value as any) ?? {};
      const minParam = params?.minYear![type as keyof typeof params.minYear];
      const maxParam = params?.maxYear![type as keyof typeof params.maxYear];
      if (minYear) acc[minParam] = `${minYear}-01-01`;
      if (maxYear) acc[maxParam] = `${maxYear}-12-31`;
      return acc;
    }

    if (params && formKey === 'ratings') {
      const [minRating, maxRating] = (value as any) ?? [0, 10];
      return { ...acc, [params.min!]: minRating, [params.max!]: maxRating };
    }

    if (['country', 'genres', 'nationality'].includes(formKey)) {
      const formattedValue = (value as any)
        ?.filter((v: any) => v.checked)
        .map((v: any) => v.value)
        .join('|');
      return { ...acc, [param!]: formattedValue };
    }
    if (['tags', 'network'].includes(formKey)) {
      const formattedValue = (value as any)?.map((v: any) => `${v.id}_${v.name}`).join('|');
      return { ...acc, [param!]: formattedValue };
    }

    if (param && ['contentSortBy', 'personSortBy'].includes(formKey)) {
      const sortMapping = sortKeys.find((s) => s.sort === value);
      const formattedValue = sortMapping?.value[type ?? MediaType.tv];
      if (!formattedValue) return acc;
      return { ...acc, [param]: formattedValue };
    }

    return { ...acc, [param!]: value };
  }, {} as Values);
};

const paramsToForm = (searchParams: URLSearchParams): AdvancedSearchFormType => {
  const type = searchParams.get('type') as MediaType | undefined;
  return keys.reduce((acc, { form: formKey, param, params }) => {
    const defaultValue = defaultValues[formKey as keyof AdvancedSearchFormType];

    if (param && ['country', 'genres', 'nationality'].includes(formKey)) {
      const value = searchParams.get(param);
      const checked = value?.split('|').map((v) => (formKey === 'country' ? v : Number(v)));
      const formattedValue = ((defaultValue as any) ?? [])?.map((v: any) => ({
        ...v,
        checked: checked?.includes(v.value)
      }));
      return { ...acc, [formKey]: formattedValue };
    }
    if (param && ['tags', 'network'].includes(formKey)) {
      const value = searchParams.get(param);
      const checked = value?.split('|').map((v) => ({ id: Number(v.split('_')[0]), name: v.split('_')[1] }));
      return { ...acc, [formKey]: checked };
    }

    if (param && ['contentSortBy', 'personSortBy'].includes(formKey)) {
      const value = searchParams.get(param);
      if (!value || !type) return acc;
      if (formKey === 'contentSortBy' && type === MediaType.person) return acc;
      if (formKey === 'personSortBy' && type !== MediaType.person) return acc;
      const sortMapping = sortKeys.find((s) => s.value[type] === value);
      const formattedValue = sortMapping?.sort;
      return { ...acc, [formKey]: formattedValue };
    }

    if (param) {
      const value = searchParams.get(param);
      return { ...acc, [formKey]: value ?? defaultValue };
    }

    if (params && formKey === 'releaseYear') {
      const minYear = searchParams.get(params.minYear![type as keyof typeof params.minYear]);
      const maxYear = searchParams.get(params.maxYear![type as keyof typeof params.maxYear]);
      if (minYear)
        acc[formKey] = { ...acc[formKey], minYear: Number(minYear?.split('-')?.[0] ?? (defaultValue as any)?.minYear) };
      if (maxYear)
        acc[formKey] = { ...acc[formKey], maxYear: Number(maxYear?.split('-')?.[0] ?? (defaultValue as any)?.maxYear) };
      return acc;
    }

    if (params && formKey === 'ratings') {
      const minRating = Number(searchParams.get(params.min!)) || 0;
      const maxRating = Number(searchParams.get(params.max!)) || 10;
      acc[formKey] = [minRating, maxRating];
      return acc;
    }

    return acc;
  }, defaultValues);
};

const allParams = () => {
  return keys
    .map(({ param, params, form }) => {
      if (form === 'releaseYear') {
        const { minYear, maxYear } = params as any;
        return [...Object.values(minYear), ...Object.values(maxYear)];
      }
      if (form === 'ratings') {
        return Object.values(params as any);
      }
      return [param];
    })
    .flat();
};

const networkAndTagMapping = (value: string) => {
  return value
    .split('|')
    .map((v) => {
      const [id, _] = v.split('_');
      return id;
    })
    .join('|');
};
const getAllValidParams = (searchParams: Values) => {
  const approvedParams = allParams();
  return Object.entries(searchParams)
    .filter(([key, value]) => value && approvedParams.includes(key))
    .reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: ['with_keywords', 'with_companies'].includes(key) ? networkAndTagMapping(value) : value
      }),
      {}
    );
};

export { formToParams, paramsToForm, getAllValidParams, allParams };