import type { Config } from "@netlify/functions";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";

export default async (req: Request) => {
  const { email, password } = await req.json();

  if (!email || !password) {
    return Response.json(
      { message: "Missing required fields: email, password" },
      { status: 400 },
    );
  }

  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) {
    return Response.json({ message: "User not found" }, { status: 400 });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return Response.json({ message: "Wrong password" }, { status: 400 });
  }

  return Response.json({
    token: randomUUID(),
    user: { id: user.id, name: user.name, email: user.email },
  });
};

export const config: Config = {
  path: "/api/login",
  method: "POST",
};
