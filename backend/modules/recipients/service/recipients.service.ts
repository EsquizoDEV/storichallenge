import { sql } from "drizzle-orm";
import { db } from "../../../store/init";
import { recipientSchema } from "../../../store/schema/recipient.schema";
import e from "express";

export interface Recipient {
  id: string;
  name: string | null;
  email: string;
  subscribed: boolean | null;
  subscriptionChangedAt: string | null;
}

export class RecipientsService {
  constructor() {}

  async createRecipient(
    createRecipientDto: Omit<
      Recipient,
      "id" | "name" | "subscriptionChangedAt"
    >,
    returning?: boolean
  ) {
    const buildQuery = () => {
      if (returning) {
        return db
          .insert(recipientSchema)
          .values({
            email: createRecipientDto.email,
          })
          .returning();
      }

      return db.insert(recipientSchema).values({
        email: createRecipientDto.email,
      });
    };
    const result = await buildQuery();
    return result;
  }

  async createMassiveRecipients(recipients: Omit<Recipient, "id">[]) {
    const newRecipients = await db.insert(recipientSchema).values(
      recipients.map((recipient) => ({
        email: recipient.email,
      }))
    );
    return newRecipients;
  }

  async deleteRecipient(recipient: any) {
    const result = await db
      .delete(recipientSchema)
      .where(sql`${recipientSchema.id} = ${recipient.id}`);

    return result;
  }

  async getRecipients() {
    const recipients = await db.select().from(recipientSchema);
    return recipients;
  }

  async getRecipientById(id: string) {
    const recipient = await db
      .select()
      .from(recipientSchema)
      .where(sql`${recipientSchema.id} = ${id}`);
    return recipient;
  }

  async getRecipientByEmail(email: string) {
    const [recipient] = await db
      .select()
      .from(recipientSchema)
      .where(sql`${recipientSchema.email} = ${email}`);
    return recipient;
  }

  async updateRecipient(recipient: Recipient) {
    const result = await db
      .update(recipientSchema)
      .set({
        email: recipient.email,
        name: recipient.name,
      })
      .where(sql`${recipientSchema.id} = ${recipient.id}`);

    return result;
  }
}

export const recipientsService = new RecipientsService();
