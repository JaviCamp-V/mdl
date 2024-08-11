import routes from '@/libs/routes';


const model = {
  //Fist column  brand info
  logo: '/static/images/logo_w.webp',
  name: 'MyDramaList',
  aberration: 'MDL', // use for mobile view
  description: 'Explore Asian Drama and Movies',
  socialMedia: {
    facebook: 'https://www.facebook.com/MyDramaListdotcom/',
    twitter: 'https://twitter.com/My_Drama_List',
    instagram: 'https://www.instagram.com/mydramalist/',
    youtube: 'https://www.youtube.com/user/MyDramaListOfficial',
    pinterest: 'https://www.pinterest.com/mydramalist/',
    rss: 'https://mydramalist.com/rss'
  },
  download: {
    ios: 'https://apps.apple.com/us/app/mydramalist/id1451321116',
    android: 'https://play.google.com/store/apps/details?id=com.mydramalist'
  },
  signIn: routes.login,
  signUp: routes.register,
  profile: routes.home,
  navbarLinks: {
    //one row
    Home: [
      { label: 'Feeds', href: '#' },
      { label: 'Articles', href: '#' },
      { label: 'Feeds', href: '#' }
    ],
    Explore: [
      { label: 'Top 100', href: '#' },
      { label: 'Recommendation', href: '#' },
      { label: 'Latest', href: '#' }
    ],
    Community: [
      { label: 'Forums', href: '#' },
      { label: 'Discussions', href: '#' },
      { label: 'Reviews', href: '#' }
    ],
    Calendar: [{ label: 'Calendar', href: '#' }]
  },
  footerLinks: [
    //Number of columns
    {
      About: [
        { label: 'FAQ', href: routes.faq },
        { label: 'About Us', href: routes.about },
        { label: 'Contact Us', href: routes.contact },
        { label: 'Terms of Service', href: routes.terms },
        { label: 'Privacy', href: routes.privacy },
        { label: 'Help Center', href: routes.help }
      ]
    },
    {
      'Dark Mode': [], //,
      'Work With Us': [
        { label: 'Advertise', href: routes.advertise },
        { label: 'API', href: routes.api }
      ]
    },
    {
      Recommendations: [
        { label: 'Korean Drama', href: routes.recommendationKoreanDrama },
        { label: 'Korean Movie', href: routes.recommendationKoreanMovie },
        { label: 'Top 100 Korean Dramas', href: routes.recommendationTop100KoreanDramas },
        { label: 'Top 100 Korean Movies', href: routes.recommendationTop100KoreanMovies }
      ]
    }
  ]
};

export default model;