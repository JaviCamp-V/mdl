'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import RHFForm from '@/components/RHFElements/RHFForm';
import useWriteReviewForm from './hook';
import WriteReviewFormProps from './types';

const WriteReviewForm: React.FC<WriteReviewFormProps> = (props) => {
  const { reviewType, ...rest } = props;
  const router = useRouter();
  const pathname = usePathname();
  const redirectToReviews = () => router.push(pathname?.replace(/\/new|\/edit/, ''));
  const { formFields, methods, submitHandler } = useWriteReviewForm(reviewType, rest, redirectToReviews);

  return (
    <Box sx={{ paddingY: 2, paddingX: 4 }}>
      <RHFForm fields={formFields} methods={methods} onSubmit={submitHandler} />
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 2, gap: 2 }}>
        <Button variant="contained" color="info" onClick={redirectToReviews} sx={{ textTransform: 'capitalize' }}>
          Cancel
        </Button>
        <LoadingButton
          disabled={
            !methods.formState.isValid ||
            methods.formState.isSubmitting ||
            !Object.entries(methods.formState.dirtyFields).some(([, value]) => value)
          }
          loading={methods.formState.isSubmitting}
          onClick={methods.handleSubmit(submitHandler)}
          variant="contained"
          sx={{ textTransform: 'capitalize' }}
        >
          {`${rest?.review ? 'Update' : 'Submit'} Review`}
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default WriteReviewForm;
