const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_TO_EMAIL = "hello@georgi.digital";

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
}

function clean(value) {
  return String(value || "").trim();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function verifyTurnstile(token, request, env) {
  if (!env.TURNSTILE_SECRET_KEY) {
    return true;
  }

  if (!token) {
    return false;
  }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY,
      response: token,
      remoteip: request.headers.get("CF-Connecting-IP") || "",
    }),
  });

  const result = await response.json();
  return Boolean(result.success);
}

function buildEmailText(data) {
  return [
    "Neue KI-packt-an Anfrage",
    "",
    `Unternehmen: ${data.company}`,
    `Ansprechpartner: ${data.name}`,
    `E-Mail: ${data.email}`,
    `Gewünschter Startzeitraum: ${data.timeline}`,
    `Beteiligte Systeme: ${data.systems}`,
    "",
    "Wiederkehrende Aufgabe:",
    data.message,
    "",
    "Quelle: https://ki-packt-an.de/",
  ].join("\n");
}

function buildEmailHtml(data) {
  const rows = [
    ["Unternehmen", data.company],
    ["Ansprechpartner", data.name],
    ["E-Mail", data.email],
    ["Gewünschter Startzeitraum", data.timeline],
    ["Beteiligte Systeme", data.systems],
  ];

  const detailRows = rows
    .map(([label, value]) => {
      return `<p><strong>${label}:</strong><br>${escapeHtml(value)}</p>`;
    })
    .join("");

  return `<!doctype html>
<html lang="de">
  <body style="font-family:Arial,sans-serif;line-height:1.55;color:#18202f">
    <h1 style="font-size:20px">Neue KI-packt-an Anfrage</h1>
    ${detailRows}
    <p><strong>Wiederkehrende Aufgabe:</strong></p>
    <p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>
    <p style="color:#667085;font-size:13px">Quelle: https://ki-packt-an.de/</p>
  </body>
</html>`;
}

function escapeHtml(value) {
  return clean(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function onRequestPost({ request, env }) {
  let payload;

  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ message: "Die Anfrage konnte nicht gelesen werden." }, 400);
  }

  if (clean(payload.website)) {
    return jsonResponse({ message: "Danke, die Anfrage wurde aufgenommen." });
  }

  const data = {
    company: clean(payload.company),
    name: clean(payload.name),
    email: clean(payload.email),
    timeline: clean(payload.timeline),
    systems: clean(payload.systems),
    message: clean(payload.message),
  };

  if (!data.company || !data.name || !isValidEmail(data.email) || data.message.length < 20) {
    return jsonResponse({ message: "Bitte füllen Sie alle Pflichtfelder vollständig aus." }, 422);
  }

  const turnstileOk = await verifyTurnstile(clean(payload["cf-turnstile-response"]), request, env);
  if (!turnstileOk) {
    return jsonResponse({ message: "Die Sicherheitsprüfung ist fehlgeschlagen." }, 403);
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_FROM_EMAIL) {
    return jsonResponse({ message: "Das Formular ist noch nicht vollständig konfiguriert." }, 500);
  }

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL,
      to: [env.CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL],
      reply_to: data.email,
      subject: `KI packt an Anfrage: ${data.company}`,
      text: buildEmailText(data),
      html: buildEmailHtml(data),
    }),
  });

  if (!response.ok) {
    return jsonResponse({ message: "Die Anfrage konnte gerade nicht versendet werden." }, 502);
  }

  return jsonResponse({ message: "Danke, die Anfrage wurde versendet. Ich melde mich zeitnah." });
}

export function onRequest() {
  return jsonResponse({ message: "Methode nicht erlaubt." }, 405);
}
