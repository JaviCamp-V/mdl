'use client';

import React from 'react';
import '@/features/watchlist/components/forms/AddWatchlistRecord/model';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Button, Grid, IconButton, Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Iconify from '@/components/Icon/Iconify';
import RHFElementsSelector, { TextField } from '@/components/RHFElements';
import RHFForm from '@/components/RHFElements/RHFForm';
import Divider from '@/components/common/Divider';
import MediaType from '@/types/enums/IMediaType';
import { FormType, defaultValues, formFields, formSchema } from './model';

interface AdvancedSearchFormProps {}
const AdvancedSearchForm: React.FC<AdvancedSearchFormProps> = ({}) => {
  const methods = useForm<FormType>({
    mode: 'onChange',
    resolver: yupResolver(formSchema),
    defaultValues: defaultValues,
    shouldFocusError: true,
    criteriaMode: 'all'
  });

  console.log('methods', methods.getValues('country'));
  const watchedType = methods.watch('type');
  const { query, type, country, genres, tags, network, releaseYear, ratings, nationality } = formFields;

  const currentFormFields = React.useMemo(() => {
    if (watchedType === MediaType.person) return { nationality };
    return { country, genres, tags, network, releaseYear, ratings };
  }, [watchedType]);

  return (
    <Box
      sx={{
        borderRadius: 2,

        backgroundColor: 'background.paper',
        boxShadow: '0 1px 1px rgba(0,0,0,.1)',
        border: '1px solid rgba(0, 0, 0, .14)'
      }}
    >
      <FormProvider {...methods}>
        <form>
          <Box sx={{ paddingY: 2 }}>
            <Typography fontSize={18} fontWeight={700} paddingX={2}>
              Advanced Search
            </Typography>

            <Divider />

            <Box paddingX={2}>
              <TextField {...query} size="small" />
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
                    onClick={() => methods.setValue('type', value)}
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
                {Object.values(currentFormFields).map(({ label, ...field }, index) => (
                  <Grid item xs={12} key={index}>
                    <Accordion
                      sx={{ boxShadow: 'none', borderBottom: '1px solid hsla(210, 8%, 51%, .13)' }}
                      disableGutters
                      square
                    >
                      <AccordionSummary
                        expandIcon={<Iconify icon="gridicons:dropdown" width={25} color={'text.primary'} />}
                      >
                        <Typography>{label}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <RHFElementsSelector {...field} />
                      </AccordionDetails>
                    </Accordion>
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
                onClick={methods.handleSubmit((data) => console.log(data))}
                sx={{
                  textTransform: 'capitalize'
                }}
              >
                Search
              </Button>
              <Button color="info" variant="contained" onClick={() => methods.reset()}>
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
