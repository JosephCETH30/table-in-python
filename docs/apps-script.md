# Menyimpan respon survei ke Google Sheet

Setiap kali "Simpan respon" ditekan, form mengirim data ke `/api/responses` ([app/api/responses/route.ts](../app/api/responses/route.ts)). Route itu meneruskannya ke Google Apps Script, yang menambahkan satu baris ke sheet `Data_Profil_Driver`. Data juga tetap disimpan di `localStorage` perangkat sebagai cadangan.

## Setup Apps Script

1. Buka Google Sheet dataset. Pastikan ada tab bernama `Data_Profil_Driver`.
2. Buka **Extensions > Apps Script**, lalu tempel kode di bawah (sama dengan [apps-script.gs](apps-script.gs)). Ganti `ID_SPREADSHEET_DI_SINI` dengan ID dari URL sheet (bagian antara `/d/` dan `/edit`). Copy-paste, jangan diketik.
   Klik **Jalankan** sekali dan izinkan aksesnya. Error `postData` setelahnya wajar.
3. Klik **Deploy > New deployment**, pilih tipe **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Salin URL yang berakhiran `/exec`.

https://script.google.com/macros/s/AKfycbwDvtBsNVfhYn7rTCxl6G6nitcFh5f1fg2_ZEZRuBPSxPNG4cBdFWsBopkDP7JeeCUKXw/exec
```js
// Paste into Apps Script. Deploy > New deployment > Web app,
// Execute as: Me, Who has access: Anyone. Copy the /exec URL to SHEETS_WEBHOOK_URL.
// After every code change: Deploy > Manage deployments > Edit > New version.
const SHEET_ID = "ID_SPREADSHEET_DI_SINI"; // from the sheet URL: /d/<ID>/edit
const SHEET_NAME = "Data_Profil_Driver";

// Payload comes from lib/sheet-columns.ts: { keys, headers, formats, values }.
function doPost(e) {
  const { keys, headers, formats, values } = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  // Row 1 is always rewritten, so the column titles can't go missing or stale.
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setNotes([keys]);
  styleSheet(sheet);
  // Text format must be set before writing (keeps "D002", leading zeros);
  // the rest after, because Sheets' own date/number detection overrides it.
  const row = sheet.getRange(Math.max(sheet.getLastRow(), 1) + 1, 1, 1, values.length);
  const setFormats = (pick) =>
    formats.forEach((f, i) => {
      if (f && pick(f)) row.getCell(1, i + 1).setNumberFormat(f);
    });
  setFormats((f) => f === "@");
  row.setValues([values]);
  setFormats((f) => f !== "@");
  return ContentService.createTextOutput("ok");
}

// Readable header, frozen ID column, zebra rows. Safe to re-run.
function styleSheet(sheet) {
  const n = sheet.getLastColumn();
  // Banding paints over cell backgrounds, so it must not cover the header.
  sheet.getBandings().forEach((b) => b.remove());
  sheet
    .getRange(1, 1, 1, n)
    .setFontWeight("bold")
    .setBackground("#262626")
    .setFontColor("#ffffff")
    .setWrap(true)
    .setVerticalAlignment("middle")
    .setHorizontalAlignment("center");
  sheet.setRowHeight(1, 52);
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(1);
  sheet.setColumnWidths(1, n, 170);
  sheet.setColumnWidth(n, 360); // Catatan Kualitatif

  const rows = sheet.getMaxRows() - 1;
  sheet.getRange(2, 1, rows, n).setVerticalAlignment("top");
  sheet.getRange(2, n, rows, 1).setWrap(true);
  sheet
    .getRange(2, 1, rows, n)
    .applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, false, false);
}
```

Catatan perilaku script:
- Urutan kolom, nama header, dan format diatur di [lib/sheet-columns.ts](../lib/sheet-columns.ts), bukan di script.
- Setiap kali respon disimpan, baris 1 ditulis ulang sebagai judul kolom yang rapi: teks tebal, baris dan kolom ID dibekukan, format Rupiah dan tanggal, dan warna baris selang-seling. Nama variabel asli (mis. `Usia`) tersimpan sebagai note di tiap header.
- Kalau urutan kolom diubah di aplikasi, buat tab baru. Judul ikut berubah, tapi baris lama tetap di posisi kolom lamanya.

## Konfigurasi aplikasi

Set variabel environment berikut.

```
SHEETS_WEBHOOK_URL=<URL /exec dari langkah 4>
```

- Lokal: taruh di `.env.local` (sudah di-ignore git), lalu restart dev server.
- Hosting: tambahkan variabel yang sama di pengaturan environment, lalu deploy ulang.

## Tes

1. Isi form sampai "Simpan respon".
2. Cek tab `Data_Profil_Driver`: harus muncul satu baris baru.
3. Hapus baris tes sebelum pengumpulan data sungguhan.

Jika muncul toast "Gagal kirim ke Google Sheet", periksa:
- `SHEETS_WEBHOOK_URL` sudah di-set dan server sudah di-restart.
- Deployment berakses **Anyone**.
- Nama tab persis `Data_Profil_Driver`.

## Keamanan dan pemeliharaan

- URL `/exec` bisa dipakai siapa pun yang mengetahuinya untuk menambah baris ke sheet. Jangan dibagikan atau di-commit.
- Setelah mengubah kode Apps Script, buat **deployment versi baru** (Deploy > Manage deployments > Edit > New version). URL lama tetap menjalankan versi lama sampai diperbarui.
