import { Repository } from "typeorm";
import { Task } from "../entities/Task";
import { AppDataSource } from "../data-source";
import { injectable } from "tsyringe";

@injectable()
export class TaskRepository {
    private ormRepository: Repository<Task>;
    constructor() { this.ormRepository = AppDataSource.getRepository(Task); }
    async create(data: { title: string }): Promise<Task> {
        const task = this.ormRepository.create(data);
        return this.ormRepository.save(task);
    }
    async findAll(): Promise<Task[]> { return this.ormRepository.find(); }
}
