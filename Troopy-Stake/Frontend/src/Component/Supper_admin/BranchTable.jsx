import React from "react";
import { Building2, Eye, Pencil, Trash2, ChevronDown, Power, KeyRound } from "lucide-react";

function BranchTable({ branches, loading, actionOpen, setActionOpen, onView, onEdit, onDelete, onToggleStatus, onResetPassword, emptyMessage }) {
  if (loading) {
    return (
      <div className="br-table-wrap">
        <table>
          <thead>{renderHeaders()}</thead>
          <tbody><tr><td colSpan={11} className="br-empty">Loading...</td></tr></tbody>
        </table>
      </div>
    );
  }

  if (!branches || branches.length === 0) {
    return (
      <div className="br-table-wrap">
        <table>
          <thead>{renderHeaders()}</thead>
          <tbody><tr><td colSpan={11} className="br-empty">{emptyMessage || "No branches found"}</td></tr></tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="br-table-wrap">
      <table>
        <thead>{renderHeaders()}</thead>
        <tbody>
          {branches.map((b) => (
            <tr key={b._id} className={b.status !== "Active" ? "br-row-inactive" : ""}>
              <td>
                <div className="br-name-cell">
                  <div className="br-avatar-placeholder"><Building2 size={16} /></div>
                  <div>
                    <div className="br-name">{b.branchName}</div>
                    <div className="br-code">{b.branchCode}</div>
                  </div>
                </div>
              </td>
              <td>{b.instituteId?.name || "N/A"}</td>
              <td>{b.city || "-"}</td>
              <td>
                <div className="br-admin-info">
                  <span>{b.adminId?.name || "No admin"}</span>
                  {b.adminId?.email && <span className="br-email-text">{b.adminId.email}</span>}
                </div>
              </td>
              <td>{b.phone || "-"}</td>
              <td><span className="br-count">{b.studentCount || 0}</span></td>
              <td><span className="br-count">{b.admissionCount || 0}</span></td>
              <td><span className="br-count">{b.leadCount || 0}</span></td>
              <td><span className="br-count">{b.counsellorCount || 0}</span></td>
              <td>
                <span className={`br-status br-${(b.status || "active").toLowerCase()}`}>{b.status}</span>
              </td>
              <td>
                <div className="br-action-wrap">
                  <button className="br-action-btn" onClick={() => setActionOpen(actionOpen === b._id ? null : b._id)}>
                    <ChevronDown size={16} />
                  </button>
                  {actionOpen === b._id && (
                    <div className="br-dropdown">
                      <button onClick={() => { onView(b); setActionOpen(null); }}><Eye size={15} /> View Details</button>
                      <button onClick={() => { onEdit(b); setActionOpen(null); }}><Pencil size={15} /> Edit</button>
                      <button className="br-dropdown-danger" onClick={() => { onDelete(b); setActionOpen(null); }}><Trash2 size={15} /> Delete</button>
                      <button onClick={() => { onToggleStatus(b._id); setActionOpen(null); }}>
                        <Power size={15} /> {b.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                      <button onClick={() => { onResetPassword(b); setActionOpen(null); }}>
                        <KeyRound size={15} /> Reset Admin Password
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderHeaders() {
  return (
    <tr>
      <th>Branch</th>
      <th>Institute</th>
      <th>City</th>
      <th>Admin / Email</th>
      <th>Phone</th>
      <th>Students</th>
      <th>Admissions</th>
      <th>Leads</th>
      <th>Counsellors</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  );
}

export default BranchTable;
