import { sql } from "drizzle-orm";
import { db } from "../../../store/init"; // Adjust the path as needed
import { users } from "../../../store/schema/users.schema";
import bcrypt from "bcryptjs";

export interface User {
  id: string;
  name: string | null;
  email: string;
  password: string;
  role: string;
}

class UsersService {
  constructor() {}

  async createUser(
    name: string,
    email: string,
    password: string,
    role: string
  ): Promise<Omit<User, "password">> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      });
    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(sql`${users.id} = ${id}`);
    return user || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(sql`${users.email} = ${email}`);
    return user || null;
  }

  async updateUser(
    id: string,
    name?: string,
    email?: string,
    password?: string,
    role?: string
  ): Promise<User | null> {
    const updateData: Partial<User> = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    if (role) updateData.role = role;

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(sql`${users.id} = ${id}`)
      .returning();
    return updatedUser || null;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(sql`${users.id} = ${id}`);
    if (result.rowCount) {
      return result.rowCount > 0;
    }
    return false;
  }

  async getUsers(): Promise<User[]> {
    const usersList = await db.select().from(users);
    return usersList;
  }
}

export const usersService = new UsersService();
