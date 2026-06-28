const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Hrishikesh@14",
  database: "USERDATA",
});
db.connect((err) => {
  if (err) {
    console.log("Database connection failed", err);
  } else {
    console.log("MySQL Connected");
    // Create users table if not exists
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      )
    `;
    db.query(createUsersTable, (err, result) => {
      if (err) {
        console.log("Error creating users table", err);
      } else {
        console.log("Users table ready");
      }
    });

    // Create feedback table if not exists
    const createFeedbackTable = `
      CREATE TABLE IF NOT EXISTS feedback (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        movie_id INT NOT NULL,
        comment TEXT,
        likes INT DEFAULT 0,
        dislikes INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    db.query(createFeedbackTable, (err, result) => {
      if (err) {
        console.log("Error creating feedback table", err);
      } else {
        console.log("Feedback table ready");

        // Ensure likes/dislikes columns exist for vote counts
        const checkLikesColumns = `
          SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
          WHERE TABLE_NAME = 'feedback' AND COLUMN_NAME IN ('likes','dislikes') AND TABLE_SCHEMA = DATABASE()
        `;
        db.query(checkLikesColumns, (err, result) => {
          if (err) {
            console.log("Error checking feedback columns", err);
            return;
          }

          const existingColumns = result.map((row) => row.COLUMN_NAME);
          const alterClauses = [];
          if (!existingColumns.includes("likes")) {
            alterClauses.push("ADD COLUMN likes INT DEFAULT 0");
          }
          if (!existingColumns.includes("dislikes")) {
            alterClauses.push("ADD COLUMN dislikes INT DEFAULT 0");
          }

          if (alterClauses.length > 0) {
            const alterTableQuery = `ALTER TABLE feedback ${alterClauses.join(", ")}`;
            db.query(alterTableQuery, (err) => {
              if (err) {
                console.log(
                  "Could not add likes/dislikes columns to feedback table",
                  err,
                );
              } else {
                console.log("Added likes/dislikes columns to feedback table");
              }
            });
          }
        });

        // Check if rating column exists and remove it if needed (migration)
        const checkRatingColumn = `
          SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_NAME = 'feedback' AND COLUMN_NAME = 'rating' AND TABLE_SCHEMA = DATABASE()
        `;
        db.query(checkRatingColumn, (err, result) => {
          if (result && result.length > 0) {
            // Rating column exists, drop it
            const alterTableQuery = `ALTER TABLE feedback DROP COLUMN rating`;
            db.query(alterTableQuery, (err) => {
              if (err) {
                console.log("Could not drop rating column", err);
              } else {
                console.log("Removed rating column from feedback table");
              }
            });
          }
        });
      }
    });

    // Create feedback votes table if not exists
    const createFeedbackVotesTable = `
      CREATE TABLE IF NOT EXISTS feedback_votes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        feedback_id INT NOT NULL,
        user_id INT NOT NULL,
        vote_type ENUM('like', 'dislike') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_feedback (feedback_id, user_id),
        FOREIGN KEY (feedback_id) REFERENCES feedback(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    db.query(createFeedbackVotesTable, (err, result) => {
      if (err) {
        console.log("Error creating feedback_votes table", err);
      } else {
        console.log("Feedback votes table ready");
      }
    });

    // Create watchlist table if not exists
    const createWatchlistTable = `
      CREATE TABLE IF NOT EXISTS watchlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        movie_id INT NOT NULL,
        movie_title VARCHAR(255),
        movie_poster VARCHAR(255),
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_movie (user_id, movie_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    db.query(createWatchlistTable, (err, result) => {
      if (err) {
        console.log("Error creating watchlist table", err);
      } else {
        console.log("Watchlist table ready");
      }
    });
  }
});

// REGISTER
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // TEMPORARY: Storing plain password for debugging - INSECURE!
  const hashedPassword = password; // Remove hashing

  const sql = "INSERT INTO users (name,email,password) VALUES (?,?,?)";

  db.query(sql, [name, email, hashedPassword], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json({ message: "User registered" });
  });
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email=?";

  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0)
      return res.status(400).json({
        message: "User not found",
      });

    const user = result[0];

    // TEMPORARY: Plain password comparison for debugging - INSECURE!
    const validPassword = password === user.password; // Remove bcrypt.compare

    if (!validPassword)
      return res.status(400).json({
        message: "Wrong password",
      });

    const token = jwt.sign({ id: user.id }, "secretkey", { expiresIn: "1d" });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  });
});

// GET USER BY TOKEN
app.post("/get-user", (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, "secretkey");
    const sql = "SELECT id, name, email FROM users WHERE id=?";
    db.query(sql, [decoded.id], (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.length === 0)
        return res.status(400).json({ message: "User not found" });
      res.json(result[0]);
    });
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
});

// ADD FEEDBACK
app.post("/add-feedback", (req, res) => {
  const { user_id, movie_id, comment } = req.body;

  // Validate inputs
  if (!user_id || !movie_id || !comment) {
    return res
      .status(400)
      .json({ message: "Missing required fields: user_id, movie_id, comment" });
  }

  const sql =
    "INSERT INTO feedback (user_id, movie_id, comment) VALUES (?, ?, ?)";

  db.query(sql, [user_id, movie_id, comment], (err, result) => {
    if (err) {
      console.log("Database error adding feedback:", err);
      return res.status(500).json({
        message: "Error adding feedback to database",
        error: err.message,
      });
    }
    res.json({ message: "Feedback added successfully", id: result.insertId });
  });
});

// GET FEEDBACK FOR MOVIE
app.get("/feedback/:movie_id", (req, res) => {
  const { movie_id } = req.params;

  const sql =
    "SELECT f.id, f.user_id, f.movie_id, f.comment, f.likes, f.dislikes, f.created_at, u.name FROM feedback f JOIN users u ON f.user_id = u.id WHERE f.movie_id = ? ORDER BY f.created_at DESC";

  db.query(sql, [movie_id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ADD LIKE/DISLIKE TO FEEDBACK
app.post("/vote-feedback", (req, res) => {
  const { feedback_id, user_id, vote_type } = req.body;

  const sql =
    "INSERT INTO feedback_votes (feedback_id, user_id, vote_type) VALUES (?, ?, ?)";

  db.query(sql, [feedback_id, user_id, vote_type], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        // User already voted, update the vote
        const updateSql =
          "UPDATE feedback_votes SET vote_type = ? WHERE feedback_id = ? AND user_id = ?";
        db.query(
          updateSql,
          [vote_type, feedback_id, user_id],
          (err, result) => {
            if (err) return res.status(500).json(err);

            // Update feedback like/dislike counts
            const countSql =
              "SELECT COUNT(CASE WHEN vote_type = 'like' THEN 1 END) as likes, COUNT(CASE WHEN vote_type = 'dislike' THEN 1 END) as dislikes FROM feedback_votes WHERE feedback_id = ?";
            db.query(countSql, [feedback_id], (err, countResult) => {
              if (err) return res.status(500).json(err);
              const updateFeedbackSql =
                "UPDATE feedback SET likes = ?, dislikes = ? WHERE id = ?";
              db.query(
                updateFeedbackSql,
                [countResult[0].likes, countResult[0].dislikes, feedback_id],
                (err) => {
                  if (err) return res.status(500).json(err);
                  res.json({ message: "Vote updated" });
                },
              );
            });
          },
        );
      } else {
        return res.status(500).json(err);
      }
    } else {
      // New vote added, update counts
      const countSql =
        "SELECT COUNT(CASE WHEN vote_type = 'like' THEN 1 END) as likes, COUNT(CASE WHEN vote_type = 'dislike' THEN 1 END) as dislikes FROM feedback_votes WHERE feedback_id = ?";
      db.query(countSql, [feedback_id], (err, countResult) => {
        if (err) return res.status(500).json(err);
        const updateFeedbackSql =
          "UPDATE feedback SET likes = ?, dislikes = ? WHERE id = ?";
        db.query(
          updateFeedbackSql,
          [countResult[0].likes, countResult[0].dislikes, feedback_id],
          (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Vote added" });
          },
        );
      });
    }
  });
});

// GET USER VOTE ON FEEDBACK
app.get("/feedback-user-vote/:feedback_id/:user_id", (req, res) => {
  const { feedback_id, user_id } = req.params;

  const sql =
    "SELECT vote_type FROM feedback_votes WHERE feedback_id = ? AND user_id = ?";

  db.query(sql, [feedback_id, user_id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ userVote: result.length > 0 ? result[0].vote_type : null });
  });
});

// ADD TO WATCHLIST
app.post("/add-watchlist", (req, res) => {
  const { user_id, movie_id, movie_title, movie_poster } = req.body;

  const sql =
    "INSERT INTO watchlist (user_id, movie_id, movie_title, movie_poster) VALUES (?, ?, ?, ?)";

  db.query(
    sql,
    [user_id, movie_id, movie_title, movie_poster],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Already in watchlist" });
        }
        return res.status(500).json(err);
      }
      res.json({ message: "Added to watchlist" });
    },
  );
});

// REMOVE FROM WATCHLIST
app.post("/remove-watchlist", (req, res) => {
  const { user_id, movie_id } = req.body;

  const sql = "DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?";

  db.query(sql, [user_id, movie_id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Removed from watchlist" });
  });
});

// GET USER WATCHLIST
app.get("/watchlist/:user_id", (req, res) => {
  const { user_id } = req.params;

  const sql =
    "SELECT * FROM watchlist WHERE user_id = ? ORDER BY added_at DESC";

  db.query(sql, [user_id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// CHECK IF MOVIE IN WATCHLIST
app.get("/watchlist-check/:user_id/:movie_id", (req, res) => {
  const { user_id, movie_id } = req.params;

  const sql = "SELECT * FROM watchlist WHERE user_id = ? AND movie_id = ?";

  db.query(sql, [user_id, movie_id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ inWatchlist: result.length > 0 });
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));
