import "reflect-metadata";
import express from "express";
import "./container"; // Import DI container
import { AppDataSource } from "./data-source";
import { taskRoutes } from "./routes/task.routes";

const app = express();

app.use(express.json());
app.use("/tasks", taskRoutes);

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });
