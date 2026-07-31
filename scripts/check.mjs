import { existsSync, readFileSync, statSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const css = readFileSync("assets/styles.css", "utf8");
const script = readFileSync("assets/script.js", "utf8");
const contactFunction = readFileSync("functions/api/contact.js", "utf8");
const cname = readFileSync("CNAME", "utf8").trim();
const sitemap = readFileSync("sitemap.xml", "utf8");

const required = [
  "Pilotkunden",
  "KI packt an",
  "KI-Assistenten",
  "Clara Postmann",
  "Nora Wissen",
  "Felix Angebot",
  "https://ki-packt-an.de/",
  "50 Prozent",
  "Häufigkeit der Arbeit",
  "Beteiligte Systeme oder Datenquellen",
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

if (!script.includes("fetch(form.action")) {
  throw new Error("Lead form must submit through fetch.");
}

if (!contactFunction.includes("https://api.resend.com/emails")) {
  throw new Error("Contact function must use the Resend email API.");
}

if (!contactFunction.includes("RESEND_API_KEY")) {
  throw new Error("Contact function must read RESEND_API_KEY from Cloudflare env.");
}

const assistantImages = [
  "assets/assistants/clara-postmann.webp",
  "assets/assistants/nora-wissen.webp",
  "assets/assistants/felix-angebot.webp",
  "assets/assistants/mira-service.webp",
  "assets/assistants/ben-ablauf.webp",
  "assets/assistants/greta-zahlen.webp",
];

for (const image of assistantImages) {
  if (!html.includes(image)) {
    throw new Error(`Assistant image not referenced: ${image}`);
  }

  if (!existsSync(image)) {
    throw new Error(`Assistant image missing: ${image}`);
  }

  if (statSync(image).size > 120_000) {
    throw new Error(`Assistant image too large: ${image}`);
  }
}

if (cname !== "ki-packt-an.de") {
  throw new Error("CNAME must point to ki-packt-an.de.");
}

if (!sitemap.includes("https://ki-packt-an.de/")) {
  throw new Error("Sitemap must use the primary custom domain.");
}

console.log("Landing page checks passed.");
