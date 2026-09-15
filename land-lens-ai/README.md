# Land Lens AI — Intelligent Land Record Digitization & Validation System (ILRDVS)

A frontend prototype that digitizes scanned land records: upload a document, OCR it,
extract structured fields, validate them against a mock registry, and route the
result to approval or manual verification.

This is a **self-contained, single-file** application — `index.html` — with no
build step, no npm install, and no backend required. Everything (UI, mock data,
OCR, PDF text extraction, charts) runs client-side in the browser.

## Run it

Just open `index.html` in a modern browser (Chrome/Edge/Firefox), or serve the
folder with any static file server, e.g.:

```bash
npx serve .
# or
python3 -m http.server 8080
```

No install step is required either way — the only "dependencies" are loaded
from public CDNs at runtime (see below).

## Demo login credentials

| Role         | Email                  | Password    |
|--------------|-------------------------|-------------|
| Admin        | admin@example.com       | admin123    |
| Land Officer | officer@example.com     | officer123  |

## Pages

Landing · Login · Dashboard · Upload Land Record · OCR / Extracted Data ·
Validation · Validation Result · Land Records · Record Details ·
Errors & Duplicates · Reports · Users · Audit Logs · Settings

## How document processing works

The Upload page has two clearly separated modes:

- **Real Document Processing** — actually reads the file you upload:
  - Digital PDFs: text is extracted directly with **PDF.js** (no OCR needed).
  - Scanned PDFs / images: pages are OCR'd in-browser with **Tesseract.js**.
  - Recognized text is parsed with a set of label-based regex patterns to
    populate Owner Name, Survey Number, Document Number, Village, Mandal,
    District, State, Land Area, Land Type, and Registration Date — each with
    a confidence score, or "not detected" if a field's pattern wasn't found.
    Extracted fields are always editable before validation.
- **Demo Scenario** — a simulated pipeline using two fixed sample outcomes
  (98% clean match / 87% land-area mismatch) for demoing the validation UI
  without needing a real file.

Validation looks up a matching record in the mock registry (`RECORDS` array)
by survey number + village and compares the current field values against it;
if no match exists, the document is flagged for review as a new record.

> **Known limitation / pending work:** OCR is currently tuned for printed
> English text only. Multi-language OCR (Hindi + Telugu + English), detected
> document preview, "detected language" reporting, handwriting/stamp/seal
> tolerance, and extra fields (Registration Number, Consideration/Amount)
> for real Indian land-deed scans were requested but **not yet implemented**
> in this snapshot — see `CHANGELOG.md`.

## Tech stack

- HTML5 / CSS3 / vanilla JavaScript (no framework, no bundler)
- [Chart.js](https://www.chartjs.org/) (CDN) — dashboard & report charts
- [PDF.js](https://mozilla.github.io/pdf.js/) (CDN) — digital PDF text extraction
- [Tesseract.js](https://tesseract.projectnaptha.com/) (CDN) — in-browser OCR

All mock data (land records, users, audit logs) lives in-memory in
`index.html` and resets on page reload — there is no backend or database in
this snapshot.

## Repo layout

```
.
├── index.html          # the entire working application (open this)
├── README.md
├── CHANGELOG.md
├── .gitignore
└── legacy/
    └── ILRDVS.jsx       # earlier React/JSX prototype, superseded by index.html
```

`legacy/ILRDVS.jsx` is kept only for history — it was an earlier React-based
build of the same idea that was replaced because it didn't render reliably
outside a React-aware preview. It is not wired into `index.html` and is not
needed to run the app.
