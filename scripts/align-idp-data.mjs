// Align public/data/idp-data.json identity fields to the canonical
// participants.csv (PGS-1133 consistency). Idempotent: canonical names are kept,
// any non-canonical person name is deterministically remapped to a canonical one,
// and role/dept/email/nik/initials are recomputed from the final name (dept = nama tim).
// Hand-authored content (programs, comment text, review aspects, etc.) is preserved.
// Run: node scripts/align-idp-data.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const JSON_PATH = join(ROOT, "public/data/idp-data.json");

const csv = readFileSync(join(ROOT, "public/data/participants.csv"), "utf8").replace(/^﻿/, "").trim().split(/\r?\n/);
const H = csv[0].split(",");
const canon = csv.slice(1).map(l => { const v = l.split(","); return Object.fromEntries(H.map((h, i) => [h, (v[i] ?? "").trim()])); });
const byName = new Map(canon.map(r => [r.name, r]));
const canonNames = canon.map(r => r.name);

// Nama tim dibaca dari output kanonik (dihasilkan scripts/seed.mjs) supaya kolom
// "Teams" di modul IDP tidak bisa melenceng dari nama yang dipakai Team Profile /
// Visibility Map. participants.csv hanya menyimpan id timnya (ENG, OPS, ...).
const genSrc = readFileSync(join(ROOT, "src/data/model/generated.ts"), "utf8");
const canonical = JSON.parse(genSrc.slice(genSrc.indexOf("{", genSrc.indexOf("CANONICAL")), genSrc.lastIndexOf("}") + 1));
const teamNameById = new Map(canonical.teams.map(t => [t.id, t.name]));

const initials = (name) => (name || "").split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0] || "").join("").toUpperCase();
const slug = (name) => (name || "").toLowerCase().normalize("NFD").replace(/[^\w\s]/g, "").trim().replace(/\s+/g, ".");
const emailOf = (name) => slug(name) + "@talentlytica.com";
// deterministic NIK from canonical index (stable ordering)
const nikOf = (name) => { const i = canonNames.indexOf(name); return "23497" + String((i < 0 ? 0 : i) + 1).padStart(5, "0"); };

// stable non-canonical -> canonical mapping (hash the string to an index)
function toCanon(name) {
  if (!name) return name;
  if (byName.has(name)) return name;
  let h = 0; for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return canonNames[h % canonNames.length];
}

const d = JSON.parse(readFileSync(JSON_PATH, "utf8"));
const remap = new Map(); // for reporting + prose replacement

function fixName(name) { const c = toCanon(name); if (name && c !== name) remap.set(name, c); return c; }
function fixPerson(obj, roleFromCanon = false) {
  if (!obj || typeof obj !== "object" || !obj.name) return;
  obj.name = fixName(obj.name);
  const cr = byName.get(obj.name);
  if ("initials" in obj) obj.initials = initials(obj.name);
  if (roleFromCanon && cr && "role" in obj) obj.role = cr.position;
  // position/photoUrl: dipakai kartu PIC di detail-idp-admin/manager/employee.html
  // (avatar foto + nama + jabatan), supaya jabatannya tidak perlu di-hardcode ("PIC").
  if (cr) {
    obj.position = cr.position;
    if (cr.id) obj.photoUrl = `/avatars/employee/${cr.id.toLowerCase()}.png`;
  }
}

// employees: role/dept/email/nik/avatar from canonical; fix pic identities
(d.employees || []).forEach(e => {
  e.name = fixName(e.name);
  const cr = byName.get(e.name);
  if (cr) {
    // dept menyimpan NAMA TIM (bukan departemen) — modul IDP menampilkannya pada
    // kolom "Teams" dan subtitle "role · dept", jadi keduanya ikut konsisten.
    e.role = cr.position; e.dept = teamNameById.get(cr.team) ?? "-"; e.email = emailOf(e.name); e.nik = nikOf(e.name);
    if ("avatar" in e && cr.id) e.avatar = `/avatars/employee/${cr.id.toLowerCase()}.png`;
  }
  (e.idps || []).forEach(idp => (idp.pics || []).forEach(p => fixPerson(p)));
});

// comments
(d.comments || []).forEach(c => fixPerson(c));

// reviews: requester + participants + pics
(d.reviews || []).forEach(r => {
  fixPerson(r.reqby, true);
  if (Array.isArray(r.participants)) r.participants = r.participants.map(fixName);
  if (Array.isArray(r.pics)) r.pics = r.pics.map(fixName);
});

// participantPool: rebuild from ALL canonical people
d.participantPool = canonNames.map(name => ({ name, nik: nikOf(name), email: emailOf(name) }));

// notifications: replace any remapped non-canonical name in prose (whole word)
if (remap.size && Array.isArray(d.notifications)) {
  d.notifications.forEach(n => {
    for (const [from, to] of remap) {
      if (n.desc) n.desc = n.desc.split(from).join(to);
      if (n.title) n.title = n.title.split(from).join(to);
    }
  });
}

writeFileSync(JSON_PATH, JSON.stringify(d, null, 2) + "\n");
console.log("aligned idp-data.json");
console.log("employees:", (d.employees || []).length, "| participantPool:", d.participantPool.length);
console.log("non-canonical names remapped (" + remap.size + "):");
for (const [from, to] of remap) console.log("  " + from + " -> " + to);
