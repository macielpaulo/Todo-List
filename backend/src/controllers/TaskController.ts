import { Request, Response } from "express";
import { container } from "tsyringe";
import { TaskService } from "../services/TaskService";

export class TaskController {
    async create(req: Request, res: Response) {
        const service = container.resolve(TaskService);
        try {
            const task = await service.createTask(req.body);
            return res.status(201).json(task);
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }
    async list(req: Request, res: Response) {
        const service = container.resolve(TaskService);
        const tasks = await service.listTasks();
        return res.json(tasks);
    }
}
