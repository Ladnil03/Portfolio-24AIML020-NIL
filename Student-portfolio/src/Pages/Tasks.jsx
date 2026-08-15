import React, { useState, useEffect, useCallback } from "react";
import * as taskService from "../services/taskService";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import TaskStats from "../components/TaskStats";
import TaskList from "../components/TaskList";
import TaskModal from "../components/TaskModal";
import Toast from "../components/Toast";

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

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

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

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Handle Create or Update submission from Modal
  const handleModalSubmit = async (formData) => {
    setModalLoading(true);
    setModalError(null);

    try {
      if (editingTask) {
        const id = editingTask._id || editingTask.id;
        const updatedTask = await taskService.updateTask(id, formData);
        setTasks((prev) =>
          prev.map((t) => ((t._id || t.id) === id ? updatedTask : t))
        );
        showToast("Task updated successfully in MongoDB!", "success");
      } else {
        const createdTask = await taskService.createTask(formData);
        setTasks((prev) => [createdTask, ...prev]);
        showToast("Task created and saved to MongoDB!", "success");
      }
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      setModalError(err.message || "Operation failed. Please try again.");
      showToast(err.message || "Failed to save task", "error");
    } finally {
      setModalLoading(false);
    }
  };

  // Quick toggle status (completed / pending)
  const handleToggleStatus = async (task) => {
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
        newStatus ? "Task marked as completed!" : "Task marked as pending.",
        "success"
      );
    } catch (err) {
      showToast(err.message || "Failed to update task status", "error");
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setModalError(null);
    setIsModalOpen(true);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingTask(null);
    setModalError(null);
    setIsModalOpen(true);
  };

  // Confirm and Execute Task Deletion
  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    const id = taskToDelete._id || taskToDelete.id;

    setDeletingTaskId(id);
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => (t._id || t.id) !== id));
      showToast("Task deleted successfully from MongoDB!", "success");
      setTaskToDelete(null);
    } catch (err) {
      showToast(err.message || "Failed to delete task", "error");
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
    <section
      style={{
        padding: "40px 20px 60px",
        maxWidth: "1150px",
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Toast Feedback Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header Banner */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <h1
          style={{
            fontSize: "40px",
            color: "var(--text-h)",
            marginBottom: "10px",
            fontWeight: "700",
          }}
        >
          Task Management
        </h1>
        <p
          style={{
            fontSize: "17px",
            color: "var(--text)",
            maxWidth: "650px",
            margin: "0 auto 24px",
            lineHeight: "1.6",
          }}
        >
          Manage tasks in real time backed by your Node.js + Express REST API and MongoDB Atlas database.
        </p>

        {/* Live MongoDB Status and Action Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "14px",
            marginTop: "10px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "20px",
              backgroundColor: "rgba(34, 197, 94, 0.12)",
              border: "1px solid rgba(34, 197, 94, 0.35)",
              color: "#22c55e",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#22c55e",
                display: "inline-block",
              }}
            />
            Connected to Node.js & MongoDB
          </div>

          <button
            onClick={handleOpenCreate}
            style={{
              backgroundColor: "#22c55e",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              padding: "12px 22px",
              fontSize: "15px",
              fontWeight: "700",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 14px rgba(34, 197, 94, 0.35)",
              transition: "transform 0.2s ease, background-color 0.2s ease",
            }}
          >
            ➕ New Task
          </button>
        </div>
      </div>

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

          {/* Search and Filters Bar */}
          <div
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "18px 20px",
              marginBottom: "24px",
              boxShadow: "var(--shadow)",
              display: "flex",
              flexWrap: "wrap",
              gap: "14px",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Search Input */}
            <div style={{ flex: "1 1 260px", minWidth: "200px" }}>
              <input
                type="text"
                placeholder="🔍 Search tasks by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  fontSize: "14px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--code-bg)",
                  color: "var(--text-h)",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Filter Controls */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                alignItems: "center",
              }}
            >
              {/* Status Filter */}
              <select
                aria-label="Filter tasks by status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--code-bg)",
                  color: "var(--text-h)",
                  fontSize: "13px",
                  fontWeight: "600",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="all">All Statuses</option>
                <option value="pending">⏳ Pending</option>
                <option value="completed">✅ Completed</option>
              </select>

              {/* Priority Filter */}
              <select
                aria-label="Filter tasks by priority"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--code-bg)",
                  color: "var(--text-h)",
                  fontSize: "13px",
                  fontWeight: "600",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="all">All Priorities</option>
                <option value="high">🔥 High</option>
                <option value="medium">⚡ Medium</option>
                <option value="low">🌱 Low</option>
              </select>

              {/* Sort Order */}
              <select
                aria-label="Sort tasks"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--code-bg)",
                  color: "var(--text-h)",
                  fontSize: "13px",
                  fontWeight: "600",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="newest">⏱️ Newest First</option>
                <option value="oldest">🕰️ Oldest First</option>
                <option value="priority">🔥 By Priority</option>
              </select>

              {(searchQuery || statusFilter !== "all" || priorityFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setPriorityFilter("all");
                  }}
                  style={{
                    backgroundColor: "transparent",
                    color: "var(--text)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "9px 12px",
                    fontSize: "13px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Task Grid / List */}
          <TaskList
            tasks={filteredTasks}
            onToggleStatus={handleToggleStatus}
            onEdit={handleOpenEdit}
            onDelete={(task) => setTaskToDelete(task)}
            updatingTaskId={updatingTaskId}
            deletingTaskId={deletingTaskId}
            onCreateNew={handleOpenCreate}
          />
        </>
      )}

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
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              backgroundColor: "var(--card-bg)",
              borderRadius: "16px",
              border: "2px solid #ef4444",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
              width: "100%",
              maxWidth: "440px",
              padding: "28px",
              boxSizing: "border-box",
              color: "var(--text-h)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "50%",
                backgroundColor: "rgba(239, 68, 68, 0.12)",
                color: "#ef4444",
                fontSize: "26px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              🗑️
            </div>
            <h3 id="delete-dialog-title" style={{ fontSize: "20px", margin: "0 0 10px", fontWeight: "700" }}>
              Delete Task?
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "var(--text)",
                lineHeight: "1.6",
                marginBottom: "24px",
              }}
            >
              Are you sure you want to permanently delete{" "}
              <strong>"{taskToDelete.title}"</strong> from MongoDB? This action cannot be undone.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
              <button
                onClick={() => setTaskToDelete(null)}
                disabled={deletingTaskId !== null}
                style={{
                  padding: "10px 18px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--code-bg)",
                  color: "var(--text-h)",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                disabled={deletingTaskId !== null}
                style={{
                  padding: "10px 22px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#ef4444",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: deletingTaskId !== null ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                }}
              >
                {deletingTaskId !== null && (
                  <div
                    style={{
                      border: "2px solid rgba(255, 255, 255, 0.3)",
                      borderTop: "2px solid #ffffff",
                      borderRadius: "50%",
                      width: "12px",
                      height: "12px",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                )}
                {deletingTaskId !== null ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Tasks;
