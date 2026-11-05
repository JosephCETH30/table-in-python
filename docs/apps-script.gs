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
