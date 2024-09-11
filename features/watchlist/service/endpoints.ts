const viewEndpoints = {
  watchlistByUserId: { endpoint: 'watchlist/user/{userId}', tags: ['watchlist-userId-{userId}'] },
  watchlistByUsername: { endpoint: 'watchlist/user/username/{username}', tags: ['watchlist-username-{username}'] },
  watchlistRecord: {
    endpoint: 'watchlist/{mediaType}/{mediaId}/user/{userId}',
    tags: ['watchlist-{mediaType}-{mediaId}-userId-{userId}']
  },
  watchlistRecordTotalByMedia: {
    endpoint: 'watchlist/{mediaType}/{mediaId}/total',
    tags: ['total-watchlist-{mediaType}-{mediaId}']
  },
  watchlistStatuesTotalByMedia: {
    endpoint: 'watchlist/{mediaType}/{mediaId}/watch-status/total',
    tags: ['watch-status-total-watchlist-{mediaType}-{mediaId}']
  },
  userWatchlistRecordById: {
    endpoint: 'user/watchlist/{id}',
    tags: ['user-{userId}-watchlist-{id}']
  },
  userWatchlistByMedia: {
    endpoint: 'user/watchlist/{mediaType}/{mediaId}',
    tags: ['user-{userId}-watchlist-{mediaType}-{mediaId}']
  }
};

const updateEndpoints = {
  updateWatchlist: {
    endpoint: 'watchlist',
    tags: [
      'watchlist-userId-{userId}',
      'watchlist-username-{username}',
      'watchlist-{mediaType}-{mediaId}-userId-{userId}',
      'total-watchlist-{mediaType}-{mediaId}',
      'watch-status-total-watchlist-{mediaType}-{mediaId}',
      'user-{userId}-watchlist-{id}',
      'user-{userId}-watchlist-{mediaType}-{mediaId}'
    ]
  },
  deleteWatchlistRecordById: {
    endpoint: 'user/watchlist/:id',
    tags: [
      'watchlist-userId-{userId}',
      'watchlist-username-{username}',
      'watchlist-{mediaType}-{mediaId}-userId-{userId}',
      'total-watchlist-{mediaType}-{mediaId}',
      'watch-status-total-watchlist-{mediaType}-{mediaId}',
      'user-{userId}-watchlist-{id}',
      'user-{userId}-watchlist-{mediaType}-{mediaId}'
    ]
  }
};

export { viewEndpoints, updateEndpoints };
