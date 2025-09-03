import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import TodoForm from "../TodoForm";

describe("Компонент TodoForm", () => {
  // Мокаем функции-обработчики
  const mockOnAddTask = vi.fn(); // функция добавления задачи
  const mockOnInputChange = vi.fn(); // функция обработки ввода

  // Очищаем моки перед каждым тестом
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Отображает форму с полем ввода и кнопкой", () => {
    render(
      <TodoForm
        inputValue=""
        onInputChange={mockOnInputChange}
        onAddTask={mockOnAddTask}
      />
    );

    expect(
      screen.getByPlaceholderText("Введите задачу...")
    ).toBeInTheDocument();
    expect(screen.getByText("Добавить")).toBeInTheDocument();
  });

  test("Вызывает onInputChange при вводе текста", async () => {
    const user = userEvent.setup();
    render(
      <TodoForm
        inputValue=""
        onInputChange={mockOnInputChange}
        onAddTask={mockOnAddTask}
      />
    );

    const input = screen.getByPlaceholderText("Введите задачу...");
    await user.type(input, "test");

    // Проверяем, что функция вызвалась 4 раза (по количеству символов)
    expect(mockOnInputChange).toHaveBeenCalledTimes(4);
  });

  test("Вызывает onAddTask с новой задачей при отправке", async () => {
    const user = userEvent.setup();
    render(
      <TodoForm
        inputValue="Test task"
        onInputChange={mockOnInputChange}
        onAddTask={mockOnAddTask}
      />
    );

    const button = screen.getByText("Добавить");
    await user.click(button);

    // Проверяем, что задача передана с нужными параметрами
    expect(mockOnAddTask).toHaveBeenCalledWith({
      id: expect.any(Number),
      text: "Test task",
      completed: false,
    });
  });

  test("Не вызывает onAddTask при пустом вводе", async () => {
    const user = userEvent.setup();
    render(
      <TodoForm
        inputValue=""
        onInputChange={mockOnInputChange}
        onAddTask={mockOnAddTask}
      />
    );

    const button = screen.getByText("Добавить");
    await user.click(button);

    expect(mockOnAddTask).not.toHaveBeenCalled();
  });
});
