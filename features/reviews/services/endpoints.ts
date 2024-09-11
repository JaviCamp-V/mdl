const reviewUpdateEndpoints = {
  addReview: {
    endpoint: 'user/reviews',
    tags: [
      'recent-reviews',
      'overall-reviews-{mediaType}-{mediaId}',
      'episode-reviews-{mediaId}-{season}-{episode}',
      'user-reviews-{userId}-{reviewType}',
      'user-overall-review-{mediaType}-{mediaId}-{userId}',
      'user-episode-review-{mediaId}-{season}-{episode}-{userId}'
    ]
  },
  deleteReview: {
    endpoint: 'user/reviews/:id',
    tags: [
      'recent-reviews',
      'overall-reviews-{mediaType}-{mediaId}',
      'episode-reviews-{mediaId}-{season}-{episode}',
      'user-reviews-{userId}-{reviewType}',
      'user-overall-review-{mediaType}-{mediaId}-{userId}',
      'user-episode-review-{mediaId}-{season}-{episode}-{userId}'
    ]
  },
  markReviewHelpful: {
    endpoint: 'user/reviews/:id/helpful',
    tags: ['review-helpful-{id}', 'user-review-helpful-{id}-{userId}']
  },
  removeHelpfulRating: {
    endpoint: 'user/reviews/:id/helpful',
    tags: ['review-helpful-{id}', 'user-review-helpful-{id}-{userId}']
  }
};

const reviewViewEndpoints = {
  getUserReviews: {
    endpoint: 'reviews/user/:userId',
    tags: ['user-reviews-{userId}-{reviewType}']
  },
  getRecentReviews: {
    endpoint: 'reviews/updates',
    tags: ['recent-reviews']
  },
  getMediaOverallReviews: {
    endpoint: 'reviews/:mediaType/:mediaId',
    tags: ['overall-reviews-{mediaType}-{mediaId}']
  },
  getUserOverallReview: {
    endpoint: 'reviews/:mediaType/:mediaId/user/:userId',
    tags: ['user-overall-review-{mediaType}-{mediaId}-{userId}']
  },
  getMediaEpisodeReviews: {
    endpoint: 'reviews/:mediaId/:season/:episode',
    tags: ['episode-reviews-{mediaId}-{season}-{episode}']
  },
  getUserEpisodeReview: {
    endpoint: 'reviews/:mediaId/:season/:episode/user/:userId',
    tags: ['user-episode-review-{mediaId}-{season}-{episode}-{userId}']
  },
  getReview: {
    endpoint: 'reviews/:id',
    tags: ['review-{id}']
  },
  getReviewHelpful: {
    endpoint: 'reviews/:id/helpful',
    tags: ['review-helpful-{id}']
  },
  getUserReviewHelpfulRating: {
    endpoint: 'reviews/:id/helpful/user/:userId',
    tags: ['user-review-helpful-{id}-{userId}']
  }
};

export { reviewUpdateEndpoints, reviewViewEndpoints };
