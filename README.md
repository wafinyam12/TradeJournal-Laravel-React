# 📈 TradeJournal – Laravel & React SPA

**TradeJournal** adalah aplikasi pencatatan dan analisis trading (forex, crypto, dll.) berbasis **full-stack modern**.  
Backend dibangun dengan **Laravel 10 + Sanctum**, frontend menggunakan **React 18 + Inertia + Vite + Tailwind CSS**,  
menghasilkan pengalaman **SPA (Single Page Application)** yang cepat, aman, dan responsif.

---

## 🧰 Kebutuhan Sistem
| Komponen     | Versi / Catatan           |
|--------------|---------------------------|
| PHP          | ≥ 8.1                     |
| Composer     | Versi terbaru             |
| Node.js      | ≥ 18                      |
| PostgreSQL   | (default di `.env`)       |
| Git          | Untuk clone repository    |

---

## 🚀 Instalasi Lengkap (0 → Running)

### 1. Clone & Masuk ke Folder
```bash
git clone https://github.com/yourname/trade-journal.git
cd trade-journal
```

### 2. Install Dependensi

**Backend (Laravel)**:
```bash
composer install
```

**Frontend (React, Tailwind, Vite, Axios, Inertia)**:
```bash
npm install
```

### 3. Konfigurasi Environment
Salin file environment dan buat app key:
```bash
cp .env.example .env
php artisan key:generate
```

Edit file `.env` sesuai database lokal:
```dotenv
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=tradejournal
DB_USERNAME=postgres
DB_PASSWORD=password
```

### 4. Setup Database & Sanctum
```bash
php artisan migrate
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```
Opsional: isi data awal
```bash
php artisan db:seed
```

### 5. Jalankan Server

**Terminal 1 – Backend:**
```bash
php artisan serve
# Akses di http://127.0.0.1:8000
```

**Terminal 2 – Frontend (Hot Module Reload):**
```bash
npm run dev
```

Untuk build production:
```bash
npm run build
```

---

## 📂 Struktur Proyek Singkat
```
trade-journal/
├── app/                  # Logika Laravel
├── resources/js/
│   ├── Pages/            # Halaman React (Inertia)
│   ├── Components/       # Komponen React reusable
│   └── app.jsx           # Entry point React
├── routes/               # API & web routes (Inertia)
├── tailwind.config.js    # Konfigurasi Tailwind CSS
└── vite.config.js        # Konfigurasi Vite
```

---

## 🧪 Skrip & Workflow Development

| Tujuan               | Perintah                |
|----------------------|------------------------|
| Dev server (HMR)     | `npm run dev`           |
| Build production     | `npm run build`         |
| Lint PHP             | `./vendor/bin/pint`     |
| Jalankan test        | `php artisan test`      |

---

## 📦 Teknologi yang Digunakan
- **Laravel 10** – backend & REST API
- **Laravel Sanctum** – autentikasi token
- **React 18** – library UI
- **Inertia** – bridge SPA tanpa API manual
- **Vite** – bundler & HMR super cepat
- **Tailwind CSS** – utility-first styling
- **Axios** – komunikasi HTTP
- **PostgreSQL** – database utama

---

## 📄 Lisensi
MIT © 2025 – Bebas digunakan, dimodifikasi, dan didistribusikan.

Selamat mencoba & semoga trading-nya profitable! 🚀
