import "reflect-metadata";
import express from "express";
import request from "supertest";
import { container } from "tsyringe";

import { taskRoutes } from "../task.routes";
import type { ITaskRepository } from "../../repositories/TaskRepository";
import type { Task } from "../../entities/Task";

const buildRepositoryMock = () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const buildApp = () => {
  const app = express();
  app.use(express.json());
  // Mesmo prefixo usado em src/index.ts (app.use("/tasks", taskRoutes)).
  app.use("/tasks", taskRoutes);
  return app;
};

describe("Rotas de tarefas (integracao)", () => {
  let app: express.Express;
  let repository: ReturnType<typeof buildRepositoryMock>;

  beforeEach(() => {
    repository = buildRepositoryMock();
    // Integra rota -> controller -> service reais, substituindo apenas a
    // camada de persistencia (repositorio) por um mock.
    container.registerInstance(
      "TaskRepository",
      repository as unknown as ITaskRepository
    );
    app = buildApp();
  });

  describe("POST /tasks", () => {
    it("cria a tarefa e responde 201", async () => {
      const created = { id: "1", title: "Comprar leite", completed: false };
      repository.create.mockResolvedValue(created);

      const res = await request(app)
        .post("/tasks")
        .send({ title: "Comprar leite" });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(created);
      expect(repository.create).toHaveBeenCalledWith({ title: "Comprar leite" });
    });

    it("responde 400 quando o titulo e invalido", async () => {
      const res = await request(app).post("/tasks").send({});

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Title is required" });
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe("GET /tasks", () => {
    it("responde 200 com a lista de tarefas", async () => {
      const tasks = [
        { id: "1", title: "A" },
        { id: "2", title: "B" },
      ];
      repository.findAll.mockResolvedValue(tasks);

      const res = await request(app).get("/tasks");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(tasks);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /tasks/:id", () => {
    it("responde 200 com a tarefa encontrada", async () => {
      const task = { id: "abc", title: "Detalhe" };
      repository.findById.mockResolvedValue(task);

      const res = await request(app).get("/tasks/abc");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(task);
      expect(repository.findById).toHaveBeenCalledWith("abc");
    });

    it("responde 404 quando a tarefa nao existe", async () => {
      repository.findById.mockResolvedValue(null);

      const res = await request(app).get("/tasks/inexistente");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Task not found" });
    });
  });

  describe("PUT /tasks/:id", () => {
    it("atualiza a tarefa e responde 200", async () => {
      const updated = { id: "abc", title: "Editada" };
      repository.update.mockResolvedValue(updated);

      const res = await request(app)
        .put("/tasks/abc")
        .send({ title: "Editada" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(updated);
      expect(repository.update).toHaveBeenCalledWith("abc", { title: "Editada" });
    });

    it("responde 404 quando a tarefa nao existe", async () => {
      repository.update.mockResolvedValue(null);

      const res = await request(app)
        .put("/tasks/inexistente")
        .send({ title: "Editada" });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Task not found" });
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("remove a tarefa e responde 204", async () => {
      repository.delete.mockResolvedValue(undefined);

      const res = await request(app).delete("/tasks/abc");

      expect(res.status).toBe(204);
      expect(repository.delete).toHaveBeenCalledWith("abc");
    });
  });
});
