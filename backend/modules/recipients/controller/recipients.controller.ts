import express from "express";
import { recipientsService } from "../service/recipients.service";

export const recipientsRouter = express.Router();

recipientsRouter.post("/create", async (req, res): Promise<any> => {
  try {
    const data = req.body;

    const result = await recipientsService.createRecipient({
      email: data.email,
      subscribed: true,
    });

    return res.status(201).send(result);
  } catch (error) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

recipientsRouter.post("/create/many", async (req, res): Promise<any> => {
  try {
    const data = req.body;

    const result = await recipientsService.createMassiveRecipients(data);

    return res.status(201).send(result);
  } catch (error) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

recipientsRouter.delete("/delete/:id", async (req, res): Promise<any> => {
  try {
    const { id } = req.params;

    const result = await recipientsService.deleteRecipient(id);

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

recipientsRouter.get("/", async (req, res): Promise<any> => {
  try {
    const recipients = await recipientsService.getRecipients();

    if (!recipients || recipients.length === 0) {
      return res.status(204);
    }

    return res.status(200).send(recipients);
  } catch (error) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

recipientsRouter.get("/:id", async (req, res): Promise<any> => {
  try {
    const { id } = req.params;

    const recipient = await recipientsService.getRecipientById(id);

    if (!recipient || recipient.length === 0) {
      return res.status(204);
    }

    return res.status(200).send(recipient);
  } catch (error) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
});
