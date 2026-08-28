import { pgTable, serial, text, integer, timestamp, unique } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  password: text().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const watchlist = pgTable(
  "watchlist",
  {
    id: serial().primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    movieId: integer("movie_id").notNull(),
    movieTitle: text("movie_title"),
    moviePoster: text("movie_poster"),
    addedAt: timestamp("added_at").defaultNow(),
  },
  (table) => [unique("unique_user_movie").on(table.userId, table.movieId)],
);
