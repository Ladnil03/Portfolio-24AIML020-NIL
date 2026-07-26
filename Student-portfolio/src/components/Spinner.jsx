import React from "react";

function Spinner() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        minHeight: "300px",
      }}
    >
      <div className="spinner-loader"></div>
      <p
        style={{
          color: "var(--text-h)",
          fontSize: "18px",
          fontWeight: "600",
          marginTop: "10px",
        }}
      >
        Loading Repositories from GitHub...
      </p>
    </div>
  );
}

export default Spinner;
