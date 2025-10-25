## Dokumentasi API

Anda dapat menemukan dokumentasi API lengkap untuk proyek ini di Postman:
[Dokumentasi API Postman](https://documenter.getpostman.com/view/44671713/2sB3Wjz3pW#be85099c-f34f-480e-95c7-d6b9aa99842e)

## Pola Desain dan Struktur Proyek

Repositori ini menggunakan beberapa pola desain dan struktur direktori untuk menjaga kode tetap terorganisir, terkelola, dan terukur. Berikut adalah penjelasan pola utama yang digunakan:

### 1. Pola Modular (Modular Pattern)

Aplikasi ini dibagi menjadi beberapa **modul** yang terpisah berdasarkan fungsionalitasnya (misalnya, `AuthModule`, `UserModule`, `MutationModule`). Setiap modul merangkum *controllers*, *services*, *entities*, dan *DTOs* yang terkait dengan fitur tertentu. Pendekatan ini meningkatkan **reusabilitas** dan **pemeliharaan** kode.

**Contoh Lokasi:**
* `src/auth/auth.module.ts`
* `src/user/user.module.ts`
* `src/mutation/mutation.module.ts`

### 2. Pola Controller-Service-Repository

Pola ini memisahkan tanggung jawab ke dalam tiga lapisan utama dalam setiap modul:

* **Controllers** (`*.controller.ts`): Bertanggung jawab untuk menangani *request* HTTP yang masuk, memvalidasi *payload* (menggunakan DTOs), memanggil *service* yang sesuai, dan mengirimkan *response* HTTP kembali ke klien.
    **Contoh Lokasi:** `src/user/user.controller.ts`, `src/mutation/mutation.controller.ts`

* **Services** (`*.service.ts`): Berisi **logika bisnis** utama aplikasi. *Service* dipanggil oleh *controller* dan bertanggung jawab untuk mengoordinasikan operasi, memanipulasi data, dan berinteraksi dengan lapisan *repository* untuk akses data.
    **Contoh Lokasi:** `src/user/user.service.ts`, `src/mutation/mutation.service.ts`

* **Repository Pattern (TypeORM Built-in)**: Lapisan ini bertanggung jawab untuk interaksi dengan *database*. Alih-alih menggunakan *custom repository pattern*, proyek ini memanfaatkan `Repository` bawaan dari **TypeORM** yang di-*inject* ke dalam *services* menggunakan `@InjectRepository()`. Ini menyederhanakan operasi CRUD dan *query database* lainnya.
    **Contoh Penggunaan:** Dalam `src/user/user.service.ts`, `UserRepository` di-*inject* dan digunakan untuk mengakses data *user*.

### 3. Lapisan Konfigurasi (`config`)

Direktori `src/config` berisi file-file untuk mengelola konfigurasi aplikasi, seperti kredensial *database* dan *secret key* JWT. Konfigurasi ini dimuat dari *environment variables* menggunakan pustaka `dotenv`. Pendekatan ini menggunakan **objek atau class sederhana** untuk mengekspor konfigurasi, bukan modul `@nestjs/config`.

**Contoh Lokasi:**
* `src/config/database.ts`
* `src/config/jwt.ts`
* `src/config/hash.ts`

### 4. Lapisan Decorators (`decorators`)

Direktori `src/decorators` menampung **custom decorators** yang dibuat untuk keperluan spesifik, seperti validasi kustom pada DTO.

**Contoh Lokasi:**
* `src/decorators/is-equals-to.decorator.ts`
* `src/decorators/is-different-to.decorator.ts`

### 5. Lapisan Entitas (`entities`)

Di dalam setiap modul (misalnya, `src/user/entities/`, `src/mutation/entities/`), terdapat file `*.entity.ts`. File-file ini mendefinisikan **struktur tabel *database*** menggunakan dekorator **TypeORM**. Entitas ini merepresentasikan data yang disimpan dalam *database*.

**Contoh Lokasi:**
* `src/user/entities/user.entity.ts`
* `src/mutation/entities/mutation.entity.ts`
* `src/auth/entities/session.entity.ts`

### 6. Lapisan DTO (Data Transfer Object) (`dto`)

Di dalam setiap modul (misalnya, `src/user/dto/`, `src/mutation/dto/`), terdapat file `*.dto.ts`. DTO digunakan untuk mendefinisikan **bentuk data** yang diterima dari *request* klien (payload). DTO juga dimanfaatkan bersama pustaka `class-validator` dan `class-transformer` untuk **validasi** dan **transformasi** data *request* secara otomatis.

**Contoh Lokasi:**
* `src/user/dto/update-user.dto.ts`
* `src/user/dto/update-password.dto.ts`
* `src/auth/dto/login.dto.ts`
* `src/auth/dto/register.dto.ts`
* `src/mutation/dto/create-mutation.dto.ts`
* `src/mutation/dto/get-mutation.dto.ts`
