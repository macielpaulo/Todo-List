import { Router } from "express";
import { TaskController } from "../controllers/TaskController";

export const taskRoutes = Router();
const taskController = new TaskController();

taskRoutes.post("/", taskController.create);
taskRoutes.get("/", taskController.list);
taskRoutes.get("/:id", taskController.get);
taskRoutes.put("/:id", taskController.update);
taskRoutes.delete("/:id", taskController.delete);
