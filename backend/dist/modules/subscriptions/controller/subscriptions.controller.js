"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionsRouter = void 0;
const express_1 = __importDefault(require("express"));
const subscriptions_service_1 = require("../service/subscriptions.service");
exports.subscriptionsRouter = express_1.default.Router();
// Create a new subscription
exports.subscriptionsRouter.post("/create", async (req, res) => {
    try {
        const data = req.body;
        const result = await subscriptions_service_1.subscriptionsService.createSubscription(data.userId, data.newsletterId);
        return res.status(201).send(result);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.subscriptionsRouter.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await subscriptions_service_1.subscriptionsService.deleteSubscription(id);
        return res.status(200).send(result);
    }
    catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.subscriptionsRouter.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const subscription = await subscriptions_service_1.subscriptionsService.getSubscriptionById(id);
        if (!subscription) {
            return res.status(204).send([]);
        }
        return res.status(200).send(subscription);
    }
    catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.subscriptionsRouter.get("/", async (req, res) => {
    try {
        const subscriptions = await subscriptions_service_1.subscriptionsService.getSubscriptions();
        return res.status(200).send(subscriptions);
    }
    catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.subscriptionsRouter.get("/recipient/:recipientId", async (req, res) => {
    try {
        const { recipientId } = req.params;
        const subscriptions = await subscriptions_service_1.subscriptionsService.getSubscriptionsByRecipientId(recipientId);
        if (!subscriptions || subscriptions.length === 0) {
            return res.status(204).send([]);
        }
        return res.status(200).send(subscriptions);
    }
    catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.subscriptionsRouter.get("/newsletter/:newsletterId", async (req, res) => {
    try {
        const { newsletterId } = req.params;
        const subscriptions = await subscriptions_service_1.subscriptionsService.getSubscriptionsByNewsletterId(newsletterId);
        if (!subscriptions || subscriptions.length === 0) {
            return res.status(204).send([]);
        }
        return res.status(200).send(subscriptions);
    }
    catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.subscriptionsRouter.get("/email/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const subscriptions = await subscriptions_service_1.subscriptionsService.getSubscriptionsByEmail(email);
        if (!subscriptions || subscriptions.length === 0) {
            return res.status(200).send([]);
        }
        return res.status(200).send(subscriptions);
    }
    catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
//# sourceMappingURL=subscriptions.controller.js.map