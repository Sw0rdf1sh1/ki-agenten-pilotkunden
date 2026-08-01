const form = document.querySelector("#lead-form");
const formStatus = document.querySelector("#lead-form-status");
const workflowSteps = Array.from(document.querySelectorAll(".workflow-step"));

if (workflowSteps.length > 0 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let activeStep = 0;

  window.setInterval(() => {
    workflowSteps[activeStep]?.classList.remove("is-active");
    activeStep = (activeStep + 1) % workflowSteps.length;
    workflowSteps[activeStep]?.classList.add("is-active");
  }, 1400);
}

function buildMailtoUrl(data) {
  const subject = `KI packt an Einsatzbereich: ${data.get("company") || "Unternehmen"}`;
  const body = [
    "Hallo Fabian,",
    "",
    "ich möchte prüfen lassen, ob ein KI-Assistent für unseren Ablauf sinnvoll ist.",
    "",
    `Unternehmen: ${data.get("company") || ""}`,
    `Ansprechpartner: ${data.get("name") || ""}`,
    `E-Mail: ${data.get("email") || ""}`,
    `Gewünschter Startzeitraum: ${data.get("timeline") || ""}`,
    `Beteiligte Systeme: ${data.get("systems") || ""}`,
    "",
    "Wiederkehrende Aufgabe:",
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

function resetTurnstile() {
  try {
    window.turnstile?.reset();
  } catch {
    // Keep the fallback mail path usable even if the widget cannot reset.
  }
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
      resetTurnstile();
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}
