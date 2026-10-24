import { useState, useEffect } from "react";
import * as eventService from "../services/eventService";
import { Button } from "./ui/button";
import { CornerMarks } from "./Decor";

const EVENT_BADGE_COLORS = {
  "task:created": "bg-yellow text-ink",
  "task:updated": "bg-sky text-ink",
  "task:status_changed": "bg-emerald-400 text-ink",
  "task:deleted": "bg-coral text-ink",
  "task:high_priority_alert": "bg-red-500 text-white font-bold animate-pulse",
  "notification:dispatched": "bg-purple-300 text-ink",
  "job:enqueued": "bg-blue-300 text-ink",
  "job:started": "bg-amber-300 text-ink",
  "job:progress": "bg-sky text-ink",
  "job:completed": "bg-emerald-300 text-ink",
  "job:failed": "bg-red-400 text-white",
  "user:registered": "bg-pink-300 text-ink",
  "user:logged_in": "bg-indigo-300 text-ink",
};

export default function EventMonitorDrawer({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("events"); // 'events' | 'jobs' | 'telemetry'
  const [streamStatus, setStreamStatus] = useState("connecting"); // 'connected' | 'connecting' | 'error'
  const [events, setEvents] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);
  const [jobToast, setJobToast] = useState(null);

  // Subscribe to real-time SSE event stream
  useEffect(() => {
    if (!isOpen) return;

    setStreamStatus("connecting");
    const unsubscribe = eventService.subscribeToEventStream(
      (eventData) => {
        setStreamStatus("connected");

        // Ignore internal keep-alive handshake if needed, or record it
        if (eventData.type === "connection:open") {
          return;
        }

        // Prepend new event to stream list (keep max 30)
        setEvents((prev) => [
          {
            ...eventData,
            receivedAt: new Date().toLocaleTimeString(),
          },
          ...prev.slice(0, 29),
        ]);

        // If the event is a job progress/completion event, update activeJobs state
        if (eventData.type?.startsWith("job:")) {
          const payload = eventData.payload || {};
          setActiveJobs((prevJobs) => {
            const index = prevJobs.findIndex((j) => j.id === payload.jobId);
            if (index !== -1) {
              const updated = [...prevJobs];
              updated[index] = {
                ...updated[index],
                status: eventData.type === "job:completed" ? "completed" : eventData.type === "job:failed" ? "failed" : "processing",
                progress: payload.progress !== undefined ? payload.progress : updated[index].progress,
                progressMessage: payload.message || updated[index].progressMessage,
                result: payload.result || updated[index].result,
                error: payload.error || updated[index].error,
              };
              return updated;
            }
            return prevJobs;
          });
        }
      },
      () => {
        setStreamStatus("error");
      }
    );

    // Initial fetch of metrics and recent background jobs
    loadMetricsAndJobs();

    return () => {
      unsubscribe();
    };
  }, [isOpen]);

  const loadMetricsAndJobs = async () => {
    try {
      const [metricsData, jobsData] = await Promise.all([
        eventService.fetchEventMetrics(),
        eventService.fetchJobsList(),
      ]);
      setMetrics(metricsData);
      if (jobsData?.data) {
        setActiveJobs(jobsData.data);
      }
    } catch (err) {
      console.warn("Could not load metrics or jobs:", err.message);
    }
  };

  // Trigger Asynchronous Background Job (HTTP 202 Accepted)
  const handleTriggerJob = async (jobType) => {
    setIsSubmittingJob(true);
    setJobToast(null);

    try {
      const response = await eventService.enqueueBackgroundJob(jobType);
      const newJob = {
        id: response.data.jobId,
        type: response.data.type,
        status: response.data.status,
        progress: response.data.progress,
        progressMessage: response.data.progressMessage,
        createdAt: response.data.createdAt,
      };

      setActiveJobs((prev) => [newJob, ...prev]);
      setJobToast(`✓ HTTP 202 Accepted: ${jobType} enqueued asynchronously!`);

      // Switch to jobs tab so user sees real-time progress bar immediately
      setActiveTab("jobs");
    } catch (err) {
      setJobToast(`✕ Failed to enqueue job: ${err.message}`);
    } finally {
      setIsSubmittingJob(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-ink/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="relative flex h-full w-full max-w-2xl flex-col border-l-[4px] border-ink bg-paper shadow-brutal">
        <CornerMarks />

        {/* Drawer Header */}
        <div className="border-b-[3px] border-ink bg-yellow p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="size-3 border border-ink bg-ink animate-pulse" />
              <h2 className="font-display text-xl uppercase tracking-tight text-ink sm:text-2xl">
                Event-Driven Architecture (EDA)
              </h2>
            </div>
            <button
              onClick={onClose}
              className="border-2 border-ink bg-paper px-2.5 py-1 label-mono text-xs font-bold text-ink hover:bg-coral brutal-press"
            >
              ✕ CLOSE
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="label-mono text-xs text-ink/80">
              Decoupled Pub/Sub • Async Jobs • Real-Time SSE
            </p>
            <div className="flex items-center gap-2">
              <span className="label-mono text-xs font-bold">STREAM:</span>
              <span
                className={`border-2 border-ink px-2 py-0.5 label-mono text-[11px] font-bold shadow-brutal-xs ${
                  streamStatus === "connected"
                    ? "bg-emerald-400 text-ink"
                    : streamStatus === "connecting"
                    ? "bg-yellow text-ink animate-pulse"
                    : "bg-coral text-ink"
                }`}
              >
                {streamStatus.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b-[3px] border-ink bg-paper">
          <button
            onClick={() => setActiveTab("events")}
            className={`flex-1 border-r-[2px] border-ink py-2.5 label-mono text-xs font-bold transition-colors ${
              activeTab === "events"
                ? "bg-ink text-paper"
                : "bg-paper text-ink hover:bg-yellow/40"
            }`}
          >
            LIVE STREAM ({events.length})
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`flex-1 border-r-[2px] border-ink py-2.5 label-mono text-xs font-bold transition-colors ${
              activeTab === "jobs"
                ? "bg-ink text-paper"
                : "bg-paper text-ink hover:bg-yellow/40"
            }`}
          >
            ASYNC JOBS (HTTP 202)
          </button>
          <button
            onClick={() => {
              setActiveTab("telemetry");
              loadMetricsAndJobs();
            }}
            className={`flex-1 py-2.5 label-mono text-xs font-bold transition-colors ${
              activeTab === "telemetry"
                ? "bg-ink text-paper"
                : "bg-paper text-ink hover:bg-yellow/40"
            }`}
          >
            TELEMETRY &amp; STATS
          </button>
        </div>

        {/* Toast Banner inside drawer */}
        {jobToast && (
          <div className="border-b-2 border-ink bg-sky px-4 py-2 label-mono text-xs font-bold text-ink">
            {jobToast}
          </div>
        )}

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* TAB 1: Real-time Live Event Feed */}
          {activeTab === "events" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="label-mono text-xs font-bold text-ink/70">
                  REAL-TIME SERVER-SENT EVENTS
                </span>
                {events.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEvents([])}
                    className="shadow-brutal-xs py-0.5 text-xs"
                  >
                    Clear Stream
                  </Button>
                )}
              </div>

              {events.length === 0 ? (
                <div className="border-2 border-dashed border-ink p-8 text-center bg-paper">
                  <p className="font-display text-lg uppercase text-ink">
                    Waiting for events...
                  </p>
                  <p className="mt-1 label-mono text-xs text-ink/60">
                    Create, update, toggle, or delete a task on the dashboard to view real-time domain events!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {events.map((evt, idx) => (
                    <div
                      key={evt.id || idx}
                      className="border-2 border-ink bg-paper p-3 shadow-brutal-xs transition-all hover:bg-yellow/10"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`border border-ink px-2 py-0.5 label-mono text-[11px] font-bold shadow-brutal-xs ${
                            EVENT_BADGE_COLORS[evt.type] || "bg-paper text-ink"
                          }`}
                        >
                          {evt.type}
                        </span>
                        <span className="label-mono text-[10px] text-ink/60">
                          {evt.receivedAt}
                        </span>
                      </div>

                      {/* Event Details */}
                      <p className="mt-2 text-xs font-bold text-ink">
                        {evt.payload?.task?.title
                          ? `Task: "${evt.payload.task.title}"`
                          : evt.payload?.message ||
                            (evt.payload?.jobId ? `Job: ${evt.payload.jobId}` : "Domain Event Triggered")}
                      </p>

                      {evt.payload?.notification && (
                        <div className="mt-1 border-l-2 border-ink pl-2 label-mono text-[11px] text-ink/80">
                          Dispatched [{evt.payload.notification.channel?.toUpperCase()}]: {evt.payload.notification.title}
                        </div>
                      )}

                      {/* Micro Metadata */}
                      <div className="mt-2 flex items-center justify-between border-t border-ink/20 pt-1 label-mono text-[10px] text-ink/50">
                        <span>ID: {evt.id}</span>
                        <span>Actor: {evt.meta?.actor?.email || "anonymous"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Asynchronous Background Jobs (HTTP 202) */}
          {activeTab === "jobs" && (
            <div className="flex flex-col gap-6">
              {/* Job Launchpad Controls */}
              <div className="border-[3px] border-ink bg-sky/20 p-4 shadow-brutal-xs">
                <p className="label-mono text-xs font-bold text-ink">
                  TRIGGER BACKGROUND JOBS (HTTP 202 ACCEPTED)
                </p>
                <p className="mt-1 text-xs text-ink/70">
                  Offloads computational, analytical, or export operations to asynchronous background workers without blocking the main HTTP thread.
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    onClick={() => handleTriggerJob("export_tasks_csv")}
                    disabled={isSubmittingJob}
                    className="shadow-brutal-xs"
                  >
                    ⚡ Export CSV (Async 202)
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleTriggerJob("batch_analyze_tasks")}
                    disabled={isSubmittingJob}
                    className="shadow-brutal-xs"
                  >
                    📊 Batch Analytics
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleTriggerJob("simulate_failure")}
                    disabled={isSubmittingJob}
                    className="shadow-brutal-xs text-red-700 hover:bg-red-100"
                  >
                    ⚠️ Test Retries &amp; DLQ
                  </Button>
                </div>
              </div>

              {/* Active / Recent Jobs List */}
              <div>
                <p className="label-mono text-xs font-bold text-ink/70 mb-3">
                  BACKGROUND JOB QUEUE &amp; WORKERS
                </p>

                {activeJobs.length === 0 ? (
                  <p className="label-mono text-xs text-ink/50 italic">
                    No background jobs have been launched yet. Click a button above!
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {activeJobs.map((job) => (
                      <div
                        key={job.id}
                        className="border-2 border-ink bg-paper p-4 shadow-brutal-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="label-mono text-xs font-bold text-ink">
                            {job.type}
                          </span>
                          <span
                            className={`border border-ink px-2 py-0.5 label-mono text-[10px] font-bold ${
                              job.status === "completed"
                                ? "bg-emerald-400 text-ink"
                                : job.status === "processing"
                                ? "bg-sky text-ink animate-pulse"
                                : job.status === "dead_letter"
                                ? "bg-red-500 text-white"
                                : "bg-yellow text-ink"
                            }`}
                          >
                            {job.status?.toUpperCase()}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="flex justify-between label-mono text-[11px] text-ink/70 mb-1">
                            <span>{job.progressMessage || "Processing..."}</span>
                            <span className="font-bold">{job.progress || 0}%</span>
                          </div>
                          <div className="h-3 w-full border-2 border-ink bg-paper overflow-hidden">
                            <div
                              className="h-full bg-yellow border-r border-ink transition-all duration-300"
                              style={{ width: `${job.progress || 0}%` }}
                            />
                          </div>
                        </div>

                        {/* Result or Download Button */}
                        {job.status === "completed" && job.result?.downloadUrl && (
                          <div className="mt-3 flex items-center justify-between border-t border-ink/20 pt-2">
                            <span className="label-mono text-xs text-ink/70">
                              {job.result.filename} ({job.result.rowCount} rows)
                            </span>
                            <a
                              href={eventService.getJobDownloadUrl(job.id)}
                              target="_blank"
                              rel="noreferrer"
                              className="border-2 border-ink bg-yellow px-3 py-1 label-mono text-xs font-bold text-ink hover:bg-emerald-300 shadow-brutal-xs brutal-press"
                            >
                              ⬇ DOWNLOAD ARTIFACT
                            </a>
                          </div>
                        )}

                        {job.status === "completed" && job.result?.systemHealth && (
                          <div className="mt-3 border-t border-ink/20 pt-2 label-mono text-xs">
                            <span className="font-bold">Health: {job.result.systemHealth}</span> • Completion: {job.result.completionRate}
                            <p className="mt-1 text-ink/70">{job.result.recommendedAction}</p>
                          </div>
                        )}

                        {job.status === "dead_letter" && (
                          <div className="mt-2 border-t border-red-300 pt-2 label-mono text-xs text-red-600">
                            Exceeded max retries. Successfully routed to Dead-Letter Queue (DLQ).
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Telemetry & Architectural Metrics */}
          {activeTab === "telemetry" && (
            <div className="flex flex-col gap-6">
              {metrics ? (
                <>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="border-2 border-ink bg-paper p-3 shadow-brutal-xs">
                      <p className="label-mono text-[10px] text-ink/60">TOTAL EMITTED</p>
                      <p className="font-display text-2xl text-ink">
                        {metrics.eventBus?.totalEmitted || 0}
                      </p>
                    </div>
                    <div className="border-2 border-ink bg-yellow p-3 shadow-brutal-xs">
                      <p className="label-mono text-[10px] text-ink/60">AVG DURATION</p>
                      <p className="font-display text-2xl text-ink">
                        {metrics.eventBus?.averageDurationMs || 0} ms
                      </p>
                    </div>
                    <div className="border-2 border-ink bg-sky p-3 shadow-brutal-xs">
                      <p className="label-mono text-[10px] text-ink/60">NOTIFICATIONS</p>
                      <p className="font-display text-2xl text-ink">
                        {metrics.notifications?.dispatchedCount || 0}
                      </p>
                    </div>
                    <div className="border-2 border-ink bg-coral p-3 shadow-brutal-xs">
                      <p className="label-mono text-[10px] text-ink/60">DLQ COUNT</p>
                      <p className="font-display text-2xl text-ink">
                        {metrics.jobQueue?.dlqCount || 0}
                      </p>
                    </div>
                  </div>

                  {/* Active Consumers List */}
                  <div className="border-2 border-ink bg-paper p-4 shadow-brutal-xs">
                    <p className="label-mono text-xs font-bold text-ink mb-3">
                      SUBSCRIBER TOPIC BINDINGS
                    </p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {Object.entries(metrics.eventBus?.activeSubscribers || {}).map(
                        ([topic, count]) => (
                          <div
                            key={topic}
                            className="flex items-center justify-between border border-ink/40 p-2 label-mono text-xs"
                          >
                            <span className="font-bold text-ink">{topic}</span>
                            <span className="bg-ink px-2 py-0.5 text-paper font-bold">
                              {count} listener{count !== 1 ? "s" : ""}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Architecture Diagram Info */}
                  <div className="border-[3px] border-ink bg-paper p-4 shadow-brutal-xs">
                    <p className="label-mono text-xs font-bold text-ink mb-2">
                      HOW IT WORKS: DECOUPLED ARCHITECTURE
                    </p>
                    <div className="space-y-2 text-xs text-ink/80">
                      <p>
                        <strong>1. Non-Blocking Ingestion:</strong> API routes save essential data and emit events (`eventBus.publish()`) before instantly returning `201 Created` or `202 Accepted` to the client.
                      </p>
                      <p>
                        <strong>2. Decoupled Subscribers:</strong> Audit Logging (`ActivityLog`), Notifications (Email/Webhook), and In-Memory Cache Invalidation process concurrently in the background.
                      </p>
                      <p>
                        <strong>3. Fault Isolation:</strong> If a downstream notification worker fails, the primary API request and remaining workers remain completely unaffected.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center label-mono text-xs">
                  Loading telemetry metrics...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
