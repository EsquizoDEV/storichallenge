"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recipientSchema = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
exports.recipientSchema = (0, pg_core_1.pgTable)("recipients", {
    id: (0, pg_core_1.uuid)()
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    name: (0, pg_core_1.varchar)({ length: 50 }),
    email: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    subscribed: (0, pg_core_1.boolean)()
        .notNull()
        .default((0, drizzle_orm_1.sql) `false`),
    subscriptionChangedAt: (0, pg_core_1.date)(),
});
//# sourceMappingURL=recipient.schema.js.map