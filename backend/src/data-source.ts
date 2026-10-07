import "reflect-metadata";
import { DataSource } from "typeorm";
import { Task } from "./entities/Task";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "todolist",
    synchronize: true,
    logging: false,
    entities: [Task],
    subscribers: [],
    migrations: [],
});
