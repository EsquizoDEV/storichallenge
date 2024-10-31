import { count, countDistinct, QueryPromise, sql } from "drizzle-orm";
import { db } from "../../../store/init";
import { subscriptionSchema } from "../../../store/schema/subscription.schema";
import { recipientSchema } from "../../../store/schema/recipient.schema";
import { newsletterSchema } from "../../../store/schema/newsletter.schema";
import { users } from "../../../store/schema/users.schema";
import {
  Recipient,
  RecipientsService,
  recipientsService,
} from "../../recipients/service/recipients.service";

class SubscriptionsService {
  constructor() {}

  async createSubscription(userId: string, newsletterId: string) {
    // find users that match the userid and join with the recipient schema
    console.log("userId", userId);
    const [user] = await db
      .select()
      .from(users)
      .leftJoin(recipientSchema, sql`${users.email} = ${recipientSchema.email}`)
      .where(sql`${users.id} = ${userId}`);
    console.log("user", user);
    let recipient: Recipient;
    // if the user is not a recipient create a new recipient with the user email
    if (!user.recipients) {
      console.log("creating recipient");
      await recipientsService.createRecipient({
        email: user.users.email,
        subscribed: true,
      });

      recipient = await recipientsService.getRecipientByEmail(user.users.email);
    } else {
      recipient = user.recipients;
    }

    console.log("recipient", recipient);
    console.log("newsletterId", newsletterId);
    const subscription = await db.insert(subscriptionSchema).values({
      recipientId: recipient.id,
      newsletterId,
    });

    console.log("subscription", subscription);
    return subscription;
  }

  async deleteSubscription(id: string) {
    const result = await db
      .delete(subscriptionSchema)
      .where(sql`${subscriptionSchema.id} = ${id}`);
    if (result.rowCount) {
      return result.rowCount > 0;
    }
  }

  async getSubscriptionById(id: string) {
    const subscription = await db
      .select()
      .from(subscriptionSchema)
      .where(sql`${subscriptionSchema.id} = ${id}`);
    return subscription || null;
  }

  async getSubscriptions() {
    const subscriptions = await db.select().from(subscriptionSchema);

    const [totalSubscriptions] = await db
      .select({ countDistinct: countDistinct(subscriptionSchema.newsletterId) })
      .from(subscriptionSchema);

    const percentageByNewsletter = await db
      .select({
        newsletterId: subscriptionSchema.newsletterId,
        newsletterTitle: newsletterSchema.title,
        count: countDistinct(subscriptionSchema.recipientId),
      })
      .from(subscriptionSchema)
      .leftJoin(
        newsletterSchema,
        sql`${subscriptionSchema.newsletterId} = ${newsletterSchema.id}`
      )
      .groupBy(subscriptionSchema.newsletterId, newsletterSchema.title);

    const total = percentageByNewsletter.reduce(
      (acc, item) => acc + item.count,
      0
    );

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

  async getSubscriptionsByRecipientId(recipientId: string) {
    const subscriptions = await db
      .select()
      .from(subscriptionSchema)
      .where(sql`${subscriptionSchema.recipientId} = ${recipientId}`);
    return subscriptions;
  }

  async getSubscriptionsByNewsletterId(newsletterId: string) {
    const subscriptions = await db
      .select()
      .from(subscriptionSchema)
      .where(sql`${subscriptionSchema.newsletterId} = ${newsletterId}`);
    return subscriptions;
  }

  async getSubscriptionsByEmail(email: string) {
    const subscriptions = await db
      .select()
      .from(subscriptionSchema)
      .leftJoin(
        recipientSchema,
        sql`${subscriptionSchema.recipientId} = ${recipientSchema.id}`
      )
      .where(sql`recipients.email = ${email}`);
    return subscriptions;
  }
}

export const subscriptionsService = new SubscriptionsService();
