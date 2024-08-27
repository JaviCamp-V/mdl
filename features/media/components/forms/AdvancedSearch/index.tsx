'use client';

import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { formToParams, paramsToForm } from '@/features/media/utils/tmdbAdaancedSearch';
import '@/features/watchlist/components/forms/AddWatchlistRecord/model';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Button, Grid, IconButton, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Iconify from '@/components/Icon/Iconify';
import { TextField } from '@/components/RHFElements';
import RHFAccordionWrapper from '@/components/RHFElements/RHFAccordionWrapper';
import Divider from '@/components/common/Divider';
import MediaType from '@/types/enums/IMediaType';
import { AdvancedSearchFormType, contentFormFields, defaultValues, formSchema, personFormFields, queryField } from './model';


interface AdvancedSearchFormProps {}

const AdvancedSearchForm: React.FC<AdvancedSearchFormProps> = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // query params and default values combined
  const formDefaultValues = React.useMemo(() => paramsToForm(searchParams), [searchParams]);

  const methods = useForm<AdvancedSearchFormType>({
    mode: 'onChange',
    resolver: yupResolver(formSchema),
    defaultValues: formDefaultValues,
    shouldFocusError: true,
    criteriaMode: 'all'
  });

  const watchedType = methods.watch('type');
  const currentFormFields = React.useMemo(() => {
    if (watchedType === MediaType.person) return personFormFields;
    return contentFormFields;
  }, [watchedType]);

  const onSubmit: SubmitHandler<AdvancedSearchFormType> = async (formData) => {
    const values = formToParams(formData);
    const filteredValues = Object.entries(values)
      .filter(([, value]) => value)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    const params = new URLSearchParams(filteredValues);
    router.push(`${pathname}?${params.toString()}`);
  };

  const onWatchedTypeChange = (type: MediaType) => {
    if (watchedType === type) return;
    const isBetweenPersonAndContent = type === MediaType.person || watchedType === MediaType.person;
    if (isBetweenPersonAndContent) return methods.reset({ ...defaultValues, type });
    methods.setValue('type', type);
  };

  return (
    <Box
      sx={{
        borderRadius: 2,
        marginTop: 4.5,
        backgroundColor: 'background.paper',
        boxShadow: '0 1px 1px rgba(0,0,0,.1)',
        border: '1px solid rgba(0, 0, 0, .14)'
      }}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Box sx={{ paddingY: 2 }}>
            <Typography fontSize={18} fontWeight={700} paddingX={2}>
              Advanced Search
            </Typography>

            <Divider />

            <Box paddingX={2}>
              <TextField {...(queryField as any)} size="small" />
            </Box>
          </Box>
          <Box>
            <Box sx={{ backgroundColor: 'background.default', paddingX: 2, margin: 0, paddingY: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingY: 1.5 }}>
                <Typography fontSize={15} fontWeight={'bolder'}>
                  Advanced Filters
                </Typography>
                <IconButton onClick={() => methods.setValue('type', undefined)}>
                  <Iconify icon="mdi:close" color="text.primary" />
                </IconButton>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                {Object.values(MediaType).map((value) => (
                  <Button
                    key={value}
                    variant={watchedType === value ? 'outlined' : 'text'}
                    onClick={() => onWatchedTypeChange(value)}
                    sx={{
                      margin: 0,
                      marginBottom: -0.1,
                      color: watchedType === value ? 'primary.main' : 'text.primary',
                      backgroundColor: watchedType === value ? 'background.paper' : 'transparent',
                      borderColor: '#3e4042',
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                      fontWeight: 700,
                      textTransform: 'capitalize',
                      borderBottom: 'none',
                      '&:hover': {
                        backgroundColor: 'background.paper',
                        borderRight: '1px solid #3e4042',
                        borderBottom: 'none',
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0
                      }
                    }}
                  >
                    {value === MediaType.tv ? 'Drama' : value}
                  </Button>
                ))}
              </Box>
            </Box>
            {watchedType && (
              <Grid container spacing={0}>
                {Object.values(currentFormFields).map((field) => (
                  <Grid item xs={12} key={field.name}>
                    <RHFAccordionWrapper field={field} />
                  </Grid>
                ))}
              </Grid>
            )}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 2
              }}
            >
              <Button
                color="primary"
                variant="contained"
                onClick={methods.handleSubmit(onSubmit)}
                sx={{
                  textTransform: 'capitalize'
                }}
              >
                Search
              </Button>
              <Button color="info" variant="contained" onClick={() => methods.reset(defaultValues)}>
                Reset
              </Button>
            </Box>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
};

export default AdvancedSearchForm;