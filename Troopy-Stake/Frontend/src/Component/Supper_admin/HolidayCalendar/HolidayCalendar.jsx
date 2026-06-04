import React, { useEffect, useState, useCallback } from "react";
import { Search, Plus, Download, ChevronLeft, ChevronRight, Filter, X, CalendarDays, Flag, Bell, CalendarCheck, Calendar as CalendarIcon, ChevronDown, Trash2, FileSpreadsheet, FileText, Upload } from "lucide-react";
import { holidayService } from "../../../services/holidayService";
import HolidayModal from "./HolidayModal";
import HolidayDetails from "./HolidayDetails";
import BulkUploadModal from "./BulkUploadModal";
import "./HolidayCalendar.css";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTH_OPTIONS = [{ value: "", label: "All Months" }, ...MONTHS.map((m, i) => ({ value: String(i + 1), label: m }))];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOLIDAY_COLORS = {
  "National Holiday": { bg: "#fef2f2", text: "#ef4444", dot: "#ef4444" },
  "Festival Holiday": { bg: "#fff7ed", text: "#f97316", dot: "#f97316" },
  "Company Holiday": { bg: "#eff6ff", text: "#3b82f6", dot: "#3b82f6" },
  "Optional Holiday": { bg: "#f0fdf4", text: "#22c55e", dot: "#22c55e" },
  "Bank Holiday": { bg: "#faf5ff", text: "#9333ea", dot: "#9333ea" },
};
const HOLIDAY_TYPES = ["National Holiday", "Festival Holiday", "Company Holiday", "Optional Holiday", "Bank Holiday"];

function HolidayCalendar() {
  const [holidays, setHolidays] = useState([]);
  const [stats, setStats] = useState({ totalHolidays: 0, upcomingHolidays: 0, currentMonthHolidays: 0, scheduledReminders: 0 });
  const [roleCounts, setRoleCounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");

  const [search, setSearch] = useState("");
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterType, setFilterType] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 15;

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [detailsHoliday, setDetailsHoliday] = useState(null);
  const [actionOpen, setActionOpen] = useState(null);
  const [filterMonth, setFilterMonth] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [notifList, setNotifList] = useState([]);
  const [notifCount, setNotifCount] = useState(0);
  const [bellOpen, setBellOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (msg, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const fetchStats = useCallback(async () => {
    try {
      const res = await holidayService.getStats();
      setStats(res.data);
    } catch (err) { console.error(err); }
  }, []);

  const fetchRoleCounts = useCallback(async () => {
    try {
      const res = await holidayService.getRoleCounts();
      setRoleCounts(res.data.roles || []);
    } catch (err) { console.error(err); }
  }, []);

  const fetchHolidays = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit, year: filterYear };
      if (search) params.search = search;
      if (filterType) params.holidayType = filterType;
      if (filterMonth) params.month = parseInt(filterMonth);
      const res = await holidayService.getAll(params);
      setHolidays(res.data.holidays || []);
      setTotalPages(res.data.pages || 1);
      setTotalItems(res.data.total || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, search, filterYear, filterType, filterMonth]);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await holidayService.getNotifications({ limit: 10 });
      setNotifList(res.data.notifications || []);
      setNotifCount(res.data.total || 0);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => { fetchStats(); fetchRoleCounts(); }, [fetchStats, fetchRoleCounts]);
  useEffect(() => { fetchHolidays(); }, [fetchHolidays]);
  useEffect(() => { setPage(1); }, [search, filterYear, filterType, filterMonth]);
  useEffect(() => {
    fetchNotifications();
    const iv = setInterval(fetchNotifications, 30000);
    return () => clearInterval(iv);
  }, [fetchNotifications]);

  const navigate = (dir) => {
    const d = new Date(currentDate);
    if (viewMode === "month") d.setMonth(d.getMonth() + dir);
    else if (viewMode === "week") d.setDate(d.getDate() + 7 * dir);
    else d.setFullYear(d.getFullYear() + dir);
    setCurrentDate(d);
  };

  const goToday = () => setCurrentDate(new Date());

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const getHolidaysForDate = (year, month, day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return holidays.filter((h) => {
      const hd = new Date(h.holidayDate);
      return `${hd.getFullYear()}-${String(hd.getMonth() + 1).padStart(2, "0")}-${String(hd.getDate()).padStart(2, "0")}` === dateStr;
    });
  };

  const getWeekDays = () => {
    const start = new Date(currentDate);
    const day = start.getDay();
    start.setDate(start.getDate() - day);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(<div key={`empty-${i}`} className="hl-cal-day hl-cal-day-empty" />);

    for (let d = 1; d <= daysInMonth; d++) {
      const dayHolidays = getHolidaysForDate(year, month, d);
      const isToday = new Date().getFullYear() === year && new Date().getMonth() === month && new Date().getDate() === d;
      const cellColor = dayHolidays.length ? HOLIDAY_COLORS[dayHolidays[0].holidayType] : null;
      cells.push(
        <div key={d} className={`hl-cal-day ${isToday ? "hl-cal-today" : ""} ${dayHolidays.length ? "hl-cal-has-holiday" : ""}`}
          style={cellColor ? { background: cellColor.bg } : {}}
          onClick={() => dayHolidays.length && handleHolidayClick(dayHolidays[0])}
          title={dayHolidays.length ? dayHolidays.map((h) => h.holidayName).join(", ") : ""}>
          <span className="hl-cal-day-num" style={cellColor ? { color: cellColor.text } : {}}>{d}</span>
          {dayHolidays.slice(0, 2).map((h, i) => (
            <span key={i} className="hl-cal-holiday-label" style={{ background: HOLIDAY_COLORS[h.holidayType]?.bg, color: HOLIDAY_COLORS[h.holidayType]?.text, borderLeft: `3px solid ${HOLIDAY_COLORS[h.holidayType]?.dot}` }}>
              {h.holidayName}
            </span>
          ))}
          {dayHolidays.length > 2 && <span className="hl-cal-more">+{dayHolidays.length - 2} more</span>}
        </div>
      );
    }
    return cells;
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays();
    return weekDays.map((d, i) => {
      const dayHolidays = getHolidaysForDate(d.getFullYear(), d.getMonth(), d.getDate());
      const cellColor = dayHolidays.length ? HOLIDAY_COLORS[dayHolidays[0].holidayType] : null;
      const isToday = new Date().toDateString() === d.toDateString();
      return (
        <div key={i} className={`hl-week-day ${isToday ? "hl-cal-today" : ""} ${dayHolidays.length ? "hl-cal-has-holiday" : ""}`}
          style={cellColor ? { background: cellColor.bg } : {}}
          onClick={() => dayHolidays.length && handleHolidayClick(dayHolidays[0])}>
          <div className="hl-week-day-name" style={cellColor ? { color: cellColor.text } : {}}>{DAYS[d.getDay()]}</div>
          <div className="hl-week-day-date" style={cellColor ? { color: cellColor.text, fontWeight: 900 } : {}}>{d.getDate()}</div>
          {dayHolidays.map((h, j) => (
            <span key={j} className="hl-cal-holiday-label" style={{ background: HOLIDAY_COLORS[h.holidayType]?.bg, color: HOLIDAY_COLORS[h.holidayType]?.text, display: "block", marginTop: 2, borderLeft: `3px solid ${HOLIDAY_COLORS[h.holidayType]?.dot}` }}>
              {h.holidayName}
            </span>
          ))}
        </div>
      );
    });
  };

  const renderYearView = () => {
    const year = currentDate.getFullYear();
    return MONTHS.map((mName, mi) => {
      const daysInMonth = getDaysInMonth(year, mi);
      const monthHolidays = holidays.filter((h) => {
        const hd = new Date(h.holidayDate);
        return hd.getFullYear() === year && hd.getMonth() === mi;
      });
      return (
        <div key={mi} className="hl-year-month">
          <h4>{mName} <span className="hl-year-count">{monthHolidays.length}</span></h4>
          <div className="hl-year-days">
            {Array.from({ length: daysInMonth }, (_, d) => {
              const h = monthHolidays.find((h) => new Date(h.holidayDate).getDate() === d + 1);
              return (
                <span key={d} className={`hl-year-day ${h ? "has-holiday" : ""}`}
                  style={h ? { background: HOLIDAY_COLORS[h.holidayType]?.bg, color: HOLIDAY_COLORS[h.holidayType]?.text, border: `2px solid ${HOLIDAY_COLORS[h.holidayType]?.dot}` } : {}}
                  onClick={() => h && handleHolidayClick(h)} title={h?.holidayName}>
                  {d + 1}
                </span>
              );
            })}
          </div>
        </div>
      );
    });
  };

  const handleHolidayClick = (holiday) => {
    setDetailsHoliday(holiday);
    setShowDetails(true);
  };

  const handleSave = async (data, id) => {
    try {
      if (id) await holidayService.update(id, data);
      else await holidayService.create(data);
      addToast(id ? "Holiday updated" : "Holiday created");
      fetchHolidays();
      fetchStats();
      fetchNotifications();
      return true;
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to save holiday", "error");
      return false;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this holiday?")) return;
    try {
      await holidayService.delete(id);
      addToast("Holiday deleted");
      setActionOpen(null);
      fetchHolidays();
      fetchStats();
      fetchNotifications();
    } catch (err) {
      addToast("Failed to delete holiday", "error");
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedIds.length} holidays?`)) return;
    try {
      await Promise.all(selectedIds.map((id) => holidayService.delete(id)));
      setSelectedIds([]);
      addToast(`${selectedIds.length} holidays deleted`);
      fetchHolidays();
      fetchStats();
      fetchNotifications();
    } catch (err) {
      addToast("Failed to delete holidays", "error");
    }
  };

  const handleExport = async (format) => {
    setExportOpen(false);
    try {
      const res = await holidayService.getAll({ page: 1, limit: 10000, year: filterYear, holidayType: filterType || undefined, month: filterMonth || undefined, search: search || undefined });
      const data = res.data.holidays || [];
      if (data.length === 0) { addToast("No holidays to export", "error"); return; }
      const rows = data.map((h) => ({
        Name: h.holidayName,
        Date: new Date(h.holidayDate).toLocaleDateString("en-IN"),
        Day: new Date(h.holidayDate).toLocaleDateString("en-IN", { weekday: "long" }),
        Type: h.holidayType,
        Status: h.status,
        Reminder: `${h.reminderDays} day(s)`,
      }));
      if (format === "csv") {
        const headers = Object.keys(rows[0]);
        const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => `"${(r[h] || "").replace(/"/g, '""')}"`).join(","))].join("\n");
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        downloadBlob(blob, `holidays-${filterYear}.csv`);
      } else {
        const XLSX = await import("xlsx");
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.book_append_sheet(wb, ws, "Holidays");
        const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([buf], { type: "application/octet-stream" });
        downloadBlob(blob, `holidays-${filterYear}.xlsx`);
      }
      addToast(`Exported ${data.length} holidays as ${format.toUpperCase()}`);
    } catch (err) {
      addToast("Export failed", "error");
    }
  };

  const handleBulkUpload = async (holidays) => {
    try {
      const res = await holidayService.bulkCreate({ holidays });
      addToast(res.data.message);
      fetchHolidays();
      fetchStats();
      fetchNotifications();
      return res.data;
    } catch (err) {
      addToast("Bulk upload failed", "error");
      throw err;
    }
  };

  const downloadBlob = (blob, name) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePreload = async () => {
    if (!window.confirm(`Preload common Indian holidays for year ${filterYear}?`)) return;
    try {
      const res = await holidayService.preload(filterYear);
      addToast(res.data.message);
      fetchHolidays();
      fetchStats();
      fetchNotifications();
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to preload", "error");
    }
  };

  const formatDate = (d) => {
    const dt = new Date(d);
    return dt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const getDayName = (d) => {
    return new Date(d).toLocaleDateString("en-IN", { weekday: "long" });
  };

  const getStatusBadge = (status) => {
    if (status === "Active") return <span className="hl-badge hl-badge-active">Active</span>;
    return <span className="hl-badge hl-badge-inactive">Inactive</span>;
  };

  const getTypeBadge = (type) => {
    const c = HOLIDAY_COLORS[type] || { text: "#667085" };
    return <span className="hl-type-badge" style={{ borderColor: c.text, color: c.text }}>{type}</span>;
  };

  const renderStats = () => (
    <div className="hl-stats">
      <div className="hl-stat-card">
        <div className="hl-stat-top"><CalendarDays size={18} color="#4f46e5" /><span className="hl-stat-label">Total Holidays</span></div>
        <h3 className="hl-stat-value">{stats.totalHolidays}</h3>
      </div>
      <div className="hl-stat-card">
        <div className="hl-stat-top"><Flag size={18} color="#f97316" /><span className="hl-stat-label">Upcoming Holidays</span></div>
        <h3 className="hl-stat-value">{stats.upcomingHolidays}</h3>
      </div>
      <div className="hl-stat-card">
        <div className="hl-stat-top"><CalendarCheck size={18} color="#3b82f6" /><span className="hl-stat-label">This Month</span></div>
        <h3 className="hl-stat-value">{stats.currentMonthHolidays}</h3>
      </div>
      <div className="hl-stat-card">
        <div className="hl-stat-top"><Bell size={18} color="#22c55e" /><span className="hl-stat-label">Reminders Scheduled</span></div>
        <h3 className="hl-stat-value">{stats.scheduledReminders}</h3>
      </div>
    </div>
  );

  const renderCalendar = () => (
    <div className="hl-cal-container">
      <div className="hl-cal-header">
        <div className="hl-cal-nav">
          <button className="hl-cal-nav-btn" onClick={() => navigate(-1)}><ChevronLeft size={18} /></button>
          <button className="hl-cal-today-btn" onClick={goToday}>Today</button>
          <button className="hl-cal-nav-btn" onClick={() => navigate(1)}><ChevronRight size={18} /></button>
          <h2 className="hl-cal-title">
            {viewMode === "month" && `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
            {viewMode === "week" && `Week of ${formatDate(getWeekDays()[0])}`}
            {viewMode === "year" && `${currentDate.getFullYear()}`}
          </h2>
        </div>
        <div className="hl-cal-view-tabs">
          {["month", "week", "year"].map((v) => (
            <button key={v} className={`hl-cal-view-tab ${viewMode === v ? "active" : ""}`} onClick={() => setViewMode(v)}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="hl-cal-legend">
        {HOLIDAY_TYPES.map((t) => (
          <span key={t} className="hl-legend-item"><span className="hl-legend-dot" style={{ background: HOLIDAY_COLORS[t]?.dot }} />{t}</span>
        ))}
      </div>

      <div className={`hl-cal-body hl-cal-${viewMode}`}>
        {viewMode === "month" && (
          <>
            <div className="hl-cal-day-names">
              {DAYS.map((d) => <div key={d} className="hl-cal-day-name">{d}</div>)}
            </div>
            <div className="hl-cal-days-grid">{renderMonthView()}</div>
          </>
        )}
        {viewMode === "week" && (
          <div className="hl-week-grid">{renderWeekView()}</div>
        )}
        {viewMode === "year" && (
          <div className="hl-year-grid">{renderYearView()}</div>
        )}
      </div>
    </div>
  );

  const renderTable = () => (
    <div className="hl-table-card">
      <div className="hl-table-filters">
        <div className="hl-search-box">
          <Search size={18} />
          <input type="text" placeholder="Search holidays..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="hl-filter-group">
          <Filter size={16} />
          <select value={filterYear} onChange={(e) => setFilterYear(Number(e.target.value))}>
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
            {MONTH_OPTIONS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">All Types</option>
            {HOLIDAY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {selectedIds.length > 0 && (
            <button className="hl-bulk-delete-btn" onClick={handleBulkDelete}><Trash2 size={15} /> Delete ({selectedIds.length})</button>
          )}
          <button className="hl-preload-btn" onClick={handlePreload} title="Preload Indian holidays">
            <Download size={15} /> Preload
          </button>
          {exportOpen && <div className="fu-overlay" onClick={() => setExportOpen(false)} />}
          <div className="hl-export-dropdown-wrap">
            <button className="hl-preload-btn hl-export-btn" onClick={() => setExportOpen(!exportOpen)}>
              <Download size={16} /> Export <ChevronDown size={14} />
            </button>
            {exportOpen && (
              <div className="hl-export-dropdown">
                <button onClick={() => handleExport("csv")}><FileText size={15} /> Export as CSV</button>
                <button onClick={() => handleExport("excel")}><FileSpreadsheet size={15} /> Export as Excel</button>
              </div>
            )}
          </div>
          {(search || filterType || filterMonth) && (
            <button className="hl-clear-btn" onClick={() => { setSearch(""); setFilterType(""); setFilterMonth(""); setPage(1); }}><X size={16} /></button>
          )}
        </div>
      </div>

      <div className="hl-table-wrap">
        <table>
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <input type="checkbox" checked={selectedIds.length === holidays.length && holidays.length > 0}
                  onChange={(e) => setSelectedIds(e.target.checked ? holidays.map((h) => h._id) : [])} />
              </th>
              <th>Holiday Name</th>
              <th>Date</th>
              <th>Day</th>
              <th>Type</th>
              <th>Reminder</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="hl-empty">Loading...</td></tr>
            ) : holidays.length === 0 ? (
              <tr><td colSpan={8} className="hl-empty">No holidays found. Click "Add Holiday" or "Preload" to get started.</td></tr>
            ) : (
              holidays.map((h) => (
                <tr key={h._id} className={selectedIds.includes(h._id) ? "hl-row-selected" : ""}>
                  <td>
                    <input type="checkbox" checked={selectedIds.includes(h._id)}
                      onChange={(e) => setSelectedIds(e.target.checked ? [...selectedIds, h._id] : selectedIds.filter((id) => id !== h._id))} />
                  </td>
                  <td className="hl-name-cell">{h.holidayName}</td>
                  <td>{formatDate(h.holidayDate)}</td>
                  <td>{getDayName(h.holidayDate)}</td>
                  <td>{getTypeBadge(h.holidayType)}</td>
                  <td>{h.reminderDays} day{h.reminderDays > 1 ? "s" : ""} before</td>
                  <td>{getStatusBadge(h.status)}</td>
                  <td>
                    <div className="hl-action-wrap">
                      <button className="hl-action-btn" onClick={() => setActionOpen(actionOpen === h._id ? null : h._id)}>•••</button>
                      {actionOpen === h._id && (
                        <div className="hl-dropdown">
                          <button onClick={() => { setDetailsHoliday(h); setShowDetails(true); setActionOpen(null); }}>
                            <CalendarIcon size={15} /> View
                          </button>
                          <button onClick={() => { setEditing(h); setShowModal(true); setActionOpen(null); }}>
                            <i className="hl-edit-icon" /> Edit
                          </button>
                          <button className="hl-dropdown-danger" onClick={() => handleDelete(h._id)}>
                            <i className="hl-delete-icon" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="hl-pagination">
        <span className="hl-page-info">Showing {Math.min((page - 1) * limit + 1, totalItems)}–{Math.min(page * limit, totalItems)} of {totalItems}</span>
        <div className="hl-page-btns">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft size={15} /></button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const start = Math.max(1, page - 2);
            const p = start + i;
            if (p > totalPages) return null;
            return <button key={p} className={page === p ? "active" : ""} onClick={() => setPage(p)}>{p}</button>;
          })}
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}><ChevronRight size={15} /></button>
        </div>
      </div>
    </div>
  );

  const renderReminderPanel = () => (
    <div className="hl-reminder-panel">
      <div className="hl-reminder-header">
        <Bell size={18} />
        <h3>Reminder Notifications</h3>
      </div>
      <p className="hl-reminder-subtitle">Holiday reminders will be sent to these roles</p>
      <div className="hl-reminder-list">
        {roleCounts.map((r) => (
          <div key={r.key} className="hl-reminder-role">
            <div className="hl-role-info">
              <span className="hl-role-name">{r.role}</span>
              <span className="hl-role-count">{r.count} users</span>
            </div>
            <div className="hl-role-methods">
              {r.notifications?.map((m) => (
                <span key={m} className={`hl-role-method ${m}`}>
                  {m === "in-app" ? "In-App" : m === "email" ? "Email" : m}
                </span>
              ))}
              <span className="hl-role-method coming">WhatsApp</span>
              <span className="hl-role-method coming">SMS</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="hl-page">
      <div className="hl-header">
        <div>
          <h1>Holiday Calendar</h1>
          <p className="hl-subtitle">Manage Holidays & Notifications</p>
        </div>
        <div className="hl-header-actions">
          <div className="hl-bell-wrap">
            <button className="hl-bell-btn" onClick={() => setBellOpen(!bellOpen)}>
              <Bell size={20} />
              {notifCount > 0 && <span className="hl-bell-badge">{notifCount > 9 ? "9+" : notifCount}</span>}
            </button>
            {bellOpen && (
              <>
                <div className="fu-overlay" onClick={() => setBellOpen(false)} />
                <div className="hl-bell-dropdown">
                  <div className="hl-bell-dd-header">
                    <h4>Notifications</h4>
                    <button onClick={() => setBellOpen(false)}><X size={16} /></button>
                  </div>
                  <div className="hl-bell-dd-body">
                    {notifList.length === 0 ? (
                      <p className="hl-bell-empty">No notifications</p>
                    ) : notifList.map((n) => (
                      <div key={n._id} className="hl-bell-item">
                        <span className="hl-bell-item-msg">{n.message || "Holiday reminder"}</span>
                        <span className="hl-bell-item-date">{new Date(n.sentDate).toLocaleDateString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          <button className="hl-preload-btn" onClick={() => setShowBulkUpload(true)} title="Bulk upload holidays from file">
            <Upload size={16} /> Bulk Upload
          </button>
          <button className="hl-add-btn" onClick={() => { setEditing(null); setShowModal(true); }}><Plus size={18} /> Add Holiday</button>
        </div>
      </div>

      {renderStats()}

      <div className="hl-main-grid">
        <div className="hl-main-content">
          {renderCalendar()}
          {renderTable()}
        </div>
        <div className="hl-sidebar-content">
          {renderReminderPanel()}
        </div>
      </div>

      {showModal && <HolidayModal show={showModal} onClose={() => { setShowModal(false); setEditing(null); }} onSave={handleSave} editing={editing} />}

      {showDetails && <HolidayDetails holiday={detailsHoliday} onClose={() => { setShowDetails(false); setDetailsHoliday(null); }} onEdit={(h) => { setShowDetails(false); setEditing(h); setShowModal(true); }} />}

      {showBulkUpload && <BulkUploadModal onClose={() => setShowBulkUpload(false)} onUpload={handleBulkUpload} />}

      <div className="hl-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`hl-toast hl-toast-${t.type}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HolidayCalendar;
