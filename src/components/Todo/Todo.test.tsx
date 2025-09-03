import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import Todo from "../Todo";

describe("Компонент Todo", () => {
  // Мокаем localStorage для изоляции тестов
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
      length: 0,
      key: vi.fn(),
    };
  })();

  // Перед каждым тестом очищаем DOM и localStorage
  beforeEach(() => {
    cleanup();
    localStorageMock.clear();

    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      configurable: true,
    });
  });

  test("Отображает приложение Todo", () => {
    render(<Todo />);
    expect(screen.getByText("todos")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Введите задачу...")
    ).toBeInTheDocument();
  });

  test("Добавляет новую задачу", async () => {
    const user = userEvent.setup();
    render(<Todo />);

    const input = screen.getByPlaceholderText("Введите задачу...");
    const button = screen.getByText("Добавить");

    await user.type(input, "Тестовая задача");
    await user.click(button);

    const tasks = screen.getAllByText("Тестовая задача");
    expect(tasks.length).toBeGreaterThan(0);
  });

  test("Переключает статус выполнения задачи", async () => {
    const user = userEvent.setup();
    render(<Todo />);

    const input = screen.getByPlaceholderText("Введите задачу...");
    const button = screen.getByText("Добавить");
    await user.type(input, "Тестовая задача");
    await user.click(button);

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);

    expect(checkboxes[0]).toBeChecked();
  });

  test("Очищает выполненные задачи", async () => {
    const user = userEvent.setup();
    render(<Todo />);

    const input = screen.getByPlaceholderText("Введите задачу...");
    const addButton = screen.getByText("Добавить");
    await user.type(input, "Тестовая задача");
    await user.click(addButton);

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);

    const clearButton = screen.getByText("Clear completed");
    await user.click(clearButton);

    expect(screen.queryByText("Тестовая задача")).not.toBeInTheDocument();
  });

  test("Загружает задачи из localStorage", () => {
    const testTasks = [{ id: 1, text: "Сохранённая задача", completed: false }];
    localStorage.setItem("todo-tasks", JSON.stringify(testTasks));

    render(<Todo />);

    const taskElements = screen.getAllByText("Сохранённая задача");
    expect(taskElements.length).toBeGreaterThan(0);
  });

  test("Сохраняет задачи в localStorage", async () => {
    const user = userEvent.setup();
    render(<Todo />);

    const input = screen.getByPlaceholderText("Введите задачу...");
    const button = screen.getByText("Добавить");
    await user.type(input, "Тестовая задача");
    await user.click(button);

    const savedTasks = JSON.parse(localStorage.getItem("todo-tasks") || "[]");
    expect(savedTasks).toHaveLength(1);
    expect(savedTasks[0].text).toBe("Тестовая задача");
  });
});
