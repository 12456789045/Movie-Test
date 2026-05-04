# Movie Central - New Features Documentation

## Features Added

### 1. **User Authentication with Profile Display (Netflix-style)**

#### What's New:

- After login, user information (name and email) is displayed in the header
- User profile dropdown menu similar to Netflix
- Click on the user avatar to see profile info and logout option

#### Files Modified:

- `src/pages/Login.js` - Now stores user info in localStorage
- `src/components/header/Header.jsx` - Displays user profile dropdown
- `src/components/header/header.scss` - Styled user menu with avatar

#### How It Works:

1. User logs in with email and password
2. Backend returns token and user data (id, name, email)
3. User data is stored in localStorage
4. Header displays user avatar (first letter of name) in a circular button
5. Click avatar to see dropdown with name, email, and logout button

---

### 2. **Feedback/Review System**

#### What's New:

- Users can submit reviews with ratings (1-5 stars) and comments
- See all user reviews for each movie
- Reviews display user name, rating, date, and comment
- Real-time feedback submission

#### Files Created:

- `src/components/feedback/FeedbackSection.jsx` - Main feedback component
- `src/components/feedback/feedback.scss` - Feedback styling

#### Database:

- New `feedback` table stores: user_id, movie_id, rating, comment, timestamp

#### How to Use:

1. Navigate to any movie detail page
2. Scroll to bottom to see "User Reviews & Feedback" section
3. Rate the movie (1-5 stars) by clicking stars
4. Enter your review text
5. Click "Submit Review"
6. See all user reviews below

#### Backend Endpoints:

- `POST /add-feedback` - Add new feedback
- `GET /feedback/:movie_id` - Get all feedback for a movie

---

### 3. **Watchlist Feature**

#### What's New:

- Add/remove movies from personal watchlist
- View all watchlist movies in dedicated page
- Persistent watchlist across sessions
- Quick visual indicator on movie detail page

#### Files Created:

- `src/components/watchlist/WatchlistSection.jsx` - Add to watchlist button
- `src/components/watchlist/watchlist.scss` - Watchlist button styling
- `src/pages/WatchlistPage.jsx` - Watchlist view page
- `src/pages/watchlist-page.scss` - Watchlist page styling

#### Database:

- New `watchlist` table stores: user_id, movie_id, movie_title, movie_poster, timestamp

#### How to Use:

1. On any movie detail page, click the "Add to Watchlist" button
2. Button changes to "In Watchlist" when added
3. Go to "Watchlist" in header navigation to view all saved movies
4. Remove movies from watchlist by clicking the "Remove" button
5. See the date when each movie was added

#### Backend Endpoints:

- `POST /add-watchlist` - Add movie to watchlist
- `POST /remove-watchlist` - Remove movie from watchlist
- `GET /watchlist/:user_id` - Get user's watchlist
- `GET /watchlist-check/:user_id/:movie_id` - Check if movie is in watchlist

---

## Database Schema

### Feedback Table

```sql
CREATE TABLE feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  rating INT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
```

### Watchlist Table

```sql
CREATE TABLE watchlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  movie_title VARCHAR(255),
  movie_poster VARCHAR(255),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_movie (user_id, movie_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
```

---

## Backend API Endpoints

### User Management

- `POST /login` - Login user, returns token and user data
- `POST /get-user` - Get user info from token

### Feedback

- `POST /add-feedback` - Submit feedback
  - Body: `{ user_id, movie_id, rating, comment }`
- `GET /feedback/:movie_id` - Get all feedback for a movie

### Watchlist

- `POST /add-watchlist` - Add to watchlist
  - Body: `{ user_id, movie_id, movie_title, movie_poster }`
- `POST /remove-watchlist` - Remove from watchlist
  - Body: `{ user_id, movie_id }`
- `GET /watchlist/:user_id` - Get user's watchlist
- `GET /watchlist-check/:user_id/:movie_id` - Check if movie is in watchlist

---

## Component Structure

### Header Component

```
Header
├── User Avatar Button
└── User Dropdown Menu
    ├── User Name
    ├── User Email
    └── Logout Button
```

### Detail Page

```
Detail Page
├── Banner
├── Movie Content
│   ├── Poster
│   └── Info
│       ├── Title
│       ├── Genres
│       ├── Overview
│       └── Watchlist Button ← NEW
├── Cast List
├── Videos
├── Similar Movies
└── Feedback Section ← NEW
    ├── Submit Feedback Form
    └── Existing Reviews List
```

---

## Running the Application

### Prerequisites

- MySQL running with USERDATA database
- Node.js and npm installed

### Start Backend

```bash
cd backend/server
node server.js
```

### Start Frontend

```bash
npm start
```

### Access Application

- Open browser at `http://localhost:3000`
- Login with registered credentials

---

## Features Summary

| Feature      | Location                           | Login Required | Storage                 |
| ------------ | ---------------------------------- | -------------- | ----------------------- |
| User Profile | Header                             | Yes            | localStorage + Database |
| Feedback     | Movie Detail Page                  | Yes            | MySQL                   |
| Watchlist    | Movie Detail Page + Watchlist Page | Yes            | MySQL                   |
| Logout       | User Menu                          | Yes            | -                       |

---

## Future Enhancements

1. Ability to edit/delete own reviews
2. Helpful vote system for reviews (upvote/downvote)
3. User ratings influence recommendations
4. Export watchlist to file
5. Share watchlist with friends
6. Notifications for new reviews on watched movies
