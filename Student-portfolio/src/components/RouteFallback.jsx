
/**
 * RouteFallback - Meaningful Skeleton & Loading Fallback UI
 * Displayed while lazy-loaded route chunks (Tasks, Contact, Login, etc.) are downloading.
 */
export default function RouteFallback({ title = "Loading page content..." }) {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "30px 24px",
        boxSizing: "border-box",
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      {/* Top Banner Skeleton */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "35px",
          gap: "12px",
        }}
      >
        <div
          className="skeleton-pulse"
          style={{
            height: "36px",
            width: "320px",
            borderRadius: "10px",
          }}
        />
        <div
          className="skeleton-pulse"
          style={{
            height: "18px",
            width: "480px",
            borderRadius: "6px",
          }}
        />
      </div>

      {/* Grid of Skeleton Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "18px",
          marginBottom: "30px",
        }}
      >
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              padding: "20px",
              boxShadow: "var(--shadow)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              className="skeleton-pulse"
              style={{
                height: "22px",
                width: "60%",
                borderRadius: "6px",
              }}
            />
            <div
              className="skeleton-pulse"
              style={{
                height: "14px",
                width: "90%",
                borderRadius: "4px",
              }}
            />
            <div
              className="skeleton-pulse"
              style={{
                height: "14px",
                width: "75%",
                borderRadius: "4px",
              }}
            />
          </div>
        ))}
      </div>

      {/* Loading Indicator Status */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          color: "var(--text)",
          fontSize: "14px",
          fontWeight: "600",
        }}
      >
        <div
          style={{
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            border: "2px solid var(--accent-bg)",
            borderTop: "2px solid var(--accent)",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <span>{title}</span>
      </div>
    </div>
  );
}
