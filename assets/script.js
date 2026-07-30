const form = document.querySelector("#lead-form");
const formStatus = document.querySelector("#lead-form-status");

function buildMailtoUrl(data) {
  const subject = `KI packt an Pilotgespräch: ${data.get("company") || "Unternehmen"}`;
  const body = [
    "Hallo Fabian,",
    "",
    "ich interessiere mich für einen KI packt an Pilot.",
    "",
    `Unternehmen: ${data.get("company") || ""}`,
    `Name: ${data.get("name") || ""}`,
    `E-Mail: ${data.get("email") || ""}`,
    `Passender Startpunkt: ${data.get("pilot") || ""}`,
    "",
    "Welche Arbeit die KI vorbereiten soll:",
    data.get("message") || "",
    "",
    "Viele Grüße",
  ].join("\n");

  return `mailto:hello@georgi.digital?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function setFormStatus(message, type = "info") {
  if (!formStatus) {
    return;
  }

  formStatus.textContent = message;
  formStatus.dataset.type = type;
}

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');

    setFormStatus("Anfrage wird versendet ...");

    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Die Anfrage konnte nicht versendet werden.");
      }

      form.reset();
      setFormStatus(result.message || "Danke, die Anfrage wurde versendet.", "success");
    } catch (error) {
      setFormStatus(
        `${error.message || "Der Versand ist gerade nicht erreichbar."} Alternativ öffnet sich Ihr E-Mail-Programm.`,
        "error",
      );
      window.location.href = buildMailtoUrl(data);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}
