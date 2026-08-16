const productionOrigin = "https://ki-packt-an.de";
const routes = [
  "/",
  "/email-assistent/",
  "/openclaw-fuer-unternehmen/",
  "/ki-assistent-crm-erp/",
  "/ki-assistent-betrieb-betreuung/",
  "/wissen/",
  "/wissen/was-ist-ein-ki-agent/",
  "/wissen/ki-agenten-im-mittelstand/",
  "/wissen/produktive-ki-agenten-openclaw-mittelstand/",
  "/wissen/openclaw-sicher-betreiben/",
  "/wissen/openclaw-microsoft-365-oauth-email/",
  "/wissen/openclaw-selbst-hosten-docker-backup-monitoring/",
  "/wissen/openclaw-dsgvo-datenfluesse-modelle-unternehmensdaten/",
  "/wissen/prompt-injection-test-ki-agent-email/",
  "/wissen/ki-email-assistent-sicher-einsetzen/",
  "/wissen/ki-agent-kosten/",
  "/wissen/ki-agent-sicherheit-prompt-injection/",
  "/fabian-georgi/",
];

const staticFiles = ["/robots.txt", "/sitemap.xml", "/llms.txt", "/llms-full.txt"];
const crawlerAgents = [
  ["Googlebot", "Googlebot/2.1 (+http://www.google.com/bot.html)"],
  ["Bingbot", "bingbot/2.0; +http://www.bing.com/bingbot.htm"],
  ["OAI-SearchBot", "OAI-SearchBot/1.0; +https://openai.com/searchbot"],
  ["ChatGPT-User", "ChatGPT-User/1.0; +https://openai.com/bot"],
  ["Claude-SearchBot", "Claude-SearchBot/1.0"],
  ["Claude-User", "Claude-User/1.0"],
  ["PerplexityBot", "PerplexityBot/1.0"],
  ["Perplexity-User", "Perplexity-User/1.0"],
];
const redirects = new Map([
  ["/ki-assistenten-unternehmen/", "/"],
]);

const baseUrl = (process.argv[2] || "").replace(/\/$/, "");
const mode = process.argv[3] || "production";

if (!baseUrl || !["production", "preview"].includes(mode)) {
  throw new Error("Usage: node scripts/audit-seo.mjs <base-url> <production|preview>");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function countMatches(html, pattern) {
  return (html.match(pattern) || []).length;
}

function extractJsonLd(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
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
      value["@type"].forEach((type) => types.add(type));
    } else {
      types.add(value["@type"]);
    }
  }

  Object.values(value).forEach((nested) => jsonLdTypes(nested, types));
  return types;
}

function textOnly(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function get(path) {
  return getWithUserAgent(path, "ki-packt-an-seo-audit/1.0");
}

async function getWithUserAgent(path, userAgent) {
  const response = await fetch(`${baseUrl}${path}`, {
    redirect: "manual",
    headers: {
      "user-agent": userAgent,
    },
  });
  const body = await response.text();
  return { response, body };
}

for (const route of routes) {
  const { response, body } = await get(route);
  const canonical = `${productionOrigin}${route}`;
  const contentType = response.headers.get("content-type") || "";

  assert(response.status === 200, `${route} returned ${response.status}`);
  assert(contentType.includes("text/html"), `${route} must return HTML, got ${contentType}`);
  assert(countMatches(body, /<h1[\s>]/g) === 1, `${route} must contain exactly one h1`);
  assert(/<title>[^<]{8,}<\/title>/.test(body), `${route} must contain a non-empty title`);
  assert(/<meta name="description" content="[^"]{40,}">/.test(body), `${route} must contain a useful meta description`);
  assert(countMatches(body, /<link rel="canonical"/g) === 1, `${route} must contain exactly one canonical`);
  assert(body.includes(`<link rel="canonical" href="${canonical}">`), `${route} canonical must be ${canonical}`);
  assert(!body.includes("pages.dev"), `${route} must not contain preview URLs`);
  assert(body.includes('<meta property="og:title"'), `${route} must contain og:title`);
  assert(body.includes('<meta property="og:image"'), `${route} must contain og:image`);
  assert(countMatches(body, /<meta property="og:image"/g) === 1, `${route} must contain exactly one og:image`);
  assert(textOnly(body).length > 700, `${route} must contain crawlable text`);

  if (mode === "production") {
    assert(!/noindex/i.test(body), `${route} must not contain noindex in production`);
    assert(!/noindex/i.test(response.headers.get("x-robots-tag") || ""), `${route} must not send X-Robots-Tag noindex in production`);
  } else {
    assert(body.includes('<meta name="robots" content="noindex,nofollow">'), `${route} must contain preview noindex meta`);
    assert(/noindex/i.test(response.headers.get("x-robots-tag") || ""), `${route} must send X-Robots-Tag noindex in preview`);
  }

  const jsonLdBlocks = extractJsonLd(body);
  assert(jsonLdBlocks.length >= 1, `${route} must contain JSON-LD`);
  const types = jsonLdTypes(jsonLdBlocks);
  assert(types.has("WebSite"), `${route} JSON-LD must include WebSite`);
  assert(types.has("ProfessionalService"), `${route} JSON-LD must include ProfessionalService`);
  assert(types.has("Person"), `${route} JSON-LD must include Person`);
  assert(types.has("WebPage") || types.has("CollectionPage") || types.has("ProfilePage"), `${route} JSON-LD must include a page node`);

  if (route.startsWith("/wissen/") && route !== "/wissen/") {
    assert(types.has("Article"), `${route} JSON-LD must include Article`);
    assert(body.includes('"dateModified":"2026-08-16"'), `${route} Article must expose the current review date`);
  }
}

for (const [label, userAgent] of crawlerAgents) {
  const { response, body } = await getWithUserAgent("/", userAgent);
  assert(response.status === 200, `${label} must receive HTTP 200 on the homepage, got ${response.status}`);
  if (mode === "production") {
    assert(!/noindex/i.test(body), `${label} must not receive noindex on the homepage in production`);
  } else {
    assert(/noindex/i.test(body), `${label} must receive preview noindex on the homepage`);
  }
}

for (const path of staticFiles) {
  const { response, body } = await get(path);
  const contentType = response.headers.get("content-type") || "";

  assert(response.status === 200, `${path} returned ${response.status}`);
  assert(!body.includes("pages.dev"), `${path} must not contain preview URLs`);

  if (path.endsWith(".xml")) {
    assert(contentType.includes("xml"), `${path} must return XML, got ${contentType}`);
  } else {
    assert(contentType.includes("text/plain") || contentType.includes("text/markdown"), `${path} must return text, got ${contentType}`);
  }

  if (path === "/sitemap.xml" || path === "/llms.txt") {
    for (const route of routes) {
      assert(body.includes(`${productionOrigin}${route}`), `${path} missing ${productionOrigin}${route}`);
    }
  }

  if (path === "/llms-full.txt") {
    assert(body.includes("KI-Agenten und Prompt Injection"), "llms-full.txt must include public knowledge content");
    assert(!body.includes("RESEND_API_KEY") && !body.includes("TURNSTILE_SECRET_KEY"), "llms-full.txt must not leak internal configuration names");
  }

  if (path === "/robots.txt") {
    assert(body.includes("User-agent: OAI-SearchBot"), "robots.txt must mention OAI-SearchBot");
    assert(body.includes("User-agent: ChatGPT-User"), "robots.txt must mention ChatGPT-User");
    assert(body.includes("User-agent: GPTBot"), "robots.txt must explicitly handle GPTBot");
    assert(body.includes("User-agent: Claude-SearchBot"), "robots.txt must mention Claude-SearchBot");
    assert(body.includes("User-agent: Claude-User"), "robots.txt must mention Claude-User");
    assert(body.includes("User-agent: ClaudeBot"), "robots.txt must explicitly handle ClaudeBot");
    assert(body.includes("User-agent: PerplexityBot"), "robots.txt must mention PerplexityBot");
    assert(body.includes("User-agent: Perplexity-User"), "robots.txt must mention Perplexity-User");
    assert(body.includes("User-agent: Google-Extended"), "robots.txt must explicitly handle Google-Extended");
    assert(body.includes("Content-Signal: search=yes, ai-input=yes, ai-train=no, use=reference"), "robots.txt must expose content signals");
    assert(body.includes(`Sitemap: ${productionOrigin}/sitemap.xml`), "robots.txt must reference the production sitemap");
  }
}

if (!baseUrl.includes("127.0.0.1") && !baseUrl.includes("localhost")) {
  for (const [from, to] of redirects) {
    const { response } = await get(from);
    assert([301, 302, 308].includes(response.status), `${from} must redirect, got ${response.status}`);
    const location = response.headers.get("location") || "";
    assert(location === to || location === `${productionOrigin}${to}` || location === `${baseUrl}${to}`, `${from} must redirect to ${to}, got ${location}`);
  }
}

console.log(`SEO HTTP audit passed for ${routes.length} routes in ${mode} mode at ${baseUrl}.`);
