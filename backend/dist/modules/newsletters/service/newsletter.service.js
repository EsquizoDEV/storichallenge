"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsletterService = void 0;
const newsletter_schema_1 = require("../../../store/schema/newsletter.schema");
const init_1 = require("../../../store/init");
const newsletterEntry_schema_1 = require("../../../store/schema/newsletterEntry.schema");
const drizzle_orm_1 = require("drizzle-orm");
const subscriptions_service_1 = require("../../subscriptions/service/subscriptions.service");
const recipients_service_1 = require("../../recipients/service/recipients.service");
const email_service_1 = require("../../email/service/email.service");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const fs_1 = __importDefault(require("fs"));
const s3 = new aws_sdk_1.default.S3();
class NewsletterServiceClass {
    constructor() { }
    async getNewsletters() {
        const newsletters = await init_1.db.select().from(newsletter_schema_1.newsletterSchema);
        return newsletters;
    }
    async getNewsletterById(id) {
        const [newsletter] = await init_1.db
            .select()
            .from(newsletter_schema_1.newsletterSchema)
            .where((0, drizzle_orm_1.sql) `${newsletter_schema_1.newsletterSchema.id} = ${id}`);
        return newsletter;
    }
    async createNewsletter(createNewsletterDto) {
        const { title, description, imageKey } = createNewsletterDto;
        try {
            await init_1.db.insert(newsletter_schema_1.newsletterSchema).values({
                description,
                imageKey,
                title,
            });
            console.log("Newsletter created successfully");
        }
        catch (error) {
            console.error("Error creating newsletter:", error);
        }
    }
    async createNewsletterEntry(createNewsletterEntryDto) {
        const { newsletterId, title, content, htmlContent } = createNewsletterEntryDto;
        try {
            let fileUrl = null;
            if (createNewsletterEntryDto.file) {
                const file = createNewsletterEntryDto.file;
                const fileContent = fs_1.default.readFileSync(file.path);
                const params = {
                    Bucket: "storichallengeluis",
                    Key: `${Date.now()}_${file.originalname}`,
                    Body: fileContent,
                    ContentType: file.mimetype,
                };
                const uploadResult = await s3.upload(params).promise();
                fileUrl = uploadResult.Location;
            }
            await init_1.db.insert(newsletterEntry_schema_1.newsletterEntry).values({
                newsletterId,
                title,
                content,
                attachmentKey: fileUrl,
            });
            console.log("Newsletter entry created successfully");
            const subscribers = await subscriptions_service_1.subscriptionsService.getSubscriptionsByNewsletterId(newsletterId);
            console.log("Subscribers:", subscribers);
            if (!subscribers || subscribers.length === 0) {
                return;
            }
            Promise.all(subscribers.map(async (subscriber) => await recipients_service_1.recipientsService.getRecipientById(subscriber.recipientId)))
                .then(async (recipients) => {
                console.log("Recipients:", recipients);
                const [recps] = recipients;
                const emails = recps.map((recp) => recp.email);
                await email_service_1.emailService.sendEmail(emails, title, content, fileUrl, htmlContent, newsletterId);
            })
                .catch((error) => {
                console.error("Error sending newsletter entry:", error);
            });
        }
        catch (error) {
            console.error("Error creating newsletter entry:", error);
        }
    }
    subscribeToNewsletter(newsletterId) { }
    sendNewsletterEntry(entryId) { }
}
exports.newsletterService = new NewsletterServiceClass();
//# sourceMappingURL=newsletter.service.js.map