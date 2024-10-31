import express from "express";
import { newsletterService } from "../service/newsletter.service";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

export const newsletterRouter = express.Router();

newsletterRouter.get<Promise<any>>("/", async (req, res): Promise<any> => {
  try {
    const newsletters = await newsletterService.getNewsletters();
    console.log(newsletters);
    if (!newsletters || newsletters.length === 0) {
      return res.status(200).send([]);
    }
    return res.status(200).send(newsletters);
  } catch (error) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

newsletterRouter.post("/new", async (req, res) => {
  const data = req.body;
  await newsletterService.createNewsletter(data);
  res.status(200).send("New newsletter created");
});

newsletterRouter.post("/subscribe/:newsletterId", (req, res) => {
  const { newsletterId } = req.params;
  newsletterService.subscribeToNewsletter(newsletterId);
  res.status(200).send(`Subscribed to newsletter with ID: ${newsletterId}`);
});

newsletterRouter.post(
  "/entry/:newsletterid",
  upload.single("file"),
  async (req, res) => {
    const data = req.body;

    data.handleAsHtml = data.handleAsHtml === "true";

    await newsletterService.createNewsletterEntry({
      title: data.title,
      content: data.content,
      newsletterId: req.params.newsletterid,
      file: req.file,
      htmlContent: data.handleAsHtml,
    });
    res.status(201).send("Newsletter entry created");
  }
);

newsletterRouter.post("/send/:entryId", (req, res) => {
  const { entryId } = req.params;
  newsletterService.sendNewsletterEntry(entryId);
  res.status(200).send(`Newsletter entry with ID: ${entryId} sent`);
});
