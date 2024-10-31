import { sql } from "drizzle-orm";
import { char, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const newsletterSchema = pgTable("newsletter", {
  id: uuid()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 50 }).notNull(),
  description: varchar("description", { length: 255 }),
  imageKey: varchar("image_key", { length: 255 }),
});
