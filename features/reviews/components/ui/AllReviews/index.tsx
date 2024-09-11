'use client';

import React from 'react';
import ReviewType from '@/features/reviews/types/enums/ReviewType';
import {
  ExtendEpisodeReviewWithMediaHelpful,
  ExtendOverallReview,
  ExtendOverallReviewWithMediaHelpful,
  ExtendedEpisodeReview
} from '@/features/reviews/types/interfaces/ExtendReviewResponse';
import { withHelpful } from '@/features/reviews/types/interfaces/ReviewHelpfulData';
import { BaseReviewResponse } from '@/features/reviews/types/interfaces/ReviewResponse';
import Box from '@mui/material/Box';
import Divider from '@/components/common/Divider';
import PaginatedList from '@/components/common/PagninatedList';
import SelectField from '@/components/common/Select';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import MediaType from '@/types/enums/IMediaType';
import { formatStringDate } from '@/utils/formatters';
import { scrollToTopById } from '@/utils/scrollToElement';
import ManageReviewButton from '../../buttons/ManageReviewButton';
import ReviewTypeSwitcher from '../../buttons/ReviewTypeSwitcher';
import EpisodeReviewCard from '../../cards/EpsiodeReview';
import OverallReviewCard from '../../cards/OverallReview';
import UserReviewCard from '../../cards/UserReview';
import NoReviews from '../NoReview';

interface OverallReviewsProps {
  reviewType: ReviewType.OVERALL;
  userReview: ExtendOverallReview | null;
  reviews: ExtendOverallReview[];
  totalEpisodes?: number;
}
interface EpisodeReviewsProps {
  reviewType: ReviewType.EPISODE;
  userReview: ExtendedEpisodeReview | null;
  reviews: ExtendedEpisodeReview[];
  seasonNumber: number;
  episodeNumber: number;
}

type ReviewProps = OverallReviewsProps | EpisodeReviewsProps;

type MediaReviewsProps = MediaDetailsProps &
  ReviewProps & {
    view: 'media';
  };

type UserReviewsProps = {
  view: 'user';
  reviewType: ReviewType;
  username: string;
  reviews: (ExtendOverallReviewWithMediaHelpful | ExtendEpisodeReviewWithMediaHelpful)[];
};

type AllReviewsProps = MediaReviewsProps | UserReviewsProps;

const createdAtComparator = (a: BaseReviewResponse, b: BaseReviewResponse) => {
  return formatStringDate(a.createdAt).getTime() - formatStringDate(b.createdAt).getTime();
};
const helpfulComparator = (a: withHelpful, b: withHelpful) => {
  return b.helpful.numberOfHelpfulReviews - a.helpful.numberOfHelpfulReviews;
};

const AllReviews: React.FC<AllReviewsProps> = (props) => {
  const { reviews, view, reviewType } = props;
  const [switchPage, setSwitchPage] = React.useState<number>();
  const [sortedBy, setSortedBy] = React.useState<'helpful' | 'recent'>();
  const sortedReviews = React.useMemo(() => {
    if (!sortedBy) return reviews;
    return reviews.sort((a, b) => {
      return sortedBy === 'helpful' ? helpfulComparator(a, b) : createdAtComparator(a, b);
    });
  }, [sortedBy, reviews]);

  const onChange = (value: string) => {
    const by = value as 'helpful' | 'recent';
    if (by === sortedBy) return;
    setSortedBy(by);
  };

  const onViewUserReview = () => {
    if (view !== 'media') return;
    const userReview = props?.userReview;
    const whichPage = sortedReviews.findIndex((review) => review.id === userReview?.id);
    const page = Math.floor(whichPage / 10) + 1;
    setSwitchPage(page);
    scrollToTopById(`review-${userReview?.id}`);
  };

  if (sortedReviews.length === 0)
    return (
      <NoReviews
        view={view}
        mediaId={view === 'media' ? props.mediaId : 0}
        mediaType={view === 'media' ? props.mediaType : MediaType.tv}
        reviewType={reviewType}
        seasonNumber={view === 'media' && reviewType === ReviewType.EPISODE ? props.seasonNumber : undefined}
        episodeNumber={view === 'media' && reviewType === ReviewType.EPISODE ? props.episodeNumber : undefined}
        containerStyle={{ minHeight: '10vh' }}
      />
    );

  const renderReview = (
    review:
      | ExtendOverallReview
      | ExtendedEpisodeReview
      | ExtendEpisodeReviewWithMediaHelpful
      | ExtendOverallReviewWithMediaHelpful
  ) => {
    if (view === 'user') return <UserReviewCard review={review as any} username={props.username} />;

    if (reviewType === ReviewType.OVERALL) {
      return <OverallReviewCard review={review as ExtendOverallReview} totalEpisodes={props?.totalEpisodes} />;
    }
    return <EpisodeReviewCard review={review as ExtendedEpisodeReview} />;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingX: 2,
          marginBottom: 2
        }}
      >
        <SelectField
          options={[
            { label: 'Most Helpful', value: 'helpful' },
            { label: 'Most Recent', value: 'recent' }
          ]}
          value={sortedBy ?? 'helpful'}
          onChange={onChange}
        />
        {view === 'media' ? (
          <ManageReviewButton
            reviewType={reviewType as any}
            review={props?.userReview as any}
            formMode={reviewType === ReviewType.OVERALL ? 'page' : 'modal'}
            mediaId={props?.mediaId}
            mediaType={props?.mediaType}
            onViewReview={onViewUserReview}
            seasonNumber={reviewType === ReviewType.EPISODE ? props.seasonNumber : 0}
            episodeNumber={reviewType === ReviewType.EPISODE ? props.episodeNumber : 0}
          />
        ) : (
          <ReviewTypeSwitcher currentReviewType={reviewType} username={props.username} />
        )}
      </Box>
      <Divider marginBottom={0} />

      <PaginatedList items={sortedReviews} itemsPerPage={10} renderItem={renderReview} switchPage={switchPage} />
    </Box>
  );
};

export default AllReviews;
