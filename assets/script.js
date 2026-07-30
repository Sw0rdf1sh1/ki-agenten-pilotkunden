const form = document.querySelector("#lead-form");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
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

    const href = `mailto:hello@georgi.digital?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  });
}
