const productionOrigin = "https://ki-packt-an.de";
const routes = [
  "/",
  "/ki-assistenten-unternehmen/",
  "/email-assistent/",
  "/openclaw-fuer-unternehmen/",
  "/ki-assistent-crm-erp/",
  "/ki-assistent-betrieb-betreuung/",
  "/wissen/",
  "/wissen/was-ist-ein-ki-agent/",
  "/wissen/ki-agenten-im-mittelstand/",
  "/wissen/ki-email-assistent-sicher-einsetzen/",
  "/wissen/ki-agent-kosten/",
  "/wissen/ki-agent-sicherheit-prompt-injection/",
  "/fabian-georgi/",
];

const staticFiles = ["/robots.txt", "/sitemap.xml", "/llms.txt", "/llms-full.txt"];

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

function textOnly(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function get(path) {
  const response = await fetch(`${baseUrl}${path}`, {
    redirect: "manual",
    headers: {
      "user-agent": "ki-packt-an-seo-audit/1.0",
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
    assert(body.includes("User-agent: GPTBot"), "robots.txt must explicitly handle GPTBot");
    assert(body.includes(`Sitemap: ${productionOrigin}/sitemap.xml`), "robots.txt must reference the production sitemap");
  }
}

console.log(`SEO HTTP audit passed for ${routes.length} routes in ${mode} mode at ${baseUrl}.`);
