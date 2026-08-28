import type { Config } from "@netlify/functions";
import { and, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { watchlist } from "../../db/schema.js";

export default async (req: Request) => {
  const { user_id, movie_id } = await req.json();

  if (!user_id || !movie_id) {
    return Response.json(
      { message: "Missing required fields: user_id, movie_id" },
      { status: 400 },
    );
  }

  await db
    .delete(watchlist)
    .where(and(eq(watchlist.userId, user_id), eq(watchlist.movieId, movie_id)));

  return Response.json({ message: "Removed from watchlist" });
};

export const config: Config = {
  path: "/api/remove-watchlist",
  method: "POST",
};
