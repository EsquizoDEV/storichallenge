"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id")
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    name: (0, pg_core_1.varchar)({
        length: 50,
    }),
    email: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    password: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    role: (0, pg_core_1.varchar)({ length: 50 }).notNull(),
});
//# sourceMappingURL=users.schema.js.map