"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const entryPoint_1 = require("./modules/entryPoint");
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const app = (0, express_1.default)();
const port = 9999;
//cors
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["POST", "GET", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
(0, entryPoint_1.createModules)(app);
app.on("error", (app) => {
    console.group("Error initializing server");
    console.groupEnd();
});
const server = http_1.default.createServer(app);
server.on("error", (error) => {
    console.log("Error initializing server", error);
});
server.on("listening", () => {
    console.log(`Server is running on http://localhost:${port}`);
});
server.listen(port);
//# sourceMappingURL=index.js.map