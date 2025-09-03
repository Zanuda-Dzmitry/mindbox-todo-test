import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoCard from "../TodoCard";
import { Task } from "../Todo";

describe("Компонент TaskCard", () => {
  // Мокаем функции-обработчики
  const mockOnToggleTask = vi.fn(); // для переключения статуса задачи
  const mockOnClick = vi.fn(); // для клика по карточке

  // Тестовые задачи
  const testTasks: Task[] = [
    { id: 1, text: "Тестовая задача 1", completed: false },
    { id: 2, text: "Тестовая задача 2", completed: true },
  ];

  // Перед каждым тестом очищаем моки
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Отображает список задач", () => {
    render(
      <TodoCard
        tasks={testTasks}
        isEmptyMessage="Нет задач"
        position={0}
        onToggleTask={mockOnToggleTask}
        onClick={mockOnClick}
      />
    );

    expect(screen.getByText("Тестовая задача 1")).toBeInTheDocument();
    expect(screen.getByText("Тестовая задача 2")).toBeInTheDocument();
  });

  test("Показывает сообщение при отсутствии задач", () => {
    render(
      <TodoCard
        tasks={[]}
        isEmptyMessage="Задачи отсутствуют"
        position={0}
        onToggleTask={mockOnToggleTask}
        onClick={mockOnClick}
      />
    );

    expect(screen.getByText("Задачи отсутствуют")).toBeInTheDocument();
  });

  test("Вызывает onToggleTask при клике на чекбокс", async () => {
    const user = userEvent.setup();
    render(
      <TodoCard
        tasks={testTasks}
        isEmptyMessage="Нет задач"
        position={0}
        onToggleTask={mockOnToggleTask}
        onClick={mockOnClick}
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);

    expect(mockOnToggleTask).toHaveBeenCalledWith(1); // ID первой задачи
  });

  test("Вызывает onClick при клике на карточку", async () => {
    const user = userEvent.setup();
    render(
      <TodoCard
        tasks={testTasks}
        isEmptyMessage="Нет задач"
        position={0}
        onToggleTask={mockOnToggleTask}
        onClick={mockOnClick}
      />
    );

    const card = screen.getByRole("list");
    await user.click(card);

    expect(mockOnClick).toHaveBeenCalled();
  });

  test("Отображает выполненные задачи с зачёркнутым текстом", () => {
    render(
      <TodoCard
        tasks={testTasks}
        isEmptyMessage="Нет задач"
        position={0}
        onToggleTask={mockOnToggleTask}
        onClick={mockOnClick}
      />
    );

    const completedTask = screen.getByText("Тестовая задача 2");
    expect(completedTask).toHaveStyle("text-decoration: line-through");
  });
});
