import nodemailer from "nodemailer";
import dotenv from "dotenv";
import AWS from "aws-sdk";
import axios from "axios";

dotenv.config();

AWS.config.update({
  region: process.env.AWS_REGION || "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN, // Include this if using temporary credentials
});

const s3 = new AWS.S3();

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      SES: new AWS.SES({
        apiVersion: "2010-12-01",
      }),
    });
  }

  async sendEmail(
    email: string | string[],
    subject: string,
    message: string,
    fileUrl?: string | null,
    asHtml = false,
    newsletterId?: string
  ): Promise<void> {
    const destinations = Array.isArray(email) ? email : [email];
    const mailOptions: nodemailer.SendMailOptions = {
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
      const response = await axios.get(fileUrl, {
        responseType: "arraybuffer",
      });
      const fileName = fileUrl.split("/").pop();
      const fileContent = Buffer.from(response.data, "binary");

      mailOptions.attachments = [
        {
          filename: fileName!,
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
    } catch (error) {
      console.error(`Failed to send email to ${email}:`, error);
      throw error;
    }
  }
}

export const emailService = new EmailService();
