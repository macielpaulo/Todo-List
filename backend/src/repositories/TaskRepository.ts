import { Repository } from "typeorm";
import { Task } from "../entities/Task";
import { AppDataSource } from "../data-source";
import { injectable } from "tsyringe";

export interface ITaskRepository {
    create(data: { title: string; completed?: boolean }): Promise<Task>;
    findAll(): Promise<Task[]>;
    findById(id: string): Promise<Task | null>;
    update(id: string, data: Partial<Task>): Promise<Task | null>;
    delete(id: string): Promise<void>;
}

@injectable()
export class TaskRepository implements ITaskRepository {
    private ormRepository: Repository<Task>;

    constructor() { 
        this.ormRepository = AppDataSource.getRepository(Task); 
    }

    async create(data: { title: string; completed?: boolean }): Promise<Task> {
        const task = this.ormRepository.create(data);
        return this.ormRepository.save(task);
    }

    async findAll(): Promise<Task[]> { 
        return this.ormRepository.find(); 
    }

    async findById(id: string): Promise<Task | null> {
        return this.ormRepository.findOne({ where: { id } });
    }

    async update(id: string, data: Partial<Task>): Promise<Task | null> {
        await this.ormRepository.update(id, data);
        return this.findById(id);
    }

    async delete(id: string): Promise<void> {
        await this.ormRepository.delete(id);
    }
}
