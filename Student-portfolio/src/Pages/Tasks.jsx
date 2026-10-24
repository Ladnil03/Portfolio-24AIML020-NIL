import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import * as taskService from "../services/taskService";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import TaskStats from "../components/TaskStats";
import TaskList from "../components/TaskList";
import TaskModal from "../components/TaskModal";
import Toast from "../components/Toast";
import PageHeader from "../components/PageHeader";
import { Button } from "../components/ui/button";
import { Arrow } from "../components/Decor";
import { lazyWithMinDelay } from "../utils/lazyWithMinDelay";
import EventMonitorDrawer from "../components/EventMonitorDrawer";

// Heavy third-party component (Recharts) lazy-loaded on demand with min-delay
const TaskAnalyticsChart = lazy(
  lazyWithMinDelay(() => import("../components/TaskAnalyticsChart"), 300)
);

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  // Per-task Action Loading State
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  // Delete Confirmation State
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Toast Notification State
  const [toast, setToast] = useState(null);

  // Toggle state to conditionally mount/load the heavy chart component
  const [showCharts, setShowCharts] = useState(false);

  // Event Monitor Drawer State (Event-Driven Architecture)
  const [isEventDrawerOpen, setIsEventDrawerOpen] = useState(false);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await taskService.fetchTasks();
      setTasks(data);
    } catch (err) {
      setFetchError(err.message || "Failed to connect to MongoDB backend");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch on mount. The rule flags the synchronous setState inside
  // loadTasks, but this is the intended async-fetch pattern.
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Handle Create or Update submission from Modal (with Optimistic UI for Create)
  const handleModalSubmit = async (formData) => {
    if (editingTask) {
      // Edit Mode (PUT)
      setModalLoading(true);
      setModalError(null);
      try {
        const id = editingTask._id || editingTask.id;
        const updatedTask = await taskService.updateTask(id, formData);
        setTasks((prev) =>
          prev.map((t) => ((t._id || t.id) === id ? updatedTask : t))
        );
        showToast("✓ Task updated successfully in MongoDB!", "success");
        setIsModalOpen(false);
        setEditingTask(null);
      } catch (err) {
        setModalError(err.message || "Operation failed. Please try again.");
        showToast(`✕ Failed to update task: ${err.message || "Error"}`, "error");
      } finally {
        setModalLoading(false);
      }
    } else {
      // Optimistic Create Mode
      const tempId = `temp-${Date.now()}`;
      const optimisticTask = {
        _id: tempId,
        id: tempId,
        title: formData.title,
        description: formData.description || "",
        priority: formData.priority || "medium",
        completed: Boolean(formData.completed),
        createdAt: new Date().toISOString(),
        isOptimistic: true, // Show syncing state in UI immediately
      };

      // 1. Instantly display task in the list before server confirms
      setTasks((prev) => [optimisticTask, ...prev]);

      // 2. Immediately close modal
      setIsModalOpen(false);
      setEditingTask(null);

      // 3. Show notification
      showToast("⏳ Adding task (syncing with MongoDB...)", "info");

      // 4. Send API request to persist in MongoDB
      try {
        const createdTask = await taskService.createTask(formData);
        // Replace optimistic placeholder with real MongoDB doc
        setTasks((prev) =>
          prev.map((t) => (t._id === tempId ? createdTask : t))
        );
        showToast("✓ Task created and persisted in MongoDB!", "success");
      } catch (err) {
        // Rollback optimistic task on failure
        setTasks((prev) => prev.filter((t) => t._id !== tempId));
        showToast(
          `✕ Failed to save task: ${err.message || "Network error"}`,
          "error"
        );
      }
    }
  };

  // Quick toggle status (completed / pending) with Toast feedback
  const handleToggleStatus = useCallback(async (task) => {
    const id = task._id || task.id;
    const newStatus = !task.completed;

    setUpdatingTaskId(id);
    try {
      const updatedTask = await taskService.patchTask(id, {
        completed: newStatus,
      });
      setTasks((prev) =>
        prev.map((t) => ((t._id || t.id) === id ? updatedTask : t))
      );
      showToast(
        newStatus ? "✓ Task marked as completed!" : "✓ Task marked as pending.",
        "success"
      );
    } catch (err) {
      showToast(`✕ Failed to update task status: ${err.message || "Error"}`, "error");
    } finally {
      setUpdatingTaskId(null);
    }
  }, [showToast]);

  // Open Edit Modal
  const handleOpenEdit = useCallback((task) => {
    setEditingTask(task);
    setModalError(null);
    setIsModalOpen(true);
  }, []);

  // Set Task to Delete
  const handleDeleteRequest = useCallback((task) => {
    setTaskToDelete(task);
  }, []);

  // Open Create Modal
  const handleOpenCreate = useCallback(() => {
    setEditingTask(null);
    setModalError(null);
    setIsModalOpen(true);
  }, []);

  // Confirm and Execute Task Deletion with Toast feedback
  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    const id = taskToDelete._id || taskToDelete.id;

    setDeletingTaskId(id);
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => (t._id || t.id) !== id));
      showToast("✓ Task permanently deleted from MongoDB!", "success");
      setTaskToDelete(null);
    } catch (err) {
      showToast(`✕ Failed to delete task: ${err.message || "Error"}`, "error");
    } finally {
      setDeletingTaskId(null);
    }
  };

  // Filter and Sort Tasks
  const filteredTasks = tasks
    .filter((task) => {
      // Search Query filter (matches title or description)
      const matchesSearch =
        task.title?.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase().trim());

      // Status filter
      let matchesStatus = true;
      if (statusFilter === "completed") {
        matchesStatus = Boolean(task.completed);
      } else if (statusFilter === "pending") {
        matchesStatus = !task.completed;
      }

      // Priority filter
      let matchesPriority = true;
      if (priorityFilter !== "all") {
        matchesPriority = (task.priority || "").toLowerCase() === priorityFilter;
      }

      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      if (sortBy === "priority") {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        return (
          (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0)
        );
      }
      return 0;
    });

  return (
    <>
      {/* Toast Feedback Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      <PageHeader
        index="10"
        label="Task management"
        title="Tasks"
        lede="Manage tasks in real time backed by your Node.js + Express REST API and MongoDB Atlas database."
      >
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-2.5 border-[3px] border-ink bg-sky px-4 py-2.5 label-mono shadow-brutal-xs">
            <span className="size-2.5 animate-blink bg-ink" aria-hidden="true" />
            Connected to Node.js &amp; MongoDB
          </span>
          <Button
            variant="outline"
            onClick={() => setIsEventDrawerOpen(true)}
            className="border-[3px] border-ink bg-yellow text-ink shadow-brutal-xs hover:bg-yellow/90"
          >
            <span className="size-2 rounded-full bg-red-600 animate-pulse mr-1" />
            ⚡ Event Stream &amp; Async Jobs
          </Button>
          <Button onClick={handleOpenCreate}>
            New Task <Arrow />
          </Button>
        </div>
      </PageHeader>

      <section className="bg-paper">
        <div className="mx-auto w-full max-w-[1400px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          {/* Initial Loading Spinner */}
          {isLoading && <Spinner message="Fetching tasks from MongoDB..." />}

          {/* Initial Fetch Error Display with Retry */}
          {!isLoading && fetchError && (
            <ErrorMessage
              title="Backend Connection Error"
              message={fetchError}
              onRetry={loadTasks}
            />
          )}

          {/* Main Content Area */}
          {!isLoading && !fetchError && (
            <>
              {/* Stats Overview */}
              <TaskStats tasks={tasks} />

              {/* Toggle Button for Heavy Third-Party Chart Component (Recharts) */}
              <div className="mb-6 flex justify-end">
                <Button
                  variant={showCharts ? "accent" : "outline"}
                  size="sm"
                  onClick={() => setShowCharts((prev) => !prev)}
                >
                  {showCharts ? "Hide Visual Analytics" : "Show Visual Analytics"}
                </Button>
              </div>

              {/* Lazy-Loaded Heavy Third-Party Component with Minimum-Delay Fallback */}
              {showCharts && (
                <div className="mb-8 border-[3px] border-ink bg-paper shadow-brutal">
                  <Suspense
                    fallback={
                      <Spinner message="Loading Recharts data visualization bundle..." />
                    }
                  >
                    <TaskAnalyticsChart tasks={tasks} />
                  </Suspense>
                </div>
              )}

              {/* Search and Filters Bar */}
              <div className="mb-8 flex flex-col gap-4 border-[3px] border-ink bg-paper p-4 shadow-brutal sm:p-5 lg:flex-row lg:items-center">
                <div className="flex-1">
                  <label htmlFor="task-search" className="sr-only">
                    Search tasks by title or description
                  </label>
                  <input
                    id="task-search"
                    type="search"
                    placeholder="Search tasks by title or description…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border-[3px] border-ink bg-paper px-4 py-3 text-[0.95rem] placeholder:text-ink/35 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-coral"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    aria-label="Filter tasks by status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border-[3px] border-ink bg-paper px-3 py-3 label-mono"
                  >
                    <option value="all">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>

                  <select
                    aria-label="Filter tasks by priority"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="border-[3px] border-ink bg-paper px-3 py-3 label-mono"
                  >
                    <option value="all">All priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>

                  <select
                    aria-label="Sort tasks"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border-[3px] border-ink bg-paper px-3 py-3 label-mono"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="priority">By priority</option>
                  </select>

                  {(searchQuery || statusFilter !== "all" || priorityFilter !== "all") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                        setPriorityFilter("all");
                      }}
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </div>

              {/* Task Grid / List */}
              <TaskList
                tasks={filteredTasks}
                onToggleStatus={handleToggleStatus}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteRequest}
                updatingTaskId={updatingTaskId}
                deletingTaskId={deletingTaskId}
                onCreateNew={handleOpenCreate}
              />
            </>
          )}
        </div>
      </section>

      {/* Create / Edit Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          if (!modalLoading) {
            setIsModalOpen(false);
            setEditingTask(null);
          }
        }}
        onSubmit={handleModalSubmit}
        initialData={editingTask}
        isLoading={modalLoading}
        error={modalError}
      />

      {/* Delete Confirmation Dialog */}
      {taskToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-ink/70 p-5"
          onClick={(e) => {
            if (e.target === e.currentTarget && deletingTaskId === null) {
              setTaskToDelete(null);
            }
          }}
        >
          <div className="animate-rise w-full max-w-lg border-[3px] border-ink bg-coral p-7 text-center shadow-brutal-xl sm:p-9">
            <span
              aria-hidden="true"
              className="font-display text-4xl leading-none text-ink"
            >
              ✕
            </span>
            <h3 id="delete-dialog-title" className="text-card-title mt-5">
              Delete task?
            </h3>
            <p className="mx-auto mt-4 max-w-sm leading-relaxed text-ink/85">
              Are you sure you want to permanently delete{" "}
              <strong>&ldquo;{taskToDelete.title}&rdquo;</strong> from MongoDB? This
              action cannot be undone.
            </p>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
              <Button
                variant="outline"
                onClick={() => setTaskToDelete(null)}
                disabled={deletingTaskId !== null}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                disabled={deletingTaskId !== null}
              >
                {deletingTaskId !== null ? "Deleting..." : "Yes, Delete Task"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Event-Driven Architecture (EDA) & Background Jobs Drawer */}
      <EventMonitorDrawer
        isOpen={isEventDrawerOpen}
        onClose={() => setIsEventDrawerOpen(false)}
      />
    </>
  );
}

export default Tasks;
