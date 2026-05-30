import React from "react";

export default function StatsCard({ icon: Icon, label, value, subtitle, color = "primary" }) {
  return (
    <div className="sa-stat-card">
      {Icon && <Icon size={32} className={`text-${color}`} />}
      <p>{label}</p>
      <h2>{value ?? "—"}</h2>
      {subtitle && <span>{subtitle}</span>}
    </div>
  );
}
