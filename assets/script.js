const form = document.querySelector("#lead-form");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const subject = `KI-Agenten Pilotanfrage: ${data.get("company") || "Unternehmen"}`;
    const body = [
      "Hallo Fabian,",
      "",
      "ich interessiere mich für einen KI-Agenten-Pilot.",
      "",
      `Unternehmen: ${data.get("company") || ""}`,
      `Name: ${data.get("name") || ""}`,
      `E-Mail: ${data.get("email") || ""}`,
      `Interessanter Pilot: ${data.get("pilot") || ""}`,
      "",
      "Was der Agent vorbereiten soll:",
      data.get("message") || "",
      "",
      "Viele Grüße",
    ].join("\n");

    const href = `mailto:hello@georgi.digital?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  });
}
