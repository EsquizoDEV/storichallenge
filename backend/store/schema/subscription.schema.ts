import { sql } from "drizzle-orm";
import { date, pgTable, uuid } from "drizzle-orm/pg-core";
import { recipientSchema } from "./recipient.schema";
import { newsletterSchema } from "./newsletter.schema";

export const subscriptionSchema = pgTable("subscriptions", {
  id: uuid()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  recipientId: uuid().references(() => recipientSchema.id),
  newsletterId: uuid().references(() => newsletterSchema.id),
  createdAt: date().notNull().defaultNow(),
  updatedAt: date().notNull().defaultNow(),
});
