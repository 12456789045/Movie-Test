import type { Config } from "@netlify/functions";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";

export default async (req: Request) => {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return Response.json(
      { message: "Missing required fields: name, email, password" },
      { status: 400 },
    );
  }

  const [existing] = await db.select().from(users).where(eq(users.email, email));
  if (existing) {
    return Response.json({ message: "Email already registered" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.insert(users).values({ name, email, password: hashedPassword });

  return Response.json({ message: "User registered" });
};

export const config: Config = {
  path: "/api/register",
  method: "POST",
};
