import { sql } from "drizzle-orm";
import {
  pgTable,
  integer,
  PrimaryKey,
  char,
  uuid,
  varchar,
  date,
  boolean,
} from "drizzle-orm/pg-core";

export const recipientSchema = pgTable("recipients", {
  id: uuid()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar({ length: 50 }),
  email: varchar({ length: 255 }).notNull(),
  subscribed: boolean()
    .notNull()
    .default(sql`false`),
  subscriptionChangedAt: date(),
});
