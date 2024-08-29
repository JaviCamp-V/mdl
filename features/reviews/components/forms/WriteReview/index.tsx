'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AuthRequired from '@/features/auth/components/ui/AuthRequired';
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

  if (!session?.user) return <AuthRequired action="write a review" />;

  return (
    <Box sx={{ paddingY: 2, paddingX: 4 }}>
      <RHFForm fields={formFields} methods={methods} onSubmit={onSubmit} />
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
