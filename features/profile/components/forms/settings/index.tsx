'use client';

import React from 'react';
import { updateProfile } from '@/features/profile/service/userProfileService';
import ProfileData from '@/features/profile/types/interfaces/ProfileData';
import { yupResolver } from '@hookform/resolvers/yup';
import { enqueueSnackbar } from 'notistack';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button } from '@mui/material';
import RHFForm from '@/components/RHFElements/RHFForm';
import { FieldModel } from '@/types/common/IForm';
import { formatStringDate, valuesToFormData } from '@/utils/formatters';
import { isErrorResponse } from '@/utils/handleError';
import { FormType, formDefaultValues, formFields, formSchema } from './model';

interface ProfileSettingsFormProps {
  profile: ProfileData;
  avatarFile?: File | null;
}

const profileToDefaultValues = (profile: ProfileData, avatarFile?: File | null): FormType => {
  const { displayName, username, email, location, bio, birthday } = profile;
  return {
    ...formDefaultValues,
    avatar: avatarFile,
    displayName,
    username,
    email: email ?? 'placeholder@gmail.com',
    location,
    bio,
    birthday: birthday ? formatStringDate(birthday) : undefined
  };
};
const ProfileSettingsForm: React.FC<ProfileSettingsFormProps> = ({ profile, avatarFile }) => {
  const methods = useForm<FormType>({
    mode: 'onChange',
    resolver: yupResolver(formSchema),
    defaultValues: profileToDefaultValues(profile, avatarFile),
    shouldFocusError: true,
    criteriaMode: 'all'
  });
  const onSubmit: SubmitHandler<FormType> = async (values) => {
    const formData = valuesToFormData(values);
    try {
      const response = await updateProfile(formData);
      if (isErrorResponse(response)) {
        response.errors.forEach((error) => {
          methods.setError(error.field as keyof FormType, { type: 'manual', message: error.message });
        });
        enqueueSnackbar('An error occurred while updating the record', { variant: 'error' });
        return;
      }
      enqueueSnackbar(response.message, { variant: 'success' });
    } catch (error: any) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <RHFForm fields={formFields as FieldModel} methods={methods} spacing={4} onSubmit={onSubmit} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginY: 2 }}>
        <Button
          variant="contained"
          color="primary"
          disabled={!methods.formState.isValid}
          onClick={methods.handleSubmit(onSubmit)}
          sx={{ textTransform: 'capitalize' }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileSettingsForm;
