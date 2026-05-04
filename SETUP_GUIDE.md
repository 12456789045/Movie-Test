# Setup & Installation Guide

## Prerequisites

- MySQL 5.7 or higher
- Node.js 14 or higher
- npm 6 or higher

## Database Setup

The database tables will be automatically created when the backend server starts. However, you can manually create them if needed:

### 1. Create Database

```sql
CREATE DATABASE IF NOT EXISTS USERDATA;
USE USERDATA;
```

### 2. Users Table (Auto-created)

```sql
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);
```

### 3. Feedback Table (NEW - Auto-created)

```sql
CREATE TABLE IF NOT EXISTS feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  rating INT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 4. Watchlist Table (NEW - Auto-created)

```sql
CREATE TABLE IF NOT EXISTS watchlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  movie_title VARCHAR(255),
  movie_poster VARCHAR(255),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_movie (user_id, movie_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend/server
   ```

2. **Update MySQL Credentials** (if different from defaults)
   - Edit `server.js`
   - Update the connection object:

   ```javascript
   const db = mysql.createConnection({
     host: "localhost",
     port: 3306,
     user: "root", // Change if needed
     password: "Hrishikesh@14", // Change if needed
     database: "USERDATA",
   });
   ```

3. **Start Backend Server**
   ```bash
   node server.js
   ```

   - Should see: "MySQL Connected" and "Users table ready", "Feedback table ready", "Watchlist table ready"
   - Server runs on `http://localhost:5000`

## Frontend Setup

1. **Navigate to root directory**

   ```bash
   cd ..
   cd ..
   ```

2. **Install Dependencies** (if not already done)

   ```bash
   npm install
   ```

3. **Start Frontend**
   ```bash
   npm start
   ```

   - Application opens at `http://localhost:3000`

## Testing the New Features

### Test 1: User Registration & Login

1. Click "Create Account" on login page
2. Enter name, email, and password
3. Click "Register"
4. Login with credentials
5. ✅ Should see user avatar in header

### Test 2: User Profile Menu

1. Click the circular avatar button in header
2. ✅ Should see dropdown with name and email
3. Click logout and confirm

### Test 3: Add to Watchlist

1. Navigate to any movie
2. Scroll down to see "Add to Watchlist" button
3. Click button
4. ✅ Button should change to "In Watchlist"
5. Click "Watchlist" in header to view

### Test 4: Watchlist Management

1. Go to Watchlist page
2. ✅ Should see all added movies
3. Click "Remove" on any movie
4. ✅ Movie should disappear from list

### Test 5: Submit Feedback

1. Navigate to any movie detail page
2. Scroll to bottom: "User Reviews & Feedback" section
3. Select star rating (1-5)
4. Enter review text
5. Click "Submit Review"
6. ✅ Review appears in list immediately
7. ✅ Check database: `SELECT * FROM feedback;`

### Test 6: View Feedback

1. Go to any movie with reviews
2. ✅ See list of reviews with:
   - User name and avatar
   - Star rating
   - Comment text
   - Date submitted

## Troubleshooting

### "User not found" on login

- Ensure you've registered first
- Check MySQL database has user record: `SELECT * FROM users;`

### Feedback not saving

- Check backend is running: `http://localhost:5000`
- Verify user_id in localStorage: Open DevTools → Application → localStorage
- Check MySQL: `SELECT * FROM feedback;`

### Watchlist not working

- Ensure MySQL connection is active
- Check CORS is enabled in backend
- Verify user_id is saved after login

### "Cannot GET /feedback/123" error

- Backend server not running
- Check if axios URL matches backend port (5000)

## Important Files Modified

### Backend

- `backend/server/server.js` - Added feedback & watchlist endpoints and tables

### Frontend

- `src/pages/Login.js` - Stores user info in localStorage
- `src/components/header/Header.jsx` - Shows user profile dropdown
- `src/components/header/header.scss` - User menu styles
- `src/pages/detail/Detail.jsx` - Added feedback and watchlist sections
- `src/routes/Routes.jsx` - Added watchlist route

### New Components

- `src/components/feedback/FeedbackSection.jsx`
- `src/components/feedback/feedback.scss`
- `src/components/watchlist/WatchlistSection.jsx`
- `src/components/watchlist/watchlist.scss`
- `src/pages/WatchlistPage.jsx`
- `src/pages/watchlist-page.scss`

## Important Notes

⚠️ **Security Warnings** (Development Only)

- Passwords are currently stored in plain text (NOT PRODUCTION READY)
- JWT secret key is hardcoded ("secretkey") - use environment variables
- No input validation or sanitization - add in production
- CORS is open to localhost:3000 - restrict in production

## Next Steps for Production

1. Use bcryptjs for password hashing
2. Store secrets in `.env` files
3. Add input validation and sanitization
4. Implement proper error handling
5. Add rate limiting
6. Use HTTPS
7. Add user authentication middleware
8. Implement refresh token mechanism
