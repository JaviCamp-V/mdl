'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import ResponsiveSearchField from '@/components/RHFElements/ResponsiveSearchField';
import routes from '@/libs/routes';

interface SearchFormProps {
  responsive?: boolean;
}

const formSchema = yup.object().shape({
  search: yup.string().required('Search is required')
});

type FormType = yup.InferType<typeof formSchema>;

const SearchForm: React.FC<SearchFormProps> = ({ responsive }) => {
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
        <ResponsiveSearchField
          name="search"
          placeholder="Find Asian Dramas, Movies, Actors and more..."
          type="text"
          responsive={responsive}
          fullWidth
          onClick={() => methods.handleSubmit(onSubmit)()}
        />
      </form>
    </FormProvider>
  );
};

export default SearchForm;
