import React from 'react';
import { createReview } from '@/features/reviews/services/reviewUpdateService';
import ReviewType from '@/features/reviews/types/enums/ReviewType';
import { CreateEpisodeReview, CreateOverallReview } from '@/features/reviews/types/interfaces/ReviewRequest';
import { EpisodeReview, OverallReview } from '@/features/reviews/types/interfaces/ReviewResponse';
import { yupResolver } from '@hookform/resolvers/yup';
import { enqueueSnackbar } from 'notistack';
import { SubmitHandler, UseFormReturn, useForm } from 'react-hook-form';
import { FieldModel } from '@/types/common/IForm';
import {
  EpisodeReviewFormType,
  OverallReviewFormType,
  episodeReviewDefaultValues,
  episodeReviewFormFields,
  episodeReviewFormSchema,
  overallReviewDefaultValues,
  overallReviewFormFields,
  overallReviewFormSchema
} from './model';
import { EpisodeReviewFormProps, WriteReviewFormMap } from './types';

const reviewToDefaultValues = <T extends ReviewType>(
  reviewType: T,
  review: T extends ReviewType.EPISODE ? EpisodeReview : OverallReview
): T extends ReviewType.EPISODE ? EpisodeReviewFormType : OverallReviewFormType => {
  const { overallRating, content, headline, hasSpoilers } = review;

  if (reviewType === ReviewType.EPISODE)
    return { ...episodeReviewDefaultValues, overallRating, content, headline, hasSpoilers } as any;

  const overallReview = review as OverallReview;
  const { storyRating, actingRating, musicRating, rewatchValueRating, hasCompleted } = overallReview;
  return {
    ...overallReviewDefaultValues,
    storyRating,
    actingRating,
    musicRating,
    rewatchValueRating,
    overallRating,
    content,
    hasCompleted,
    headline,
    hasSpoilers
  } as OverallReviewFormType;
};

const getDefaultValues = (reviewType: ReviewType, review: EpisodeReview | OverallReview | null | undefined) => {
  if (review) return reviewToDefaultValues(reviewType, review as any);
  return reviewType === ReviewType.EPISODE ? episodeReviewDefaultValues : overallReviewDefaultValues;
};

const useWriteReviewForm = <T extends ReviewType>(
  reviewType: T,
  props: WriteReviewFormMap[T],
  onSuccess: () => void
): {
  formFields: FieldModel;
  methods: UseFormReturn<T extends ReviewType.EPISODE ? EpisodeReviewFormType : OverallReviewFormType>;
  submitHandler: SubmitHandler<EpisodeReviewFormType | OverallReviewFormType>;
} => {
  const { review, mediaType, mediaId } = props;

  const formSchema = reviewType === ReviewType.EPISODE ? episodeReviewFormSchema : overallReviewFormSchema;
  const formDefaultValues = getDefaultValues(reviewType, review);
  const methods = useForm<T extends ReviewType.EPISODE ? EpisodeReviewFormType : OverallReviewFormType>({
    mode: 'onChange',
    resolver: yupResolver(formSchema) as any,
    defaultValues: formDefaultValues as any,
    shouldFocusError: true,
    criteriaMode: 'all'
  });

  const formaOverallReviewRequest = (formData: OverallReviewFormType | EpisodeReviewFormType) => {
    const { headline, hasSpoilers, overallRating, content } = formData;
    const request = { headline, hasSpoilers, overallRating, content, mediaId, mediaType, language: 'en' };

    if (reviewType === ReviewType.EPISODE) {
      const { seasonNumber, episodeNumber } = props as EpisodeReviewFormProps;
      return { ...request, season: seasonNumber, episode: episodeNumber } as CreateEpisodeReview;
    }

    const { storyRating, actingRating, musicRating, rewatchValueRating, hasCompleted } =
      formData as OverallReviewFormType;
    return {
      ...request,
      storyRating,
      actingRating,
      musicRating,
      rewatchValueRating,
      hasCompleted
    } as CreateOverallReview;
  };

  const onSubmit: SubmitHandler<EpisodeReviewFormType | OverallReviewFormType> = async (formData) => {
    const request = formaOverallReviewRequest(formData);
    const response = await createReview(reviewType, request as any);
    if (response && 'errors' in response) {
      response.errors.forEach((error) => {
        methods.setError(error.field as any, { type: 'manual', message: error.message });
      });
      enqueueSnackbar('An error occurred while updating the record', { variant: 'error' });
      return;
    }
    enqueueSnackbar(response.message, { variant: 'success' });
    onSuccess();
  };

  return {
    formFields: reviewType === ReviewType.EPISODE ? episodeReviewFormFields : overallReviewFormFields,
    methods,
    submitHandler: onSubmit
  };
};

export default useWriteReviewForm;
