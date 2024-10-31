"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionSchema = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const recipient_schema_1 = require("./recipient.schema");
const newsletter_schema_1 = require("./newsletter.schema");
exports.subscriptionSchema = (0, pg_core_1.pgTable)("subscriptions", {
    id: (0, pg_core_1.uuid)()
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    recipientId: (0, pg_core_1.uuid)().references(() => recipient_schema_1.recipientSchema.id),
    newsletterId: (0, pg_core_1.uuid)().references(() => newsletter_schema_1.newsletterSchema.id),
    createdAt: (0, pg_core_1.date)().notNull().defaultNow(),
    updatedAt: (0, pg_core_1.date)().notNull().defaultNow(),
});
//# sourceMappingURL=subscription.schema.js.map