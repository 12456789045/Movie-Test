import type { Config, Context } from "@netlify/functions";
import { and, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { watchlist } from "../../db/schema.js";

export default async (req: Request, context: Context) => {
  const userId = Number(context.params.user_id);
  const movieId = Number(context.params.movie_id);

  if (!userId || !movieId) {
    return Response.json({ message: "Invalid user_id or movie_id" }, { status: 400 });
  }

  const [existing] = await db
    .select()
    .from(watchlist)
    .where(and(eq(watchlist.userId, userId), eq(watchlist.movieId, movieId)));

  return Response.json({ inWatchlist: !!existing });
};

export const config: Config = {
  path: "/api/watchlist-check/:user_id/:movie_id",
  method: "GET",
};
