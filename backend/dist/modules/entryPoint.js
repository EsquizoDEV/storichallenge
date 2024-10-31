"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModules = void 0;
const newsletter_controller_1 = require("./newsletters/controller/newsletter.controller");
const recipients_controller_1 = require("./recipients/controller/recipients.controller");
const subscriptions_controller_1 = require("./subscriptions/controller/subscriptions.controller");
const auth_controller_1 = require("./auth/controller/auth.controller");
const createModules = (app) => {
    app.use("/auth", auth_controller_1.authRouter);
    app.use("/newsletters", newsletter_controller_1.newsletterRouter);
    app.use("/recipients", recipients_controller_1.recipientsRouter);
    app.use("/subscriptions", subscriptions_controller_1.subscriptionsRouter);
};
exports.createModules = createModules;
//# sourceMappingURL=entryPoint.js.map