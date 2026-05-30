import React from "react";

const variantStyles = {
  success: "bg-success bg-opacity-10 text-success border-success",
  warning: "bg-warning bg-opacity-10 text-warning border-warning",
  danger: "bg-danger bg-opacity-10 text-danger border-danger",
  info: "bg-info bg-opacity-10 text-info border-info",
  secondary: "bg-secondary bg-opacity-10 text-secondary border-secondary",
  primary: "bg-primary bg-opacity-10 text-primary border-primary",
};

export default function StatusBadge({ status = "", variant, children }) {
  const v = variant || (status?.toLowerCase().includes("active") || status?.toLowerCase().includes("open") ? "success" : status?.toLowerCase().includes("closed") || status?.toLowerCase().includes("lost") ? "danger" : status?.toLowerCase().includes("pending") ? "warning" : "info");
  const style = variantStyles[v] || variantStyles.info;

  return (
    <span className={`badge border ${style}`}>
      {children || status}
    </span>
  );
}
