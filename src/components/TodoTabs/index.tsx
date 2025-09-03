import { ViewType } from "../Todo";
import "./TodoTabs.scss";

// Компонент переключателей
const ViewTabs = ({
  currentView,
  onViewChange,
}: {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}) => {
  const views: { value: ViewType; label: string }[] = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <div className="tabs">
      {views.map((view) => (
        <button
          key={view.value}
          className={currentView === view.value ? "active" : ""}
          onClick={() => onViewChange(view.value)}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
};

export default ViewTabs;
