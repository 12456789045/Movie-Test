# Quick Reference - New Features

## 🎬 Movie Central - New Features Overview

### ✨ 1. Netflix-style User Profile

**Location**: Top right corner of header

**Features**:

- User avatar (first letter of name in colored circle)
- Click avatar to see dropdown
- Displays user name and email
- Logout button in dropdown

**User Flow**:

```
Login → Avatar appears → Click avatar → See profile dropdown → Logout option
```

---

### ⭐ 2. User Feedback/Reviews System

**Location**: Bottom of movie detail page

**What you can do**:

- ⭐ Rate movie 1-5 stars
- 💬 Write your review/opinion
- 👁️ See all user reviews
- 📅 View review dates and user names

**UI Elements**:

- Star rating selector (click to rate)
- Text area for review comment
- Submit Review button
- List of all reviews below

**Example**:

```
⭐⭐⭐⭐⭐ 5/5
John Doe
May 2, 2026
"Amazing movie! Must watch!"
```

---

### 📋 3. Watchlist Feature

**Where to use it**:

1. On movie detail pages: "Add to Watchlist" button
2. In header navigation: "Watchlist" link
3. Watchlist page: View all saved movies

**What you can do**:

- ➕ Add movies to watchlist
- ❌ Remove movies from watchlist
- 📺 View all your saved movies in one place
- 📅 See when you added each movie

**Button States**:

- "Add to Watchlist" (not in list) - Blue button
- "In Watchlist" (already added) - Blue outline button

**Watchlist Page**:

- Shows movie poster and title
- Shows date added
- Remove button on hover
- Count of movies in watchlist

---

## 🔒 Authentication & Login

**New Changes**:

- User info (name & email) now displayed after login
- Login stores user data in browser memory (localStorage)
- User profile accessible from header at all times

**User Data Stored**:

- User ID
- Full Name
- Email Address
- Authentication Token

---

## 📱 Mobile Responsive

All new features are fully responsive:

- ✅ User profile dropdown works on mobile
- ✅ Watchlist grid adjusts to screen size
- ✅ Feedback section readable on small screens
- ✅ Touch-friendly button sizes

---

## 🗄️ Data Storage

### What's Stored in Database?

**Feedback**:

- User who submitted
- Movie ID
- Rating (1-5)
- Comment text
- Timestamp

**Watchlist**:

- User who created it
- Movie ID
- Movie title
- Movie poster
- Date added

**Important**: All data is linked to your user account and private to you.

---

## ⌨️ Keyboard & Browser

### LocalStorage (Browser Memory)

- User login token
- User profile info (name, email)
- Persists until logout

### Database (Server)

- All feedback reviews
- All watchlist items
- User accounts

---

## 🎯 Common Tasks

### Add movie to watchlist

1. Go to movie detail page
2. Click "Add to Watchlist" button
3. Done! Button changes to "In Watchlist"

### View my watchlist

1. Click "Watchlist" in header
2. See all your saved movies
3. Click remove to delete

### Leave a review

1. Scroll to bottom of movie page
2. Click stars to rate (1-5)
3. Type your opinion
4. Click "Submit Review"

### View reviews

1. Go to movie detail page
2. Scroll to "User Reviews" section
3. See all user reviews with ratings

### Logout

1. Click user avatar (top right)
2. Click "Logout"
3. Redirected to login page

---

## ❌ Errors & Solutions

| Error                             | Solution                        |
| --------------------------------- | ------------------------------- |
| "Please login to use watchlist"   | Register and login first        |
| "Please login to submit feedback" | You must be logged in           |
| Reviews not showing               | Wait a moment, might be loading |
| Watchlist not updating            | Check internet connection       |
| Avatar not showing                | Refresh page after login        |

---

## 🔄 Workflow Examples

### Example 1: New User

```
1. Click "Create Account"
2. Fill in Name, Email, Password
3. Click Register
4. Login with credentials
5. See avatar in header
6. Browse movies
7. Click Watchlist
8. Add movies
9. Leave reviews
```

### Example 2: Watchlist Management

```
1. Find movie you want to save
2. Click "Add to Watchlist"
3. See "In Watchlist" confirmation
4. Click "Watchlist" in header
5. See all your movies
6. Can remove anytime
```

### Example 3: Review Other Users' Work

```
1. Go to any movie
2. Scroll down to "User Reviews"
3. See others' opinions
4. Read comments and ratings
5. Add your own review
6. See it appear in list
```

---

## 🌟 Tips & Tricks

💡 **Tips**:

- You can edit your watchlist anytime
- Reviews are instant - others see them right away
- Check your watchlist on different devices (same account)
- Sort watchlist by newest or oldest added
- Rate movies honestly to help others

⚡ **Quick Actions**:

- Rate star by clicking on it
- Remove from watchlist by hovering and clicking remove
- Click user avatar to quickly logout
- Press Ctrl+Shift+Delete to clear browser data

---

## 📊 Data Visibility

**Public**:

- Your reviews (name, rating, comment visible to all)

**Private**:

- Your watchlist (only you see it)
- Your email address (in your profile)
- Your password (never shared)

---

## ❓ FAQ

**Q: Can I edit my review?**
A: Current version doesn't support edit. Delete and resubmit if needed.

**Q: Is my watchlist saved?**
A: Yes! It's saved in database. Same on all devices.

**Q: Who can see my watchlist?**
A: Only you. It's private.

**Q: Can I see other users' watchlists?**
A: No, watchlists are private to each user.

**Q: How long do reviews stay?**
A: Forever, unless manually deleted.

---

## 🚀 Getting Started

1. **Register**: Create new account
2. **Login**: Use credentials
3. **Explore**: Browse movies
4. **Add to Watchlist**: Save favorites
5. **Leave Review**: Share your thoughts
6. **View Profile**: Check user info
7. **Logout**: When done
