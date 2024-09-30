# iMark
iMark – the Map-based Information Distribution System

- You post an event based on the location, and this event is displayed on the map.
- There are many topics (categories), like marketplace, jobs, rental market and sports and so on.
- You can search related events to view, and share and favourite them.

## Features
- Information distribution management
    - Post an event
    - Update an event
    - Delete an event
    - Query events
- Category management
    - Create a category
    - Edit a category
    - Delete a category
    - Search categories
- User management
    - Add a user
    - Change the password
    - Block a user
    - Delete a user
    - Change a role
    - Update a profile
- Favorite management
    - Follow an event
    - Unfollow an event
- Map interaction
    - View all events
    - Locate an event on the map
    - Share an event to social media
    - Favorite an event
- Log in
- Log out
- Sign up

## Configuration

### Development environment
Create a file `.env.local` in the root directory, and configure the following environment variables:
- Google Maps Platform
- Fasebase

```bash
NEXT_PUBLIC_GOOGLE_MAP_API_KEY=
NEXT_PUBLIC_GOOGLE_MAP_ID=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
BACKEND_APIS=http://localhost:3000/api/:path*
```

## Getting Started

First, install node modules:
```bash
npm install
```

Second, run the development server:

```bash
npm run dev
```

Open [http://localhost:3008](http://localhost:3008) to your browser to view the application.

## Deployment

Utilze the following command to deploy to the production environment.
The codebase is deployed to AWS Amplify, which is https://main.d1wt4ve9frisen.amplifyapp.com/.

```bash
npm run build
```