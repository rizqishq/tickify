# Tickify - Backend Service

Tickify adalah platform manajemen tiket acara yang komprehensif, dirancang untuk memfasilitasi pembuatan acara, penjualan tiket, dan manajemen pesanan dengan mudah dan efisien. Repositori ini berisi kode sumber untuk layanan backend yang mendukung aplikasi Tickify.

## Dokumentasi API

Dokumentasi lengkap mengenai endpoint API tersedia melalui tautan berikut:

[Dokumentasi Postman](https://documenter.getpostman.com/view/50574177/2sB3dSQ8mV)

## Daftar Isi

1.  [Tentang Proyek](#tentang-proyek)
2.  [Fitur Utama](#fitur-utama)
3.  [Teknologi yang Digunakan](#teknologi-yang-digunakan)
4.  [Prasyarat](#prasyarat)
5.  [Instalasi](#instalasi)
6.  [Konfigurasi](#konfigurasi)
7.  [Menjalankan Aplikasi](#menjalankan-aplikasi)
8.  [Struktur Proyek](#struktur-proyek)

## Tentang Proyek

Tickify dibangun dengan arsitektur yang scalable dan aman, menyediakan RESTful API untuk interaksi antara klien (frontend web/mobile) dan database. Sistem ini menangani otentikasi pengguna, manajemen acara, pemesanan tiket, dan integrasi pembayaran.

## Fitur Utama

-   **Otentikasi & Otorisasi**: Registrasi, Login, dan manajemen profil pengguna menggunakan JWT (JSON Web Token).
-   **Manajemen Acara**: Pembuatan, pembaruan, dan penghapusan acara oleh penyelenggara atau admin.
-   **Sistem Tiket**: Manajemen stok tiket, kategori tiket, dan validasi.
-   **Pemesanan & Pembayaran**: Alur pemesanan tiket lengkap dengan integrasi gateway pembayaran (Xendit).
-   **Dashboard Admin**: Endpoint khusus untuk administrator guna mengelola pengguna, acara, dan tiket secara global.
-   **Upload Media**: Integrasi dengan Cloudinary untuk penyimpanan gambar banner acara dan profil pengguna.

## Teknologi yang Digunakan

Proyek ini dikembangkan menggunakan teknologi berikut:

-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: PostgreSQL
-   **Driver Database**: node-postgres (pg)
-   **Otentikasi**: JSON Web Token (JWT) & Bcrypt
-   **Penyimpanan Media**: Cloudinary
-   **Gerbang Pembayaran**: Xendit

## Prasyarat

Sebelum memulai, pastikan perangkat Anda telah terinstal:

-   Node.js (versi 16 atau lebih baru)
-   npm (Node Package Manager)
-   PostgreSQL Server

## Instalasi

Ikuti langkah-langkah berikut untuk menginstal dan menjalankan proyek di lingkungan lokal Anda:

1.  **Clone Repositori**

    Salin kode sumber proyek ke direktori lokal Anda.

2.  **Instal Dependensi**

    Masuk ke direktori proyek dan jalankan perintah berikut untuk menginstal semua paket yang diperlukan:

    ```bash
    npm install
    ```

3.  **Persiapkan Database**

    -   Buat database baru di PostgreSQL.
    -   Jalankan skrip migrasi untuk membuat tabel yang diperlukan:

    ```bash
    psql -U username_anda -d nama_database -f migrations/001_init.sql
    ```

    *Catatan: Sesuaikan `username_anda` dan `nama_database` dengan konfigurasi PostgreSQL Anda.*

## Konfigurasi

Salin file contoh konfigurasi `.env.example` menjadi `.env` dan sesuaikan nilainya dengan lingkungan lokal Anda.

```bash
cp .env.example .env
```

Pastikan variabel berikut diisi dengan benar di dalam file `.env`:

-   `PORT`: Port server (default: 5000)
-   `DATABASE_URL`: URL koneksi PostgreSQL (contoh: `postgres://user:pass@localhost:5432/dbname`)
-   `JWT_SECRET`: Kunci rahasia untuk enkripsi token
-   `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Kredensial Cloudinary
-   `XENDIT_SECRET_KEY`: Kunci rahasia API Xendit

## Menjalankan Aplikasi

Untuk menjalankan server dalam mode pengembangan (dengan hot-reload):

```bash
npm run dev
```

Server akan berjalan pada URL default `http://localhost:5000` (atau sesuai port yang Anda konfigurasi).

## Struktur Proyek

Berikut adalah gambaran umum struktur direktori proyek:

-   `src/config`: Konfigurasi database dan layanan pihak ketiga
-   `src/controllers`: Logika bisnis utama untuk setiap endpoint
-   `src/middlewares`: Middleware untuk otentikasi, upload file, dan penanganan error
-   `src/routes`: Definisi rute API
-   `src/services`: Logika tambahan atau layanan eksternal
-   `migrations`: Skrip SQL untuk skema database
