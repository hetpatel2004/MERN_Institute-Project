import React, { useEffect, useState } from "react";
import { X, CalendarDays, Clock, Bell, Edit } from "lucide-react";
import { holidayService } from "../../../services/holidayService";

const HOLIDAY_COLORS = {
  "National Holiday": { bg: "#fef2f2", text: "#ef4444", dot: "#ef4444" },
  "Festival Holiday": { bg: "#fff7ed", text: "#f97316", dot: "#f97316" },
  "Company Holiday": { bg: "#eff6ff", text: "#3b82f6", dot: "#3b82f6" },
  "Optional Holiday": { bg: "#f0fdf4", text: "#22c55e", dot: "#22c55e" },
  "Bank Holiday": { bg: "#faf5ff", text: "#9333ea", dot: "#9333ea" },
};

export default function HolidayDetails({ holiday, onClose, onEdit }) {
  const [notificationLogs, setNotificationLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (holiday?._id) {
      fetchLogs();
    }
  }, [holiday?._id]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await holidayService.getNotificationLogs(holiday._id);
      setNotificationLogs(res.data.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!holiday) return null;

  const colorInfo = HOLIDAY_COLORS[holiday.holidayType] || { bg: "#f8fafc", text: "#667085", dot: "#98a2b3" };

  return (
    <div className="fu-overlay" onClick={onClose}>
      <div className="hl-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="hl-drawer-header">
          <h2>Holiday Details</h2>
          <div>
            <button className="hl-drawer-edit-btn" onClick={() => onEdit(holiday)} title="Edit holiday">
              <Edit size={16} />
            </button>
            <button className="fu-modal-close" onClick={onClose}><X size={20} /></button>
          </div>
        </div>

        <div className="hl-drawer-body">
          <div className="hl-detail-type-badge" style={{ background: colorInfo.bg, color: colorInfo.text, border: `1px solid ${colorInfo.text}33` }}>
            {holiday.holidayType}
          </div>

          <h3 className="hl-detail-name">{holiday.holidayName}</h3>

          <div className="hl-detail-info-grid">
            <div className="hl-detail-info-item">
              <CalendarDays size={16} color="#667085" />
              <div>
                <span className="hl-detail-label">Date</span>
                <span className="hl-detail-value">{new Date(holiday.holidayDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
              </div>
            </div>
            <div className="hl-detail-info-item">
              <Clock size={16} color="#667085" />
              <div>
                <span className="hl-detail-label">Day</span>
                <span className="hl-detail-value">{new Date(holiday.holidayDate).toLocaleDateString("en-IN", { weekday: "long" })}</span>
              </div>
            </div>
            <div className="hl-detail-info-item">
              <Bell size={16} color="#667085" />
              <div>
                <span className="hl-detail-label">Reminder</span>
                <span className="hl-detail-value">{holiday.reminderDays} day{holiday.reminderDays > 1 ? "s" : ""} before</span>
              </div>
            </div>
            <div className="hl-detail-info-item">
              <CalendarDays size={16} color="#667085" />
              <div>
                <span className="hl-detail-label">Status</span>
                <span className="hl-detail-value">
                  <span className={`hl-badge ${holiday.status === "Active" ? "hl-badge-active" : "hl-badge-inactive"}`}>{holiday.status}</span>
                </span>
              </div>
            </div>
          </div>

          {holiday.description && (
            <div className="hl-detail-section">
              <h4>Description</h4>
              <p className="hl-detail-desc">{holiday.description}</p>
            </div>
          )}

          <div className="hl-detail-section">
            <h4>Reminder Notifications <span className="hl-detail-count">{notificationLogs.length}</span></h4>
            {loading ? (
              <p className="hl-detail-desc">Loading...</p>
            ) : notificationLogs.length === 0 ? (
              <p className="hl-detail-desc">No notifications sent yet.</p>
            ) : (
              <div className="hl-notification-list">
                {notificationLogs.map((log) => (
                  <div key={log._id} className="hl-notification-item">
                    <div className="hl-notif-top">
                      <span className="hl-notif-role">{log.role}</span>
                      <span className={`hl-notif-status ${log.deliveryStatus}`}>{log.deliveryStatus}</span>
                    </div>
                    <p className="hl-notif-message">{log.message}</p>
                    <span className="hl-notif-date">{new Date(log.sentDate).toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
