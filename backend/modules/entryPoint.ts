import { Application } from "express";
import { newsletterRouter } from "./newsletters/controller/newsletter.controller";
import { recipientsRouter } from "./recipients/controller/recipients.controller";
import { subscriptionsRouter } from "./subscriptions/controller/subscriptions.controller";
import { authRouter } from "./auth/controller/auth.controller";

export const createModules = (app: Application) => {
  app.use("/auth", authRouter);
  app.use("/newsletters", newsletterRouter);
  app.use("/recipients", recipientsRouter);
  app.use("/subscriptions", subscriptionsRouter);
};
