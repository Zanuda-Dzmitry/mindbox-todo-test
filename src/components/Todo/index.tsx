import { useState, useEffect } from "react";
import TaskCard from "../TodoCard";
import ViewTabs from "../TodoTabs";
import TodoForm from "../TodoForm";
import "./Todo.scss";

export type Task = {
  id: number;
  text: string;
  completed: boolean;
};

export type ViewType = "all" | "active" | "completed";

const STORAGE_KEY = "todo-tasks";

// Функция для загрузки задач из localStorage
const loadTasksFromStorage = (): Task[] => {
  try {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    return storedTasks ? JSON.parse(storedTasks) : [];
  } catch (error) {
    console.error("Error loading tasks from localStorage:", error);
    return [];
  }
};

// Функция для сохранения задач в localStorage
const saveTasksToStorage = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error);
  }
};

const Todo = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [view, setView] = useState<ViewType>("all");

  // Загрузка задач из localStorage при монтировании компонента
  useEffect(() => {
    const storedTasks = loadTasksFromStorage();
    if (storedTasks.length > 0) {
      setTasks(storedTasks);
    }
  }, []);

  // Сохранение задач в localStorage при изменении
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
    setInputValue("");
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  // Фильтрация задач
  const filteredTasks = {
    all: tasks,
    active: tasks.filter((task) => !task.completed),
    completed: tasks.filter((task) => task.completed),
  };

  // Определяем позиции карточек в стопке
  const getCardPosition = (cardView: ViewType): number => {
    const views: ViewType[] = ["all", "active", "completed"];
    const currentIndex = views.indexOf(view);
    const cardIndex = views.indexOf(cardView);

    // Позиция 0 - верхняя, 1 - средняя, 2 - нижняя
    return (cardIndex - currentIndex + 3) % 3;
  };

  const remainingCount = filteredTasks.active.length;

  return (
    <div className="app">
      <h1>todos</h1>

      <TodoForm
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onAddTask={addTask}
      />

      <div className="cards-stack">
        <TaskCard
          tasks={filteredTasks.all}
          isEmptyMessage="Нет задач"
          position={getCardPosition("all")}
          onToggleTask={toggleTask}
          onClick={() => setView("all")}
        />

        <TaskCard
          tasks={filteredTasks.active}
          isEmptyMessage="Нет невыполненных задач"
          position={getCardPosition("active")}
          onToggleTask={toggleTask}
          onClick={() => setView("active")}
        />

        <TaskCard
          tasks={filteredTasks.completed}
          isEmptyMessage="Нет выполненных задач"
          position={getCardPosition("completed")}
          onToggleTask={toggleTask}
          onClick={() => setView("completed")}
        />

        <div className="nav">
          <p>{remainingCount} items left</p>
          <ViewTabs currentView={view} onViewChange={setView} />

          {filteredTasks.completed.length > 0 && (
            <button onClick={clearCompleted} className="clear-btn">
              Clear completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Todo;
