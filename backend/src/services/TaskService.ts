import { injectable, inject } from "tsyringe";
import { ITaskRepository } from "../repositories/TaskRepository";
import { Task } from "../entities/Task";

@injectable()
export class TaskService {
    constructor(@inject("TaskRepository") private taskRepository: ITaskRepository) {}

    async createTask(data: { title: string; completed?: boolean }): Promise<Task> {
        if (!data.title) throw new Error("Title is required");
        return this.taskRepository.create(data);
    }

    async listTasks(): Promise<Task[]> { 
        return this.taskRepository.findAll(); 
    }

    async getTaskById(id: string): Promise<Task | null> {
        return this.taskRepository.findById(id);
    }

    async updateTask(id: string, data: Partial<Task>): Promise<Task | null> {
        return this.taskRepository.update(id, data);
    }

    async deleteTask(id: string): Promise<void> {
        return this.taskRepository.delete(id);
    }
}
