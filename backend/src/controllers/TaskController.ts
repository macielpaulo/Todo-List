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

    async get(req: Request, res: Response) {
        const id = req.params.id as string;
        const service = container.resolve(TaskService);
        const task = await service.getTaskById(id);
        if (!task) return res.status(404).json({ error: "Task not found" });
        return res.json(task);
    }

    async update(req: Request, res: Response) {
        const id = req.params.id as string;
        const service = container.resolve(TaskService);
        const task = await service.updateTask(id, req.body);
        if (!task) return res.status(404).json({ error: "Task not found" });
        return res.json(task);
    }

    async delete(req: Request, res: Response) {
        const id = req.params.id as string;
        const service = container.resolve(TaskService);
        await service.deleteTask(id);
        return res.status(204).send();
    }
}
