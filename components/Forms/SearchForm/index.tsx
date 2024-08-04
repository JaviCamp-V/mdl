'use client';
import React from 'react';

import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import routes from '@/libs/routes';
import SearchField from '@/components/RHFElements/SearchField';

interface SearchFormProps {}

const formSchema = yup.object().shape({
  search: yup.string().required('Search is required')
});

type FormType = yup.InferType<typeof formSchema>;

const SearchForm: React.FC<SearchFormProps> = () => {
  const router = useRouter();
  const methods = useForm<FormType>({
    mode: 'onChange',
    resolver: yupResolver(formSchema),
    defaultValues: { search: '' },
    shouldFocusError: true,
    criteriaMode: 'all'
  });
  
  const onSubmit: SubmitHandler<FormType> = (formData) => {
    router.push(`${routes.search}?query=${formData.search}`);
    methods.reset();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <SearchField name="search" placeholder="Find Asian Dramas, Movies, Actors and more..." fullWidth />
      </form>
    </FormProvider>
  );
};

export default SearchForm;
