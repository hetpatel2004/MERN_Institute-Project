import React, { useState } from "react";
import { MessageCircle, Search, Send, Phone, MoreVertical } from "lucide-react";
import "./Communication.css";

const dummyConversations = [
  { id: 1, name: "Priya Sharma", lastMessage: "Yes, I'll visit the institute tomorrow.", time: "2 min ago", avatar: "PS", color: "#4f46e5", online: true },
  { id: 2, name: "Rahul Verma", lastMessage: "What is the fee structure for the course?", time: "15 min ago", avatar: "RV", color: "#059669", online: true },
  { id: 3, name: "Ananya Gupta", lastMessage: "Thank you for the information!", time: "1 hr ago", avatar: "AG", color: "#d97706", online: false },
  { id: 4, name: "Vikram Singh", lastMessage: "I'll come with my parents on Saturday.", time: "2 hr ago", avatar: "VS", color: "#dc2626", online: false },
  { id: 5, name: "Neha Patel", lastMessage: "Can you share the brochure?", time: "3 hr ago", avatar: "NP", color: "#7c3aed", online: true },
  { id: 6, name: "Arjun Reddy", lastMessage: "The demo class was great!", time: "5 hr ago", avatar: "AR", color: "#0891b2", online: false },
  { id: 7, name: "Kavita Joshi", lastMessage: "Please send the payment link.", time: "1 day ago", avatar: "KJ", color: "#db2777", online: false },
  { id: 8, name: "Deepak Kumar", lastMessage: "Is online registration available?", time: "1 day ago", avatar: "DK", color: "#65a30d", online: false },
];

const dummyMessages = {
  1: [
    { id: 1, text: "Hello! I'm interested in your courses.", sent: false, time: "10:30 AM" },
    { id: 2, text: "Hi Priya! We have a variety of courses. Which field are you interested in?", sent: true, time: "10:32 AM" },
    { id: 3, text: "I'm looking for a full-stack development course.", sent: false, time: "10:35 AM" },
    { id: 4, text: "Great choice! We have a comprehensive MERN stack program starting next month.", sent: true, time: "10:38 AM" },
    { id: 5, text: "Yes, I'll visit the institute tomorrow.", sent: false, time: "10:42 AM" },
  ],
  2: [
    { id: 1, text: "Hi, I'm Rahul. I want to know about the fees.", sent: false, time: "11:00 AM" },
    { id: 2, text: "Hello Rahul! Our fees vary by course. Which course are you interested in?", sent: true, time: "11:05 AM" },
    { id: 3, text: "What is the fee structure for the course?", sent: false, time: "11:08 AM" },
  ],
};

export default function WhatsAppInbox() {
  const [activeConv, setActiveConv] = useState(1);
  const [messages, setMessages] = useState(dummyMessages[1] || []);
  const [inputText, setInputText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConvs = dummyConversations.filter(
    (c) => c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectConv = (id) => {
    setActiveConv(id);
    setMessages(dummyMessages[id] || []);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: Date.now(),
      text: inputText,
      sent: true,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages([...messages, newMsg]);
    setInputText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const activeConvData = dummyConversations.find((c) => c.id === activeConv);

  return (
    <div className="fin-page">
      <div className="fin-header">
        <div>
          <h1>WhatsApp Inbox</h1>
          <p className="fin-subtitle">Manage WhatsApp conversations</p>
        </div>
      </div>

      <div className="wa-container">
        <div className="wa-sidebar">
          <div className="wa-sidebar-header">
            <MessageCircle size={22} />
            <span>WhatsApp</span>
          </div>
          <div className="wa-sidebar-search">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="wa-conversation-list">
            {filteredConvs.map((c) => (
              <div
                key={c.id}
                className={`wa-conversation-item ${activeConv === c.id ? "active" : ""}`}
                onClick={() => handleSelectConv(c.id)}
              >
                <div className="wa-avatar" style={{ background: c.color }}>{c.avatar}</div>
                <div className="wa-conv-info">
                  <div className="wa-conv-name">{c.name}</div>
                  <div className="wa-conv-last">{c.lastMessage}</div>
                </div>
                <div className="wa-conv-time">{c.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="wa-main">
          {activeConvData ? (
            <>
              <div className="wa-main-header">
                <div className="wa-main-header-left">
                  <div className="wa-avatar" style={{ background: activeConvData.color, width: 40, height: 40, fontSize: 14 }}>
                    {activeConvData.avatar}
                  </div>
                  <div>
                    <div className="wa-main-header-name">{activeConvData.name}</div>
                    <div className="wa-main-header-status">
                      {activeConvData.online ? "Online" : "Offline"}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="fin-action-btn" title="Call"><Phone size={16} /></button>
                  <button className="fin-action-btn" title="More"><MoreVertical size={16} /></button>
                </div>
              </div>

              <div className="wa-chat-area">
                {messages.map((m) => (
                  <div key={m.id} className={`wa-message ${m.sent ? "sent" : "received"}`}>
                    {m.text}
                    <div className="wa-msg-time">{m.time}</div>
                  </div>
                ))}
              </div>

              <div className="wa-input-area">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button className="wa-send-btn" onClick={handleSend}>
                  <Send size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="wa-empty-chat">
              <MessageCircle size={48} />
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
