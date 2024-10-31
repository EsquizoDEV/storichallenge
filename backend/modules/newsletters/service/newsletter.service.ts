import { pgTable } from "drizzle-orm/pg-core";
import { CreateNewsLetterDto } from "../dto/createNewsLetter.dto";
import { newsletterSchema } from "../../../store/schema/newsletter.schema";
import { db } from "../../../store/init";
import { newsletterEntry } from "../../../store/schema/newsletterEntry.schema";
import { sql } from "drizzle-orm";
import { subscriptionsService } from "../../subscriptions/service/subscriptions.service";
import { recipientsService } from "../../recipients/service/recipients.service";
import { emailService } from "../../email/service/email.service";
import AWS from "aws-sdk";
import fs from "fs";

const s3 = new AWS.S3();

class NewsletterServiceClass {
  constructor() {}

  async getNewsletters() {
    const newsletters = await db.select().from(newsletterSchema);
    return newsletters;
  }

  async getNewsletterById(id: string) {
    const [newsletter] = await db
      .select()
      .from(newsletterSchema)
      .where(sql`${newsletterSchema.id} = ${id}`);
    return newsletter;
  }

  async createNewsletter(createNewsletterDto: CreateNewsLetterDto) {
    const { title, description, imageKey } = createNewsletterDto;

    try {
      await db.insert(newsletterSchema).values({
        description,
        imageKey,
        title,
      });
      console.log("Newsletter created successfully");
    } catch (error) {
      console.error("Error creating newsletter:", error);
    }
  }

  async createNewsletterEntry(createNewsletterEntryDto: {
    newsletterId: string;
    title: string;
    content: string;
    file?: Express.Multer.File;
    htmlContent?: boolean;
  }) {
    const { newsletterId, title, content, htmlContent } =
      createNewsletterEntryDto;

    try {
      let fileUrl: string | null = null;
      if (createNewsletterEntryDto.file) {
        const file = createNewsletterEntryDto.file;
        const fileContent = fs.readFileSync(file.path);
        const params = {
          Bucket: "storichallengeluis",
          Key: `${Date.now()}_${file.originalname}`,
          Body: fileContent,
          ContentType: file.mimetype,
        };

        const uploadResult = await s3.upload(params).promise();
        fileUrl = uploadResult.Location;
      }

      await db.insert(newsletterEntry).values({
        newsletterId,
        title,
        content,
        attachmentKey: fileUrl,
      });

      console.log("Newsletter entry created successfully");
      const subscribers =
        await subscriptionsService.getSubscriptionsByNewsletterId(newsletterId);
      console.log("Subscribers:", subscribers);
      if (!subscribers || subscribers.length === 0) {
        return;
      }

      Promise.all(
        subscribers.map(
          async (subscriber) =>
            await recipientsService.getRecipientById(subscriber.recipientId!)
        )
      )
        .then(async (recipients) => {
          console.log("Recipients:", recipients);
          const [recps] = recipients;
          const emails = recps.map((recp) => recp.email);
          await emailService.sendEmail(
            emails,
            title,
            content,
            fileUrl,
            htmlContent,
            newsletterId
          );
        })
        .catch((error) => {
          console.error("Error sending newsletter entry:", error);
        });
    } catch (error) {
      console.error("Error creating newsletter entry:", error);
    }
  }

  subscribeToNewsletter(newsletterId: string) {}

  sendNewsletterEntry(entryId: string) {}
}

export const newsletterService = new NewsletterServiceClass();
