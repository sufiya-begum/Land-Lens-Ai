# Changelog

## v3 — Real OCR (this snapshot)
- Upload page split into two clearly separated modes: **Real Document
  Processing** and **Demo Scenario**.
- Real mode actually reads the uploaded file:
  - Digital PDFs → text extracted via PDF.js.
  - Scanned PDFs / images → OCR'd in-browser via Tesseract.js, with a live
    progress bar driven by Tesseract's real recognition progress.
  - Extracted text is parsed with label-based regex to populate the record
    fields, each with a genuine confidence score (or "not detected").
- OCR Result page shows the actual engine used, overall confidence, and a
  "View Raw Extracted Text" panel with the real recognized text.
- Validation no longer compares against hard-coded demo answers — it looks
  up a matching record in the live registry by survey number + village and
  validates whatever is currently in the extracted fields (real or demo)
  against that.
- Added a `State` field across OCR, validation, and record views.
- **Pending / not yet implemented:** multi-language OCR (English + Hindi +
  Telugu), handwriting/stamp/seal-tolerant extraction, document image
  preview on the OCR Result page, "Detected Language" reporting, and
  additional fields (Registration Number, Consideration/Amount) for real
  Indian land-deed scans. These were requested but not completed in this
  snapshot.

## v2 — Rebuilt as single-file HTML/CSS/vanilla JS
- The v1 React/JSX artifact didn't render reliably in the Claude Artifact
  preview, so the whole app was rebuilt from scratch as one self-contained
  `index.html` file (no React, no JSX, no build step).
- Recreated all 14 pages, sidebar navigation, mock data, toasts, modals, and
  Chart.js-based charts using plain template-string rendering and a single
  `render()` function with focus-preserving re-renders.
- Upload page had a simulated OCR pipeline (Uploading → OCR → Extracting →
  Validating → Completed) driven by two fixed demo scenarios:
  1. Successful validation — 98% confidence.
  2. Land-area mismatch — 87% confidence, Manual Verification Required.

## v1 — Initial React/JSX prototype
- First working version of ILRDVS built as a React component (`ILRDVS.jsx`):
  landing, login, dashboard, upload, OCR result, validation, validation
  result, land records, record details, errors & duplicates, reports,
  users, audit logs, and settings, all using mock data and React state.
- Superseded by v2 (see `legacy/ILRDVS.jsx`).
