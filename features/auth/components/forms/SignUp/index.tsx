'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { signIn } from 'next-auth/react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button, FormHelperText, Grid } from '@mui/material';
import RHFElementsSelector from '@/components/RHFElements';
import ValidationError from '@/types/common/ValidationError';
import { FormType, formDefaultValues, formModel, formSchema } from './model';

interface AuthFormProps {}

const SignUpForm: React.FC<AuthFormProps> = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const methods = useForm<FormType>({
    mode: 'onChange',
    resolver: yupResolver(formSchema),
    defaultValues: formDefaultValues,
    shouldFocusError: true,
    criteriaMode: 'all'
  });

  const [error, setError] = React.useState<string | null>(null);
  const onSubmit: SubmitHandler<FormType> = async (formData) => {
    try {
      const { username, password, email } = formData;
      const response = (await signIn('credentials', {
        username,
        email,
        password,
        isNewUser: true,
        redirect: false
      })) as any;
      if (response?.error && response.status !== 200) {
        const parsed = JSON.parse(response.error);
        const isObject = typeof parsed === 'object';
        if (isObject && parsed?.errors) {
          const errors = parsed.errors as ValidationError[];
          errors.forEach((error) => {
            methods.setError(error.field as keyof FormType, { type: 'manual', message: error.message });
          });
        }
        setError(isObject ? parsed.message : parsed);
      } else {
        const matches: RegExpMatchArray = searchParams.get('callbackUrl')?.match(/callbackUrl=([^&]*)/) ?? [
          `callbackUrl=${window.location.origin}`,
          window.location.origin
        ];
        const callbackUrl = decodeURIComponent(matches[1].replace(/\+/g, ' '));
        const callbackParsedUrl = new URL(callbackUrl);
        router.push(callbackParsedUrl.hostname === window.location.hostname ? callbackUrl : window.location.origin);
      }
    } catch (error) {
      setError('An error occurred while signing in');
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {error && (
              <Grid item xs={12}>
                <FormHelperText color="error">{error}</FormHelperText>
              </Grid>
            )}
            {Object.values(formModel).map((field) => (
              <Grid key={field.name} item {...field?.breakpoints}>
                <RHFElementsSelector {...field} fullWidth />
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                sx={{ width: '100%' }}
                disabled={
                  methods.formState.isSubmitting ||
                  methods.formState.isValidating ||
                  !methods.formState.isValid ||
                  !methods.formState.isDirty
                }
                onClick={methods.handleSubmit(onSubmit)}
              >
                Sign Up
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </Box>
  );
};

export default SignUpForm;
