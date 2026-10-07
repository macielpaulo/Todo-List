import { injectable, inject } from "tsyringe";
import { TaskRepository } from "../repositories/TaskRepository";
import { CreateTaskDTO } from "../dtos/TaskDTO";

@injectable()
export class TaskService {
    constructor(@inject("TaskRepository") private taskRepository: TaskRepository) {}
    async createTask(data: CreateTaskDTO) {
        if (!data.title) throw new Error("Title is required");
        return this.taskRepository.create(data);
    }
    async listTasks() { return this.taskRepository.findAll(); }
}
