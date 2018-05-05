## Altitude Events
- Built wit React, Next, Express, Material-UI, Mongodb and 3rd party auth with Google OAuth
- 2-week skill test for Altitude Games

#### Setup for local development
- Clone the project
- `yarn` to install the packages
- Create an `.env` file at the app's root directory.
- Specify the following env variables to your `.env` file

---
```
PORT="XXXX"  
MONGO_URL="XXXX"  
MONGO_URL_TEST="XXXX"  
SESSION_SECRET="XXXX"  
Google_clientID="XXXX"  
Google_clientSecret="XXXX"
```
---

- `MONGO_URL_TEST` is for local development
- `MONGO_URL` is for production
- For Google OAuth, callback URL is: http://localhost:PORT/oauth2callback
- Enable Google+ API in your Google Cloud Platform account.
- Start the app with `yarn dev`.
- The first registered user in the app becomes the admin user.

#### Tasks
- ~~API endpoints boilerplate~~
- ~~Authentication~~
- ~~Front-end/web framework~~
- __`Events`__ endpoint
- Dashboard
- Additional visualization
- Production preparation
- Production deployment

#### Stack
- [Express](https://github.com/expressjs/express)
- [Mongoose](https://github.com/Automattic/mongoose)
- [MongoDB](https://github.com/mongodb/mongo)
- [React](https://github.com/facebook/react)
- [Material-UI](https://github.com/mui-org/material-ui)
- [Next.js](https://github.com/zeit/next.js)


