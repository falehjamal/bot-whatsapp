// src/utils/state.js

let qrData = null;
let connectionStatus = 'disconnected';
let sockInstance = null;

/**
 * Set QR dan status koneksi.
 * Kalau status 'connected' atau 'disconnected', otomatis hapus qrData.
 */
export function setConnectionInfo(qr, status) {
  connectionStatus = status;

  if (status === 'qr') {
    qrData = qr;
  } else {
    qrData = null;
  }
}

export function getQrData() {
  return qrData;
}

export function getConnectionStatus() {
  return connectionStatus;
}

export function setSockInstance(sock) {
  sockInstance = sock;
}

export function getSockInstance() {
  return sockInstance;
}
