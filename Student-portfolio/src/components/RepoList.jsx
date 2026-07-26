import React from "react";

function RepoList({ data }) {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "50px 20px",
          backgroundColor: "var(--card-bg)",
          borderRadius: "16px",
          border: "2px dashed var(--border)",
          margin: "20px 0"
        }}
      >
        <p style={{ fontSize: "18px", color: "var(--text)", margin: 0 }}>
          No repositories found matching your query.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "25px",
        marginTop: "20px",
      }}
    >
      {data.map((repo) => (
        <div
          key={repo.id || repo.name}
          style={{
            backgroundColor: "var(--card-bg)",
            color: "var(--text-h)",
            padding: "25px",
            borderRadius: "16px",
            border: "2px solid #22c55e",
            boxShadow: "var(--shadow)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            textAlign: "left",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            boxSizing: "border-box"
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "10px",
                marginBottom: "12px",
                flexWrap: "wrap"
              }}
            >
              <h3
                style={{
                  color: "#22c55e",
                  fontSize: "20px",
                  margin: 0,
                  fontWeight: "700",
                  wordBreak: "break-word",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexWrap: "wrap"
                }}
              >
                <span>{repo.name}</span>
                <span
                  style={{
                    fontSize: "13px",
                    backgroundColor: "rgba(34, 197, 94, 0.15)",
                    color: "#22c55e",
                    border: "1px solid rgba(34, 197, 94, 0.4)",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontWeight: "600",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "3px"
                  }}
                  title={`${repo.stargazers_count ?? 0} stars on GitHub`}
                >
                  ⭐ {repo.stargazers_count ?? 0}
                </span>
              </h3>
              {repo.language && (
                <span
                  style={{
                    backgroundColor: "rgba(34, 197, 94, 0.1)",
                    color: "var(--text-h)",
                    border: "1px solid var(--border)",
                    padding: "3px 10px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    whiteSpace: "nowrap"
                  }}
                >
                  {repo.language}
                </span>
              )}
            </div>

            <p
              style={{
                color: "var(--text)",
                fontSize: "15px",
                lineHeight: "1.6",
                marginBottom: "20px",
                minHeight: "48px",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}
            >
              {repo.description || "No description provided for this repository."}
            </p>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                fontSize: "14px",
                color: "var(--text)",
                marginBottom: "18px",
                paddingTop: "12px",
                borderTop: "1px solid var(--border)"
              }}
            >
              <span>⭐ {repo.stargazers_count ?? 0} stars</span>
              <span>🍴 {repo.forks_count ?? 0} forks</span>
            </div>

            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                backgroundColor: "#22c55e",
                color: "#ffffff",
                textDecoration: "none",
                padding: "10px 16px",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: "600",
                boxSizing: "border-box",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 10px rgba(34, 197, 94, 0.25)"
              }}
            >
              View Repository ↗
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RepoList;
