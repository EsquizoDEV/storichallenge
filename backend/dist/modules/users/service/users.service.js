"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const init_1 = require("../../../store/init"); // Adjust the path as needed
const users_schema_1 = require("../../../store/schema/users.schema");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UsersService {
    constructor() { }
    async createUser(name, email, password, role) {
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const [user] = await init_1.db
            .insert(users_schema_1.users)
            .values({
            name,
            email,
            password: hashedPassword,
            role,
        })
            .returning({
            id: users_schema_1.users.id,
            name: users_schema_1.users.name,
            email: users_schema_1.users.email,
            role: users_schema_1.users.role,
        });
        return user;
    }
    async getUserById(id) {
        const [user] = await init_1.db
            .select()
            .from(users_schema_1.users)
            .where((0, drizzle_orm_1.sql) `${users_schema_1.users.id} = ${id}`);
        return user || null;
    }
    async getUserByEmail(email) {
        const [user] = await init_1.db
            .select()
            .from(users_schema_1.users)
            .where((0, drizzle_orm_1.sql) `${users_schema_1.users.email} = ${email}`);
        return user || null;
    }
    async updateUser(id, name, email, password, role) {
        const updateData = {};
        if (name)
            updateData.name = name;
        if (email)
            updateData.email = email;
        if (password)
            updateData.password = await bcryptjs_1.default.hash(password, 10);
        if (role)
            updateData.role = role;
        const [updatedUser] = await init_1.db
            .update(users_schema_1.users)
            .set(updateData)
            .where((0, drizzle_orm_1.sql) `${users_schema_1.users.id} = ${id}`)
            .returning();
        return updatedUser || null;
    }
    async deleteUser(id) {
        const result = await init_1.db.delete(users_schema_1.users).where((0, drizzle_orm_1.sql) `${users_schema_1.users.id} = ${id}`);
        if (result.rowCount) {
            return result.rowCount > 0;
        }
        return false;
    }
    async getUsers() {
        const usersList = await init_1.db.select().from(users_schema_1.users);
        return usersList;
    }
}
exports.usersService = new UsersService();
//# sourceMappingURL=users.service.js.map