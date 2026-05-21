import React from "react";

function SuperAdminMenuPage({ title }) {
  return (
    <div className="sa-page-card">
      <h1>{title}</h1>
      <p>This page is protected and ready. You can make this page dynamic later.</p>
    </div>
  );
}

export default SuperAdminMenuPage;