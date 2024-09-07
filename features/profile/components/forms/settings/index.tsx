'use client';

import React from 'react';
import { updateProfile } from '@/features/profile/service/userProfileService';
import ProfileData from '@/features/profile/types/interfaces/ProfileData';
import { yupResolver } from '@hookform/resolvers/yup';
import DOMPurify from 'dompurify';
import { useSession } from 'next-auth/react';
import { enqueueSnackbar } from 'notistack';
import { SubmitHandler, useForm } from 'react-hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box } from '@mui/material';
import RHFForm from '@/components/RHFElements/RHFForm';
import { FieldModel } from '@/types/common/IForm';
import { formatDate, formatStringDate, valuesToFormData } from '@/utils/formatters';
import { isErrorResponse } from '@/utils/handleError';
import urlToFile from '@/utils/urlToFile';
import { FormType, formDefaultValues, formFields, formSchema } from './model';

interface ProfileSettingsFormProps {
  profile?: ProfileData | undefined;
  avatarFile?: File | null;
}

const ProfileSettingsForm: React.FC<ProfileSettingsFormProps> = ({ profile }) => {
  const { update, data: session, status } = useSession();

  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);

  React.useEffect(() => {
    if (status !== 'authenticated') return;
    const fetchAvatar = async () => {
      if (session?.user?.avatarUrl) {
        const response = await urlToFile(session.user.avatarUrl);
        setAvatarFile(response);
      }
    };
    fetchAvatar();
  }, [status]);

  const methods = useForm<FormType>({
    mode: 'onChange',
    resolver: yupResolver(formSchema),
    defaultValues: formDefaultValues,
    shouldFocusError: true,
    criteriaMode: 'all'
  });
  const onSubmit: SubmitHandler<FormType> = async (values) => {
    const { avatar, displayName, bio, birthday, location } = values;
    const isAvatarDirty = Boolean(methods.formState?.dirtyFields?.avatar);
    const bioCleaned = bio ? DOMPurify.sanitize(bio, { USE_PROFILES: { html: true } }) : '';

    const requestData = {
      avatar: avatar ?? '',
      displayName: displayName ?? '',
      bio: bioCleaned,
      birthday: birthday ? formatDate(birthday) : '',
      location: location ?? '',
      updateAvatar: isAvatarDirty ? 'YES' : 'NO'
    };
    const formData = valuesToFormData(requestData);
    try {
      const response = await updateProfile(formData);
      if (isErrorResponse(response)) {
        response.errors.forEach((error) => {
          methods.setError(error.field as keyof FormType, { type: 'manual', message: error.message });
        });
        enqueueSnackbar('An error occurred while updating the record', { variant: 'error' });
        return;
      }
      update();
      enqueueSnackbar(response.message, { variant: 'success' });
    } catch (error: any) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  React.useEffect(() => {
    if (status !== 'authenticated') return;
    if (session?.user.avatarUrl && !avatarFile) return;

    const { location, bio, birthday } = profile ?? {};
    const { displayName, username, email } = session?.user ?? {};
    const defaultValues = {
      ...formDefaultValues,
      avatar: avatarFile,
      displayName: displayName ?? '',
      username: username ?? '',
      email: email ?? '',
      location: location ?? '',
      bio: bio ?? ``,
      birthday: birthday ? formatStringDate(birthday) : undefined
    };
    methods.reset(defaultValues);
  }, [profile, avatarFile, status]);

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <RHFForm fields={formFields as FieldModel} methods={methods} spacing={4} onSubmit={onSubmit} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginY: 2 }}>
        <LoadingButton
          variant="contained"
          color="primary"
          loading={methods.formState.isSubmitting}
          disabled={!methods.formState.isValid || methods.formState.isSubmitting || !methods.formState.isDirty}
          onClick={methods.handleSubmit(onSubmit)}
          sx={{ textTransform: 'capitalize' }}
        >
          Submit
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default ProfileSettingsForm;
