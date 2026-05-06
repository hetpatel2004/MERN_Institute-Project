import React from "react";
import { getUser } from "../../utils/storage";

function CompanyAdmin() {
  const user = getUser();
  const info = user?.loginInfo;

  return (
    <div className="container py-5">
      <div className="card shadow p-4">
        <h2>Company Admin Dashboard</h2>

        <hr />

        <p><b>Name:</b> {user?.name}</p>
        <p><b>Email:</b> {user?.email}</p>
        <p><b>Role:</b> {user?.role}</p>

        <h4 className="mt-4">Login Details</h4>
        <p><b>IP Address:</b> {info?.ipAddress || "Not found"}</p>
        <p><b>Device:</b> {info?.device || "Not found"}</p>
        <p>
          <b>Location:</b>{" "}
          {info?.location?.latitude
            ? `${info.location.latitude}, ${info.location.longitude}`
            : "Location permission not allowed"}
        </p>
        <p>
          <b>Login Time:</b>{" "}
          {info?.loginTime ? new Date(info.loginTime).toLocaleString() : "Not found"}
        </p>
      </div>
    </div>
  );
}

export default CompanyAdmin;