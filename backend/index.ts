import express, { Application } from "express";
import { createModules } from "./modules/entryPoint";
import cors from "cors";
import http from "http";

const app = express();
const port = 9999;
//cors
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["POST", "GET", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

createModules(app);

app.on("error", (app: Application) => {
  console.group("Error initializing server");
  console.groupEnd();
});

const server = http.createServer(app);

server.on("error", (error) => {
  console.log("Error initializing server", error);
});

server.on("listening", () => {
  console.log(`Server is running on http://localhost:${port}`);
});

server.listen(port);
