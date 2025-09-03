import { Task } from "../Todo";
import "./TodoCard.scss";

// Компонент карточки
const TaskCard = ({
  tasks,
  isEmptyMessage,
  position,
  onToggleTask,
  onClick,
}: {
  tasks: Task[];
  isEmptyMessage: string;
  position: number;
  onToggleTask: (id: number) => void;
  onClick: () => void;
}) => {
  return (
    <div
      className={`task-card position-${position}`}
      onClick={onClick}
      style={{ zIndex: 10 - position }}
    >
      <ul className="task-list">
        {tasks.length === 0 ? (
          <li>{isEmptyMessage}</li>
        ) : (
          tasks.map((task) => (
            <li key={task.id} className="task-item">
              <label
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                }}
              >
                <input
                  type="checkbox"
                  className="round-checkbox"
                  checked={task.completed}
                  onChange={(e) => {
                    e.stopPropagation();
                    onToggleTask(task.id);
                  }}
                />
                {task.text}
              </label>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TaskCard;
