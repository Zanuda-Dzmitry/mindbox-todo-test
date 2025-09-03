import React from "react";
import { Task } from "../Todo";
import "./TodoForm.scss";

interface TodoFormProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onAddTask: (task: Task) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({
  inputValue,
  onInputChange,
  onAddTask,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
    };

    onAddTask(newTask);
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          placeholder="Введите задачу..."
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
        />
        <button type="submit">Добавить</button>
      </form>
    </>
  );
};

export default TodoForm;
