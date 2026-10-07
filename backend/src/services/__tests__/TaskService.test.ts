import "reflect-metadata";
import { TaskService } from "../TaskService";
import type { ITaskRepository } from "../../repositories/TaskRepository";
import type { Task } from "../../entities/Task";

const buildRepositoryMock = () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe("TaskService", () => {
  let repository: ReturnType<typeof buildRepositoryMock>;
  let service: TaskService;

  beforeEach(() => {
    repository = buildRepositoryMock();
    // O TaskService recebe o repositorio por injecao de dependencia; no teste
    // de unidade passamos um mock para isolar a camada de persistencia.
    service = new TaskService(repository as unknown as ITaskRepository);
  });

  describe("createTask", () => {
    it("lanca erro quando o titulo esta vazio e nao chama o repositorio", async () => {
      await expect(service.createTask({ title: "" })).rejects.toThrow(
        "Title is required"
      );
      expect(repository.create).not.toHaveBeenCalled();
    });

    it("repassa os dados ao repositorio e retorna a tarefa criada", async () => {
      const data = { title: "Nova tarefa", completed: false };
      const created = { id: "1", ...data, createdAt: new Date() } as Task;
      repository.create.mockResolvedValue(created);

      await expect(service.createTask(data)).resolves.toBe(created);
      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith(data);
    });
  });

  describe("listTasks", () => {
    it("retorna a lista vinda do repositorio", async () => {
      const tasks = [{ id: "1" }, { id: "2" }] as Task[];
      repository.findAll.mockResolvedValue(tasks);

      await expect(service.listTasks()).resolves.toBe(tasks);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("getTaskById", () => {
    it("busca a tarefa pelo id no repositorio", async () => {
      const task = { id: "abc-123" } as Task;
      repository.findById.mockResolvedValue(task);

      await expect(service.getTaskById("abc-123")).resolves.toBe(task);
      expect(repository.findById).toHaveBeenCalledWith("abc-123");
    });

    it("retorna null quando a tarefa nao existe", async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.getTaskById("inexistente")).resolves.toBeNull();
    });
  });

  describe("updateTask", () => {
    it("repassa id e dados ao repositorio e retorna a tarefa atualizada", async () => {
      const updated = { id: "abc-123", title: "Editada" } as Task;
      repository.update.mockResolvedValue(updated);

      await expect(
        service.updateTask("abc-123", { title: "Editada" })
      ).resolves.toBe(updated);
      expect(repository.update).toHaveBeenCalledWith("abc-123", {
        title: "Editada",
      });
    });
  });

  describe("deleteTask", () => {
    it("remove a tarefa pelo id no repositorio", async () => {
      repository.delete.mockResolvedValue(undefined);

      await expect(service.deleteTask("abc-123")).resolves.toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith("abc-123");
    });
  });
});
