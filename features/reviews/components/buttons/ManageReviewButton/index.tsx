'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { deleteReview } from '@/features/reviews/services/reviewUpdateService';
import { enqueueSnackbar } from 'notistack';
import Button from '@mui/material/Button';
import CreateIcon from '@/components/Icon/CreateIcon';
import DeleteIcon from '@/components/Icon/DeleteIcon';
import EditIcon from '@/components/Icon/EditIcon';
import ViewIcon from '@/components/Icon/ViewIcon';
import DropdownButton from '@/components/common/DropdownButton';
import DeleteConfirmationModal from '@/components/modals/DeleteConfrimationModal';
import { isErrorResponse } from '@/utils/handleError';
import WriteReviewFormProps from '../../forms/WriteReview/types';
import WriteReviewFormModal from '../../modals/WriteFormModal';

type ManageButtonProps = WriteReviewFormProps & {
  onViewReview: () => void;
  formMode?: 'modal' | 'page';
};

/**
 *
 *  ManageReviewButton assumes that button is place on a valid review page ie  review , episode guide/ episode page
 * @param {ManageButtonProps} {reviewId} reviewId is the id of a review logged in user is trying to manage
 * @returns React.FC
 */
const ManageReviewButton: React.FC<ManageButtonProps> = ({ onViewReview, formMode = 'page', ...formProps }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isReviewFormModalOpen, setIsReviewFormModalOpen] = React.useState(false);
  const [formAction, setFormAction] = React.useState<'create' | 'edit'>('create');

  const openModalEdit = () => {
    setFormAction('edit');
    setIsReviewFormModalOpen(true);
  };

  const openModalCreate = () => {
    setFormAction('create');
    setIsReviewFormModalOpen(true);
  };

  const onEditReview = () => (formMode === 'modal' ? openModalEdit() : router.push(`${pathname}/edit`));
  const onCreateReview = () => (formMode === 'modal' ? openModalCreate() : router.push(`${pathname}/new`));

  const buttons = [
    { id: 'view', label: 'View Review', icon: <ViewIcon width={16} />, onClick: onViewReview },
    { id: 'edit', label: 'Edit Review', icon: <EditIcon width={16} />, onClick: onEditReview },
    { id: 'create', label: 'New Review', icon: <CreateIcon width={16} />, onClick: onCreateReview },
    { id: 'delete', label: 'Delete Review', icon: <DeleteIcon width={16} />, onClick: () => setDeleteModalOpen(true) }
  ];

  if (!formProps.review) {
    return (
      <Button
        variant="contained"
        startIcon={<CreateIcon />}
        onClick={onCreateReview}
        sx={{ textTransform: 'capitalize' }}
      >
        Write Review
      </Button>
    );
  }
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteReview(formProps?.review?.id!);
      const isSuccess = !isErrorResponse(response);
      enqueueSnackbar(response?.message, { variant: isSuccess ? 'success' : 'error' });
      if (isSuccess) setDeleteModalOpen(false);
    } catch (error: any) {
      enqueueSnackbar(error?.message, { variant: 'error' });
      setDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <React.Fragment>
      <DropdownButton title="Manage Review" menuItems={buttons} />
      {deleteModalOpen && (
        <DeleteConfirmationModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onDelete={handleDelete}
          itemName="Review"
          isDeleting={isDeleting}
        />
      )}
      {isReviewFormModalOpen && (
        <WriteReviewFormModal
          open={isReviewFormModalOpen}
          onClose={() => setIsReviewFormModalOpen(false)}
          {...formProps}
        />
      )}
    </React.Fragment>
  );
};

export default ManageReviewButton;
