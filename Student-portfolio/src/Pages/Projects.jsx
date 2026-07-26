import React, { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import RepoList from "../components/RepoList";

function Projects() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchRepos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://api.github.com/users/Ladnil03/repos?sort=updated");
      if (!response.ok) {
        throw new Error(`GitHub API request failed with status ${response.status}`);
      }
      const json = await response.json();
      if (!Array.isArray(json)) {
        throw new Error("Invalid response format received from GitHub API.");
      }
      setData(json);
    } catch (err) {
      setError(err.message || "Unable to fetch repositories from GitHub.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const filteredData = data
    ? data.filter((repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    )
    : [];

  return (
    <section
      style={{
        padding: "40px 20px 60px",
        maxWidth: "1100px",
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box"
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1
          style={{
            fontSize: "40px",
            color: "var(--text-h)",
            marginBottom: "10px",
            fontWeight: "700"
          }}
        >
          GitHub Repositories
        </h1>
        <p
          style={{
            fontSize: "18px",
            color: "var(--text)",
            maxWidth: "600px",
            margin: "0 auto 20px"
          }}
        >
          Dynamically fetched projects directly from GitHub REST API.
        </p>

        {!loading && !error && data && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "12px",
              marginTop: "20px",
              flexWrap: "wrap"
            }}
          >
            <input
              type="text"
              placeholder="🔍 Search repositories by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                maxWidth: "450px",
                padding: "12px 20px",
                fontSize: "16px",
                borderRadius: "10px",
                border: "2px solid #22c55e",
                backgroundColor: "var(--code-bg)",
                color: "var(--text-h)",
                outline: "none",
                boxShadow: "var(--shadow)",
                boxSizing: "border-box",
                transition: "all 0.3s ease"
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  backgroundColor: "var(--code-bg)",
                  color: "var(--text-h)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {loading && <Spinner />}

      {!loading && error && (
        <ErrorMessage message={error} onRetry={fetchRepos} />
      )}

      {!loading && !error && data && <RepoList data={filteredData} />}
    </section>
  );
}

export default Projects;
