<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Kerangka kerja <a href="http://nodejs.org" target="_blank">Node.js</a> progresif untuk membangun aplikasi sisi server yang efisien dan terukur.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  ## Deskripsi

Repositori *starter* kerangka kerja [Nest](https://github.com/nestjs/nest) menggunakan TypeScript.

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

## Pengaturan Proyek

```bash
$ npm install
````

## Kompilasi dan Jalankan Proyek

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Jalankan Tes

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

Ketika Anda siap untuk men-deploy aplikasi NestJS Anda ke produksi, ada beberapa langkah kunci yang dapat Anda ambil untuk memastikannya berjalan seefisien mungkin. Lihat [dokumentasi deployment](https://docs.nestjs.com/deployment) untuk informasi lebih lanjut.

Jika Anda mencari platform berbasis cloud untuk men-deploy aplikasi NestJS Anda, lihat [Mau](https://mau.nestjs.com), platform resmi kami untuk men-deploy aplikasi NestJS di AWS. Mau membuat deployment menjadi mudah dan cepat, hanya memerlukan beberapa langkah sederhana:

```bash
$npm install -g @nestjs/mau$ mau deploy
```

Dengan Mau, Anda dapat men-deploy aplikasi Anda hanya dalam beberapa klik, memungkinkan Anda fokus membangun fitur daripada mengelola infrastruktur.

## Sumber Daya

Lihat beberapa sumber daya yang mungkin berguna saat bekerja dengan NestJS:

  - Kunjungi [Dokumentasi NestJS](https://docs.nestjs.com) untuk mempelajari lebih lanjut tentang kerangka kerja ini.
  - Untuk pertanyaan dan dukungan, silakan kunjungi [saluran Discord](https://discord.gg/G7Qnnhy) kami.
  - Untuk menyelam lebih dalam dan mendapatkan lebih banyak pengalaman langsung, lihat [kursus](https://courses.nestjs.com/) video resmi kami.
  - Deploy aplikasi Anda ke AWS dengan bantuan [NestJS Mau](https://mau.nestjs.com) hanya dalam beberapa klik.
  - Visualisasikan grafik aplikasi Anda dan berinteraksi dengan aplikasi NestJS secara *real-time* menggunakan [NestJS Devtools](https://devtools.nestjs.com).
  - Butuh bantuan dengan proyek Anda (paruh waktu hingga penuh waktu)? Lihat [dukungan enterprise](https://enterprise.nestjs.com) resmi kami.
  - Untuk tetap terhubung dan mendapatkan pembaruan, ikuti kami di [X](https://x.com/nestframework) dan [LinkedIn](https://linkedin.com/company/nestjs).
  - Mencari pekerjaan, atau punya pekerjaan untuk ditawarkan? Lihat [Papan Pekerjaan](https://jobs.nestjs.com) resmi kami.

## Dukungan

Nest adalah proyek sumber terbuka berlisensi MIT. Ini dapat berkembang berkat para sponsor dan dukungan dari para pendukung yang luar biasa. Jika Anda ingin bergabung dengan mereka, silakan [baca lebih lanjut di sini](https://docs.nestjs.com/support).

## Tetap Terhubung

  - Penulis - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
  - Situs Web - [https://nestjs.com](https://nestjs.com/)
  - Twitter - [@nestframework](https://twitter.com/nestframework)

## Lisensi

Nest berlisensi [MIT](https://github.com/nestjs/nest/blob/master/LICENSE).

```
```
