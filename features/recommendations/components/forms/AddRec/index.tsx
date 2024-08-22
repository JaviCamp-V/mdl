'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getImagePath } from '@/features/media/utils/tmdbUtils';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import RHFForm from '@/components/RHFElements/RHFForm';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import ImageType from '@/types/enums/ImageType';
import { FormType, formDefaultValues, formFields, formSchema } from './model';

interface AddRecommendationProps extends MediaDetailsProps {}
const AddRecommendation: React.FC<AddRecommendationProps> = ({ mediaId, mediaType }) => {
  const methods = useForm<FormType>({
    mode: 'onChange',
    resolver: yupResolver(formSchema),
    defaultValues: formDefaultValues,
    shouldFocusError: true,
    criteriaMode: 'all'
  });

  const router = useRouter();
  const onSubmit: SubmitHandler<FormType> = async (formData) => {};
  const watchFields = methods.watch('suggested');
  return (
    <Box sx={{ paddingY: 2, paddingX: 4, width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'center', sm: 'baseline' },
          gap: 4
        }}
      >
        <Box sx={{ width: { xs: '100%', md: '70%' } }}>
          <RHFForm fields={formFields} methods={methods} spacing={4} />
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 2, gap: 2 }}>
            <Button
              variant="contained"
              color="info"
              onClick={() => router.push(`/${mediaType}/${mediaId}/recommendations`)}
              sx={{ textTransform: 'capitalize' }}
            >
              Cancel
            </Button>
            <LoadingButton
              disabled={methods.formState.isSubmitting || methods.formState.isValidating || !methods.formState.isValid}
              loading={methods.formState.isSubmitting}
              onClick={methods.handleSubmit(onSubmit)}
              variant="contained"
              sx={{ textTransform: 'capitalize' }}
            >
              Submit Recommendation
            </LoadingButton>
          </Box>
        </Box>
        <Box sx={{ width: { xs: '100%', md: '30%' } }}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Typography color="primary" fontSize={16} sx={{ marginBottom: 1 }}>
              Recommendation
            </Typography>
            <Box
              sx={{
                position: 'relative',
                width: { xs: '60%', md: '80%' },
                height: { xs: '50vh', md: '40vh' },
                backgroundColor: 'info.main',
                borderRadius: '2px'
              }}
            >
              {watchFields && (
                <Image
                  src={getImagePath(watchFields.poster_path, ImageType.poster, 'w500')}
                  alt={watchFields?.mediaId.toString()}
                  fill
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    borderRadius: '0.175rem',
                    backgroundColor: 'var(--muted-color)'
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddRecommendation;
