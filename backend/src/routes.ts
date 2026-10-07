import { Router } from "express";
import { TaskController } from "./controllers/TaskController";
export const router = Router();
const taskController = new TaskController();
router.post("/tasks", taskController.create);
router.get("/tasks", taskController.list);
