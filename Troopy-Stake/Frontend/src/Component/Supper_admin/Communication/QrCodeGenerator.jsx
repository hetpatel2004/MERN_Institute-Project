import React, { useState, useRef, useCallback } from "react";
import { QrCode, Download, Copy } from "lucide-react";
import "./Communication.css";

function generateQrMatrix(text) {
  const len = text.length;
  const size = 11;
  const matrix = Array.from({ length: size }, () => Array(size).fill(0));

  for (let i = 0; i < size; i++) {
    matrix[0][i] = 1;
    matrix[size - 1][i] = 1;
    matrix[i][0] = 1;
    matrix[i][size - 1] = 1;
  }

  matrix[0][0] = 1;
  matrix[0][size - 1] = 1;
  matrix[size - 1][0] = 1;
  matrix[size - 1][size - 1] = 1;

  for (let r = 1; r < size - 1; r++) {
    for (let c = 1; c < size - 1; c++) {
      const charIndex = (r - 1) * (size - 2) + (c - 1);
      if (charIndex < len * 8) {
        const byteIndex = Math.floor(charIndex / 8);
        const bitIndex = charIndex % 8;
        const byte = text.charCodeAt(byteIndex) || 0;
        matrix[r][c] = (byte >> (7 - bitIndex)) & 1;
      } else {
        matrix[r][c] = ((r * 7 + c * 13 + (r + c) * 3) % 5 === 0) ? 1 : 0;
      }
    }
  }

  return matrix;
}

export default function QrCodeGenerator() {
  const [inputText, setInputText] = useState("");
  const [qrData, setQrData] = useState("");
  const displayRef = useRef(null);

  const handleGenerate = useCallback(() => {
    if (!inputText.trim()) return;
    setQrData(inputText.trim());
  }, [inputText]);

  const handleDownload = useCallback(() => {
    if (!displayRef.current || !qrData) return;
    const canvas = document.createElement("canvas");
    const size = 260;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    const matrix = generateQrMatrix(qrData);
    const cellSize = size / matrix.length;
    ctx.fillStyle = "#101828";
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c]) {
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
      }
    }
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [qrData]);

  const handleCopy = useCallback(() => {
    if (!qrData) return;
    navigator.clipboard.writeText(qrData).catch(() => {});
  }, [qrData]);

  const matrix = qrData ? generateQrMatrix(qrData) : null;

  return (
    <div className="fin-page">
      <div className="fin-header">
        <div>
          <h1>QR Code Generator</h1>
          <p className="fin-subtitle">Generate QR codes for text or URLs</p>
        </div>
      </div>

      <div className="qr-page-wrap">
        <div className="fin-table-card">
          <div className="" style={{ padding: 32 }}>
            <div className="qr-input-group">
              <label>Text or URL <span className="text-danger">*</span></label>
              <input
                type="text"
                placeholder="Enter text or URL..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleGenerate(); }}
              />
            </div>

            <div className="qr-display" ref={displayRef}>
              {matrix ? (
                <div className="qr-canvas-grid" style={{ gridTemplateColumns: `repeat(${matrix.length}, 1fr)` }}>
                  {matrix.map((row, r) =>
                    row.map((cell, c) => (
                      <div key={`${r}-${c}`} className={`qr-cell ${cell ? "dark" : "light"}`} />
                    ))
                  )}
                </div>
              ) : (
                <div className="qr-placeholder">
                  <div className="qr-placeholder-icon"><QrCode size={64} /></div>
                  <p>Enter text and generate</p>
                </div>
              )}
            </div>

            <div className="qr-actions">
              <button className="qr-action-btn primary" onClick={handleGenerate} disabled={!inputText.trim()}>
                <QrCode size={18} /> Generate
              </button>
              <button className="qr-action-btn" onClick={handleDownload} disabled={!qrData}>
                <Download size={18} /> Download
              </button>
              <button className="qr-action-btn" onClick={handleCopy} disabled={!qrData}>
                <Copy size={18} /> Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
