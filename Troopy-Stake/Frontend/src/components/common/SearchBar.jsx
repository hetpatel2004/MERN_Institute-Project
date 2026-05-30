import React from "react";

export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="input-group" style={{ maxWidth: 320 }}>
      <span className="input-group-text bg-white">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </span>
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
