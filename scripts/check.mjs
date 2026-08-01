import { readFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const css = readFileSync("assets/styles.css", "utf8");
const script = readFileSync("assets/script.js", "utf8");
const contactFunction = readFileSync("functions/api/contact.js", "utf8");
const cname = readFileSync("CNAME", "utf8").trim();
const sitemap = readFileSync("sitemap.xml", "utf8");

const required = [
  "Einrichtung, Integration und Betrieb von KI-Assistenten",
  "KI-Assistenten, die E-Mails, Dokumente und wiederkehrende Arbeit übernehmen.",
  "Unverbindlich Einsatz prüfen",
  "So arbeitet ein KI-Assistent",
  "Klare Aufgaben",
  "Bestehende Systeme",
  "Menschliche Freigaben",
  "Laufende Betreuung",
  "KI packt an",
  "KI-Assistenten",
  "E-Mail-Assistent",
  "Angebotsanfrage für 40 Arbeitsplätze",
  "E-Mail",
  "CRM",
  "Dokumente",
  "Bereit zur Prüfung",
  "Von der Aufgabe zum betreuten KI-Assistenten.",
  "So wird aus einer eingehenden Anfrage ein vorbereiteter Vorgang.",
  "Weitere gute Startpunkte",
  "So selbstständig arbeitet der Assistent.",
  "Sicher vom ersten Prozess in den laufenden Betrieb.",
  "Erst prüfen. Dann einen produktiven Assistenten begrenzt aufbauen.",
  "Pilotkondition, regulär 490 EUR",
  "Pilotkondition, regulär ab 2.900 EUR",
  "2.950-4.950 EUR Pilotkondition",
  "5.900-9.900 EUR",
  "regulär ab 490 EUR/Monat",
  "technische Erreichbarkeit und Zugänge",
  "Anonymisierte Erkenntnisse",
  "Kein langfristiger Plattformvertrag erforderlich",
  "Ich begleite die technische Umsetzung persönlich",
  "Fabian Georgi, technischer Ansprechpartner für KI packt an",
  "Softwareentwicklung, Integration und Betrieb",
  "Welche wiederkehrende Arbeit soll der Assistent übernehmen?",
  "https://ki-packt-an.de/",
  "Gewünschter Startzeitraum",
  "Beteiligte Systeme",
  "CODIKI",
  "Fabian Georgi / georgi.digital",
  "hello@georgi.digital",
  "Impressum",
  "Datenschutz",
];

for (const needle of required) {
  if (!html.includes(needle)) {
    throw new Error(`Missing required page content: ${needle}`);
  }
}

const forbiddenVisibleText = [
  "Wer KI-Agenten einrichten will",
  "Der Schwerpunkt liegt auf KI für den Mittelstand",
  "Unternehmensprozesse automatisieren",
  "KI mit CRM und ERP verbinden",
  "KI-Assistent betreiben",
  "Regulär",
  "Prozess prüfen lassen",
  "Pilot besprechen",
];

for (const needle of forbiddenVisibleText) {
  if (html.includes(needle)) {
    throw new Error(`Remove SEO-like visible text: ${needle}`);
  }
}

const visibleText = html
  .replace(/<script[\s\S]*?<\/script>/g, "")
  .replace(/<style[\s\S]*?<\/style>/g, "")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim();

if (visibleText.length > 6_600) {
  throw new Error(`Visible page text is still too long: ${visibleText.length} chars.`);
}

const h1Count = (html.match(/<h1[\s>]/g) || []).length;
if (h1Count !== 1) {
  throw new Error(`Expected exactly one h1, found ${h1Count}.`);
}

if (/font-size:\s*[^;]*vw/.test(css)) {
  throw new Error("Avoid viewport-width font sizing in CSS.");
}

if (!html.includes('form class="lead-form"')) {
  throw new Error("Lead form missing.");
}

if (!html.includes('action="/api/contact"')) {
  throw new Error("Lead form must post to the Cloudflare contact function.");
}

if (!html.includes('id="lead-form-status"')) {
  throw new Error("Lead form status region missing.");
}

if (!html.includes("fabian-georgi-450.webp 450w") || !html.includes('sizes="(max-width: 1120px) 220px, 260px"')) {
  throw new Error("Provider portrait must use a responsive WebP srcset.");
}

const requiredFields = [
  'name="company"',
  'name="name"',
  'name="email"',
  'name="message"',
  'name="systems"',
  'name="timeline"',
];

for (const field of requiredFields) {
  if (!html.includes(field)) {
    throw new Error(`Lead form field missing: ${field}`);
  }
}

const removedFields = ['name="pilot"', 'name="frequency"', 'name="team_size"'];
for (const field of removedFields) {
  if (html.includes(field)) {
    throw new Error(`Lead form still includes removed field: ${field}`);
  }
}

if (html.includes("placeholder=")) {
  throw new Error("Avoid placeholder text in the lead form.");
}

if (!html.includes('data-sitekey="0x4AAAAAAEDDgd1QoPAr9Cby"')) {
  throw new Error("Lead form must include the configured Turnstile site key.");
}

if (!script.includes("https://challenges.cloudflare.com/turnstile/v0/api.js")) {
  throw new Error("Turnstile client script missing.");
}

if (!script.includes("fetch(form.action")) {
  throw new Error("Lead form must submit through fetch.");
}

if (!script.includes("turnstile?.reset")) {
  throw new Error("Lead form must reset Turnstile after submissions.");
}

if (!script.includes("workflow-phase") || !script.includes("clearInterval")) {
  throw new Error("Workflow animation must run through phases and stop in a stable state.");
}

if (!contactFunction.includes("https://api.resend.com/emails")) {
  throw new Error("Contact function must use the Resend email API.");
}

if (!contactFunction.includes("RESEND_API_KEY")) {
  throw new Error("Contact function must read RESEND_API_KEY from Cloudflare env.");
}

if (!contactFunction.includes("TURNSTILE_SECRET_KEY")) {
  throw new Error("Contact function must read TURNSTILE_SECRET_KEY from Cloudflare env.");
}

if (!contactFunction.includes("https://challenges.cloudflare.com/turnstile/v0/siteverify")) {
  throw new Error("Contact function must validate Turnstile tokens server-side.");
}

if (cname !== "ki-packt-an.de") {
  throw new Error("CNAME must point to ki-packt-an.de.");
}

if (!sitemap.includes("https://ki-packt-an.de/")) {
  throw new Error("Sitemap must use the primary custom domain.");
}

console.log("Landing page checks passed.");
