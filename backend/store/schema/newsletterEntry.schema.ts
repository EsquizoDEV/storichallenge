import {
  boolean,
  char,
  date,
  pgTable,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { newsletterSchema } from "./newsletter.schema";
import { sql } from "drizzle-orm";

export const newsletterEntry = pgTable("newsletter_entry", {
  id: uuid()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: varchar({ length: 50 }).notNull(),
  content: varchar({ length: 255 }).notNull(),
  newsletterId: uuid("newsletter_id")
    .notNull()
    .references(() => newsletterSchema.id),
  attachmentKey: varchar({ length: 255 }),
  sent: boolean("sent").notNull().default(false),
  schedule: date("schedule"),
  crea1tedAt: date("created_at").notNull().defaultNow(),
  updatedAt: date("updated_at").notNull().defaultNow(),
  deletedAt: date("deleted_at"),
  scheduledAt: date("scheduled_at"),
});
