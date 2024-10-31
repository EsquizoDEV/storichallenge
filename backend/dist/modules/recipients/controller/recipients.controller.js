"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recipientsRouter = void 0;
const express_1 = __importDefault(require("express"));
const recipients_service_1 = require("../service/recipients.service");
exports.recipientsRouter = express_1.default.Router();
exports.recipientsRouter.post("/create", async (req, res) => {
    try {
        const data = req.body;
        const result = await recipients_service_1.recipientsService.createRecipient({
            email: data.email,
            subscribed: true,
        });
        return res.status(201).send(result);
    }
    catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.recipientsRouter.post("/create/many", async (req, res) => {
    try {
        const data = req.body;
        const result = await recipients_service_1.recipientsService.createMassiveRecipients(data);
        return res.status(201).send(result);
    }
    catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.recipientsRouter.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await recipients_service_1.recipientsService.deleteRecipient(id);
        return res.status(200).send(result);
    }
    catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.recipientsRouter.get("/", async (req, res) => {
    try {
        const recipients = await recipients_service_1.recipientsService.getRecipients();
        if (!recipients || recipients.length === 0) {
            return res.status(204);
        }
        return res.status(200).send(recipients);
    }
    catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.recipientsRouter.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const recipient = await recipients_service_1.recipientsService.getRecipientById(id);
        if (!recipient || recipient.length === 0) {
            return res.status(204);
        }
        return res.status(200).send(recipient);
    }
    catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
//# sourceMappingURL=recipients.controller.js.map