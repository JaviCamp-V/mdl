import React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import RHFForm from '@/components/RHFElements/RHFForm';
import DefaultModal from '@/components/modals/DefaultModal';
import useWriteReviewForm from '../../forms/WriteReview/hook';
import WriteReviewFormProps from '../../forms/WriteReview/types';

type WriteReviewFormModalProps = WriteReviewFormProps & {
  open: boolean;
  onClose: () => void;
};
const WriteReviewFormModal: React.FC<WriteReviewFormModalProps> = ({ open, onClose, reviewType, ...rest }) => {
  const { formFields, methods, submitHandler } = useWriteReviewForm(reviewType, rest, onClose);

  const content = <RHFForm fields={formFields} methods={methods} onSubmit={submitHandler} />;
  const actions = (
    <React.Fragment>
      <Button variant="contained" color="info" onClick={onClose} sx={{ textTransform: 'capitalize' }}>
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
    </React.Fragment>
  );

  return <DefaultModal open={open} onClose={onClose} content={content} actions={actions} />;
};

export default WriteReviewFormModal;
