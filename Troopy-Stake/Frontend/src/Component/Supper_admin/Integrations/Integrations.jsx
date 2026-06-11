import React, { useEffect, useState } from "react";
import { Plug, MessageCircle, Mail, MessageSquare, CreditCard, Calendar, MessageCircle as SlackIcon, ChevronDown, ChevronUp } from "lucide-react";
import "../Finance/Finance.css";

const STORAGE_KEY = "super_admin_integrations";

const defaultIntegrations = [
  {
    id: "whatsapp",
    name: "WhatsApp Business API",
    description: "Send automated WhatsApp messages to leads and students",
    icon: MessageCircle,
    enabled: false,
    hasConfig: false,
    config: {},
  },
  {
    id: "email",
    name: "Email SMTP",
    description: "Configure SMTP server for transactional emails",
    icon: Mail,
    enabled: false,
    hasConfig: true,
    config: { host: "", port: "587", username: "", password: "", fromEmail: "" },
  },
  {
    id: "sms",
    name: "SMS Gateway",
    description: "Send SMS notifications via gateway provider",
    icon: MessageSquare,
    enabled: false,
    hasConfig: true,
    config: { provider: "", apiKey: "", senderId: "" },
  },
  {
    id: "payment",
    name: "Payment Gateway",
    description: "Configure payment gateway for fee collections",
    icon: CreditCard,
    enabled: false,
    hasConfig: true,
    config: { gateway: "razorpay", apiKey: "", apiSecret: "", webhookSecret: "" },
  },
  {
    id: "calendar",
    name: "Google Calendar",
    description: "Sync events and schedules with Google Calendar",
    icon: Calendar,
    enabled: false,
    hasConfig: false,
    config: {},
  },
  {
    id: "slack",
    name: "Slack",
    description: "Receive notifications and alerts on Slack",
    icon: SlackIcon,
    enabled: false,
    hasConfig: false,
    config: {},
  },
];

export default function Integrations() {
  const [integrations, setIntegrations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return defaultIntegrations.map((def) => {
          const savedItem = parsed.find((p) => p.id === def.id);
          return savedItem ? { ...def, enabled: savedItem.enabled, config: { ...def.config, ...savedItem.config } } : def;
        });
      }
    } catch {}
    return defaultIntegrations;
  });

  const [expanded, setExpanded] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = (msg, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(integrations.map(({ id, enabled, config }) => ({ id, enabled, config }))));
  }, [integrations]);

  const toggleIntegration = (id) => {
    setIntegrations((prev) => prev.map((i) => (i.id === id ? { ...i, enabled: !i.enabled } : i)));
    const item = integrations.find((i) => i.id === id);
    addToast(`${item?.name || id} ${item?.enabled ? "disabled" : "enabled"}`);
  };

  const updateConfig = (id, field, value) => {
    setIntegrations((prev) => prev.map((i) => (i.id === id ? { ...i, config: { ...i.config, [field]: value } } : i)));
  };

  const saveConfig = (id) => {
    addToast("Configuration saved");
    setExpanded(null);
  };

  return (
    <div className="fin-page">
      <div className="fin-header">
        <div>
          <h1>Integrations</h1>
          <p className="fin-subtitle">Connect third-party services to your platform</p>
        </div>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        {integrations.map((integration) => {
          const Icon = integration.icon;
          return (
            <div key={integration.id} className="fin-table-card" style={{ overflow: "visible" }}>
              <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: integration.enabled ? "#ecfdf5" : "#f2f4f7", display: "flex", alignItems: "center", justifyContent: "center", color: integration.enabled ? "#059669" : "#98a2b3" }}>
                  <Icon size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#101828" }}>{integration.name}</h3>
                  <p style={{ margin: "2px 0 0", fontSize: 13, color: "#667085" }}>{integration.description}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {integration.hasConfig && (
                    <button
                      onClick={() => setExpanded(expanded === integration.id ? null : integration.id)}
                      style={{ background: "none", border: "1px solid #e5e7eb", borderRadius: 6, padding: "4px 8px", cursor: "pointer", color: "#667085", display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}
                    >
                      Config {expanded === integration.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  )}
                  <label style={{ position: "relative", display: "inline-block", width: 40, height: 22, cursor: "pointer" }}>
                    <input type="checkbox" checked={integration.enabled} onChange={() => toggleIntegration(integration.id)} style={{ opacity: 0, width: 0, height: 0 }} />
                    <span style={{
                      position: "absolute", inset: 0, backgroundColor: integration.enabled ? "#4f46e5" : "#d1d5db", borderRadius: 22, transition: "0.3s",
                      boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
                    }}>
                      <span style={{
                        position: "absolute", left: integration.enabled ? 20 : 2, top: 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "0.3s",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                      }} />
                    </span>
                  </label>
                </div>
              </div>

              {expanded === integration.id && integration.hasConfig && (
                <div style={{ borderTop: "1px solid #e5e7eb", padding: "16px 20px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {Object.entries(integration.config).map(([key, val]) => (
                      <div key={key}>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#667085", marginBottom: 4, textTransform: "capitalize" }}>
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </label>
                        <input
                          type={key.toLowerCase().includes("secret") || key.toLowerCase().includes("password") || key.toLowerCase().includes("key") ? "password" : "text"}
                          value={val}
                          onChange={(e) => updateConfig(integration.id, key, e.target.value)}
                          placeholder={`Enter ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                          style={{ width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 13, outline: "none", boxSizing: "border-box" }}
                        />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
                    <button className="fin-add-btn" onClick={() => saveConfig(integration.id)}>Save Configuration</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="fin-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`fin-toast fin-toast-${t.type}`}>{t.msg}</div>
        ))}
      </div>
    </div>
  );
}
