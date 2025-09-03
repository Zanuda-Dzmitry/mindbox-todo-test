import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoTabs from "../TodoTabs";

describe("Компонент ViewTabs", () => {
  // Мокаем функцию смены представления
  const mockOnViewChange = vi.fn();

  // Очищаем моки перед каждым тестом
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Отображает все вкладки фильтра", () => {
    render(<TodoTabs currentView="all" onViewChange={mockOnViewChange} />);

    expect(screen.getByText("All")).toBeInTheDocument(); // вкладка "Все"
    expect(screen.getByText("Active")).toBeInTheDocument(); // вкладка "Активные"
    expect(screen.getByText("Completed")).toBeInTheDocument(); // вкладка "Завершённые"
  });

  test("Выделяет текущую активную вкладку", () => {
    render(<TodoTabs currentView="active" onViewChange={mockOnViewChange} />);

    const activeButton = screen.getByText("Active");
    expect(activeButton).toHaveClass("active"); // проверка наличия класса активности
  });

  test("Вызывает onViewChange при клике на вкладку", async () => {
    const user = userEvent.setup();
    render(<TodoTabs currentView="all" onViewChange={mockOnViewChange} />);

    const completedButton = screen.getByText("Completed");
    await user.click(completedButton);

    expect(mockOnViewChange).toHaveBeenCalledWith("completed"); // ожидаем вызов с аргументом "completed"
  });
});
