import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  LayoutDashboard, UploadCloud, FileText, CheckCircle2, AlertTriangle,
  Files, Users as UsersIcon, ScrollText, Settings as SettingsIcon, LogOut,
  ChevronRight, ChevronDown, Search, Bell, MapPin, Calendar, Ruler, Hash,
  User, ShieldCheck, XCircle, Clock, TrendingUp, Menu, X, Eye, Edit3,
  Trash2, Download, Filter, ArrowRight, ArrowLeft, RefreshCw, AlertCircle,
  BarChart3, PieChart as PieChartIcon, Building2, FileCheck2, Copy,
  ScanLine, Loader2, Landmark, UserCog, KeyRound, Plus, Check, ChevronsUpDown,
  FolderOpen, ClipboardCheck, Layers, Info
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

/* ============================== CONSTANTS ============================== */

const BRAND = {
  name: "ILRDVS",
  full: "Intelligent Land Record Digitization & Validation System",
  dept: "Department of Revenue, Registration & Survey",
};

const STATUS_STYLES = {
  Verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Error: "bg-red-50 text-red-700 border-red-200",
  "Manual Verification": "bg-orange-50 text-orange-700 border-orange-200",
};

const STATUS_DOT = {
  Verified: "bg-emerald-500",
  Pending: "bg-amber-500",
  Error: "bg-red-500",
  "Manual Verification": "bg-orange-500",
};

const FIELD_LABELS = {
  ownerName: "Owner Name",
  surveyNumber: "Survey Number",
  documentNumber: "Document Number",
  village: "Village",
  mandal: "Mandal",
  district: "District",
  landArea: "Land Area",
  landType: "Land Type",
  registrationDate: "Registration Date",
};

const FIELD_ICONS = {
  ownerName: User,
  surveyNumber: Hash,
  documentNumber: FileText,
  village: MapPin,
  mandal: MapPin,
  district: MapPin,
  landArea: Ruler,
  landType: Layers,
  registrationDate: Calendar,
};

const INITIAL_RECORDS = [
  { id: "LR-1001", ownerName: "K. Venkata Rao", surveyNumber: "142/2A", documentNumber: "DOC-2024-08821", village: "Peddapuram", mandal: "Kakinada Rural", district: "Kakinada", landArea: "2.45 acres", landType: "Agricultural", registrationDate: "2024-03-12", status: "Verified", confidence: 98, uploadedDate: "2024-03-14" },
  { id: "LR-1002", ownerName: "S. Lakshmi Devi", surveyNumber: "88/1B", documentNumber: "DOC-2023-09154", village: "Gollaprolu", mandal: "Gollaprolu", district: "Kakinada", landArea: "2.80 acres", landType: "Agricultural", registrationDate: "2023-11-08", status: "Verified", confidence: 96, uploadedDate: "2023-11-10" },
  { id: "LR-1003", ownerName: "M. Prasad Reddy", surveyNumber: "56/3", documentNumber: "DOC-2024-07733", village: "Tuni", mandal: "Tuni", district: "East Godavari", landArea: "1.20 acres", landType: "Residential", registrationDate: "2024-01-22", status: "Pending", confidence: 82, uploadedDate: "2024-01-23" },
  { id: "LR-1004", ownerName: "A. Suryanarayana", surveyNumber: "210/1", documentNumber: "DOC-2023-06621", village: "Rajahmundry Rural", mandal: "Rajahmundry Rural", district: "East Godavari", landArea: "4.00 acres", landType: "Agricultural", registrationDate: "2023-09-05", status: "Error", confidence: 54, uploadedDate: "2023-09-06", issue: "Illegible document scan — key fields unreadable" },
  { id: "LR-1005", ownerName: "P. Anitha", surveyNumber: "12/4C", documentNumber: "DOC-2024-05512", village: "Anakapalli", mandal: "Anakapalli", district: "Visakhapatnam", landArea: "0.85 acres", landType: "Residential", registrationDate: "2024-02-18", status: "Manual Verification", confidence: 87, uploadedDate: "2024-02-19", issue: "Land area mismatch with registry database" },
  { id: "LR-1006", ownerName: "D. Ramesh Babu", surveyNumber: "305/2", documentNumber: "DOC-2023-04409", village: "Bhimavaram", mandal: "Bhimavaram", district: "West Godavari", landArea: "3.60 acres", landType: "Agricultural", registrationDate: "2023-12-30", status: "Verified", confidence: 95, uploadedDate: "2023-12-31" },
  { id: "LR-1007", ownerName: "V. Sita Mahalakshmi", surveyNumber: "77/1", documentNumber: "DOC-2024-03302", village: "Eluru Rural", mandal: "Eluru Rural", district: "West Godavari", landArea: "1.95 acres", landType: "Agricultural", registrationDate: "2024-04-02", status: "Verified", confidence: 97, uploadedDate: "2024-04-03" },
  { id: "LR-1008", ownerName: "N. Krishna Murthy", surveyNumber: "88/1B", documentNumber: "DOC-2024-09155", village: "Gollaprolu", mandal: "Gollaprolu", district: "Kakinada", landArea: "2.80 acres", landType: "Agricultural", registrationDate: "2024-05-02", status: "Error", confidence: 41, uploadedDate: "2024-05-03", issue: "Duplicate of LR-1002 — identical survey number & village", duplicateOf: "LR-1002" },
  { id: "LR-1009", ownerName: "B. Chandrasekhar", surveyNumber: "19/5", documentNumber: "DOC-2023-02214", village: "Vijayawada Rural", mandal: "Vijayawada Rural", district: "Krishna", landArea: "2.10 acres", landType: "Commercial", registrationDate: "2023-08-14", status: "Pending", confidence: 79, uploadedDate: "2023-08-15" },
  { id: "LR-1010", ownerName: "G. Padmavathi", surveyNumber: "150/3A", documentNumber: "DOC-2023-01198", village: "Narasapuram", mandal: "Narasapuram", district: "West Godavari", landArea: "1.50 acres", landType: "Residential", registrationDate: "2023-07-01", status: "Verified", confidence: 99, uploadedDate: "2023-07-02" },
];

const INITIAL_USERS = [
  { id: "U1", name: "Admin User", email: "admin@example.com", password: "admin123", role: "Admin", status: "Active", lastLogin: "2024-05-20 09:14" },
  { id: "U2", name: "Land Officer", email: "officer@example.com", password: "officer123", role: "Land Officer", status: "Active", lastLogin: "2024-05-19 16:42" },
  { id: "U3", name: "R. Naveen Kumar", email: "naveen.kumar@landrecords.gov.in", role: "Land Officer", status: "Active", lastLogin: "2024-05-18 11:02" },
  { id: "U4", name: "T. Swathi", email: "swathi.t@landrecords.gov.in", role: "Verifier", status: "Inactive", lastLogin: "2024-04-30 08:20" },
  { id: "U5", name: "C. Mahesh", email: "mahesh.c@landrecords.gov.in", role: "Verifier", status: "Active", lastLogin: "2024-05-21 08:55" },
];

const INITIAL_AUDIT = [
  { id: "A1", timestamp: "2024-05-21 10:32", user: "Admin User", action: "Approved Record", details: "LR-1001 approved after validation (98% confidence)" },
  { id: "A2", timestamp: "2024-05-20 09:50", user: "Land Officer", action: "Uploaded Document", details: "New land record document uploaded for OCR processing" },
  { id: "A3", timestamp: "2024-05-19 17:10", user: "Admin User", action: "Flagged Duplicate", details: "LR-1008 flagged as duplicate of LR-1002" },
  { id: "A4", timestamp: "2024-05-19 15:22", user: "Land Officer", action: "Manual Verification", details: "LR-1005 sent for manual verification (land area mismatch)" },
  { id: "A5", timestamp: "2024-05-18 12:05", user: "Admin User", action: "User Added", details: "New user T. Swathi added with role Verifier" },
  { id: "A6", timestamp: "2024-05-17 09:40", user: "Admin User", action: "Settings Updated", details: "Validation threshold changed to 85%" },
];

const SCENARIOS = {
  A: {
    key: "A",
    label: "Scenario 1 — Clean Match",
    fileName: "Land_Deed_Peddapuram_142.pdf",
    description: "Document data matches the registry exactly.",
    dbRecordId: "LR-1001",
    extracted: {
      ownerName: "K. Venkata Rao", surveyNumber: "142/2A", documentNumber: "DOC-2024-08821",
      village: "Peddapuram", mandal: "Kakinada Rural", district: "Kakinada",
      landArea: "2.45 acres", landType: "Agricultural", registrationDate: "2024-03-12",
    },
    confidence: {
      ownerName: 99, surveyNumber: 97, documentNumber: 99, village: 96, mandal: 95,
      district: 99, landArea: 98, landType: 100, registrationDate: 97,
    },
    dbValues: {
      ownerName: "K. Venkata Rao", surveyNumber: "142/2A", documentNumber: "DOC-2024-08821",
      village: "Peddapuram", mandal: "Kakinada Rural", district: "Kakinada",
      landArea: "2.45 acres", landType: "Agricultural", registrationDate: "2024-03-12",
    },
    isNew: false,
  },
  B: {
    key: "B",
    label: "Scenario 2 — Land Area Mismatch",
    fileName: "Land_Deed_Gollaprolu_88.pdf",
    description: "Extracted land area does not match the registry record.",
    dbRecordId: "LR-1002",
    extracted: {
      ownerName: "S. Lakshmi Devi", surveyNumber: "88/1B", documentNumber: "DOC-2023-09154",
      village: "Gollaprolu", mandal: "Gollaprolu", district: "Kakinada",
      landArea: "3.10 acres", landType: "Agricultural", registrationDate: "2023-11-08",
    },
    confidence: {
      ownerName: 95, surveyNumber: 93, documentNumber: 96, village: 90, mandal: 88,
      district: 97, landArea: 72, landType: 99, registrationDate: 94,
    },
    dbValues: {
      ownerName: "S. Lakshmi Devi", surveyNumber: "88/1B", documentNumber: "DOC-2023-09154",
      village: "Gollaprolu", mandal: "Gollaprolu", district: "Kakinada",
      landArea: "2.80 acres", landType: "Agricultural", registrationDate: "2023-11-08",
    },
    isNew: false,
  },
};

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [{ key: "dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Digitization Workflow",
    items: [
      { key: "upload", label: "Upload Land Record", icon: UploadCloud },
      { key: "ocr", label: "OCR / Extracted Data", icon: ScanLine },
      { key: "validation", label: "Validation", icon: ClipboardCheck },
      { key: "validation-result", label: "Validation Result", icon: FileCheck2 },
    ],
  },
  {
    label: "Records",
    items: [
      { key: "records", label: "Land Records", icon: Files },
      { key: "errors", label: "Errors & Duplicates", icon: AlertTriangle },
      { key: "reports", label: "Reports", icon: BarChart3 },
    ],
  },
  {
    label: "Administration",
    items: [
      { key: "users", label: "Users", icon: UsersIcon, adminOnly: true },
      { key: "audit", label: "Audit Logs", icon: ScrollText },
      { key: "settings", label: "Settings", icon: SettingsIcon },
    ],
  },
];

const DISTRICTS = ["Kakinada", "East Godavari", "West Godavari", "Visakhapatnam", "Krishna"];

/* ============================== HELPERS ============================== */

function classNames(...xs) { return xs.filter(Boolean).join(" "); }

function confidenceColor(v) {
  if (v >= 90) return { text: "text-emerald-700", bg: "bg-emerald-500", chip: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  if (v >= 75) return { text: "text-amber-700", bg: "bg-amber-500", chip: "bg-amber-50 text-amber-700 border-amber-200" };
  return { text: "text-red-700", bg: "bg-red-500", chip: "bg-red-50 text-red-700 border-red-200" };
}

function StatusBadge({ status }) {
  return (
    <span className={classNames("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium", STATUS_STYLES[status] || "bg-slate-50 text-slate-700 border-slate-200")}>
      <span className={classNames("h-1.5 w-1.5 rounded-full", STATUS_DOT[status] || "bg-slate-400")} />
      {status}
    </span>
  );
}

function ConfidenceChip({ value }) {
  const c = confidenceColor(value);
  return <span className={classNames("inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold", c.chip)}>{value}%</span>;
}

function ConfidenceBar({ value, showLabel = true }) {
  const c = confidenceColor(value);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-full max-w-[120px] rounded-full bg-slate-100">
        <div className={classNames("h-1.5 rounded-full transition-all duration-700", c.bg)} style={{ width: value + "%" }} />
      </div>
      {showLabel && <span className={classNames("text-xs font-semibold", c.text)}>{value}%</span>}
    </div>
  );
}

function toast(setToasts, message, tone = "success") {
  const id = Math.random().toString(36).slice(2);
  setToasts((t) => [...t, { id, message, tone }]);
  setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
}

/* ============================== SMALL UI ============================== */

function Card({ className, children }) {
  return <div className={classNames("rounded-xl border border-slate-200 bg-white shadow-sm", className)}>{children}</div>;
}

function SectionHeading({ eyebrow, title, subtitle, right }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-600">{eyebrow}</p>}
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled, className, icon: Icon, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        "inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 active:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick, className, icon: Icon, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
}

function Toasts({ toasts }) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={classNames(
            "pointer-events-auto flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium shadow-lg animate-[fadein_0.2s_ease]",
            t.tone === "success" && "border-emerald-200 bg-emerald-50 text-emerald-800",
            t.tone === "warning" && "border-amber-200 bg-amber-50 text-amber-800",
            t.tone === "error" && "border-red-200 bg-red-50 text-red-800",
            t.tone === "info" && "border-blue-200 bg-blue-50 text-blue-800"
          )}
        >
          {t.tone === "success" && <CheckCircle2 className="h-4 w-4 shrink-0" />}
          {t.tone === "warning" && <AlertTriangle className="h-4 w-4 shrink-0" />}
          {t.tone === "error" && <XCircle className="h-4 w-4 shrink-0" />}
          {t.tone === "info" && <Info className="h-4 w-4 shrink-0" />}
          {t.message}
        </div>
      ))}
    </div>
  );
}

/* ============================== LANDING PAGE ============================== */

function LandingPage({ goTo }) {
  const steps = [
    { icon: UploadCloud, label: "Upload" },
    { icon: ScanLine, label: "OCR" },
    { icon: FileText, label: "Extract" },
    { icon: ClipboardCheck, label: "Validate" },
    { icon: AlertTriangle, label: "Detect" },
    { icon: FolderOpen, label: "Store" },
  ];
  const features = [
    { icon: ScanLine, title: "OCR Field Extraction", body: "Automatically pulls owner, survey, and registration details from scanned deeds with per-field confidence scoring." },
    { icon: Copy, title: "Duplicate Detection", body: "Cross-checks incoming records against the registry to surface duplicate survey numbers before they're filed." },
    { icon: ClipboardCheck, title: "Rule-Based Validation", body: "Flags missing fields, owner mismatches, and land-area discrepancies for manual review." },
    { icon: ScrollText, title: "Full Audit Trail", body: "Every upload, approval, and edit is timestamped and attributable for compliance reporting." },
  ];
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-white">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight text-slate-900">{BRAND.name}</p>
              <p className="text-[11px] leading-tight text-slate-500">{BRAND.dept}</p>
            </div>
          </div>
          <PrimaryButton onClick={() => goTo("login")}>Access Portal</PrimaryButton>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-blue-50 via-white to-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                <ShieldCheck className="h-3.5 w-3.5" /> Government Land Records Initiative
              </span>
              <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
                Digitize land records. <br className="hidden sm:block" />
                <span className="text-blue-700">Validate them automatically.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600">
                {BRAND.full} converts scanned land deeds into structured, verified digital
                records — extracting fields with OCR, cross-checking them against the registry,
                and routing mismatches for manual review before anything is filed.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <PrimaryButton onClick={() => goTo("login")} icon={ArrowRight}>Login to Continue</PrimaryButton>
                <SecondaryButton onClick={() => goTo("login")} icon={UploadCloud}>See the Upload Workflow</SecondaryButton>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-200 pt-6">
                <div>
                  <p className="text-2xl font-extrabold text-slate-900">12,480</p>
                  <p className="text-xs text-slate-500">Records digitized</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900">98.2%</p>
                  <p className="text-xs text-slate-500">Validation accuracy</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900">40+</p>
                  <p className="text-xs text-slate-500">Districts onboarded</p>
                </div>
              </div>
            </div>

            <Card className="p-6">
              <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-slate-400">End-to-end pipeline</p>
              <div className="flex flex-col gap-0">
                {steps.map((s, i) => (
                  <div key={s.label} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-blue-600 bg-blue-50 text-blue-700">
                        <s.icon className="h-4.5 w-4.5" />
                      </div>
                      {i < steps.length - 1 && <div className="h-8 w-0.5 bg-blue-200" />}
                    </div>
                    <div className="pb-8 pt-1.5">
                      <p className="text-sm font-semibold text-slate-800">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-600">Capabilities</p>
        <h2 className="mb-10 text-2xl font-bold text-slate-900 sm:text-3xl">Built for the volume and scrutiny of public records</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card key={f.title} className="p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <f.icon className="h-5 w-5" />
              </div>
              <p className="mb-1.5 text-sm font-bold text-slate-900">{f.title}</p>
              <p className="text-sm leading-relaxed text-slate-500">{f.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-5 py-14 text-center sm:px-8">
          <h2 className="text-2xl font-bold text-slate-900">Ready to review the digitization queue?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">Sign in with an administrator or land officer account to access the portal.</p>
          <div className="mt-6">
            <PrimaryButton onClick={() => goTo("login")} icon={ArrowRight}>Go to Login</PrimaryButton>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 text-xs text-slate-400 sm:px-8">
          © 2024 {BRAND.dept}. This is a frontend prototype built with mock data for demonstration purposes only.
        </div>
      </footer>
    </div>
  );
}

/* ============================== LOGIN PAGE ============================== */

function LoginPage({ goTo, onLogin, users, setToasts }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function fill(role) {
    if (role === "Admin") { setEmail("admin@example.com"); setPassword("admin123"); }
    else { setEmail("officer@example.com"); setPassword("officer123"); }
    setError("");
  }

  function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const match = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
      setLoading(false);
      if (match) {
        onLogin(match);
        toast(setToasts, `Welcome back, ${match.name}.`, "success");
        goTo("dashboard");
      } else {
        setError("Invalid email or password. Try one of the demo accounts below.");
      }
    }, 600);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg lg:grid lg:grid-cols-5">
        <div className="hidden flex-col justify-between bg-blue-700 p-8 text-white lg:col-span-2 lg:flex">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                <Landmark className="h-5 w-5" />
              </div>
              <p className="font-bold">{BRAND.name}</p>
            </div>
            <p className="mt-8 text-lg font-semibold leading-snug">Secure access for authorized land record officers.</p>
            <p className="mt-3 text-sm leading-relaxed text-blue-100">
              All logins are recorded in the audit log. Use your issued credentials to access
              digitization, validation, and reporting tools.
            </p>
          </div>
          <div className="space-y-3 text-sm text-blue-100">
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Role-based access control</div>
            <div className="flex items-center gap-2"><ScrollText className="h-4 w-4" /> Full activity audit trail</div>
          </div>
        </div>

        <div className="p-8 lg:col-span-3 sm:p-10">
          <button onClick={() => goTo("landing")} className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to home
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Sign in to your account</h1>
          <p className="mt-1 text-sm text-slate-500">Enter your credentials to access the ILRDVS portal.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Email address</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none ring-blue-500/30 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Password</label>
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none ring-blue-500/30 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4"
              />
            </div>
            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-700">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {error}
              </div>
            )}
            <PrimaryButton type="submit" disabled={loading} className="w-full py-3" icon={loading ? Loader2 : ArrowRight}>
              {loading ? "Signing in…" : "Sign In"}
            </PrimaryButton>
          </form>

          <div className="mt-7 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Demo credentials</p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <button onClick={() => fill("Admin")} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-left text-xs shadow-sm transition hover:border-blue-300 hover:bg-blue-50">
                <span>
                  <span className="block font-semibold text-slate-800">Admin</span>
                  <span className="text-slate-400">admin@example.com</span>
                </span>
                <UserCog className="h-4 w-4 text-blue-600" />
              </button>
              <button onClick={() => fill("Officer")} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-left text-xs shadow-sm transition hover:border-blue-300 hover:bg-blue-50">
                <span>
                  <span className="block font-semibold text-slate-800">Land Officer</span>
                  <span className="text-slate-400">officer@example.com</span>
                </span>
                <User className="h-4 w-4 text-blue-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================== SIDEBAR / TOPBAR ============================== */

function Sidebar({ page, goTo, role, mobileOpen, setMobileOpen }) {
  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={classNames(
        "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:z-0 lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-white">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight text-slate-900">{BRAND.name}</p>
              <p className="text-[11px] leading-tight text-slate-400">Land Records Portal</p>
            </div>
          </div>
          <button className="text-slate-400 lg:hidden" onClick={() => setMobileOpen(false)}><X className="h-5 w-5" /></button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {NAV_SECTIONS.map((section) => {
            const items = section.items.filter((it) => !it.adminOnly || role === "Admin");
            if (items.length === 0) return null;
            return (
              <div key={section.label}>
                <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{section.label}</p>
                <div className="space-y-1">
                  {items.map((it) => {
                    const active = page === it.key;
                    return (
                      <button
                        key={it.key}
                        onClick={() => { goTo(it.key); setMobileOpen(false); }}
                        className={classNames(
                          "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition",
                          active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        <it.icon className={classNames("h-4 w-4 shrink-0", active ? "text-blue-700" : "text-slate-400")} />
                        <span className="flex-1">{it.label}</span>
                        {active && <ChevronRight className="h-3.5 w-3.5 text-blue-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
            <p className="font-semibold text-slate-700">Need help?</p>
            <p className="mt-0.5">Contact the district land records desk for support with rejected uploads.</p>
          </div>
        </div>
      </aside>
    </>
  );
}

const PAGE_TITLES = {
  dashboard: "Dashboard", upload: "Upload Land Record", ocr: "OCR / Extracted Data",
  validation: "Validation", "validation-result": "Validation Result", records: "Land Records",
  "record-details": "Record Details", errors: "Errors & Duplicates", reports: "Reports",
  users: "Users", audit: "Audit Logs", settings: "Settings",
};

function TopBar({ page, user, setMobileOpen, onLogout, goTo }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-3.5 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button className="text-slate-500 lg:hidden" onClick={() => setMobileOpen(true)}><Menu className="h-5.5 w-5.5" /></button>
        <div>
          <p className="text-base font-bold text-slate-900 sm:text-lg">{PAGE_TITLES[page] || "ILRDVS"}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input placeholder="Search records…" onKeyDown={(e) => { if (e.key === "Enter") goTo("records"); }} className="w-56 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100" />
        </div>
        <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-50">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>
        <div className="relative">
          <button onClick={() => setMenuOpen((v) => !v)} className="flex items-center gap-2 rounded-lg border border-slate-200 py-1.5 pl-1.5 pr-2.5 hover:bg-slate-50">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">
              {user.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold leading-tight text-slate-800">{user.name}</p>
              <p className="text-[10px] leading-tight text-slate-400">{user.role}</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 z-40 mt-2 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
              <button onClick={() => { setMenuOpen(false); goTo("settings"); }} className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50">
                <SettingsIcon className="h-4 w-4" /> Settings
              </button>
              <button onClick={onLogout} className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4" /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ============================== DASHBOARD ============================== */

function DashboardPage({ records, user, goTo }) {
  const total = records.length;
  const verified = records.filter((r) => r.status === "Verified").length;
  const pending = records.filter((r) => r.status === "Pending").length;
  const manual = records.filter((r) => r.status === "Manual Verification").length;
  const errors = records.filter((r) => r.status === "Error").length;

  const statusData = [
    { name: "Verified", value: verified, color: "#059669" },
    { name: "Pending", value: pending, color: "#d97706" },
    { name: "Manual Verification", value: manual, color: "#ea580c" },
    { name: "Error", value: errors, color: "#dc2626" },
  ];

  const districtCounts = DISTRICTS.map((d) => ({ district: d.replace(" Godavari", " Godav."), count: records.filter((r) => r.district === d).length }));

  const monthly = [
    { month: "Jan", uploads: 62 }, { month: "Feb", uploads: 74 }, { month: "Mar", uploads: 88 },
    { month: "Apr", uploads: 95 }, { month: "May", uploads: 112 },
  ];

  const recent = [...records].sort((a, b) => (a.uploadedDate < b.uploadedDate ? 1 : -1)).slice(0, 5);

  const cards = [
    { label: "Total Records", value: total, icon: Files, tint: "bg-blue-50 text-blue-700" },
    { label: "Verified", value: verified, icon: CheckCircle2, tint: "bg-emerald-50 text-emerald-700" },
    { label: "Pending Review", value: pending, icon: Clock, tint: "bg-amber-50 text-amber-700" },
    { label: "Errors / Manual", value: errors + manual, icon: AlertTriangle, tint: "bg-red-50 text-red-700" },
  ];

  return (
    <div>
      <SectionHeading
        eyebrow="Overview"
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        subtitle="Here's what's happening across the digitization queue today."
        right={<PrimaryButton icon={UploadCloud} onClick={() => goTo("upload")}>Upload Record</PrimaryButton>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} className="p-5">
            <div className="flex items-center justify-between">
              <div className={classNames("flex h-10 w-10 items-center justify-center rounded-lg", c.tint)}><c.icon className="h-5 w-5" /></div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600"><TrendingUp className="h-3.5 w-3.5" /> +4.2%</span>
            </div>
            <p className="mt-4 text-2xl font-extrabold text-slate-900">{c.value}</p>
            <p className="text-xs text-slate-500">{c.label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <p className="mb-1 text-sm font-bold text-slate-800">Monthly Upload Volume</p>
          <p className="mb-4 text-xs text-slate-400">Documents submitted for digitization</p>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <LineChart data={monthly} margin={{ left: -20, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid #e2e8f0" }} />
                <Line type="monotone" dataKey="uploads" stroke="#1d4ed8" strokeWidth={2.5} dot={{ r: 3, fill: "#1d4ed8" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <p className="mb-1 text-sm font-bold text-slate-800">Status Breakdown</p>
          <p className="mb-4 text-xs text-slate-400">{total} total records</p>
          <div style={{ width: "100%", height: 180 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {statusData.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid #e2e8f0" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1.5">
            {statusData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-500"><span className="h-2 w-2 rounded-full" style={{ background: d.color }} /> {d.name}</span>
                <span className="font-semibold text-slate-700">{d.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-1">
          <p className="mb-1 text-sm font-bold text-slate-800">Records by District</p>
          <p className="mb-4 text-xs text-slate-400">Current digitized volume</p>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={districtCounts} margin={{ left: -20, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="district" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid #e2e8f0" }} />
                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 p-5 pb-4">
            <p className="text-sm font-bold text-slate-800">Recent Records</p>
            <button onClick={() => goTo("records")} className="text-xs font-semibold text-blue-700 hover:underline">View all</button>
          </div>
          <div className="divide-y divide-slate-100">
            {recent.map((r) => (
              <button key={r.id} onClick={() => goTo("record-details", r.id)} className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left hover:bg-slate-50">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">{r.ownerName}</p>
                  <p className="text-xs text-slate-400">{r.id} · {r.village}, {r.district}</p>
                </div>
                <StatusBadge status={r.status} />
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ============================== UPLOAD PAGE ============================== */

const STAGES = ["Uploading", "OCR Processing", "Extracting Fields", "Validating", "Completed"];

function UploadPage({ scenarioKey, setScenarioKey, onComplete, goTo }) {
  const [fileName, setFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [running, setRunning] = useState(false);
  const [stageIdx, setStageIdx] = useState(-1);
  const [progress, setProgress] = useState(0);
  const timers = useRef([]);

  const scenario = SCENARIOS[scenarioKey];

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function pickFile(name) {
    setFileName(name);
    setStageIdx(-1);
    setProgress(0);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    pickFile(f ? f.name : scenario.fileName);
  }

  function startProcessing() {
    if (!fileName) return;
    setRunning(true);
    setStageIdx(0);
    setProgress(0);

    let p = 0;
    const progressTimer = setInterval(() => {
      p += 8;
      if (p >= 100) { p = 100; clearInterval(progressTimer); }
      setProgress(p);
    }, 90);
    timers.current.push(progressTimer);

    STAGES.forEach((_, i) => {
      const t = setTimeout(() => {
        setStageIdx(i);
        if (i === STAGES.length - 1) {
          const done = setTimeout(() => onComplete(scenario), 700);
          timers.current.push(done);
        }
      }, i * 950 + 300);
      timers.current.push(t);
    });
  }

  return (
    <div>
      <SectionHeading eyebrow="Digitization Workflow · Step 1" title="Upload Land Record" subtitle="Submit a scanned land deed to begin OCR extraction and validation." />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={classNames(
              "flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition",
              dragOver ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50"
            )}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <UploadCloud className="h-6.5 w-6.5" />
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-700">Drag & drop a document here</p>
            <p className="mt-1 text-xs text-slate-400">Supports PDF, JPG, PNG · Max 10MB</p>
            <label className="mt-4 cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50">
              Browse Files
              <input type="file" className="hidden" onChange={(e) => { const f = e.target.files[0]; pickFile(f ? f.name : scenario.fileName); }} />
            </label>
            <button onClick={() => pickFile(scenario.fileName)} className="mt-3 text-xs font-medium text-blue-700 hover:underline">
              or use the sample document for {scenario.label}
            </button>
          </div>

          {fileName && (
            <div className="mt-5 flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><FileText className="h-4.5 w-4.5" /></div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">{fileName}</p>
                <p className="text-xs text-slate-400">Ready to process</p>
              </div>
              {!running && <button onClick={() => pickFile("")} className="text-slate-400 hover:text-red-500"><X className="h-4 w-4" /></button>}
            </div>
          )}

          {stageIdx >= 0 && (
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-500">{STAGES[stageIdx]}…</p>
                <p className="text-xs font-semibold text-blue-700">{progress}%</p>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-blue-600 transition-all duration-150" style={{ width: progress + "%" }} />
              </div>
              <div className="mt-6 grid grid-cols-5 gap-1.5">
                {STAGES.map((s, i) => (
                  <div key={s} className="flex flex-col items-center gap-1.5">
                    <div className={classNames(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                      i < stageIdx ? "border-emerald-500 bg-emerald-500 text-white" :
                      i === stageIdx ? "border-blue-600 bg-blue-600 text-white animate-pulse" :
                      "border-slate-200 bg-white text-slate-300"
                    )}>
                      {i < stageIdx ? <Check className="h-4 w-4" /> : i + 1}
                    </div>
                    <p className={classNames("text-center text-[10px] font-medium leading-tight", i <= stageIdx ? "text-slate-700" : "text-slate-300")}>{s}</p>
                  </div>
                ))}
              </div>
              {stageIdx === STAGES.length - 1 && (
                <p className="mt-5 flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" /> Processing complete — opening extracted data…
                </p>
              )}
            </div>
          )}

          {!running && (
            <PrimaryButton className="mt-6 w-full py-3" disabled={!fileName} onClick={startProcessing} icon={ScanLine}>
              Start Processing
            </PrimaryButton>
          )}
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <p className="mb-3 text-sm font-bold text-slate-800">Demo Scenario</p>
            <p className="mb-4 text-xs text-slate-400">Pick which sample document the pipeline should simulate.</p>
            <div className="space-y-2.5">
              {Object.values(SCENARIOS).map((s) => (
                <button
                  key={s.key}
                  onClick={() => { setScenarioKey(s.key); setFileName(""); setStageIdx(-1); }}
                  className={classNames(
                    "w-full rounded-lg border p-3 text-left text-xs transition",
                    scenarioKey === s.key ? "border-blue-400 bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 bg-white hover:border-slate-300"
                  )}
                >
                  <p className="font-semibold text-slate-800">{s.label}</p>
                  <p className="mt-0.5 text-slate-400">{s.description}</p>
                </button>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <p className="mb-2 text-sm font-bold text-slate-800">Tips for best OCR results</p>
            <ul className="space-y-2 text-xs leading-relaxed text-slate-500">
              <li className="flex gap-2"><CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-blue-600" /> Scan at 300 DPI or higher</li>
              <li className="flex gap-2"><CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-blue-600" /> Ensure all four corners are visible</li>
              <li className="flex gap-2"><CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-blue-600" /> Avoid glare and shadows on the document</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ============================== OCR RESULT PAGE ============================== */

function OcrResultPage({ scenario, fields, setFields, goTo }) {
  const s = scenario || SCENARIOS.A;
  const avg = Math.round(Object.values(s.confidence).reduce((a, b) => a + b, 0) / Object.values(s.confidence).length);

  function update(key, value) {
    setFields((f) => ({ ...f, [key]: value }));
  }

  return (
    <div>
      <SectionHeading
        eyebrow="Digitization Workflow · Step 2"
        title="OCR / Extracted Data"
        subtitle={`Extracted from ${s.fileName}. Review and correct any field before validation.`}
        right={<ConfidenceChip value={avg} />}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center p-6 lg:col-span-1">
          <div className="flex h-64 w-full flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-300">
            <FileText className="h-14 w-14" />
            <p className="mt-2 text-xs font-medium text-slate-400">{s.fileName}</p>
          </div>
          <div className="mt-4 w-full space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-slate-400">Pages scanned</span><span className="font-semibold text-slate-700">1</span></div>
            <div className="flex justify-between"><span className="text-slate-400">OCR engine</span><span className="font-semibold text-slate-700">Tesseract v5</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Overall confidence</span><ConfidenceChip value={avg} /></div>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <p className="mb-4 text-sm font-bold text-slate-800">Extracted Fields</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Object.keys(FIELD_LABELS).map((key) => {
              const Icon = FIELD_ICONS[key];
              return (
                <div key={key}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                      <Icon className="h-3.5 w-3.5 text-slate-400" /> {FIELD_LABELS[key]}
                    </label>
                    <ConfidenceChip value={s.confidence[key]} />
                  </div>
                  <input
                    value={fields[key] ?? ""}
                    onChange={(e) => update(key, e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                  <div className="mt-1.5"><ConfidenceBar value={s.confidence[key]} showLabel={false} /></div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
            <p className="flex items-center gap-1.5 text-xs text-slate-400"><Info className="h-3.5 w-3.5" /> Edits are saved locally and used for validation.</p>
            <div className="flex gap-2.5">
              <SecondaryButton onClick={() => goTo("upload")} icon={ArrowLeft}>Re-upload</SecondaryButton>
              <PrimaryButton onClick={() => goTo("validation")} icon={ArrowRight}>Proceed to Validation</PrimaryButton>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ============================== VALIDATION PAGE ============================== */

function computeValidation(fields, scenario) {
  const issues = [];
  const rows = Object.keys(FIELD_LABELS).map((key) => {
    const extracted = (fields[key] || "").trim();
    const db = scenario.dbValues[key];
    const missing = extracted === "";
    const match = !missing && extracted.toLowerCase() === String(db).toLowerCase();
    if (missing) issues.push({ type: "Missing Information", field: FIELD_LABELS[key], detail: `${FIELD_LABELS[key]} was not detected in the document.` });
    else if (!match && key === "ownerName") issues.push({ type: "Owner Mismatch", field: FIELD_LABELS[key], detail: `Extracted owner "${extracted}" differs from registry owner "${db}".` });
    else if (!match && key === "surveyNumber") issues.push({ type: "Survey Number Issue", field: FIELD_LABELS[key], detail: `Survey number "${extracted}" could not be matched to registry "${db}".` });
    else if (!match && key === "landArea") issues.push({ type: "Land Area Mismatch", field: FIELD_LABELS[key], detail: `Extracted area "${extracted}" does not match registry area "${db}".` });
    else if (!match) issues.push({ type: "Field Mismatch", field: FIELD_LABELS[key], detail: `"${extracted}" does not match registry value "${db}".` });
    return { key, extracted, db, match, missing };
  });

  const matchCount = rows.filter((r) => r.match).length;
  const overall = Math.round((matchCount / rows.length) * 100);
  const status = issues.length === 0 ? "Verified" : overall >= 90 ? "Verified" : "Manual Verification";
  return { rows, issues, overall, status };
}

function ValidationPage({ scenario, fields, records, goTo, onValidated }) {
  const s = scenario || SCENARIOS.A;
  const [checking, setChecking] = useState(false);
  const result = useMemo(() => computeValidation(fields, s), [fields, s]);

  const dupes = records.filter((r) => r.surveyNumber === fields.surveyNumber && r.village === fields.village && r.id !== s.dbRecordId);

  function runCheck() {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      onValidated(result, dupes);
      goTo("validation-result");
    }, 1100);
  }

  return (
    <div>
      <SectionHeading eyebrow="Digitization Workflow · Step 3" title="Validation" subtitle="Comparing extracted data against the existing registry record." />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <div className="border-b border-slate-100 p-5 pb-4">
            <p className="text-sm font-bold text-slate-800">Field-by-field Comparison</p>
            <p className="text-xs text-slate-400">Registry reference: {s.dbRecordId}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3 font-semibold">Field</th>
                  <th className="px-5 py-3 font-semibold">Extracted</th>
                  <th className="px-5 py-3 font-semibold">Database</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.rows.map((r) => (
                  <tr key={r.key} className={!r.match ? "bg-red-50/40" : ""}>
                    <td className="px-5 py-3 font-medium text-slate-700">{FIELD_LABELS[r.key]}</td>
                    <td className="px-5 py-3 text-slate-600">{r.extracted || <span className="italic text-slate-300">empty</span>}</td>
                    <td className="px-5 py-3 text-slate-600">{r.db}</td>
                    <td className="px-5 py-3">
                      {r.match ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600"><CheckCircle2 className="h-3.5 w-3.5" /> Match</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600"><XCircle className="h-3.5 w-3.5" /> Mismatch</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-2.5 border-t border-slate-100 p-5">
            <SecondaryButton onClick={() => goTo("ocr")} icon={ArrowLeft}>Back to Extracted Data</SecondaryButton>
            <PrimaryButton onClick={runCheck} disabled={checking} icon={checking ? Loader2 : ClipboardCheck}>
              {checking ? "Running checks…" : "Run Validation Check"}
            </PrimaryButton>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <p className="mb-3 text-sm font-bold text-slate-800">Checks Performed</p>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li className="flex gap-2"><ClipboardCheck className="h-3.5 w-3.5 shrink-0 text-blue-600" /> Missing information scan</li>
              <li className="flex gap-2"><User className="h-3.5 w-3.5 shrink-0 text-blue-600" /> Owner name match</li>
              <li className="flex gap-2"><Hash className="h-3.5 w-3.5 shrink-0 text-blue-600" /> Survey number lookup</li>
              <li className="flex gap-2"><Ruler className="h-3.5 w-3.5 shrink-0 text-blue-600" /> Land area comparison</li>
              <li className="flex gap-2"><Copy className="h-3.5 w-3.5 shrink-0 text-blue-600" /> Duplicate record scan</li>
            </ul>
          </Card>
          <Card className="p-5">
            <p className="mb-1 text-sm font-bold text-slate-800">Live Preview</p>
            <p className="mb-3 text-xs text-slate-400">Based on current field values</p>
            <div className="flex items-center gap-3">
              <div className={classNames("flex h-12 w-12 items-center justify-center rounded-full text-lg font-extrabold", result.overall >= 90 ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600")}>
                {result.overall}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700">{result.overall}% match confidence</p>
                <p className="text-xs text-slate-400">{result.issues.length === 0 ? "No issues detected" : `${result.issues.length} issue${result.issues.length > 1 ? "s" : ""} found`}</p>
              </div>
            </div>
            {dupes.length > 0 && (
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-orange-200 bg-orange-50 p-2.5 text-xs text-orange-700">
                <Copy className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Potential duplicate of {dupes.map((d) => d.id).join(", ")}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ============================== VALIDATION RESULT PAGE ============================== */

function ValidationResultPage({ scenario, fields, validation, dupes, goTo, onApprove, onManual, onReject }) {
  const s = scenario || SCENARIOS.A;
  const v = validation || computeValidation(fields, s);
  const success = v.status === "Verified" && v.issues.length === 0;

  return (
    <div>
      <SectionHeading eyebrow="Digitization Workflow · Step 4" title="Validation Result" subtitle="Final review before the record is stored in the registry." />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="p-6 text-center lg:col-span-1">
          <div className={classNames(
            "mx-auto flex h-28 w-28 items-center justify-center rounded-full border-8 text-3xl font-extrabold",
            success ? "border-emerald-100 text-emerald-600" : "border-orange-100 text-orange-600"
          )}>
            {v.overall}%
          </div>
          <p className="mt-4 text-base font-bold text-slate-900">{success ? "Validation Successful" : "Manual Verification Required"}</p>
          <p className="mt-1 text-xs text-slate-500">{success ? "All fields matched the registry with high confidence." : "One or more fields need human review before approval."}</p>
          <div className="mt-4"><StatusBadge status={v.status} /></div>

          <div className="mt-6 space-y-2.5 text-left">
            {Object.keys(FIELD_LABELS).map((key) => {
              const row = v.rows.find((r) => r.key === key);
              return (
                <div key={key} className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">{FIELD_LABELS[key]}</span>
                  {row.match ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <XCircle className="h-3.5 w-3.5 text-red-500" />}
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <p className="mb-4 text-sm font-bold text-slate-800">Detected Issues</p>
          {v.issues.length === 0 && dupes.length === 0 ? (
            <div className="flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              <CheckCircle2 className="h-5 w-5 shrink-0" /> No issues found. This record is ready to be approved and stored.
            </div>
          ) : (
            <div className="space-y-2.5">
              {v.issues.map((iss, i) => (
                <div key={i} className="flex items-start gap-2.5 rounded-lg border border-orange-200 bg-orange-50 p-3.5 text-sm">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                  <div>
                    <p className="font-semibold text-orange-800">{iss.type} — {iss.field}</p>
                    <p className="text-xs text-orange-600">{iss.detail}</p>
                  </div>
                </div>
              ))}
              {dupes.map((d) => (
                <div key={d.id} className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm">
                  <Copy className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <div>
                    <p className="font-semibold text-red-800">Duplicate Record — {d.id}</p>
                    <p className="text-xs text-red-600">Same survey number & village already registered to {d.ownerName}.</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Record Summary</p>
            <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
              <div><p className="text-slate-400">Owner</p><p className="font-semibold text-slate-700">{fields.ownerName}</p></div>
              <div><p className="text-slate-400">Survey No.</p><p className="font-semibold text-slate-700">{fields.surveyNumber}</p></div>
              <div><p className="text-slate-400">Land Area</p><p className="font-semibold text-slate-700">{fields.landArea}</p></div>
              <div><p className="text-slate-400">Village</p><p className="font-semibold text-slate-700">{fields.village}</p></div>
              <div><p className="text-slate-400">District</p><p className="font-semibold text-slate-700">{fields.district}</p></div>
              <div><p className="text-slate-400">Land Type</p><p className="font-semibold text-slate-700">{fields.landType}</p></div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5 border-t border-slate-100 pt-5">
            <PrimaryButton icon={CheckCircle2} onClick={onApprove}>Approve & Store Record</PrimaryButton>
            <SecondaryButton icon={AlertTriangle} onClick={onManual}>Send for Manual Verification</SecondaryButton>
            <button onClick={onReject} className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50">
              <XCircle className="h-4 w-4" /> Reject
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ============================== LAND RECORDS PAGE ============================== */

function LandRecordsPage({ records, goTo }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [district, setDistrict] = useState("All");

  const filtered = records.filter((r) => {
    const matchQ = !q || [r.ownerName, r.surveyNumber, r.village, r.id, r.documentNumber].join(" ").toLowerCase().includes(q.toLowerCase());
    const matchS = status === "All" || r.status === status;
    const matchD = district === "All" || r.district === district;
    return matchQ && matchS && matchD;
  });

  return (
    <div>
      <SectionHeading eyebrow="Records" title="Land Records" subtitle={`${records.length} digitized records in the registry.`} />

      <Card className="mb-4 flex flex-wrap items-center gap-3 p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by owner, survey no., village…" className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 outline-none focus:border-blue-400">
          <option>All</option><option>Verified</option><option>Pending</option><option>Manual Verification</option><option>Error</option>
        </select>
        <select value={district} onChange={(e) => setDistrict(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 outline-none focus:border-blue-400">
          <option>All</option>
          {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
        </select>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-semibold">Record ID</th>
                <th className="px-5 py-3 font-semibold">Owner</th>
                <th className="px-5 py-3 font-semibold">Survey No.</th>
                <th className="px-5 py-3 font-semibold">Village / District</th>
                <th className="px-5 py-3 font-semibold">Land Area</th>
                <th className="px-5 py-3 font-semibold">Confidence</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <tr key={r.id} className="cursor-pointer hover:bg-slate-50" onClick={() => goTo("record-details", r.id)}>
                  <td className="px-5 py-3.5 font-semibold text-blue-700">{r.id}</td>
                  <td className="px-5 py-3.5 text-slate-700">{r.ownerName}</td>
                  <td className="px-5 py-3.5 text-slate-600">{r.surveyNumber}</td>
                  <td className="px-5 py-3.5 text-slate-600">{r.village}, {r.district}</td>
                  <td className="px-5 py-3.5 text-slate-600">{r.landArea}</td>
                  <td className="px-5 py-3.5"><ConfidenceBar value={r.confidence} /></td>
                  <td className="px-5 py-3.5"><StatusBadge status={r.status} /></td>
                  <td className="px-5 py-3.5"><Eye className="h-4 w-4 text-slate-300" /></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-sm text-slate-400">No records match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ============================== RECORD DETAILS PAGE ============================== */

function RecordDetailsPage({ record, goTo, audit, updateRecord, setToasts }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(record);

  useEffect(() => { setDraft(record); setEditing(false); }, [record && record.id]);

  if (!record) {
    return (
      <Card className="p-10 text-center">
        <p className="text-sm text-slate-500">Record not found.</p>
        <SecondaryButton className="mt-4" onClick={() => goTo("records")} icon={ArrowLeft}>Back to Land Records</SecondaryButton>
      </Card>
    );
  }

  const history = audit.filter((a) => a.details.includes(record.id));

  function save() {
    updateRecord(draft);
    setEditing(false);
    toast(setToasts, `${record.id} updated successfully.`, "success");
  }

  return (
    <div>
      <button onClick={() => goTo("records")} className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Land Records
      </button>
      <SectionHeading
        eyebrow={record.id}
        title={record.ownerName}
        subtitle={`${record.village}, ${record.mandal}, ${record.district}`}
        right={
          <div className="flex gap-2.5">
            {!editing ? (
              <SecondaryButton icon={Edit3} onClick={() => setEditing(true)}>Edit Record</SecondaryButton>
            ) : (
              <>
                <SecondaryButton onClick={() => { setDraft(record); setEditing(false); }}>Cancel</SecondaryButton>
                <PrimaryButton icon={Check} onClick={save}>Save Changes</PrimaryButton>
              </>
            )}
            <SecondaryButton icon={Download}>Export</SecondaryButton>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-800">Record Details</p>
            <StatusBadge status={record.status} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Object.keys(FIELD_LABELS).map((key) => {
              const Icon = FIELD_ICONS[key];
              return (
                <div key={key}>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <Icon className="h-3.5 w-3.5 text-slate-400" /> {FIELD_LABELS[key]}
                  </label>
                  {editing ? (
                    <input value={draft[key] || ""} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
                  ) : (
                    <p className="rounded-lg border border-transparent bg-slate-50 px-3 py-2 text-sm text-slate-700">{record[key]}</p>
                  )}
                </div>
              );
            })}
          </div>
          {record.issue && (
            <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-orange-200 bg-orange-50 p-3.5 text-sm text-orange-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {record.issue}
            </div>
          )}
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <p className="mb-3 text-sm font-bold text-slate-800">Confidence & Metadata</p>
            <div className="space-y-3 text-xs">
              <div>
                <div className="mb-1 flex justify-between"><span className="text-slate-400">Overall confidence</span><span className="font-semibold text-slate-700">{record.confidence}%</span></div>
                <ConfidenceBar value={record.confidence} showLabel={false} />
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-3"><span className="text-slate-400">Uploaded</span><span className="font-semibold text-slate-700">{record.uploadedDate}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Document No.</span><span className="font-semibold text-slate-700">{record.documentNumber}</span></div>
            </div>
          </Card>

          <Card className="p-5">
            <p className="mb-3 text-sm font-bold text-slate-800">Activity Timeline</p>
            {history.length === 0 ? (
              <p className="text-xs text-slate-400">No logged activity references this record yet.</p>
            ) : (
              <div className="space-y-4">
                {history.map((h, i) => (
                  <div key={h.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-blue-600" />
                      {i < history.length - 1 && <div className="w-0.5 flex-1 bg-slate-100" />}
                    </div>
                    <div className="pb-1">
                      <p className="text-xs font-semibold text-slate-700">{h.action}</p>
                      <p className="text-[11px] text-slate-400">{h.timestamp} · {h.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ============================== ERRORS & DUPLICATES PAGE ============================== */

function ErrorsDuplicatesPage({ records, goTo }) {
  const flagged = records.filter((r) => r.status === "Error" || r.status === "Manual Verification" || r.duplicateOf);
  return (
    <div>
      <SectionHeading eyebrow="Records" title="Errors & Duplicates" subtitle={`${flagged.length} records currently flagged for review.`} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-2xl font-extrabold text-red-600">{records.filter((r) => r.status === "Error").length}</p>
          <p className="text-xs text-slate-500">Processing errors</p>
        </Card>
        <Card className="p-5">
          <p className="text-2xl font-extrabold text-orange-600">{records.filter((r) => r.status === "Manual Verification").length}</p>
          <p className="text-xs text-slate-500">Manual verification</p>
        </Card>
        <Card className="p-5">
          <p className="text-2xl font-extrabold text-blue-700">{records.filter((r) => r.duplicateOf).length}</p>
          <p className="text-xs text-slate-500">Detected duplicates</p>
        </Card>
      </div>

      <Card className="mt-5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-semibold">Record ID</th>
                <th className="px-5 py-3 font-semibold">Owner</th>
                <th className="px-5 py-3 font-semibold">Reason</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {flagged.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3.5 font-semibold text-blue-700">{r.id}</td>
                  <td className="px-5 py-3.5 text-slate-700">{r.ownerName}</td>
                  <td className="px-5 py-3.5 text-slate-500">{r.issue || "Flagged for review"}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={r.status} /></td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => goTo("record-details", r.id)} className="text-xs font-semibold text-blue-700 hover:underline">Review</button>
                  </td>
                </tr>
              ))}
              {flagged.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-400">No flagged records. The queue is clean.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ============================== REPORTS PAGE ============================== */

function ReportsPage({ records, setToasts }) {
  const districtData = DISTRICTS.map((d) => ({ district: d.replace(" Godavari", " Godav."), count: records.filter((r) => r.district === d).length }));
  const statusData = ["Verified", "Pending", "Manual Verification", "Error"].map((s) => ({
    name: s, value: records.filter((r) => r.status === s).length,
    color: s === "Verified" ? "#059669" : s === "Pending" ? "#d97706" : s === "Manual Verification" ? "#ea580c" : "#dc2626",
  }));
  const trend = [
    { month: "Jan", uploads: 62, errors: 6 }, { month: "Feb", uploads: 74, errors: 5 },
    { month: "Mar", uploads: 88, errors: 9 }, { month: "Apr", uploads: 95, errors: 4 },
    { month: "May", uploads: 112, errors: 7 },
  ];
  const avgConfidence = Math.round(records.reduce((a, r) => a + r.confidence, 0) / records.length);

  return (
    <div>
      <SectionHeading
        eyebrow="Records"
        title="Reports"
        subtitle="Aggregate insights across the digitization pipeline."
        right={<SecondaryButton icon={Download} onClick={() => toast(setToasts, "Report exported as CSV (mock).", "info")}>Export Report</SecondaryButton>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5"><p className="text-2xl font-extrabold text-slate-900">{records.length}</p><p className="text-xs text-slate-500">Total digitized records</p></Card>
        <Card className="p-5"><p className="text-2xl font-extrabold text-slate-900">{avgConfidence}%</p><p className="text-xs text-slate-500">Average field confidence</p></Card>
        <Card className="p-5"><p className="text-2xl font-extrabold text-slate-900">{records.filter((r) => r.status === "Verified").length}</p><p className="text-xs text-slate-500">Fully verified records</p></Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <p className="mb-4 text-sm font-bold text-slate-800">Records by District</p>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={districtData} margin={{ left: -20, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="district" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid #e2e8f0" }} />
                <Bar dataKey="count" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <p className="mb-4 text-sm font-bold text-slate-800">Status Distribution</p>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={85} label={(e) => e.value > 0 ? e.name : ""}>
                  {statusData.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid #e2e8f0" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="mt-5 p-5">
        <p className="mb-4 text-sm font-bold text-slate-800">Uploads vs. Errors Trend</p>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={trend} margin={{ left: -20, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid #e2e8f0" }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="uploads" fill="#2563eb" radius={[4, 4, 0, 0]} name="Uploads" />
              <Bar dataKey="errors" fill="#dc2626" radius={[4, 4, 0, 0]} name="Errors" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

/* ============================== USERS PAGE ============================== */

function UsersPage({ users, setUsers, role, setToasts }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "Land Officer" });

  if (role !== "Admin") {
    return (
      <Card className="p-10 text-center">
        <ShieldCheck className="mx-auto h-8 w-8 text-slate-300" />
        <p className="mt-3 text-sm font-semibold text-slate-600">Access Restricted</p>
        <p className="mt-1 text-xs text-slate-400">Only administrators can manage users.</p>
      </Card>
    );
  }

  function addUser() {
    if (!form.name || !form.email) return;
    const id = "U" + (users.length + 1);
    setUsers((u) => [...u, { id, name: form.name, email: form.email, role: form.role, status: "Active", lastLogin: "—" }]);
    setShowAdd(false);
    setForm({ name: "", email: "", role: "Land Officer" });
    toast(setToasts, `${form.name} added as ${form.role}.`, "success");
  }

  function toggleStatus(id) {
    setUsers((us) => us.map((u) => u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u));
  }

  return (
    <div>
      <SectionHeading eyebrow="Administration" title="Users" subtitle="Manage portal access for officers and verifiers." right={<PrimaryButton icon={Plus} onClick={() => setShowAdd(true)}>Add User</PrimaryButton>} />

      {showAdd && (
        <Card className="mb-5 p-5">
          <p className="mb-3 text-sm font-bold text-slate-800">New User</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
            <input placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500">
              <option>Land Officer</option><option>Verifier</option><option>Admin</option>
            </select>
          </div>
          <div className="mt-4 flex gap-2.5">
            <PrimaryButton onClick={addUser} icon={Check}>Save User</PrimaryButton>
            <SecondaryButton onClick={() => setShowAdd(false)}>Cancel</SecondaryButton>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold">Last Login</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3.5 font-semibold text-slate-800">{u.name}</td>
                  <td className="px-5 py-3.5 text-slate-500">{u.email}</td>
                  <td className="px-5 py-3.5"><span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">{u.role}</span></td>
                  <td className="px-5 py-3.5 text-slate-500">{u.lastLogin}</td>
                  <td className="px-5 py-3.5">
                    <span className={classNames("inline-flex items-center gap-1.5 text-xs font-medium", u.status === "Active" ? "text-emerald-600" : "text-slate-400")}>
                      <span className={classNames("h-1.5 w-1.5 rounded-full", u.status === "Active" ? "bg-emerald-500" : "bg-slate-300")} /> {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => toggleStatus(u.id)} className="text-xs font-semibold text-blue-700 hover:underline">
                      {u.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ============================== AUDIT LOGS PAGE ============================== */

function AuditLogsPage({ audit }) {
  const [q, setQ] = useState("");
  const filtered = audit.filter((a) => !q || (a.user + a.action + a.details).toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <SectionHeading eyebrow="Administration" title="Audit Logs" subtitle="Chronological record of all portal activity." />
      <Card className="mb-4 p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by user, action, or record…" className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
        </div>
      </Card>
      <Card className="divide-y divide-slate-100">
        {filtered.map((a) => (
          <div key={a.id} className="flex items-start gap-3.5 p-4.5">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700"><ScrollText className="h-4 w-4" /></div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <p className="text-sm font-semibold text-slate-800">{a.action}</p>
                <p className="text-[11px] text-slate-400">{a.timestamp}</p>
              </div>
              <p className="text-xs text-slate-500">{a.details}</p>
              <p className="mt-0.5 text-[11px] font-medium text-blue-600">{a.user}</p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="p-8 text-center text-sm text-slate-400">No matching activity.</p>}
      </Card>
    </div>
  );
}

/* ============================== SETTINGS PAGE ============================== */

function SettingsPage({ user, setToasts }) {
  const [threshold, setThreshold] = useState(85);
  const [notify, setNotify] = useState({ email: true, sms: false, weeklyReport: true });
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });

  function saveThreshold() { toast(setToasts, `Validation threshold set to ${threshold}%.`, "success"); }
  function changePw(e) {
    e.preventDefault();
    if (!pw.current || !pw.next || pw.next !== pw.confirm) { toast(setToasts, "Please check the password fields and try again.", "error"); return; }
    setPw({ current: "", next: "", confirm: "" });
    toast(setToasts, "Password updated successfully.", "success");
  }

  return (
    <div>
      <SectionHeading eyebrow="Administration" title="Settings" subtitle="Manage your profile, notifications, and system preferences." />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card className="p-6">
          <p className="mb-4 text-sm font-bold text-slate-800">Profile</p>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-700 text-lg font-bold text-white">
              {user.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-400">{user.email}</p>
              <span className="mt-1 inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">{user.role}</span>
            </div>
          </div>

          <p className="mb-3 mt-6 text-sm font-bold text-slate-800">Notification Preferences</p>
          <div className="space-y-3">
            {[
              { key: "email", label: "Email me when a record needs manual verification" },
              { key: "sms", label: "SMS alerts for critical validation errors" },
              { key: "weeklyReport", label: "Weekly digitization summary report" },
            ].map((n) => (
              <label key={n.key} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3.5 py-3">
                <span className="text-sm text-slate-600">{n.label}</span>
                <input type="checkbox" checked={notify[n.key]} onChange={(e) => setNotify({ ...notify, [n.key]: e.target.checked })} className="h-4 w-4 accent-blue-700" />
              </label>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-6">
            <p className="mb-1 text-sm font-bold text-slate-800">Validation Threshold</p>
            <p className="mb-4 text-xs text-slate-400">Minimum match confidence required for automatic approval.</p>
            <input type="range" min="60" max="100" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="w-full accent-blue-700" />
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span>60%</span>
              <span className="text-sm font-bold text-blue-700">{threshold}%</span>
              <span>100%</span>
            </div>
            <SecondaryButton className="mt-4" icon={Check} onClick={saveThreshold}>Save Threshold</SecondaryButton>
          </Card>

          <Card className="p-6">
            <p className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800"><KeyRound className="h-4 w-4 text-blue-700" /> Change Password</p>
            <form onSubmit={changePw} className="space-y-3">
              <input type="password" placeholder="Current password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
              <input type="password" placeholder="New password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
              <input type="password" placeholder="Confirm new password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
              <PrimaryButton type="submit" className="w-full">Update Password</PrimaryButton>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ============================== APP ============================== */

export default function App() {
  const [page, setPage] = useState("landing");
  const [history, setHistory] = useState([]);
  const [auth, setAuth] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const [records, setRecords] = useState(INITIAL_RECORDS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [audit, setAudit] = useState(INITIAL_AUDIT);

  const [scenarioKey, setScenarioKey] = useState("A");
  const [activeScenario, setActiveScenario] = useState(null);
  const [fields, setFields] = useState(SCENARIOS.A.extracted);
  const [validation, setValidation] = useState(null);
  const [dupes, setDupes] = useState([]);
  const [selectedRecordId, setSelectedRecordId] = useState(null);

  function goTo(next, recordId) {
    if (recordId) setSelectedRecordId(recordId);
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function logAudit(action, details) {
    setAudit((a) => [{ id: "A" + (a.length + 1) + Math.random().toString(36).slice(2, 5), timestamp: new Date().toISOString().slice(0, 16).replace("T", " "), user: auth ? auth.name : "System", action, details }, ...a]);
  }

  function handleLogin(u) {
    setAuth(u);
    logAudit("User Login", `${u.name} signed in to the portal`);
  }

  function handleLogout() {
    logAudit("User Logout", `${auth.name} signed out of the portal`);
    setAuth(null);
    setPage("landing");
  }

  function handleUploadComplete(scenario) {
    setActiveScenario(scenario);
    setFields(scenario.extracted);
    setValidation(null);
    logAudit("Uploaded Document", `${scenario.fileName} uploaded and processed via OCR`);
    goTo("ocr");
  }

  function handleValidated(result, dupeList) {
    setValidation(result);
    setDupes(dupeList);
    logAudit("Ran Validation", `Validation completed for ${activeScenario ? activeScenario.fileName : "document"} — ${result.overall}% confidence`);
  }

  function nextRecordId() {
    const nums = records.map((r) => parseInt(r.id.split("-")[1], 10));
    return "LR-" + (Math.max(...nums) + 1);
  }

  function approveRecord() {
    const id = nextRecordId();
    const newRecord = { id, ...fields, status: "Verified", confidence: validation ? validation.overall : 98, uploadedDate: new Date().toISOString().slice(0, 10) };
    setRecords((r) => [newRecord, ...r]);
    logAudit("Approved Record", `${id} approved and stored (${newRecord.confidence}% confidence)`);
    toast(setToasts, `${id} approved and stored in the registry.`, "success");
    goTo("records");
  }

  function manualVerifyRecord() {
    const id = nextRecordId();
    const newRecord = { id, ...fields, status: "Manual Verification", confidence: validation ? validation.overall : 87, uploadedDate: new Date().toISOString().slice(0, 10), issue: validation && validation.issues[0] ? validation.issues[0].detail : "Flagged for manual verification" };
    setRecords((r) => [newRecord, ...r]);
    logAudit("Manual Verification", `${id} sent for manual verification`);
    toast(setToasts, `${id} sent for manual verification.`, "warning");
    goTo("errors");
  }

  function rejectRecord() {
    logAudit("Rejected Document", `${activeScenario ? activeScenario.fileName : "Document"} rejected during validation review`);
    toast(setToasts, "Document rejected. It was not added to the registry.", "error");
    goTo("upload");
  }

  function updateRecord(updated) {
    setRecords((rs) => rs.map((r) => (r.id === updated.id ? updated : r)));
    logAudit("Edited Record", `${updated.id} fields manually corrected`);
  }

  const selectedRecord = records.find((r) => r.id === selectedRecordId) || null;

  if (!auth) {
    if (page === "login") return <><LoginPage goTo={goTo} onLogin={handleLogin} users={users} setToasts={setToasts} /><Toasts toasts={toasts} /></>;
    return <><LandingPage goTo={goTo} /><Toasts toasts={toasts} /></>;
  }

  let content = null;
  switch (page) {
    case "upload":
      content = <UploadPage scenarioKey={scenarioKey} setScenarioKey={setScenarioKey} onComplete={handleUploadComplete} goTo={goTo} />;
      break;
    case "ocr":
      content = <OcrResultPage scenario={activeScenario} fields={fields} setFields={setFields} goTo={goTo} />;
      break;
    case "validation":
      content = <ValidationPage scenario={activeScenario} fields={fields} records={records} goTo={goTo} onValidated={handleValidated} />;
      break;
    case "validation-result":
      content = <ValidationResultPage scenario={activeScenario} fields={fields} validation={validation} dupes={dupes} goTo={goTo} onApprove={approveRecord} onManual={manualVerifyRecord} onReject={rejectRecord} />;
      break;
    case "records":
      content = <LandRecordsPage records={records} goTo={goTo} />;
      break;
    case "record-details":
      content = <RecordDetailsPage record={selectedRecord} goTo={goTo} audit={audit} updateRecord={updateRecord} setToasts={setToasts} />;
      break;
    case "errors":
      content = <ErrorsDuplicatesPage records={records} goTo={goTo} />;
      break;
    case "reports":
      content = <ReportsPage records={records} setToasts={setToasts} />;
      break;
    case "users":
      content = <UsersPage users={users} setUsers={setUsers} role={auth.role} setToasts={setToasts} />;
      break;
    case "audit":
      content = <AuditLogsPage audit={audit} />;
      break;
    case "settings":
      content = <SettingsPage user={auth} setToasts={setToasts} />;
      break;
    default:
      content = <DashboardPage records={records} user={auth} goTo={goTo} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar page={page} goTo={goTo} role={auth.role} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex min-h-screen flex-1 flex-col">
        <TopBar page={page} user={auth} setMobileOpen={setMobileOpen} onLogout={handleLogout} goTo={goTo} />
        <main className="flex-1 p-4 sm:p-6">{content}</main>
      </div>
      <Toasts toasts={toasts} />
    </div>
  );
}
