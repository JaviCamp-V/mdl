# MyDramalist Clone

This project is a clone of the website [MyDramalist](https://mydramalist.com/). It allows users to search for their favorite dramas and movies, read reviews, and create a watchlist of shows they want to watch. Note links in the navbar and footer are implemented as placeholders and do not lead to actual pages, check the features section for more information on the implemented features.

## Uses and Dependencies

- **Next.js with TypeScript** - For server-side rendering and client side caching.
- **NextAuth.js** - For authentication and session management.
- **Material-UI** - For UI components and theming.
- **Axios** - For making HTTP requests to the external and internal APIs.
- **React Hook Form** - For managing form state and validation.
- **Yup** - For schema validation of forms.
- **Cloudinary** - For image upload and hosting.
- **Mui-TipTap** - For rich text editing for bio

## Live Demo

### Hosted on Railway

The application is hosted on Railway and can be accessed using the following links. Please note that the application may take a few seconds to be available since the server may be in sleep mode. Refresh the page if it doesn't load the first time:

- [MyDramalist App Clone](https://mdl-production-035f.up.railway.app/)
- [MyDramalist API Clone](https://mdl-api-production.up.railway.app/swagger-ui/index.html)

## Development

### APIs Used

This application is built using public APIs for data, along with a custom API for more specific features:

- [The Movie Database API](https://www.themoviedb.org/documentation/api) - Provides drama, movie, and person data.
- [TVmaze API](https://www.tvmaze.com/api) - Provides the drama airing schedule.
- [MDL API Clone](https://mdl-api-production.up.railway.app/swagger-ui/index.html) - A custom API created to handle authentication, user management, watchlist management, reviews, comments, and recommendations.

### Non-Commercial Use

This application is intended for non-commercial use only.

## Features

- **Search for Dramas and Movies:** Users can search for their favorite dramas and movies using the search functionality.
- **User Authentication:** Sign up and log in with refresh token management.
- **Watchlist Management:** Perform CRUD operations for dramas and movies in the watchlist (authenticated users only).
- **View Watchlists:** Users can view their watchlist.
- **Review Dramas and Movies:** Users can add reviews for dramas and movies (authenticated users only).
- **Rate Reviews:** Users can rate reviews for dramas and movies (authenticated users only).
- **View Reviews:** Users can view reviews for dramas and movies.
- **Recommendations:** Users can add and like recommendations for dramas and movies (authenticated users only).
- **View Recommendations:** Users can view recommendations for dramas and movies.
- **Comments:** Users can comment on dramas, movies, and persons.
- **User Profile Page:** Add a page where users can view and edit their profile.
- **User Settings Page:** Add a page where users can update their information, such as email and password.
- **User Profile Picture:** Allow users to upload and display a profile picture.
- **User Bio:** Add a rich text editor for users to create a bio with support for images and links.

## Features to Implement

- **Hero Section:** Add a hero section to the home page above the drama carousel.
- **Comments on Reviews:** Allow users to comment on reviews.
- **Custom Lists:** Add a feature where users can create custom lists of dramas, movies, and people.
- **Website Responsiveness:** Improve the website's responsiveness for different screen sizes.
- **Informational Pages:** Add pages like "About Us," "Contact Us," "Privacy Policy," and "Terms of Service."

## Features Under Consideration

- **Articles Feature:** Consider adding an articles feature similar to the original MyDramalist website.
