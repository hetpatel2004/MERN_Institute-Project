import React, { useState, useRef } from "react";
import { X, Upload, FileSpreadsheet, AlertCircle, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";

const REQUIRED_FIELDS = ["holidayName", "holidayDate", "holidayType"];
const FIELD_MAP = {
  holidayName: ["holidayname", "name", "holiday_name", "holiday name"],
  holidayDate: ["holidaydate", "date", "holiday_date", "holiday date", "day"],
  holidayType: ["holidaytype", "type", "holiday_type", "holiday type", "category"],
  description: ["description", "desc", "details"],
  reminderDays: ["reminderdays", "reminder", "reminder_days", "reminder days"],
  status: ["status"],
};

function guessField(colName) {
  const lower = colName.toLowerCase().trim();
  for (const [field, aliases] of Object.entries(FIELD_MAP)) {
    if (aliases.includes(lower)) return field;
  }
  return null;
}

export default function BulkUploadModal({ onClose, onUpload }) {
  const [file, setFile] = useState(null);
  const [allRows, setAllRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [mapping, setMapping] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [expandedErrors, setExpandedErrors] = useState(false);
  const fileRef = useRef(null);

  const handleFile = async (f) => {
    if (!f) return;
    setFile(f);
    setResult(null);
    try {
      const buf = await f.arrayBuffer();
      const XLSX = await import("xlsx");
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(ws, { defval: "" });
      if (json.length === 0) return;
      const cols = Object.keys(json[0]);
      setHeaders(cols);
      const autoMap = {};
      cols.forEach((c) => { const g = guessField(c); if (g) autoMap[g] = c; });
      setMapping(autoMap);
      setAllRows(json);
      setRows(json.slice(0, 10));
    } catch (err) {
      setAllRows([]);
      setRows([]);
      setHeaders([]);
    }
  };

  const normalizeType = (val) => {
    const v = (val || "").toLowerCase().trim();
    if (v.includes("national") || v.includes("religious") || v.includes("observance")) return "National Holiday";
    if (v.includes("festival") || v.includes("religious")) return "Festival Holiday";
    if (v.includes("optional")) return "Optional Holiday";
    if (v.includes("bank")) return "Bank Holiday";
    if (v.includes("company")) return "Company Holiday";
    return "National Holiday";
  };

  const handleUpload = async () => {
    if (allRows.length === 0) return;
    setLoading(true);
    setResult(null);
    const holidays = allRows.map((r) => {
      const entry = {};
      for (const [field, col] of Object.entries(mapping)) {
        entry[field] = r[col] || "";
      }
      entry.holidayType = normalizeType(entry.holidayType);
      if (entry.holidayDate) {
        try {
          const parsed = new Date(entry.holidayDate);
          if (!isNaN(parsed.getTime())) entry.holidayDate = parsed.toISOString().slice(0, 10);
        } catch (_) {}
      }
      return entry;
    });
    try {
      const res = await onUpload(holidays);
      setResult(res);
    } catch (err) {
      setResult({ error: err.response?.data?.message || "Upload failed" });
    } finally {
      setLoading(false);
    }
  };

  const missingRequired = !REQUIRED_FIELDS.every((f) => mapping[f]);

  return (
    <div className="fu-overlay" onClick={onClose}>
      <div className="fu-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 700 }}>
        <div className="fu-modal-header">
          <h2>Bulk Upload Holidays</h2>
          <button className="fu-modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="fu-modal-body">
          {!file && (
            <div className="hl-dropzone" onClick={() => fileRef.current?.click()}>
              <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" style={{ display: "none" }}
                onChange={(e) => handleFile(e.target.files[0])} />
              <Upload size={32} color="#4f46e5" />
              <p className="hl-dropzone-text">Click to upload CSV or Excel file</p>
              <p className="hl-dropzone-hint">File should have columns: Holiday Name, Date, Type</p>
            </div>
          )}

          {file && (
            <>
              <div className="hl-file-info">
                <FileSpreadsheet size={18} color="#4f46e5" />
                <span className="hl-file-name">{file.name}</span>
                <button className="hl-file-remove" onClick={() => { setFile(null); setAllRows([]); setRows([]); setResult(null); }}><X size={16} /></button>
              </div>

              {headers.length > 0 && (
                <div className="hl-mapping-section">
                  <h4>Column Mapping</h4>
                  <div className="hl-mapping-grid">
                    {["holidayName", "holidayDate", "holidayType", "description", "reminderDays", "status"].map((f) => (
                      <div key={f} className="hl-mapping-row">
                        <span className="hl-mapping-label">{f} {REQUIRED_FIELDS.includes(f) && <span className="required-star">*</span>}</span>
                        <select value={mapping[f] || ""} onChange={(e) => setMapping({ ...mapping, [f]: e.target.value })}>
                          <option value="">—</option>
                          {headers.map((h) => <option key={h} value={h}>{h}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {allRows.length > 0 && (
                <div className="hl-preview-section">
                  <h4>Preview ({allRows.length} rows)</h4>
                  <div className="hl-preview-table-wrap">
                    <table className="hl-preview-table">
                      <thead>
                        <tr>
                          {["#", "Name", "Date", "Type", "Description"].map((h) => <th key={h}>{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.slice(0, 10).map((r, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{r[mapping.holidayName] || "—"}</td>
                            <td>{r[mapping.holidayDate] || "—"}</td>
                            <td>{r[mapping.holidayType] || "—"}</td>
                            <td className="hl-preview-desc">{r[mapping.description] ? String(r[mapping.description]).slice(0, 40) : "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {allRows.length > 10 && <p className="hl-preview-more">+ {allRows.length - 10} more rows</p>}
                </div>
              )}

              {result && (
                <div className={`hl-upload-result ${result.error ? "hl-upload-error" : "hl-upload-success"}`}>
                  {result.error ? (
                    <><AlertCircle size={18} /><span>{result.error}</span></>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      <div>
                        <strong>{result.message}</strong>
                        {result.errors?.length > 0 && (
                          <button className="hl-error-toggle" onClick={() => setExpandedErrors(!expandedErrors)}>
                            {result.errors.length} error(s) {expandedErrors ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        )}
                        {expandedErrors && result.errors.map((e, i) => (
                          <p key={i} className="hl-error-row">Row {e.row}: {e.message}</p>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="fu-modal-footer">
          <button className="fu-cancel-btn" onClick={onClose}>Close</button>
          {file && allRows.length > 0 && !result && (
            <button className="fu-save-btn" onClick={handleUpload} disabled={loading || missingRequired}>
              {loading ? "Uploading..." : `Upload ${allRows.length} Holidays`}
            </button>
          )}
          {result && !result.error && (
            <button className="fu-save-btn" onClick={onClose}>Done</button>
          )}
        </div>
      </div>
    </div>
  );
}
