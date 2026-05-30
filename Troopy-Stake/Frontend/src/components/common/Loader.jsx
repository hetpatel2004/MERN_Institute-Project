import React from "react";

export default function Loader({ size = "md", text = "Loading..." }) {
  return (
    <div className={`text-center py-5`}>
      <div
        className={`spinner-border text-primary spinner-border-${size === "sm" ? "sm" : ""}`}
        role="status"
      >
        <span className="visually-hidden">{text}</span>
      </div>
      <p className="mt-2 text-muted small">{text}</p>
    </div>
  );
}
