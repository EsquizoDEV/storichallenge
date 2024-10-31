"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionsService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const init_1 = require("../../../store/init");
const subscription_schema_1 = require("../../../store/schema/subscription.schema");
const recipient_schema_1 = require("../../../store/schema/recipient.schema");
const newsletter_schema_1 = require("../../../store/schema/newsletter.schema");
const users_schema_1 = require("../../../store/schema/users.schema");
const recipients_service_1 = require("../../recipients/service/recipients.service");
class SubscriptionsService {
    constructor() { }
    async createSubscription(userId, newsletterId) {
        // find users that match the userid and join with the recipient schema
        console.log("userId", userId);
        const [user] = await init_1.db
            .select()
            .from(users_schema_1.users)
            .leftJoin(recipient_schema_1.recipientSchema, (0, drizzle_orm_1.sql) `${users_schema_1.users.email} = ${recipient_schema_1.recipientSchema.email}`)
            .where((0, drizzle_orm_1.sql) `${users_schema_1.users.id} = ${userId}`);
        console.log("user", user);
        let recipient;
        // if the user is not a recipient create a new recipient with the user email
        if (!user.recipients) {
            console.log("creating recipient");
            await recipients_service_1.recipientsService.createRecipient({
                email: user.users.email,
                subscribed: true,
            });
            recipient = await recipients_service_1.recipientsService.getRecipientByEmail(user.users.email);
        }
        else {
            recipient = user.recipients;
        }
        console.log("recipient", recipient);
        console.log("newsletterId", newsletterId);
        const subscription = await init_1.db.insert(subscription_schema_1.subscriptionSchema).values({
            recipientId: recipient.id,
            newsletterId,
        });
        console.log("subscription", subscription);
        return subscription;
    }
    async deleteSubscription(id) {
        const result = await init_1.db
            .delete(subscription_schema_1.subscriptionSchema)
            .where((0, drizzle_orm_1.sql) `${subscription_schema_1.subscriptionSchema.id} = ${id}`);
        if (result.rowCount) {
            return result.rowCount > 0;
        }
    }
    async getSubscriptionById(id) {
        const subscription = await init_1.db
            .select()
            .from(subscription_schema_1.subscriptionSchema)
            .where((0, drizzle_orm_1.sql) `${subscription_schema_1.subscriptionSchema.id} = ${id}`);
        return subscription || null;
    }
    async getSubscriptions() {
        const subscriptions = await init_1.db.select().from(subscription_schema_1.subscriptionSchema);
        const [totalSubscriptions] = await init_1.db
            .select({ countDistinct: (0, drizzle_orm_1.countDistinct)(subscription_schema_1.subscriptionSchema.newsletterId) })
            .from(subscription_schema_1.subscriptionSchema);
        const percentageByNewsletter = await init_1.db
            .select({
            newsletterId: subscription_schema_1.subscriptionSchema.newsletterId,
            newsletterTitle: newsletter_schema_1.newsletterSchema.title,
            count: (0, drizzle_orm_1.countDistinct)(subscription_schema_1.subscriptionSchema.recipientId),
        })
            .from(subscription_schema_1.subscriptionSchema)
            .leftJoin(newsletter_schema_1.newsletterSchema, (0, drizzle_orm_1.sql) `${subscription_schema_1.subscriptionSchema.newsletterId} = ${newsletter_schema_1.newsletterSchema.id}`)
            .groupBy(subscription_schema_1.subscriptionSchema.newsletterId, newsletter_schema_1.newsletterSchema.title);
        const total = percentageByNewsletter.reduce((acc, item) => acc + item.count, 0);
        const percentage = percentageByNewsletter.map((item) => ({
            newsletterId: item.newsletterId,
            newsletterTitle: item.newsletterTitle,
            count: item.count,
            percentage: (item.count / total) * 100,
        }));
        console.log("percentage", percentage);
        return {
            subscriptions,
            stats: {
                totalSubscriptions: totalSubscriptions.countDistinct,
                percentage,
            },
        };
    }
    async getSubscriptionsByRecipientId(recipientId) {
        const subscriptions = await init_1.db
            .select()
            .from(subscription_schema_1.subscriptionSchema)
            .where((0, drizzle_orm_1.sql) `${subscription_schema_1.subscriptionSchema.recipientId} = ${recipientId}`);
        return subscriptions;
    }
    async getSubscriptionsByNewsletterId(newsletterId) {
        const subscriptions = await init_1.db
            .select()
            .from(subscription_schema_1.subscriptionSchema)
            .where((0, drizzle_orm_1.sql) `${subscription_schema_1.subscriptionSchema.newsletterId} = ${newsletterId}`);
        return subscriptions;
    }
    async getSubscriptionsByEmail(email) {
        const subscriptions = await init_1.db
            .select()
            .from(subscription_schema_1.subscriptionSchema)
            .leftJoin(recipient_schema_1.recipientSchema, (0, drizzle_orm_1.sql) `${subscription_schema_1.subscriptionSchema.recipientId} = ${recipient_schema_1.recipientSchema.id}`)
            .where((0, drizzle_orm_1.sql) `recipients.email = ${email}`);
        return subscriptions;
    }
}
exports.subscriptionsService = new SubscriptionsService();
//# sourceMappingURL=subscriptions.service.js.map