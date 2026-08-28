import type { Config } from "@netlify/functions";
import { and, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { watchlist } from "../../db/schema.js";

export default async (req: Request) => {
  const { user_id, movie_id, movie_title, movie_poster } = await req.json();

  if (!user_id || !movie_id) {
    return Response.json(
      { message: "Missing required fields: user_id, movie_id" },
      { status: 400 },
    );
  }

  const [existing] = await db
    .select()
    .from(watchlist)
    .where(and(eq(watchlist.userId, user_id), eq(watchlist.movieId, movie_id)));

  if (existing) {
    return Response.json({ message: "Already in watchlist" }, { status: 400 });
  }

  await db.insert(watchlist).values({
    userId: user_id,
    movieId: movie_id,
    movieTitle: movie_title,
    moviePoster: movie_poster,
  });

  return Response.json({ message: "Added to watchlist" });
};

export const config: Config = {
  path: "/api/add-watchlist",
  method: "POST",
};
