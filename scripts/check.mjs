import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

const origin = "https://ki-packt-an.de";
const siteFiles = [
  "index.html",
  "ki-assistenten-unternehmen/index.html",
  "email-assistent/index.html",
  "openclaw-fuer-unternehmen/index.html",
  "ki-assistent-crm-erp/index.html",
  "ki-assistent-betrieb-betreuung/index.html",
  "wissen/index.html",
  "wissen/was-ist-ein-ki-agent/index.html",
  "wissen/ki-agenten-im-mittelstand/index.html",
  "wissen/ki-email-assistent-sicher-einsetzen/index.html",
  "wissen/ki-agent-kosten/index.html",
  "wissen/ki-agent-sicherheit-prompt-injection/index.html",
  "fabian-georgi/index.html",
];

const css = readFileSync("assets/styles.css", "utf8");
const script = readFileSync("assets/script.js", "utf8");
const contactFunction = readFileSync("functions/api/contact.js", "utf8");
const cname = readFileSync("CNAME", "utf8").trim();
const sitemap = readFileSync("sitemap.xml", "utf8");
const robots = readFileSync("robots.txt", "utf8");
const llms = readFileSync("llms.txt", "utf8");
const llmsFull = readFileSync("llms-full.txt", "utf8");
const headers = readFileSync("_headers", "utf8");
const redirects = readFileSync("_redirects", "utf8");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function pageUrl(file) {
  if (file === "index.html") return `${origin}/`;
  return `${origin}/${dirname(file)}/`;
}

function stripScripts(html) {
  return html.replace(/<script[\s\S]*?<\/script>/g, "");
}

function textOnly(html) {
  return stripScripts(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function jsonLdTypes(value, types = new Set()) {
  if (Array.isArray(value)) {
    for (const item of value) {
      jsonLdTypes(item, types);
    }
    return types;
  }

  if (!value || typeof value !== "object") {
    return types;
  }

  if (value["@type"]) {
    if (Array.isArray(value["@type"])) {
      for (const type of value["@type"]) {
        types.add(type);
      }
    } else {
      types.add(value["@type"]);
    }
  }

  for (const nested of Object.values(value)) {
    jsonLdTypes(nested, types);
  }

  return types;
}

function parseJsonLd(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((json) => JSON.parse(json[1]));
}

assert(cname === "ki-packt-an.de", "CNAME must point to ki-packt-an.de.");
assert(robots.includes("User-agent: OAI-SearchBot\nAllow: /"), "robots.txt must explicitly allow OAI-SearchBot.");
assert(robots.includes("User-agent: GPTBot\nDisallow: /"), "robots.txt must keep GPTBot separate from ChatGPT Search.");
assert(robots.includes(`Sitemap: ${origin}/sitemap.xml`), "robots.txt must reference the canonical sitemap.");
assert(headers.includes("https://*.pages.dev/*") && headers.includes("X-Robots-Tag: noindex, nofollow"), "_headers must protect Cloudflare Pages previews.");
assert(redirects.includes("https://www.ki-packt-an.de/* https://ki-packt-an.de/:splat 301"), "_redirects must canonicalize www to non-www.");
assert(existsSync("functions/_middleware.js"), "Preview noindex middleware must exist.");
const middleware = readFileSync("functions/_middleware.js", "utf8");
assert(middleware.includes(".pages.dev") && middleware.includes("noindex,nofollow") && middleware.includes("X-Robots-Tag"), "Preview middleware must inject noindex meta and header.");

for (const file of siteFiles) {
  assert(existsSync(file), `Missing page: ${file}`);
  const html = readFileSync(file, "utf8");
  const url = pageUrl(file);
  const visibleText = textOnly(html);

  assert(html.includes("<main"), `${file} must include a main element.`);
  assert((html.match(/<h1[\s>]/g) || []).length === 1, `${file} must have exactly one h1.`);
  assert(html.includes(`<link rel="canonical" href="${url}">`), `${file} must have a self-referencing canonical.`);
  assert(html.includes('<meta name="robots" content="index, follow">'), `${file} must be indexable in production.`);
  assert(html.includes('<meta property="og:site_name" content="KI packt an">'), `${file} must include og:site_name.`);
  assert(html.includes('<meta name="twitter:card" content="summary_large_image">'), `${file} must include a Twitter card.`);
  assert(html.includes(`${origin}/assets/social/ki-packt-an-social.png`), `${file} must reference the social preview image.`);
  assert((html.match(/<meta property="og:image"/g) || []).length === 1, `${file} must contain exactly one og:image.`);
  assert((html.match(/<meta name="twitter:card"/g) || []).length === 1, `${file} must contain exactly one Twitter card.`);
  assert(html.includes('type="application/ld+json"'), `${file} must include JSON-LD.`);
  assert(visibleText.length > 700, `${file} has too little crawlable visible text.`);
  assert(!html.includes(".pages.dev"), `${file} must not canonicalize or link to a preview domain.`);
  assert(!html.includes("AggregateRating") && !html.includes('"@type":"Product"'), `${file} must not contain unsupported rich-result markup.`);

  for (const match of html.matchAll(/<img\s+([^>]+)>/g)) {
    const attrs = match[1];
    assert(/\salt=/.test(attrs), `${file} has an image without alt text.`);
    assert(/\swidth=/.test(attrs) && /\sheight=/.test(attrs), `${file} has an image without fixed dimensions.`);
  }

  const jsonLd = parseJsonLd(html);
  const types = jsonLdTypes(jsonLd);
  assert(types.has("WebSite"), `${file} JSON-LD must include WebSite.`);
  assert(types.has("ProfessionalService"), `${file} JSON-LD must include ProfessionalService.`);
  assert(types.has("Person"), `${file} JSON-LD must include Person.`);
  assert(types.has("WebPage") || types.has("CollectionPage") || types.has("ProfilePage"), `${file} JSON-LD must include a page type.`);
  assert(!types.has("FAQPage"), `${file} must not use FAQPage markup as a rich-result shortcut.`);

  if (file.startsWith("wissen/") && file !== "wissen/index.html") {
    assert(types.has("Article"), `${file} JSON-LD must include Article.`);
    assert(types.has("BreadcrumbList"), `${file} JSON-LD must include BreadcrumbList.`);
    assert(html.includes('"datePublished":"2026-08-11"'), `${file} Article datePublished must match visible date.`);
    assert(html.includes('"dateModified":"2026-08-11"'), `${file} Article dateModified must match visible review date.`);
  }

  if (!file.startsWith("wissen/") && file !== "index.html" && file !== "fabian-georgi/index.html") {
    assert(types.has("Service"), `${file} JSON-LD must include Service.`);
    assert(types.has("BreadcrumbList"), `${file} JSON-LD must include BreadcrumbList.`);
  }

  assert(sitemap.includes(`<loc>${url}</loc>`), `Sitemap missing ${url}.`);
}

const articleFiles = siteFiles.filter((file) => file.startsWith("wissen/") && file !== "wissen/index.html");
for (const file of articleFiles) {
  const html = readFileSync(file, "utf8");
  assert(html.includes("Autor: Fabian Georgi"), `${file} must show the author.`);
  assert(html.includes("Fachlich geprüft:"), `${file} must show the last review date.`);
}

const home = readFileSync("index.html", "utf8");
const requiredHome = [
  "KI-Assistenten, die E-Mails, Dokumente und wiederkehrende Arbeit übernehmen.",
  "Ein KI-Assistent für Unternehmen erhält einen klaren Arbeitsauftrag",
  "Alle fachlichen Seiten im Überblick.",
  "form class=\"lead-form\"",
  "action=\"/api/contact\"",
  "data-sitekey=\"0x4AAAAAAEDDgd1QoPAr9Cby\"",
  "fabian-georgi-450.webp 450w",
];

for (const needle of requiredHome) {
  assert(home.includes(needle), `Homepage missing required content: ${needle}`);
}

const homepageLinks = [...home.matchAll(/<a\s+[^>]*href="([^"]+)"/g)].map((match) => match[1].split("#")[0]);
for (const file of siteFiles.filter((file) => file !== "index.html")) {
  const path = `/${dirname(file)}/`;
  assert(homepageLinks.includes(path), `Homepage must directly link to ${path}.`);
}

assert(!/font-size:\s*[^;]*vw/.test(css), "Avoid viewport-width font sizing in CSS.");
assert(script.includes("https://challenges.cloudflare.com/turnstile/v0/api.js"), "Turnstile client script missing.");
assert(script.includes("fetch(form.action"), "Lead form must submit through fetch.");
assert(script.includes("turnstile?.reset"), "Lead form must reset Turnstile after submissions.");
assert(contactFunction.includes("https://api.resend.com/emails"), "Contact function must use the Resend email API.");
assert(contactFunction.includes("TURNSTILE_SECRET_KEY"), "Contact function must validate Turnstile tokens server-side.");

assert(llms.includes("# KI packt an") && llms.includes("OAI-SearchBot"), "llms.txt must describe the site and ChatGPT Search crawler distinction.");
assert(llmsFull.includes("KI-Agenten und Prompt Injection"), "llms-full.txt must include public knowledge content.");
assert(llmsFull.includes("Kostenblöcke eines KI-Agenten"), "llms-full.txt must include generated rich content.");
assert(!llmsFull.includes("SECRET") && !llmsFull.includes("RESEND_API_KEY"), "llms-full.txt must not include internal secrets.");
assert(existsSync("404.html"), "404.html must exist.");
assert(existsSync("assets/social/ki-packt-an-social.png"), "Social preview PNG must exist.");
assert(existsSync("assets/social/ki-packt-an-logo-512.png"), "Square logo PNG must exist.");

console.log(`SEO/GEO checks passed for ${siteFiles.length} indexable pages.`);
