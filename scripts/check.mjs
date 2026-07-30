import { readFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const css = readFileSync("assets/styles.css", "utf8");
const cname = readFileSync("CNAME", "utf8").trim();
const sitemap = readFileSync("sitemap.xml", "utf8");

const required = [
  "Pilotkunden",
  "KI packt an",
  "KI-Assistenten",
  "https://ki-packt-an.de/",
  "50 Prozent",
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

if (cname !== "ki-packt-an.de") {
  throw new Error("CNAME must point to ki-packt-an.de.");
}

if (!sitemap.includes("https://ki-packt-an.de/")) {
  throw new Error("Sitemap must use the primary custom domain.");
}

console.log("Landing page checks passed.");
