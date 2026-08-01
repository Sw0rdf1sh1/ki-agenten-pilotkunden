import { readFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const css = readFileSync("assets/styles.css", "utf8");
const script = readFileSync("assets/script.js", "utf8");
const contactFunction = readFileSync("functions/api/contact.js", "utf8");
const cname = readFileSync("CNAME", "utf8").trim();
const sitemap = readFileSync("sitemap.xml", "utf8");

const required = [
  "Einrichtung, Integration und Betrieb von KI-Assistenten",
  "Wir richten KI-Assistenten ein, die in Ihrem Unternehmen mitarbeiten.",
  "Einsatzbereich prüfen lassen",
  "Beispielablauf ansehen",
  "Klar begrenzte Aufgaben",
  "Bestehende Systeme",
  "Definierte Freigaben",
  "Laufende Betreuung",
  "KI packt an",
  "KI-Assistenten",
  "KI-Agenten einrichten",
  "E-Mail-Assistent",
  "Unternehmensprozesse automatisieren",
  "KI mit CRM und ERP verbinden",
  "KI-Assistent betreiben",
  "KI-Workflow",
  "KI für den Mittelstand",
  "Angebot für 40 Arbeitsplätze",
  "E-Mail",
  "CRM",
  "Dokumente",
  "Zur Freigabe bereit",
  "Kein weiterer Chatbot. Ein eingerichteter digitaler Arbeitsablauf.",
  "Vom info@-Postfach bis zur fertigen Übergabe.",
  "Wiederkehrende Arbeit, die ein KI-Assistent übernehmen kann.",
  "Sie bestimmen, wie selbstständig der Assistent arbeitet.",
  "Wir bauen nicht nur den Assistenten. Wir sorgen dafür, dass er arbeiten kann.",
  "Zugriff nur dort, wo er gebraucht wird.",
  "Klein starten. Im Alltag beweisen. Danach gezielt ausbauen.",
  "Software- und Prozesskompetenz statt isolierter KI-Demo.",
  "Welche Arbeit bleibt in Ihrem Unternehmen regelmäßig liegen?",
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

if (!html.includes("https://challenges.cloudflare.com/turnstile/v0/api.js")) {
  throw new Error("Turnstile client script missing.");
}

if (!script.includes("fetch(form.action")) {
  throw new Error("Lead form must submit through fetch.");
}

if (!script.includes("turnstile?.reset")) {
  throw new Error("Lead form must reset Turnstile after submissions.");
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
