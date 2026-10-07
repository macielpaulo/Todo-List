import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import { taskRoutes } from "./routes/task.routes";
import "./container"; // This imports the DI container setup

AppDataSource.initialize().then(() => {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use("/tasks", taskRoutes);
    app.listen(3000, () => console.log("Server running on port 3000"));
}).catch(error => console.log(error));
