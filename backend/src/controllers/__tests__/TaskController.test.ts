import "reflect-metadata";
import { container } from "tsyringe";
import type { Request, Response } from "express";

import { TaskController } from "../TaskController";
import { TaskService } from "../../services/TaskService";

// Isola o controller: o TaskService real depende do TypeORM/banco de dados,
// que nao deve ser carregado em um teste de unidade. A classe abaixo serve
// apenas como "token" para o container de injecao de dependencia.
jest.mock("../../services/TaskService", () => ({
  TaskService: class TaskService {},
}));

type TaskServiceMock = {
  createTask: jest.Mock;
  listTasks: jest.Mock;
};

const buildResponse = () => {
  const res = {
    status: jest.fn(),
    json: jest.fn(),
  };
  // Em Express, status() e json() sao encadeaveis (retornam o proprio res).
  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);
  return res as unknown as Response & {
    status: jest.Mock;
    json: jest.Mock;
  };
};

describe("TaskController", () => {
  let controller: TaskController;
  let service: TaskServiceMock;

  beforeEach(() => {
    service = {
      createTask: jest.fn(),
      listTasks: jest.fn(),
    };
    // Registra o mock no container para que container.resolve(TaskService)
    // devolva exatamente este objeto durante os testes.
    container.registerInstance(TaskService, service as unknown as TaskService);
    controller = new TaskController();
  });

  describe("create", () => {
    it("repassa o body para TaskService.createTask e responde 201 com a tarefa criada", async () => {
      const body = { title: "Estudar testes" };
      const created = { id: "abc-123", title: "Estudar testes" };
      const req = { body } as unknown as Request;
      const res = buildResponse();
      service.createTask.mockResolvedValue(created);

      await controller.create(req, res);

      expect(service.createTask).toHaveBeenCalledTimes(1);
      expect(service.createTask).toHaveBeenCalledWith(body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(created);
    });

    it("responde 400 com a mensagem de erro quando o service falha", async () => {
      const req = { body: {} } as unknown as Request;
      const res = buildResponse();
      service.createTask.mockRejectedValue(new Error("Title is required"));

      await controller.create(req, res);

      expect(service.createTask).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Title is required" });
    });
  });

  describe("list", () => {
    it("delega para TaskService.listTasks e responde com a lista de tarefas", async () => {
      const tasks = [
        { id: "1", title: "Primeira" },
        { id: "2", title: "Segunda" },
      ];
      const req = {} as unknown as Request;
      const res = buildResponse();
      service.listTasks.mockResolvedValue(tasks);

      await controller.list(req, res);

      expect(service.listTasks).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(tasks);
    });

    it("propaga o erro do service (list nao trata excecoes)", async () => {
      const req = {} as unknown as Request;
      const res = buildResponse();
      service.listTasks.mockRejectedValue(new Error("boom"));

      await expect(controller.list(req, res)).rejects.toThrow("boom");
    });
  });
});
