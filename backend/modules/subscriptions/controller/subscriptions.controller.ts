import express from "express";
import { subscriptionsService } from "../service/subscriptions.service";

export const subscriptionsRouter = express.Router();

// Create a new subscription
subscriptionsRouter.post("/create", async (req, res): Promise<any> => {
  try {
    const data = req.body;
    const result = await subscriptionsService.createSubscription(
      data.userId,
      data.newsletterId
    );

    return res.status(201).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

subscriptionsRouter.delete("/delete/:id", async (req, res): Promise<any> => {
  try {
    const { id } = req.params;

    const result = await subscriptionsService.deleteSubscription(id);

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

subscriptionsRouter.get("/:id", async (req, res): Promise<any> => {
  try {
    const { id } = req.params;

    const subscription = await subscriptionsService.getSubscriptionById(id);

    if (!subscription) {
      return res.status(204).send([]);
    }

    return res.status(200).send(subscription);
  } catch (error) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

subscriptionsRouter.get("/", async (req, res): Promise<any> => {
  try {
    const subscriptions = await subscriptionsService.getSubscriptions();

    return res.status(200).send(subscriptions);
  } catch (error) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

subscriptionsRouter.get(
  "/recipient/:recipientId",
  async (req, res): Promise<any> => {
    try {
      const { recipientId } = req.params;

      const subscriptions =
        await subscriptionsService.getSubscriptionsByRecipientId(recipientId);

      if (!subscriptions || subscriptions.length === 0) {
        return res.status(204).send([]);
      }

      return res.status(200).send(subscriptions);
    } catch (error) {
      return res.status(500).send({ error: "Internal Server Error" });
    }
  }
);

subscriptionsRouter.get(
  "/newsletter/:newsletterId",
  async (req, res): Promise<any> => {
    try {
      const { newsletterId } = req.params;

      const subscriptions =
        await subscriptionsService.getSubscriptionsByNewsletterId(newsletterId);

      if (!subscriptions || subscriptions.length === 0) {
        return res.status(204).send([]);
      }

      return res.status(200).send(subscriptions);
    } catch (error) {
      return res.status(500).send({ error: "Internal Server Error" });
    }
  }
);

subscriptionsRouter.get("/email/:email", async (req, res): Promise<any> => {
  try {
    const { email } = req.params;

    const subscriptions = await subscriptionsService.getSubscriptionsByEmail(
      email
    );

    if (!subscriptions || subscriptions.length === 0) {
      return res.status(200).send([]);
    }

    return res.status(200).send(subscriptions);
  } catch (error) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
});
