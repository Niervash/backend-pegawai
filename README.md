# Backend Pegawai

Backend ini dibangun menggunakan **Node.js**, **Express**, **TypeScript**, dan **Sequelize ORM** dengan database **MySQL**.

## Teknologi yang Digunakan

- **Runtime**: Node.js
- **Bahasa**: TypeScript
- **Framework**: Express.js
- **ORM**: Sequelize
- **Database**: MySQL
- **Autentikasi**: JWT (JSON Web Token)
- **Middleware**: Helmet, Cors, Morgan, Multer

## Prasyarat

Sebelum menjalankan proyek ini, pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (versi 16 atau lebih baru)
- [MySQL](https://www.mysql.com/)

## Cara Instalasi

1. **Clone repositori ini** (atau download source code-nya).
2. **Masuk ke direktori proyek**:
   ```bash
   cd backend
   ```
3. **Instal dependensi**:
   ```bash
   npm install
   ```

## Konfigurasi Environment

1. Salin file `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
2. Buka file `.env` dan sesuaikan nilai-nilainya dengan konfigurasi database Anda:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=password_anda
   DB_NAME=nama_db
   DB_PORT=3306
   JWT_SECRET=rahasia_anda
   PORT=5000
   ```

## Setup Database

1. **Buat database baru** di MySQL dengan nama yang sesuai di `.env` (contoh: `simpeg_db`).
2. **Jalankan Migrasi** untuk membuat tabel-tabel yang diperlukan:
   ```bash
   npx sequelize-cli db:migrate
   ```
3. **Jalankan Seeder** untuk mengisi data awal (Master Data & Demo Users):
   ```bash
   npx sequelize-cli db:seed:all
   ```

## Menjalankan Aplikasi

### Mode Pengembangan (Development)
Untuk menjalankan server dengan fitur *auto-reload* saat ada perubahan kode:
```bash
npm run dev
```
Server akan berjalan di `http://localhost:5000` (atau port yang ditentukan di `.env`).

### Mode Produksi (Build & Start)
1. Kompilasi TypeScript ke JavaScript:
   ```bash
   npm run build
   ```
2. Jalankan hasil kompilasi:
   ```bash
   npm start
   ```

## Endpoint API Utama

- **Auth**: `/api/auth` (login, me)
- **Master Data**: `/api/master` (golongan, jabatan, unit-kerja)
- **Pegawai**: `/api/pegawai`
- **Approvals**: `/api/approvals`
- **Dashboard**: `/api/dashboard`
- **Dokumen**: `/api/dokumen`

## Struktur Folder

- `src/config`: Konfigurasi database dan Sequelize.
- `src/controllers`: Logika bisnis dan penanganan request.
- `src/middlewares`: Middleware untuk autentikasi, upload, dan error handling.
- `src/models`: Definisi model tabel database.
- `src/migrations`: File migrasi skema database.
- `src/seeders`: File untuk pengisian data awal database.
- `src/routes`: Definisi endpoint API.
- `uploads/`: Folder untuk menyimpan file yang diunggah.

---
Dikembangkan untuk sistem manajemen kepegawaian.
