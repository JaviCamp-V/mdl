import MediaDetailsProps from '@/types/common/MediaDetailsProps';

export default interface MakeRecommendation {
  source: MediaDetailsProps;
  suggested: MediaDetailsProps;
  reason: string;
}
