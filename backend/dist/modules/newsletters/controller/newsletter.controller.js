"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsletterRouter = void 0;
const express_1 = __importDefault(require("express"));
const newsletter_service_1 = require("../service/newsletter.service");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ dest: "uploads/" });
exports.newsletterRouter = express_1.default.Router();
exports.newsletterRouter.get("/", async (req, res) => {
    try {
        const newsletters = await newsletter_service_1.newsletterService.getNewsletters();
        console.log(newsletters);
        if (!newsletters || newsletters.length === 0) {
            return res.status(200).send([]);
        }
        return res.status(200).send(newsletters);
    }
    catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.newsletterRouter.post("/new", async (req, res) => {
    const data = req.body;
    await newsletter_service_1.newsletterService.createNewsletter(data);
    res.status(200).send("New newsletter created");
});
exports.newsletterRouter.post("/subscribe/:newsletterId", (req, res) => {
    const { newsletterId } = req.params;
    newsletter_service_1.newsletterService.subscribeToNewsletter(newsletterId);
    res.status(200).send(`Subscribed to newsletter with ID: ${newsletterId}`);
});
exports.newsletterRouter.post("/entry/:newsletterid", upload.single("file"), async (req, res) => {
    const data = req.body;
    data.handleAsHtml = data.handleAsHtml === "true";
    await newsletter_service_1.newsletterService.createNewsletterEntry({
        title: data.title,
        content: data.content,
        newsletterId: req.params.newsletterid,
        file: req.file,
        htmlContent: data.handleAsHtml,
    });
    res.status(201).send("Newsletter entry created");
});
exports.newsletterRouter.post("/send/:entryId", (req, res) => {
    const { entryId } = req.params;
    newsletter_service_1.newsletterService.sendNewsletterEntry(entryId);
    res.status(200).send(`Newsletter entry with ID: ${entryId} sent`);
});
//# sourceMappingURL=newsletter.controller.js.map