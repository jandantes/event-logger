## Altitude Events
- Built wit React, Next, Express, Material-UI, Mongodb and 3rd party auth with Google OAuth
- 2-week skill test for Altitude Games

## Setup for local development
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
JWT_SECRET="XXXX"
```
---
- `MONGO_URL` is for production, eg: [free MongoDB at mLab](http://docs.mlab.com/)
- `MONGO_URL_TEST` is for local development, eg: `mongodb://localhost/altitude-events`
- `SESSION_SECRET` https://github.com/expressjs/session#secret
- Get `Google_clientID` and `Google_clientSecret` by following [official OAuth tutorial](https://developers.google.com/identity/sign-in/web/sign-in#before_you_begin).
- For Google OAuth, callback URL is: http://localhost:PORT/oauth2callback
- Enable Google+ API in your Google Cloud Platform account.
- `JWT_SECRET` for signing JWT
- Start the app with `yarn dev`
- The first registered user in the app becomes the admin user.

## Deploy
- Sign up at https://zeit.co/
- Install now: `npm install -g now`.
- Configure `now.json`, you may check: [now configuration](https://zeit.co/docs/features/configuration).
- Configure `ROOT_URL` value in `lib/api/getRootURL.js`
- Make sure you have configured production-level env variables in `.env`
- In your terminal, deploy the app by running `now`
- Now outputs your deployment's URL, eg: `altitude-events-utwcjvfimi.now.sh`
- Point successful deployment to your domain with `now alias` eg: `now alias altitude-events-utwcjvfimi.now.sh altitude-events.now.sh`

## API
Note: User must sign-in to get the generated token to access endpoints
```
//Add the generated token as Authorization header for all API request, eg:

GET /api/v1/events HTTP/1.1
Host: localhost:54321
Authorization: Bearer [ACCESS TOKEN]
```
## Events API
------

### Get Events 
| | |
|:---|:---|
| **URL** | /api/v1/events  |
| **Method**  | GET   |
| **URL Parameters**  |timestamp range: `start ` `end`  |
| | paging: `offset` `limit` |
| **Success reponse**  | **Code:** 200 OK |
||**Content:** ```{ events: [], count: 0 } ```|
| **Error reponse**  | **Code:** 401 UNAUTHORIZED |
|| **Content:** ```{ error: "Unauthorized" } ``` |
| **Sample request**  | `/api/v1/events?start="2018-05-1T11:39:47"&end="2018-05-10T11:39:47"` |
|| `/api/v1/events?offset=10&limit=10` |
|| `/api/v1/events?key=ae_QdMexJAqPPuvgvjWeEop` |
| **Notes**  | `start ` and `end` should be `ISO 8601 Standard timestamp: 2018-05-10T02:26:00` |
| |default `limit` is 10 |
| |query by `key` is optional |

### Get an Event by key
|  |  |
|:---|:---|
| **URL** | /api/v1/events/detail/[key]  |
| **Method**  | GET   |
| **Success reponse**  | **Code:** 200 OK |
||**Content:** ```{"_id":"XXX","createdBy":"XXX","metadata":{},"timestamp":"XXX","updatedAt":"XXX","key":"XXX","__v":0} ```|
| **Success reponse**  | **Code:** 200 OK |
|| **Content:** ```"error": "Event not found" ``` |
| **Error reponse**  | **Code:** 401 UNAUTHORIZED |
|| **Content:** ```{ error: "Unauthorized" } ``` |
| **Sample request**  | `/api/v1/events/detail/ae_06AjYoaneEHKkKGwVNE1"` |

### Add an Event 
|  |  |
|:---|:---|
| **URL** | /api/v1/events/add |
| **Method**  | POST |
| **Content-Type**  | application/json |
| **Body**  | ```{ metadata: {} }``` |
| **Success reponse**  | **Code:** 200 OK |
||**Content:** ```{"_id":"XXX","createdBy":"XXX","metadata":{},"timestamp":"XXX","updatedAt":"XXX","key":"XXX","__v":0}```|
| **Success reponse**  | **Code:** 200 OK |
|| **Content:** ```{"error":"Event validation failed: metadata: metadata has no properties"} ``` |
| **Success reponse**  | **Code:** 200 OK |
|| **Content:** ```{"error":"Event validation failed: metadata: metadata is required"} ``` |
| **Error reponse**  | **Code:** 401 UNAUTHORIZED |
|| **Content:** ```{ error: "Unauthorized" } ``` |
| **Sample request**  | ```{ "metadata": { "lat": "14.5995", "lon": "120.9842", "x": 12345, "y": 123 } }```  |
| **Notes**  | `metadata` is required |
| | `metadata` must be a valid JSON object |
| | `metadata` is an "anything goes" SchemaType, its flexibility comes at a trade-off of it being harder to maintain. see Mixed Schematype: http://mongoosejs.com/docs/schematypes.html |

### Delete an Event by key
|  |  |
|:---|:---|
| **URL** | /api/v1/events/detail/[key]  |
| **Method**  | DELETE |
| **Success reponse**  | **Code:** 200 OK |
||**Content:** ```{"message":"Successfully deleted"}```|
| **Success reponse**  | **Code:** 200 OK |
|| **Content:** ```"error": "Event not found" ``` |
| **Error reponse**  | **Code:** 401 UNAUTHORIZED |
|| **Content:** ```{ error: "Unauthorized" } ``` |
| **Sample request**  | `/api/v1/events/detail/ae_06AjYoaneEHKkKGwVNE1"` |

## Stack
- [Express](https://github.com/expressjs/express)
- [Mongoose](https://github.com/Automattic/mongoose)
- [MongoDB](https://github.com/mongodb/mongo)
- [React](https://github.com/facebook/react)
- [Material-UI](https://github.com/mui-org/material-ui)
- [Next.js](https://github.com/zeit/next.js)


