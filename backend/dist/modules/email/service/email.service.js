"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
aws_sdk_1.default.config.update({
    region: process.env.AWS_REGION || "us-east-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN, // Include this if using temporary credentials
});
const s3 = new aws_sdk_1.default.S3();
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            SES: new aws_sdk_1.default.SES({
                apiVersion: "2010-12-01",
            }),
        });
    }
    async sendEmail(email, subject, message, fileUrl, asHtml = false, newsletterId) {
        const destinations = Array.isArray(email) ? email : [email];
        const mailOptions = {
            from: "luismtzesq@gmail.com", // sender address
            to: destinations,
            subject: subject,
            text: message,
        };
        if (asHtml) {
            mailOptions.html = message;
        }
        if (fileUrl && asHtml) {
            if (fileUrl.match(/\.(jpeg|jpg|gif|png)$/)) {
                mailOptions.html += `<img src="${fileUrl}" alt="Image" style="max-width: 100%; height: auto;">`;
            }
        }
        if (fileUrl && !asHtml) {
            const response = await axios_1.default.get(fileUrl, {
                responseType: "arraybuffer",
            });
            const fileName = fileUrl.split("/").pop();
            const fileContent = Buffer.from(response.data, "binary");
            mailOptions.attachments = [
                {
                    filename: fileName,
                    content: fileContent,
                },
            ];
        }
        // add unsubscribe link
        if (newsletterId) {
            if (asHtml) {
                mailOptions.html += `<br><br><a href="${process.env.FRONTEND_URL}/unsubscribe/?newsletterId=${newsletterId}">Unsubscribe</a>`;
            }
            mailOptions.text += `\n\nUnsubscribe: ${process.env.FRONTEND_URL}/unsubscribe/?newsletterId=${newsletterId}`;
        }
        try {
            console.log(mailOptions);
            await this.transporter.sendMail(mailOptions);
            console.log(`Email sent to ${email}`);
        }
        catch (error) {
            console.error(`Failed to send email to ${email}:`, error);
            throw error;
        }
    }
}
exports.EmailService = EmailService;
exports.emailService = new EmailService();
//# sourceMappingURL=email.service.js.map