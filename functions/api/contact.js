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

function displayValue(value) {
  return clean(value) || "Nicht angegeben";
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

function buildLeadEmailText(data) {
  return [
    "Neue KI-packt-an Anfrage",
    "",
    `Unternehmen: ${data.company}`,
    `Ansprechpartner: ${data.name}`,
    `E-Mail: ${data.email}`,
    `Telefon: ${data.phone}`,
    `Webseite: ${data.website}`,
    `Gewünschter Startzeitraum: ${data.timeline}`,
    `Beteiligte Systeme: ${data.systems}`,
    "",
    "Welche wiederkehrende Arbeit soll der Assistent übernehmen?",
    data.message,
    "",
    "Quelle: https://ki-packt-an.de/",
  ].join("\n");
}

function buildLeadEmailHtml(data) {
  const rows = [
    ["Unternehmen", data.company],
    ["Ansprechpartner", data.name],
    ["E-Mail", data.email],
    ["Telefon", data.phone],
    ["Webseite", data.website],
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
    <p><strong>Welche wiederkehrende Arbeit soll der Assistent übernehmen?</strong></p>
    <p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>
    <p style="color:#667085;font-size:13px">Quelle: https://ki-packt-an.de/</p>
  </body>
</html>`;
}

function buildRequesterCopyText(data) {
  return [
    `Hallo ${data.name},`,
    "",
    "vielen Dank für Ihre Anfrage. Ich prüfe Ihre Angaben zeitnah und melde mich schnellstmöglich mit einer ersten Einschätzung bei Ihnen.",
    "",
    "Ihre übermittelten Angaben:",
    "",
    `Unternehmen: ${displayValue(data.company)}`,
    `Ansprechpartner: ${displayValue(data.name)}`,
    `E-Mail: ${displayValue(data.email)}`,
    `Telefon: ${displayValue(data.phone)}`,
    `Webseite: ${displayValue(data.website)}`,
    `Gewünschter Startzeitraum: ${displayValue(data.timeline)}`,
    `Beteiligte Systeme: ${displayValue(data.systems)}`,
    "",
    "Welche wiederkehrende Arbeit soll der Assistent übernehmen?",
    data.message,
    "",
    "Viele Grüße",
    "Fabian Georgi",
    "KI packt an",
    "https://ki-packt-an.de/",
    "hello@georgi.digital",
  ].join("\n");
}

function buildRequesterCopyHtml(data) {
  const rows = [
    ["Unternehmen", data.company],
    ["Ansprechpartner", data.name],
    ["E-Mail", data.email],
    ["Telefon", data.phone],
    ["Webseite", data.website],
    ["Gewünschter Startzeitraum", data.timeline],
    ["Beteiligte Systeme", data.systems],
  ];

  const detailRows = rows
    .map(([label, value]) => {
      return `<p><strong>${label}:</strong><br>${escapeHtml(displayValue(value))}</p>`;
    })
    .join("");

  return `<!doctype html>
<html lang="de">
  <body style="font-family:Arial,sans-serif;line-height:1.55;color:#18202f">
    <p>Hallo ${escapeHtml(data.name)},</p>
    <p>vielen Dank für Ihre Anfrage. Ich prüfe Ihre Angaben zeitnah und melde mich schnellstmöglich mit einer ersten Einschätzung bei Ihnen.</p>
    <h1 style="font-size:20px">Ihre übermittelten Angaben</h1>
    ${detailRows}
    <p><strong>Welche wiederkehrende Arbeit soll der Assistent übernehmen?</strong></p>
    <p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>
    <p style="margin-top:28px">
      Viele Grüße<br>
      Fabian Georgi<br>
      KI packt an<br>
      <a href="https://ki-packt-an.de/" style="color:#335c67">ki-packt-an.de</a><br>
      <a href="mailto:hello@georgi.digital" style="color:#335c67">hello@georgi.digital</a>
    </p>
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

async function sendEmail(env, email) {
  return fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(email),
  });
}

export async function onRequestPost({ request, env }) {
  let payload;

  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ message: "Die Anfrage konnte nicht gelesen werden." }, 400);
  }

  if (clean(payload.address)) {
    return jsonResponse({ message: "Danke, die Anfrage wurde aufgenommen." });
  }

  const data = {
    company: clean(payload.company),
    name: clean(payload.name),
    email: clean(payload.email),
    phone: clean(payload.phone),
    website: clean(payload.website),
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

  const contactEmail = env.CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL;

  const leadResponse = await sendEmail(env, {
    from: env.CONTACT_FROM_EMAIL,
    to: [contactEmail],
    reply_to: data.email,
    subject: `KI packt an Anfrage: ${data.company}`,
    text: buildLeadEmailText(data),
    html: buildLeadEmailHtml(data),
  });

  if (!leadResponse.ok) {
    return jsonResponse({ message: "Die Anfrage konnte gerade nicht versendet werden." }, 502);
  }

  const copyResponse = await sendEmail(env, {
    from: env.CONTACT_FROM_EMAIL,
    to: [data.email],
    reply_to: contactEmail,
    subject: "Kopie Ihrer Anfrage bei KI packt an",
    text: buildRequesterCopyText(data),
    html: buildRequesterCopyHtml(data),
  });

  if (!copyResponse.ok) {
    console.warn("Requester copy could not be sent.");
  }

  return jsonResponse({ message: "Danke, die Anfrage wurde versendet. Sie erhalten eine Kopie per E-Mail." });
}

export function onRequest() {
  return jsonResponse({ message: "Methode nicht erlaubt." }, 405);
}
