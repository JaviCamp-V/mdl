'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createReview } from '@/features/reviews/services/reviewService';
import ReviewType from '@/features/reviews/types/enums/ReviewType';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSession } from 'next-auth/react';
import { enqueueSnackbar } from 'notistack';
import { SubmitHandler, useForm } from 'react-hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Typography } from '@mui/material';
import RHFForm from '@/components/RHFElements/RHFForm';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import routes from '@/libs/routes';
import { FormType, formDefaultValues, formFields, formSchema } from './model';

interface WriteReviewFormProps extends MediaDetailsProps {}
const WriteReviewForm: React.FC<WriteReviewFormProps> = ({ mediaId, mediaType }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const pathname = usePathname();
  const methods = useForm<FormType>({
    mode: 'onChange',
    resolver: yupResolver(formSchema),
    defaultValues: formDefaultValues,
    shouldFocusError: true,
    criteriaMode: 'all'
  });

  const onSubmit: SubmitHandler<FormType> = async (formData) => {
    const request = { ...formData, mediaId, mediaType, language: 'en' };
    const response = await createReview(ReviewType.OVERALL, request);
    if (response && 'errors' in response) {
      response.errors.forEach((error) => {
        methods.setError(error.field as keyof FormType, { type: 'manual', message: error.message });
      });
      enqueueSnackbar('An error occurred while updating the record', { variant: 'error' });
      return;
    }
    enqueueSnackbar(response.message, { variant: 'success' });
    router.push(`/${mediaType}/${mediaId}/reviews`);
    methods.reset();
  };
  return (
    <Box sx={{ paddingY: 2, paddingX: 4 }}>
      {!session?.user && (
        <Box sx={{ marginBottom: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography fontSize={14} fontWeight={700}>
            You need to be logged in to write a review. Please sign in here to continue.
            <Link href={`${routes.login}?callbackUrl=${pathname}`} style={{ textDecoration: 'none' }}>
              <Typography component={'span'} fontSize={14} fontWeight={700} color="primary" paddingLeft={0.5}>
                Sign In
              </Typography>
            </Link>
          </Typography>
          <Typography fontSize={14} fontWeight={700}>
            {"Don't have an account?   Sign up for MyDramaList here"}
            <Link href={`${routes.register}?callbackUrl=${pathname}`} style={{ textDecoration: 'none' }}>
              <Typography component={'span'} fontSize={14} fontWeight={700} color="primary" paddingLeft={0.5}>
                Sign Up
              </Typography>
            </Link>
          </Typography>
        </Box>
      )}
      <RHFForm fields={formFields} methods={methods} />
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 2, gap: 2 }}>
        <Button
          variant="contained"
          color="info"
          onClick={() => router.push(`/${mediaType}/${mediaId}/reviews`)}
          sx={{ textTransform: 'capitalize' }}
        >
          Cancel
        </Button>
        <LoadingButton
          disabled={false}
          loading={methods.formState.isSubmitting}
          onClick={methods.handleSubmit(onSubmit)}
          variant="contained"
          sx={{ textTransform: 'capitalize' }}
        >
          Submit Review
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default WriteReviewForm;
