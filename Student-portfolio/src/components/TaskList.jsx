import TaskCard from "./TaskCard";
import { Button } from "@/components/ui/button";
import { Arrow } from "@/components/Decor";

function TaskList({
  tasks = [],
  onToggleStatus,
  onEdit,
  onDelete,
  updatingTaskId,
  deletingTaskId,
  onCreateNew,
}) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="my-6 border-[3px] border-dashed border-ink bg-paper p-10 text-center sm:p-16">
        <p aria-hidden="true" className="font-display text-5xl text-coral">
          +
        </p>
        <h3 className="text-card-title mt-5">No tasks found</h3>
        <p className="mx-auto mt-3 max-w-sm text-ink/70">
          Try changing your filter settings or create a brand new task.
        </p>
        {onCreateNew && (
          <Button onClick={onCreateNew} className="mt-7">
            Create First Task <Arrow />
          </Button>
        )}
      </div>
    );
  }

  return (
    <ul className="mt-4 grid list-none grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {tasks.map((task) => {
        const id = task._id || task.id;
        return (
          <li key={id} className="h-full">
            <TaskCard
              task={task}
              onToggleStatus={onToggleStatus}
              onEdit={onEdit}
              onDelete={onDelete}
              isUpdating={updatingTaskId === id}
              isDeleting={deletingTaskId === id}
            />
          </li>
        );
      })}
    </ul>
  );
}

export default TaskList;
