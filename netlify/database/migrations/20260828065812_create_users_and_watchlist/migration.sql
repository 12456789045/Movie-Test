CREATE TABLE "users" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "watchlist" (
	"id" serial PRIMARY KEY,
	"user_id" integer NOT NULL,
	"movie_id" integer NOT NULL,
	"movie_title" text,
	"movie_poster" text,
	"added_at" timestamp DEFAULT now(),
	CONSTRAINT "unique_user_movie" UNIQUE("user_id","movie_id")
);
--> statement-breakpoint
ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;