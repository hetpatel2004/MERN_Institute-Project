import React from "react";
import { Inbox } from "lucide-react";

export default function EmptyState({ message = "No data found", icon: Icon = Inbox }) {
  return (
    <div className="text-center py-5">
      <Icon size={48} className="text-muted mb-2" />
      <p className="text-muted">{message}</p>
    </div>
  );
}
