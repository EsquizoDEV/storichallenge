"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsletterSchema = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
exports.newsletterSchema = (0, pg_core_1.pgTable)("newsletter", {
    id: (0, pg_core_1.uuid)()
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    title: (0, pg_core_1.varchar)("title", { length: 50 }).notNull(),
    description: (0, pg_core_1.varchar)("description", { length: 255 }),
    imageKey: (0, pg_core_1.varchar)("image_key", { length: 255 }),
});
//# sourceMappingURL=newsletter.schema.js.map