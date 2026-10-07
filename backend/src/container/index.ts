import "reflect-metadata";
import { container } from "tsyringe";
import { ITaskRepository, TaskRepository } from "../repositories/TaskRepository";

container.registerSingleton<ITaskRepository>(
    "TaskRepository",
    TaskRepository
);
