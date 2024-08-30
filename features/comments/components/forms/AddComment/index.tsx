'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AuthRequired from '@/features/auth/components/ui/AuthRequired';
import { addComment, updateComment } from '@/features/comments/services/commentService';
import CommentType from '@/features/comments/types/enums/CommentType';
import AddComment, { CommentBody } from '@/features/comments/types/interfaces/AddComment';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSession } from 'next-auth/react';
import { enqueueSnackbar } from 'notistack';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Grid } from '@mui/material';
import { CheckBoxField, TextField } from '@/components/RHFElements';
import { Field } from '@/types/common/IForm';
import { isErrorResponse } from '@/utils/handleError';
import { FormType, formDefaultValues, formFields, formSchema } from './model';

interface AddCommentFormProps {
  commentType: CommentType;
  parentId: number;
  commentId?: number;
  commentBody?: CommentBody;
  onClose?: () => void;
}

const AddCommentForm: React.FC<AddCommentFormProps> = ({ commentType, parentId, commentId, commentBody, onClose }) => {
  const { data: session } = useSession();
  const methods = useForm<FormType>({
    mode: 'onChange',
    resolver: yupResolver(formSchema),
    defaultValues: commentBody ?? formDefaultValues,
    shouldFocusError: true,
    criteriaMode: 'all'
  });

  const handleAdd = async (formData: FormType) => {
    const request: AddComment = { ...formData, commentType, parentId };
    const response = await addComment(request);
    return response;
  };
  const handleUpdate = async (formData: FormType) => {
    const request: CommentBody = { ...formData };
    const response = await updateComment(commentId!, request);
    return response;
  };

  const onSubmit: SubmitHandler<FormType> = async (formData) => {
    const response = commentId ? await handleUpdate(formData) : await handleAdd(formData);
    if (isErrorResponse(response)) {
      response.errors.forEach((error) => {
        methods.setError(error.field as keyof FormType, { type: 'manual', message: error.message });
      });
      enqueueSnackbar(response.message, { variant: 'error' });
      return;
    }
    enqueueSnackbar(response.message, { variant: 'success' });
    methods.reset();
    onClose && onClose();
  };

  const { content, hasSpoilers } = formFields;

  if (!session?.user) return <AuthRequired action="post a comment" />;
  return (
    <Box sx={{}}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField {...(content as Field)} />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display:
                  methods.formState.isDirty || methods.formState.touchedFields.content || onClose ? 'flex' : 'none',
                flexDirection: 'row',
                gap: 1,
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <CheckBoxField {...(hasSpoilers as Field)} size="small" />
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                {onClose && (
                  <Button onClick={onClose} variant="contained" color={'info'} sx={{ textTransform: 'capitalize' }}>
                    Cancel
                  </Button>
                )}
                <LoadingButton
                  type="submit"
                  disabled={!methods.formState.isValid || methods.formState.isSubmitting || !methods.formState.isDirty}
                  loading={methods.formState.isSubmitting}
                  variant="contained"
                  color="primary"
                  sx={{
                    textTransform: 'capitalize',
                    '&.Mui-disabled': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                      opacity: 0.5
                    }
                  }}
                >
                  {`${commentId ? 'Update' : 'Post'} Comment`}
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </Box>
  );
};

export default AddCommentForm;
