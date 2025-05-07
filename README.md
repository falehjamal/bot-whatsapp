# Bot WhatsApp

Bot WhatsApp berbasis Node.js & Express menggunakan WhatsApp Web API (@whiskeysockets/baileys), BullMQ untuk antrian pesan, dan dashboard monitoring berbasis web.  
Konfigurasi aplikasi kini lebih mudah menggunakan file `.env`.

## 📌 Fitur Utama
- **Autentikasi WhatsApp**: Scan QR via web, status koneksi real-time
- **Antrian Pesan**: BullMQ + Redis untuk pengiriman pesan asinkron
- **Dashboard Monitoring**: Pantau antrian pesan di `/queue`
- **Respon Otomatis**: Balasan otomatis untuk pesan tertentu
- **Koneksi Otomatis**: Reconnect otomatis jika terputus
- **Konfigurasi Mudah**: Semua setting Redis & port via `.env`

## 🛠 Teknologi
- Node.js, Express.js
- @whiskeysockets/baileys
- BullMQ
- Redis
- ioredis
- dotenv

## 🚀 Cara Menjalankan

1. **Clone repo & install dependencies**
   ```bash
   git clone https://github.com/falehjamal/bot-whatsapp.git
   cd bot-whatsapp
   npm install
   ```

2. **Buat file `.env` di root project:**
   ```
   REDIS_HOST=127.0.0.1
   REDIS_PORT=6379
   REDIS_PASSWORD=
   PORT=3000
   ```

3. **Pastikan Redis server berjalan**  
   (Default: `127.0.0.1:6379`)

4. **Jalankan aplikasi**
   ```bash
   npm start
   ```
   Atau untuk mode development (auto-reload):
   ```bash
   npm run dev
   ```

5. **Akses dashboard bot**
   - Buka `http://localhost:3000` untuk scan QR & kontrol bot
   - Buka `http://localhost:3000/queue` untuk monitoring antrian pesan

6. **Logout & Scan Ulang**
   - Klik tombol "Logout" di dashboard untuk disconnect & reset auth
   - Scan ulang QR jika ingin login ulang

## 📝 Catatan
- Folder `auth/` akan otomatis terhapus saat logout.
- Semua konfigurasi Redis & port Express diatur lewat `.env`.
- Tidak perlu install package yang tidak digunakan, dependencies sudah minimal.

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
