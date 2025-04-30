# Bot WhatsApp

Bot WhatsApp yang dibangun menggunakan Node.js dan WhatsApp Web API (@whiskeysockets/baileys). Bot ini dilengkapi dengan sistem antrian pesan menggunakan BullMQ dan dashboard monitoring.

---

## 📌 Fitur Utama

- **Autentikasi WhatsApp**: Sistem autentikasi multi-file untuk menyimpan status koneksi
- **Antrian Pesan**: Menggunakan BullMQ untuk mengelola pengiriman pesan secara asinkron
- **Dashboard Monitoring**: Antarmuka web untuk memantau antrian pesan
- **Respon Otomatis**: Sistem untuk menangani pesan masuk secara otomatis
- **Koneksi Otomatis**: Sistem reconnecting otomatis saat koneksi terputus

## 🛠 Teknologi yang Digunakan

- Node.js
- Express.js
- @whiskeysockets/baileys (WhatsApp Web API)
- BullMQ (Sistem Antrian)
- Redis
- QR Code Terminal

## 🚀 Cara Menjalankan

1. Install dependencies:
```bash
npm install
```

2. Pastikan Redis server berjalan di localhost:6379

3. Jalankan aplikasi:
```bash
node index.js
```

4. Scan QR Code yang muncul di terminal untuk menghubungkan bot

5. Akses dashboard monitoring di `http://localhost:3000/dashboard`

## 📝 Catatan

- Bot menggunakan sistem autentikasi multi-file yang disimpan di folder `auth/`
- Pastikan Redis server berjalan sebelum menjalankan aplikasi
- Dashboard monitoring dapat diakses untuk melihat status antrian pesan



### Contoh CURL PHP 
```bash
<?php

$url = "http://127.0.0.1:3000/send-private";

// Data yang akan dikirim
$data = [
    'number' => '6285281411550',
    'message' => 'ini testing redis bot wa',
];

// Inisialisasi CURL
$ch = curl_init($url);

// Set opsi CURL
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data)); // kirim sebagai JSON
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Content-Length: ' . strlen(json_encode($data))
]);

// Eksekusi CURL dan ambil responsenya
$response = curl_exec($ch);

// Cek error
if (curl_errno($ch)) {
    echo curl_error($ch);
} else {
    echo $response;
}

// Tutup CURL
curl_close($ch);
```
