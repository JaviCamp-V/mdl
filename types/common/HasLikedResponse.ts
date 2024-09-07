import LikeableType from '../enums/LikeableType';

export default interface HasLikedResponse {
  likeableId: number;
  likeableType: LikeableType;
  hasUserLiked: boolean;
}
