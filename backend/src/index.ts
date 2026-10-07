import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import { router } from "./routes";
import { container } from "tsyringe";
import { TaskRepository } from "./repositories/TaskRepository";

// Setup DI
container.registerSingleton("TaskRepository", TaskRepository);

AppDataSource.initialize().then(() => {
    const app = express();
    app.use(express.json());
    app.use(router);
    app.listen(3000, () => console.log("Server running on port 3000"));
}).catch(error => console.log(error));
