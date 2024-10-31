"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recipientsService = exports.RecipientsService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const init_1 = require("../../../store/init");
const recipient_schema_1 = require("../../../store/schema/recipient.schema");
class RecipientsService {
    constructor() { }
    async createRecipient(createRecipientDto, returning) {
        const buildQuery = () => {
            if (returning) {
                return init_1.db
                    .insert(recipient_schema_1.recipientSchema)
                    .values({
                    email: createRecipientDto.email,
                })
                    .returning();
            }
            return init_1.db.insert(recipient_schema_1.recipientSchema).values({
                email: createRecipientDto.email,
            });
        };
        const result = await buildQuery();
        return result;
    }
    async createMassiveRecipients(recipients) {
        const newRecipients = await init_1.db.insert(recipient_schema_1.recipientSchema).values(recipients.map((recipient) => ({
            email: recipient.email,
        })));
        return newRecipients;
    }
    async deleteRecipient(recipient) {
        const result = await init_1.db
            .delete(recipient_schema_1.recipientSchema)
            .where((0, drizzle_orm_1.sql) `${recipient_schema_1.recipientSchema.id} = ${recipient.id}`);
        return result;
    }
    async getRecipients() {
        const recipients = await init_1.db.select().from(recipient_schema_1.recipientSchema);
        return recipients;
    }
    async getRecipientById(id) {
        const recipient = await init_1.db
            .select()
            .from(recipient_schema_1.recipientSchema)
            .where((0, drizzle_orm_1.sql) `${recipient_schema_1.recipientSchema.id} = ${id}`);
        return recipient;
    }
    async getRecipientByEmail(email) {
        const [recipient] = await init_1.db
            .select()
            .from(recipient_schema_1.recipientSchema)
            .where((0, drizzle_orm_1.sql) `${recipient_schema_1.recipientSchema.email} = ${email}`);
        return recipient;
    }
    async updateRecipient(recipient) {
        const result = await init_1.db
            .update(recipient_schema_1.recipientSchema)
            .set({
            email: recipient.email,
            name: recipient.name,
        })
            .where((0, drizzle_orm_1.sql) `${recipient_schema_1.recipientSchema.id} = ${recipient.id}`);
        return result;
    }
}
exports.RecipientsService = RecipientsService;
exports.recipientsService = new RecipientsService();
//# sourceMappingURL=recipients.service.js.map