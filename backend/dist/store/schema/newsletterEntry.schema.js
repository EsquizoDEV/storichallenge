"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsletterEntry = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const newsletter_schema_1 = require("./newsletter.schema");
const drizzle_orm_1 = require("drizzle-orm");
exports.newsletterEntry = (0, pg_core_1.pgTable)("newsletter_entry", {
    id: (0, pg_core_1.uuid)()
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    title: (0, pg_core_1.varchar)({ length: 50 }).notNull(),
    content: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    newsletterId: (0, pg_core_1.uuid)("newsletter_id")
        .notNull()
        .references(() => newsletter_schema_1.newsletterSchema.id),
    attachmentKey: (0, pg_core_1.varchar)({ length: 255 }),
    sent: (0, pg_core_1.boolean)("sent").notNull().default(false),
    schedule: (0, pg_core_1.date)("schedule"),
    crea1tedAt: (0, pg_core_1.date)("created_at").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.date)("updated_at").notNull().defaultNow(),
    deletedAt: (0, pg_core_1.date)("deleted_at"),
    scheduledAt: (0, pg_core_1.date)("scheduled_at"),
});
//# sourceMappingURL=newsletterEntry.schema.js.map