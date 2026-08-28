import type { Config, Context } from "@netlify/functions";
import { desc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { watchlist } from "../../db/schema.js";

export default async (req: Request, context: Context) => {
  const userId = Number(context.params.user_id);

  if (!userId) {
    return Response.json({ message: "Invalid user_id" }, { status: 400 });
  }

  const rows = await db
    .select()
    .from(watchlist)
    .where(eq(watchlist.userId, userId))
    .orderBy(desc(watchlist.addedAt));

  const result = rows.map((row) => ({
    movie_id: row.movieId,
    movie_title: row.movieTitle,
    movie_poster: row.moviePoster,
    added_at: row.addedAt,
  }));

  return Response.json(result);
};

export const config: Config = {
  path: "/api/watchlist/:user_id",
  method: "GET",
};
