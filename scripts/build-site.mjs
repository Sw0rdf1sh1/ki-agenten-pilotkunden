import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const site = {
  origin: "https://ki-packt-an.de",
  name: "KI packt an",
  email: "hello@georgi.digital",
  author: "Fabian Georgi",
  authorTitle: "Senior Software Developer · Software-, Integrations- und Prozessentwicklung",
  datePublished: "2026-08-11",
  dateModified: "2026-08-11",
  description:
    "KI packt an richtet KI-Assistenten für Unternehmen ein, verbindet sie mit bestehenden Systemen und betreut den produktiven Betrieb.",
  socialImage: "/assets/social/ki-packt-an-social.png",
};

const nav = [
  ["Leistungen", "/ki-assistenten-unternehmen/"],
  ["E-Mail", "/email-assistent/"],
  ["OpenClaw", "/openclaw-fuer-unternehmen/"],
  ["Wissen", "/wissen/"],
  ["Fabian Georgi", "/fabian-georgi/"],
  ["Anfrage", "/#anfrage"],
];

const services = [
  {
    slug: "ki-assistenten-unternehmen",
    title: "KI-Assistenten für Unternehmen",
    metaTitle: "KI-Assistenten für Unternehmen | KI packt an",
    description:
      "KI-Assistenten für Unternehmen: Wir richten Agenten ein, verbinden E-Mail, CRM, ERP und Dokumente und betreuen den laufenden Betrieb.",
    intro:
      "Ein KI-Assistent für Unternehmen ist eine Softwarekomponente, die einen klar definierten Arbeitsauftrag erhält, freigegebene Daten und Werkzeuge nutzt und Aufgaben selbstständig vorbereitet oder innerhalb festgelegter Regeln ausführt.",
    serviceType: "KI-Assistenten Einrichtung und Betrieb",
    sections: [
      ["Was übernimmt ein KI-Assistent im Unternehmen?", [
        "Ein KI-Assistent sortiert wiederkehrende digitale Arbeit, sammelt Kontext, prüft bekannte Regeln und bereitet Entscheidungen oder Antworten vor.",
        "Geeignete Aufgaben sind zum Beispiel eingehende Anfragen, Angebotsvorbereitung, Recherche in Dokumenten, Ticket-Triage, CRM-Notizen oder interne Statusabfragen."
      ]],
      ["Welche Systeme kann ein KI-Assistent nutzen?", [
        "Typische Anbindungen sind E-Mail-Postfächer, CRM, ERP, Dokumentenablagen, Wikis, Ticketsysteme und fachliche APIs.",
        "Der Assistent erhält nicht pauschal Zugriff auf alle Unternehmensdaten. Pro Prozess werden Datenquellen, Rollen, Service Accounts und Schreibrechte getrennt festgelegt."
      ]],
      ["Welche Automatisierungsstufen gibt es?", [
        "Die niedrigste Stufe sammelt Informationen und erzeugt Entwürfe. Danach kann ein Assistent Vorgänge nach Freigabe ausführen. Erst bei stabilen Regeln werden einfache Fälle automatisch erledigt.",
        "Unsichere Vorgänge, Preise, sensible Kommunikation und Schreibaktionen bleiben kontrollierbar und können jederzeit an Menschen eskaliert werden."
      ]],
      ["Wann eignet sich ein Prozess?", [
        "Geeignet sind wiederkehrende Abläufe mit klaren Eingängen, bekannten Datenquellen, prüfbaren Ergebnissen und nachvollziehbarer Verantwortung.",
        "Nicht geeignet sind einmalige Sonderfälle, unklare Zuständigkeiten, schlechte Stammdaten oder Vorgänge, bei denen jede Entscheidung stark vom Einzelfall abhängt."
      ]],
      ["Was kostet ein KI-Assistent?", [
        "Die Kosten bestehen aus Prozess-Check, Einrichtung, Integration, Betrieb und nutzungsabhängigen Modell-, API- oder Lizenzkosten.",
        "Der bestehende Prozess-Check von KI packt an bleibt der erste Schritt. Danach wird der Pilotumfang begrenzt angeboten, statt pauschal ein großes KI-Projekt zu starten."
      ]],
    ],
    checklist: [
      "Wiederkehrender Ablauf mit messbarem Zeitaufwand",
      "Klare Entscheidung, wann ein Mensch freigeben muss",
      "Freigegebene Datenquellen statt Vollzugriff",
      "Nachvollziehbares Ergebnis wie Entwurf, Notiz oder Ticket",
      "Testfälle aus echten, aber bereinigten Vorgängen",
      "Verantwortliche Person für fachliche Prüfung",
      "Technische Protokollierung und Fehlerbehandlung",
      "Kostenrahmen für Modell-, API- und Betriebskosten",
    ],
    links: [
      ["/email-assistent/", "E-Mail-Assistenten im Detail"],
      ["/ki-assistent-crm-erp/", "CRM- und ERP-Anbindungen planen"],
      ["/ki-assistent-betrieb-betreuung/", "Betrieb und Betreuung verstehen"],
      ["/wissen/ki-agent-kosten/", "Kosten eines KI-Agenten einordnen"],
    ],
    faq: [
      ["Muss vorhandene Software ersetzt werden?", "Nein. Der typische Ansatz ist eine kontrollierte Anbindung bestehender Systeme über Postfächer, APIs oder Dokumentenquellen."],
      ["Kann ein Assistent selbstständig handeln?", "Ja, aber nur innerhalb festgelegter Regeln. Freigaben, Schreibrechte und Eskalationen werden pro Prozess definiert."],
      ["Wie startet ein Unternehmen sinnvoll?", "Mit einem konkreten Prozess, echten Beispielen und einem begrenzten Pilot statt mit einer allgemeinen KI-Plattformentscheidung."],
    ],
  },
  {
    slug: "email-assistent",
    title: "KI-E-Mail-Assistent für Unternehmen",
    metaTitle: "KI-E-Mail-Assistent einrichten | KI packt an",
    description:
      "Ein KI-E-Mail-Assistent sortiert info@-Anfragen, lädt Kontext aus CRM und Wissen und bereitet Antworten mit klaren Freigaben vor.",
    intro:
      "Ein KI-E-Mail-Assistent bereitet eingehende E-Mails vor, indem er Anliegen erkennt, Kontext lädt, Antworten entwirft und je nach Regel eine Freigabe oder Eskalation anfordert.",
    serviceType: "E-Mail-Assistent Einrichtung",
    process: [
      "E-Mail kommt im freigegebenen Postfach an, zum Beispiel info@.",
      "Das Anliegen wird klassifiziert: Anfrage, Support, Reklamation, Termin, Rechnung oder Rückfrage.",
      "Absender, Kunde oder Vorgang werden anhand erlaubter Daten erkannt.",
      "CRM-Kontext, frühere Vorgänge und zuständige Personen werden geladen.",
      "Freigegebene Dokumente, Preislogiken oder Wissensartikel werden geprüft.",
      "Der Assistent erzeugt einen Antwortentwurf, eine Zusammenfassung und bei Bedarf eine CRM-Notiz.",
      "Eine Freigabe wird angefordert, wenn Preise, Zusagen, sensible Inhalte oder Unsicherheit betroffen sind.",
      "Versand und Dokumentation erfolgen nur nach den festgelegten Regeln."
    ],
    sections: [
      ["Darf ein KI-Assistent selbstständig E-Mails versenden?", [
        "Nicht jede E-Mail sollte automatisch beantwortet werden. Sinnvoll ist ein abgestuftes Modell aus Vorbereitung, Freigabe und begrenzter Autonomie.",
        "Klare Standardfälle können später automatisch laufen. Alles mit Preis, Haftung, personenbezogenen Details oder unsicherem Kontext geht zur Prüfung."
      ]],
      ["Wie wird Sicherheit bei eingehenden E-Mails berücksichtigt?", [
        "E-Mail-Inhalte gelten als fremde, nicht vertrauenswürdige Eingaben. Der Assistent darf daraus keine neuen Systemregeln ableiten und bekommt nur notwendige Werkzeuge.",
        "Prompt-Injection-Tests, Protokolle, Rechtebegrenzung und Freigabepunkte gehören deshalb bereits in den Pilot."
      ]],
      ["Welche Systeme werden typischerweise angebunden?", [
        "Postfach, CRM, Angebotsdaten, Dokumentenablage, Wissensdatenbank und Ticketsystem reichen für viele erste E-Mail-Prozesse aus.",
        "Schreibrechte werden getrennt betrachtet: Eine CRM-Notiz vorzubereiten ist weniger kritisch als einen Auftrag anzulegen oder eine verbindliche Zusage zu versenden."
      ]],
    ],
    links: [
      ["/ki-assistenten-unternehmen/", "Grundlagen zu KI-Assistenten für Unternehmen"],
      ["/ki-assistent-crm-erp/", "CRM-Kontext sicher anbinden"],
      ["/wissen/ki-email-assistent-sicher-einsetzen/", "Sichere Abläufe für KI-E-Mail-Assistenten"],
      ["/wissen/ki-agent-sicherheit-prompt-injection/", "Prompt Injection bei E-Mails verstehen"],
    ],
    faq: [
      ["Ist ein info@-Postfach ein guter Startpunkt?", "Ja, wenn genügend ähnliche Fälle auftreten und klare Freigaben definiert werden können."],
      ["Wer prüft Antwortentwürfe?", "Das legt der Prozess fest. Häufig prüft zuerst die zuständige Fachperson, später nur noch bei unsicheren Fällen."],
      ["Was passiert bei unbekannten Anhängen?", "Der Assistent darf solche Inhalte nur nach vereinbarten Regeln verarbeiten und kann den Vorgang zur manuellen Prüfung eskalieren."],
    ],
  },
  {
    slug: "openclaw-fuer-unternehmen",
    title: "OpenClaw für Unternehmen",
    metaTitle: "OpenClaw einrichten, hosten und betreiben | KI packt an",
    description:
      "OpenClaw für Unternehmen: Einrichtung, Hosting, Betrieb und Integration von Agenten mit Rollen, Monitoring und klaren Sicherheitsgrenzen.",
    intro:
      "OpenClaw ist eine technische Umgebung, mit der KI-Agenten, Werkzeuge, Berechtigungen und wiederkehrende Arbeitsabläufe im Unternehmenskontext organisiert werden können.",
    serviceType: "OpenClaw Einrichtung und Betrieb",
    sections: [
      ["Wofür wird OpenClaw im Unternehmen eingesetzt?", [
        "OpenClaw kann Agenten mit Werkzeugen verbinden, Aufgaben koordinieren und den Zugriff auf Systeme strukturieren.",
        "Im produktiven Umfeld geht es nicht um eine lokale Spielinstallation, sondern um Rollen, Betrieb, Monitoring, Updates und abgesicherte Integrationen."
      ]],
      ["Wie sieht produktiver Betrieb aus?", [
        "Betrieb umfasst Hosting, Secrets, Backups, Protokolle, Updates, Fehlerbehandlung, Kostenkontrolle und klare Zuständigkeiten.",
        "Je nach Sicherheitsbedarf kann OpenClaw auf eigener Infrastruktur oder in einer betreuten Umgebung laufen."
      ]],
      ["Wie werden Rechte begrenzt?", [
        "Werkzeuge und Service Accounts erhalten nur die Rechte, die für den jeweiligen Prozess notwendig sind.",
        "Lesen, Schreiben, Senden und Löschen werden getrennt betrachtet. Kritische Aktionen brauchen Freigaben oder technische Schranken."
      ]],
    ],
    links: [
      ["/ki-assistent-betrieb-betreuung/", "Managed Betrieb für KI-Assistenten"],
      ["/ki-assistent-crm-erp/", "Systemanbindungen planen"],
      ["/wissen/ki-agenten-im-mittelstand/", "KI-Agenten im Mittelstand einordnen"],
    ],
    faq: [
      ["Kann OpenClaw auf eigener Infrastruktur laufen?", "Ja, wenn Betrieb, Updates, Secrets und Monitoring dafür sauber geregelt sind."],
      ["Ist OpenClaw die eigentliche Leistung?", "Nein. Die Leistung ist der nutzbare KI-Assistent für konkrete Unternehmensprozesse; OpenClaw kann dafür eine passende technische Basis sein."],
      ["Was muss vor dem Start geklärt werden?", "Zielprozess, Datenquellen, Werkzeuge, Berechtigungen, Freigaben, Betrieb und Verantwortlichkeiten."],
    ],
  },
  {
    slug: "ki-assistent-crm-erp",
    title: "KI-Assistent mit CRM und ERP verbinden",
    metaTitle: "KI mit CRM und ERP verbinden | KI packt an",
    description:
      "KI-Assistenten mit CRM und ERP verbinden: APIs, Service Accounts, Read-only-Zugriff, Freigaben, Logging und Datenminimierung sauber planen.",
    intro:
      "Eine CRM- oder ERP-Anbindung für KI-Assistenten sollte kontrolliert, protokolliert und möglichst datenminimiert erfolgen, statt dem Assistenten pauschalen Vollzugriff zu geben.",
    serviceType: "KI-Systemintegration",
    sections: [
      ["Was bedeutet Read-only bei KI-Agenten?", [
        "Read-only heißt, dass ein Assistent Informationen suchen und zusammenfassen darf, aber keine Datensätze verändert.",
        "Für viele Pilotprozesse reicht diese Stufe aus: Der Assistent bereitet Notizen, Rückfragen und Entwürfe vor, ein Mensch übernimmt die verbindliche Aktion."
      ]],
      ["Wann sind Schreibrechte sinnvoll?", [
        "Schreibrechte sind sinnvoll, wenn der Prozess stabil ist und die Auswirkungen begrenzt sind, zum Beispiel bei internen Notizen oder Statusvorschlägen.",
        "Kritische Aktionen wie Preise, Vertragsdaten, Bestellungen oder personenbezogene Änderungen benötigen zusätzliche Freigaben und Protokollierung."
      ]],
      ["Wie werden Fehlerfälle behandelt?", [
        "Bei nicht gefundenen Kunden, widersprüchlichen Daten, API-Fehlern oder unsicherem Modelloutput muss der Vorgang eskalieren.",
        "Ein guter Assistent dokumentiert, welche Quellen genutzt wurden und welche Annahmen offen geblieben sind."
      ]],
    ],
    links: [
      ["/email-assistent/", "E-Mail-Prozesse mit CRM-Kontext"],
      ["/ki-assistenten-unternehmen/", "KI-Assistenten im Unternehmenskontext"],
      ["/wissen/ki-agent-sicherheit-prompt-injection/", "Sicherheitsrisiken bei Tool-Nutzung"],
    ],
    faq: [
      ["Braucht der Assistent Zugriff auf alle Unternehmensdaten?", "Nein. Zugriff wird pro Prozess, Rolle und Datenquelle begrenzt."],
      ["Wie werden API-Zugänge verwaltet?", "Über dedizierte technische Konten, Secrets-Handling und nachvollziehbare Rechtevergabe."],
      ["Kann ein Assistent ERP-Daten ändern?", "Technisch ja, fachlich nur mit sehr klaren Regeln, Tests, Protokollen und Freigaben."],
    ],
  },
  {
    slug: "ki-assistent-betrieb-betreuung",
    title: "KI-Assistent Betrieb und Betreuung",
    metaTitle: "KI-Assistent betreiben und betreuen | KI packt an",
    description:
      "Managed Betrieb für KI-Assistenten: Hosting, Monitoring, Updates, Kostenkontrolle, Backups, Secrets, Modellwechsel und Fehlerbehandlung.",
    intro:
      "Ein produktiver KI-Assistent braucht laufenden Betrieb: Monitoring, Updates, Kostenkontrolle, sichere Zugänge, Fehlerbehandlung und Tests bei Änderungen.",
    serviceType: "Managed KI-Assistent",
    sections: [
      ["Warum endet ein KI-Projekt nicht mit der Einrichtung?", [
        "Modelle, APIs, Regeln, Datenquellen und Unternehmensprozesse ändern sich. Deshalb braucht ein Assistent technische Betreuung und fachliche Nachjustierung.",
        "Betrieb bedeutet auch, Fehler sichtbar zu machen und nach einem Ausfall wieder geordnet starten zu können."
      ]],
      ["Was gehört zum laufenden Betrieb?", [
        "Dazu gehören Hosting, Updates, API- und Token-Kosten, Monitoring, Logs, Backups, Secrets, Sicherheitsupdates und kleinere Korrekturen.",
        "Größere Erweiterungen wie neue Konnektoren oder neue Rollen werden separat geplant und getestet."
      ]],
      ["Wie werden Modellwechsel abgesichert?", [
        "Ein Modellwechsel sollte nicht blind passieren. Relevante Testfälle, Prompt-Injection-Beispiele und erwartete Ausgaben werden erneut geprüft.",
        "So bleibt der Assistent nachvollziehbar, auch wenn sich die technische Basis verändert."
      ]],
    ],
    links: [
      ["/openclaw-fuer-unternehmen/", "OpenClaw produktiv betreiben"],
      ["/wissen/ki-agent-kosten/", "Kostenbestandteile verstehen"],
      ["/ki-assistenten-unternehmen/", "Vom Prozess zum Assistenten"],
    ],
    faq: [
      ["Was passiert bei einem Fehler?", "Der Vorgang wird protokolliert, je nach Schwere eskaliert und nach der Analyse korrigiert."],
      ["Sind Modell- und API-Kosten enthalten?", "Sie werden transparent ausgewiesen, sind aber je nach Nutzung und Anbieter variabel."],
      ["Wie wird der Betrieb dokumentiert?", "Über technische Dokumentation, vereinbarte Zuständigkeiten, Protokolle und Änderungsnotizen."],
    ],
  },
];

const articles = [
  {
    slug: "wissen/was-ist-ein-ki-agent",
    title: "Was ist ein KI-Agent? Unterschied zu Chatbot und klassischer Automatisierung",
    metaTitle: "Was ist ein KI-Agent? Chatbot, Workflow und Assistent erklärt",
    description:
      "Was ein KI-Agent ist, wie er sich von Chatbots und Workflow-Automatisierung unterscheidet und warum Kontext, Werkzeuge und Freigaben entscheidend sind.",
    intro:
      "Ein KI-Agent ist ein System, das ein Ziel verfolgt, Kontext nutzt, Werkzeuge aufrufen kann und innerhalb gesetzter Grenzen Schritte vorbereitet oder ausführt.",
    sections: [
      ["Was unterscheidet einen KI-Agenten vom Chatbot?", [
        "Ein Chatbot beantwortet vor allem Nachrichten. Ein KI-Agent kann zusätzlich Werkzeuge nutzen, Informationen aus Systemen holen und Arbeitsschritte anstoßen.",
        "Der Unterschied liegt nicht im Namen, sondern in Kontext, Werkzeugzugriff, Autonomie und Verantwortungsgrenzen."
      ]],
      ["Was ist klassische Workflow-Automatisierung?", [
        "Workflow-Automatisierung folgt festen Regeln: Wenn A passiert, führe B aus. Das ist robust, solange Fälle eindeutig strukturiert sind.",
        "KI-Agenten ergänzen solche Workflows, wenn Texte verstanden, Dokumente ausgewertet oder unstrukturierte Informationen eingeordnet werden müssen."
      ]],
      ["Welche Rolle spielen Freigaben?", [
        "Freigaben verhindern, dass ein Assistent unsichere Entscheidungen still ausführt.",
        "In Unternehmen ist oft die beste erste Stufe: Der Assistent sammelt, prüft und entwirft; Menschen geben frei."
      ]],
    ],
    links: [["/ki-assistenten-unternehmen/", "KI-Assistenten für Unternehmen planen"], ["/wissen/ki-agenten-im-mittelstand/", "Geeignete Prozesse im Mittelstand"]],
  },
  {
    slug: "wissen/ki-agenten-im-mittelstand",
    title: "KI-Agenten im Mittelstand: sinnvolle Prozesse, Grenzen und Einstieg",
    metaTitle: "KI-Agenten im Mittelstand sinnvoll einsetzen | KI packt an",
    description:
      "Welche Prozesse sich für KI-Agenten im Mittelstand eignen, wo Grenzen liegen und wie ein pragmatischer Einstieg aussieht.",
    intro:
      "KI-Agenten eignen sich im Mittelstand besonders für wiederkehrende digitale Vorgänge mit klaren Datenquellen, bekannten Regeln und prüfbaren Ergebnissen.",
    sections: [
      ["Welche Prozesse eignen sich für KI-Agenten?", [
        "Geeignet sind Supportanfragen, Angebotsvorbereitung, Dokumentenprüfung, interne Recherche, CRM-Ergänzungen und wiederkehrende Statusabfragen.",
        "Wichtig ist, dass der Prozess häufig genug vorkommt und ein vorbereitetes Ergebnis wirklich Zeit spart."
      ]],
      ["Welche Prozesse eignen sich nicht?", [
        "Schlechte Kandidaten sind Sonderfälle, unklare Verantwortlichkeiten, chaotische Stammdaten oder Entscheidungen mit hoher rechtlicher Wirkung.",
        "Auch Prozesse ohne fachliche Ansprechperson sind ungeeignet, weil niemand Qualität und Grenzen prüfen kann."
      ]],
      ["Wie gelingt der Einstieg?", [
        "Der Einstieg gelingt über einen begrenzten Prozess, echte Beispiele, klare Freigaben und eine Entscheidung nach dem Pilot.",
        "So entsteht Nutzen ohne den Versuch, direkt das ganze Unternehmen zu automatisieren."
      ]],
    ],
    links: [["/ki-assistenten-unternehmen/", "Leistungsseite für KI-Assistenten"], ["/wissen/ki-agent-kosten/", "Kosten realistisch einordnen"]],
  },
  {
    slug: "wissen/ki-email-assistent-sicher-einsetzen",
    title: "KI-E-Mail-Assistent im Unternehmen: Freigaben, Sicherheit und typische Abläufe",
    metaTitle: "KI-E-Mail-Assistent sicher einsetzen | KI packt an",
    description:
      "Wie Unternehmen KI-E-Mail-Assistenten mit Freigaben, Rollen, Kontextprüfung und Sicherheitsgrenzen einsetzen.",
    intro:
      "Ein KI-E-Mail-Assistent ist sicherer, wenn er zunächst Entwürfe vorbereitet, Quellen offenlegt und nur geregelte Vorgänge mit definierten Rechten ausführt.",
    sections: [
      ["Warum braucht E-Mail besondere Vorsicht?", [
        "E-Mails kommen von außen und können falsche Angaben, manipulierte Anweisungen oder schädliche Anhänge enthalten.",
        "Der Assistent darf E-Mail-Text deshalb als Arbeitsdaten nutzen, aber nicht als neue Systemanweisung übernehmen."
      ]],
      ["Welche Freigaben sind sinnvoll?", [
        "Freigaben sind sinnvoll vor Versand, Preiszusagen, Vertragsänderungen, personenbezogenen Aussagen und allen unsicheren Fällen.",
        "Der Assistent sollte erklären, welche Quellen genutzt wurden und welche Annahmen offen sind."
      ]],
      ["Wie sieht ein typischer Ablauf aus?", [
        "Eingang klassifizieren, Absender erkennen, CRM-Kontext laden, Wissen prüfen, Entwurf erzeugen, Freigabe anfordern, Versand dokumentieren.",
        "Diese Stufen lassen sich einzeln testen und später kontrolliert erweitern."
      ]],
    ],
    links: [["/email-assistent/", "E-Mail-Assistent als Leistung"], ["/wissen/ki-agent-sicherheit-prompt-injection/", "Prompt Injection verstehen"]],
  },
  {
    slug: "wissen/ki-agent-kosten",
    title: "Was kostet ein KI-Agent für Unternehmen?",
    metaTitle: "Was kostet ein KI-Agent für Unternehmen? | KI packt an",
    description:
      "Kosten eines KI-Agenten: Prozess-Check, Einrichtung, Integration, Hosting, Modellnutzung, Monitoring, Pflege und Ausbau transparent erklärt.",
    intro:
      "Die Kosten eines KI-Agenten entstehen nicht nur durch das Modell, sondern durch Prozessklärung, Integration, Betrieb, Tests und laufende Betreuung.",
    sections: [
      ["Welche Kostenbestandteile gibt es?", [
        "Typische Bestandteile sind Prozess-Check, Einrichtung, Systemanbindung, Hosting, Modell- und API-Nutzung, Monitoring, Pflege und Erweiterungen.",
        "Bei KI packt an startet die Klärung mit dem Prozess-Check; der Pilotumfang wird anschließend konkret begrenzt."
      ]],
      ["Warum reichen Fantasiepreise nicht?", [
        "Pauschale Preise ohne Prozess, Datenquellen und Rechte sind selten belastbar.",
        "Ein E-Mail-Assistent mit einem Postfach ist anders zu kalkulieren als ein Agent mit CRM-, ERP- und Schreibrechten."
      ]],
      ["Welche laufenden Kosten sind realistisch?", [
        "Laufende Kosten entstehen durch Betrieb, Monitoring, API-Nutzung, Modellwechsel, Sicherheitsupdates und kleinere Korrekturen.",
        "Sie sollten transparent ausgewiesen werden, damit Automatisierung nicht zur versteckten Betriebslast wird."
      ]],
    ],
    links: [["/ki-assistent-betrieb-betreuung/", "Betriebskosten verstehen"], ["/ki-assistenten-unternehmen/", "Prozess-Check starten"]],
  },
  {
    slug: "wissen/ki-agent-sicherheit-prompt-injection",
    title: "KI-Agenten und Prompt Injection: Warum E-Mails und Dokumente nicht vertrauenswürdig sind",
    metaTitle: "KI-Agenten und Prompt Injection | KI packt an",
    description:
      "Prompt Injection bei KI-Agenten: untrusted input, Tool Permissions, Least Privilege, Human-in-the-loop, Logging und Schutz vor Datenabfluss.",
    intro:
      "Prompt Injection entsteht, wenn fremde Inhalte versuchen, das Verhalten eines KI-Systems zu verändern oder Werkzeuge außerhalb der vorgesehenen Regeln zu nutzen.",
    sections: [
      ["Warum sind E-Mails und Dokumente untrusted input?", [
        "Externe Inhalte können Anweisungen enthalten, die für Menschen wie Text wirken, für ein Modell aber wie Steuerungsversuche aussehen.",
        "Deshalb müssen Systemanweisungen, erlaubte Werkzeuge und Arbeitsdaten technisch und konzeptionell getrennt werden."
      ]],
      ["Welche Schutzmaßnahmen sind wichtig?", [
        "Least Privilege, getrennte Service Accounts, Tool-Freigaben, Human-in-the-loop, Logging und Tests mit realistischen Angriffsmustern reduzieren das Risiko.",
        "Kein einzelner Prompt ist eine ausreichende Sicherheitsmaßnahme, wenn der Agent echte Werkzeuge nutzen darf."
      ]],
      ["Was sagt OWASP zu Prompt Injection?", [
        "OWASP führt Prompt Injection als zentrales Risiko für LLM-Anwendungen und beschreibt unter anderem manipulierte Eingaben, Tool-Missbrauch und Datenabfluss als praktische Gefahren.",
        "Für Unternehmensassistenten heißt das: Sicherheit muss in Prozess, Rechte und Betrieb eingebaut werden."
      ]],
    ],
    sources: [["OWASP GenAI Security Project: LLM01 Prompt Injection", "https://genai.owasp.org/llmrisk/llm01-prompt-injection/"]],
    links: [["/email-assistent/", "E-Mail-Assistent sicher planen"], ["/ki-assistent-crm-erp/", "Tool-Rechte bei CRM und ERP begrenzen"]],
  },
];

const authorPage = {
  slug: "fabian-georgi",
  title: "Fabian Georgi",
  metaTitle: "Fabian Georgi | KI packt an",
  description:
    "Fabian Georgi ist technischer Ansprechpartner für KI packt an: Softwareentwicklung, Schnittstellen, Serverbetrieb, Prozessautomatisierung und KI-Agenten.",
  intro:
    "Fabian Georgi verbindet Softwareentwicklung, Schnittstellen, Serverbetrieb und Prozessautomatisierung mit dem praktischen Aufbau von KI-Assistenten für Unternehmen.",
  sections: [
    ["Fachlicher Hintergrund", [
      "Fabian arbeitet seit über 18 Jahren in Softwareentwicklung, Integrationen und technischen Betriebsumgebungen.",
      "Der Schwerpunkt liegt auf pragmatischen Lösungen: bestehende Systeme verstehen, Schnittstellen nutzen, Rechte begrenzen und Abläufe betreibbar machen."
    ]],
    ["Verbindung zu KI packt an", [
      "KI packt an ist das Angebot für Unternehmen, die einen klar begrenzten KI-Assistenten einrichten und produktiv betreiben möchten.",
      "Fabian ist der technische Ansprechpartner von der Prozessklärung über die Umsetzung bis zur Betreuung."
    ]],
  ],
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function absolute(path) {
  return `${site.origin}${path.startsWith("/") ? path : `/${path}`}`;
}

function pagePath(slug) {
  return slug === "" ? "/" : `/${slug}/`;
}

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

function header(activePath) {
  const links = nav
    .map(([label, href]) => `<a${href === activePath ? ' aria-current="page"' : ""} href="${href}">${label}</a>`)
    .join("\n        ");
  return `<header class="site-header">
      <a class="brand" href="/" aria-label="KI packt an Startseite">
        <span class="brand-mark" aria-hidden="true">KI</span>
        <span>KI packt an</span>
      </a>
      <nav class="nav" aria-label="Hauptnavigation">
        ${links}
      </nav>
    </header>`;
}

function footer() {
  return `<footer class="site-footer">
      <span>KI packt an · Fabian Georgi</span>
      <nav aria-label="Footer-Navigation">
        <a href="/ki-assistenten-unternehmen/">Leistungen</a>
        <a href="/wissen/">Wissen</a>
        <a href="/fabian-georgi/">Fabian Georgi</a>
        <a href="https://georgi.digital/impressum/">Impressum</a>
        <a href="https://georgi.digital/datenschutz/">Datenschutz</a>
        <a href="mailto:${site.email}">${site.email}</a>
      </nav>
    </footer>`;
}

function breadcrumbs(items) {
  return `<nav class="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        ${items.map(([label, href]) => `<li>${href ? `<a href="${href}">${label}</a>` : `<span aria-current="page">${label}</span>`}</li>`).join("")}
      </ol>
    </nav>`;
}

function jsonLd(page, type, path, extra = {}) {
  const url = absolute(path);
  const graph = [
    {
      "@type": "WebSite",
      "@id": `${site.origin}/#website`,
      name: site.name,
      url: site.origin,
      inLanguage: "de-DE",
      publisher: { "@id": `${site.origin}/#organization` },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${site.origin}/#organization`,
      name: site.name,
      url: site.origin,
      logo: {
        "@type": "ImageObject",
        url: absolute("/assets/social/ki-packt-an-logo-512.png"),
        width: 512,
        height: 512,
      },
      image: absolute(site.socialImage),
      description: site.description,
      areaServed: "DE",
      founder: { "@id": `${site.origin}/fabian-georgi/#person` },
      email: site.email,
    },
    {
      "@type": "Person",
      "@id": `${site.origin}/fabian-georgi/#person`,
      name: site.author,
      url: `${site.origin}/fabian-georgi/`,
      image: absolute("/assets/people/fabian-georgi.webp"),
      jobTitle: site.authorTitle,
      worksFor: { "@id": `${site.origin}/#organization` },
      sameAs: ["https://georgi.digital/"],
    },
    {
      "@type": type,
      "@id": `${url}#webpage`,
      url,
      name: page.title,
      headline: page.title,
      description: page.description,
      isPartOf: { "@id": `${site.origin}/#website` },
      inLanguage: "de-DE",
      image: absolute(site.socialImage),
      primaryImageOfPage: { "@type": "ImageObject", url: absolute(site.socialImage), width: 1200, height: 630 },
      ...extra,
    },
  ];
  return `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>`;
}

function head(page, path, type = "website", json = "") {
  const url = absolute(path);
  return `<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(page.metaTitle || page.title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}">
    <meta name="robots" content="index, follow">
    <meta name="theme-color" content="#18202f">
    <link rel="canonical" href="${url}">
    <link rel="icon" href="/assets/icons/ki-packt-an-logo.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/assets/social/ki-packt-an-logo-512.png">
    <link rel="stylesheet" href="/assets/styles.css">
    <meta property="og:site_name" content="${site.name}">
    <meta property="og:type" content="${type}">
    <meta property="og:title" content="${escapeHtml(page.metaTitle || page.title)}">
    <meta property="og:description" content="${escapeHtml(page.description)}">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="${absolute(site.socialImage)}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(page.metaTitle || page.title)}">
    <meta name="twitter:description" content="${escapeHtml(page.description)}">
    <meta name="twitter:image" content="${absolute(site.socialImage)}">
    ${json}
  </head>`;
}

function renderSections(page) {
  return page.sections
    .map(([title, paragraphs]) => `<section class="content-section">
        <h2>${title}</h2>
        ${paragraphs.map((p) => `<p>${p}</p>`).join("\n        ")}
      </section>`)
    .join("\n");
}

function renderFaq(page) {
  if (!page.faq) return "";
  return `<section class="content-section faq-section">
        <h2>Häufige Fragen</h2>
        ${page.faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("\n        ")}
      </section>`;
}

function renderLinks(page) {
  if (!page.links) return "";
  return `<section class="content-section">
        <h2>Passende nächste Seiten</h2>
        <ul class="link-list">
          ${page.links.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join("\n          ")}
        </ul>
      </section>`;
}

function renderService(page) {
  const path = pagePath(page.slug);
  const breadcrumbItems = [["Startseite", "/"], [page.title, ""]];
  const serviceJson = {
    mainEntity: {
      "@type": "Service",
      "@id": `${absolute(path)}#service`,
      name: page.serviceType,
      serviceType: page.serviceType,
      provider: { "@id": `${site.origin}/#organization` },
      areaServed: "DE",
      url: absolute(path),
      description: page.description,
    },
    breadcrumb: breadcrumbGraph(breadcrumbItems),
  };
  const faqJson = page.faq ? { mainEntity: page.faq.map(([name, answer]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text: answer } })) } : {};
  return `<!DOCTYPE html>
<html lang="de">
  ${head(page, path, "website", jsonLd(page, "WebPage", path, serviceJson) + (page.faq ? `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", "@id": `${absolute(path)}#faq`, ...faqJson })}</script>` : ""))}
  <body>
    <a class="skip-link" href="#main">Direkt zum Inhalt</a>
    ${header(path)}
    <main id="main" class="page-shell">
      ${breadcrumbs(breadcrumbItems)}
      <article class="content-page">
        <p class="eyebrow">Leistung</p>
        <h1>${page.title}</h1>
        <p class="answer-block">${page.intro}</p>
        ${page.process ? `<section class="content-section"><h2>Wie läuft ein E-Mail-Vorgang ab?</h2><ol class="step-list">${page.process.map((item) => `<li>${item}</li>`).join("")}</ol></section>` : ""}
        ${renderSections(page)}
        ${page.checklist ? `<section class="content-section checklist-section"><h2>Checkliste: Ist mein Prozess für einen KI-Assistenten geeignet?</h2><ul>${page.checklist.map((item) => `<li>${item}</li>`).join("")}</ul></section>` : ""}
        ${renderFaq(page)}
        ${renderLinks(page)}
        <section class="content-cta">
          <h2>Konkreten Prozess prüfen lassen</h2>
          <p>Beschreiben Sie den Ablauf, die beteiligten Systeme und die gewünschten Grenzen. Fabian prüft, ob ein KI-Assistent sinnvoll passt.</p>
          <a class="button primary" href="/#anfrage">Einsatz unverbindlich prüfen</a>
        </section>
      </article>
    </main>
    ${footer()}
  </body>
</html>
`;
}

function breadcrumbGraph(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, href], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: href ? absolute(href) : undefined,
    })),
  };
}

function renderArticle(page) {
  const path = pagePath(page.slug);
  const breadcrumbItems = [["Startseite", "/"], ["Wissen", "/wissen/"], [page.title, ""]];
  return `<!DOCTYPE html>
<html lang="de">
  ${head(page, path, "article", jsonLd(page, "Article", path, {
    author: { "@id": `${site.origin}/fabian-georgi/#person` },
    publisher: { "@id": `${site.origin}/#organization` },
    datePublished: site.datePublished,
    dateModified: site.dateModified,
    mainEntityOfPage: { "@id": `${absolute(path)}#webpage` },
    breadcrumb: breadcrumbGraph(breadcrumbItems),
  }))}
  <body>
    <a class="skip-link" href="#main">Direkt zum Inhalt</a>
    ${header("/wissen/")}
    <main id="main" class="page-shell">
      ${breadcrumbs(breadcrumbItems)}
      <article class="content-page article-page">
        <p class="eyebrow">Wissen</p>
        <h1>${page.title}</h1>
        <p class="answer-block">${page.intro}</p>
        <div class="byline">
          <img src="/assets/people/fabian-georgi-450.webp" alt="Fabian Georgi" width="450" height="450" loading="lazy" decoding="async">
          <p><strong>Autor: ${site.author}</strong><span>${site.authorTitle}</span><span>Veröffentlicht: ${formatDate(site.datePublished)} · Fachlich geprüft: ${formatDate(site.dateModified)}</span></p>
        </div>
        ${renderSections(page)}
        ${page.sources ? `<section class="content-section"><h2>Quellen</h2><ul class="link-list">${page.sources.map(([label, href]) => `<li><a href="${href}">${label}</a></li>`).join("")}</ul></section>` : ""}
        ${renderLinks(page)}
        <section class="content-cta">
          <h2>Vom Wissen zum ersten Prozess</h2>
          <p>KI packt an prüft konkrete Unternehmensprozesse und setzt nur begrenzte, nachvollziehbare Assistenten produktiv um.</p>
          <a class="button primary" href="/#anfrage">Prozess prüfen lassen</a>
        </section>
      </article>
    </main>
    ${footer()}
  </body>
</html>
`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("de-DE", { dateStyle: "long" }).format(new Date(`${value}T00:00:00Z`));
}

function renderKnowledgeIndex() {
  const page = {
    title: "Wissen zu KI-Agenten und KI-Assistenten",
    metaTitle: "Wissen zu KI-Agenten und KI-Assistenten | KI packt an",
    description:
      "Fachliche Grundlagen zu KI-Agenten, KI-Assistenten im Mittelstand, E-Mail-Automatisierung, Kosten und Prompt Injection.",
  };
  const path = "/wissen/";
  const breadcrumbItems = [["Startseite", "/"], ["Wissen", ""]];
  return `<!DOCTYPE html>
<html lang="de">
  ${head(page, path, "website", jsonLd(page, "CollectionPage", path, { breadcrumb: breadcrumbGraph(breadcrumbItems) }))}
  <body>
    <a class="skip-link" href="#main">Direkt zum Inhalt</a>
    ${header(path)}
    <main id="main" class="page-shell">
      ${breadcrumbs(breadcrumbItems)}
      <section class="content-page">
        <p class="eyebrow">Wissen</p>
        <h1>${page.title}</h1>
        <p class="answer-block">Der Wissensbereich erklärt konkrete Begriffe, Sicherheitsgrenzen und Kostenfragen rund um KI-Agenten im Unternehmenskontext.</p>
        <div class="teaser-grid">
          ${articles.map((article) => `<article>
            <h2><a href="/${article.slug}/">${article.title}</a></h2>
            <p>${article.description}</p>
          </article>`).join("\n          ")}
        </div>
      </section>
    </main>
    ${footer()}
  </body>
</html>
`;
}

function renderAuthor() {
  const path = pagePath(authorPage.slug);
  const breadcrumbItems = [["Startseite", "/"], [authorPage.title, ""]];
  return `<!DOCTYPE html>
<html lang="de">
  ${head(authorPage, path, "profile", jsonLd(authorPage, "ProfilePage", path, {
    mainEntity: { "@id": `${site.origin}/fabian-georgi/#person` },
    breadcrumb: breadcrumbGraph(breadcrumbItems),
  }))}
  <body>
    <a class="skip-link" href="#main">Direkt zum Inhalt</a>
    ${header(path)}
    <main id="main" class="page-shell">
      ${breadcrumbs(breadcrumbItems)}
      <article class="content-page profile-page">
        <p class="eyebrow">Person</p>
        <h1>${authorPage.title}</h1>
        <p class="answer-block">${authorPage.intro}</p>
        <figure class="profile-portrait">
          <img src="/assets/people/fabian-georgi.webp" srcset="/assets/people/fabian-georgi-450.webp 450w, /assets/people/fabian-georgi.webp 900w" sizes="(max-width: 720px) 180px, 260px" alt="Fabian Georgi" width="900" height="900" loading="eager" decoding="async">
          <figcaption><strong>Fabian Georgi</strong><span>${site.authorTitle}</span></figcaption>
        </figure>
        ${renderSections(authorPage)}
        <section class="content-section">
          <h2>Öffentliche Profile</h2>
          <ul class="link-list">
            <li><a href="https://georgi.digital/">georgi.digital</a></li>
          </ul>
        </section>
        <section class="content-cta">
          <h2>KI-Assistenten für Unternehmen</h2>
          <p>KI packt an ist das fachliche Angebot für Einrichtung, Integration und Betrieb klar begrenzter KI-Assistenten.</p>
          <a class="button primary" href="/ki-assistenten-unternehmen/">Leistungen ansehen</a>
        </section>
      </article>
    </main>
    ${footer()}
  </body>
</html>
`;
}

function render404() {
  const page = {
    title: "Seite nicht gefunden",
    metaTitle: "Seite nicht gefunden | KI packt an",
    description: "Diese Seite wurde nicht gefunden. Zurück zur Startseite oder zu den Leistungen von KI packt an.",
  };
  return `<!DOCTYPE html>
<html lang="de">
  ${head(page, "/404.html", "website")}
  <body>
    ${header("")}
    <main class="page-shell">
      <section class="content-page error-page">
        <p class="eyebrow">404</p>
        <h1>Seite nicht gefunden</h1>
        <p class="answer-block">Die angeforderte Adresse gibt es hier nicht. Die wichtigsten Inhalte liegen auf den Leistungsseiten und im Wissensbereich.</p>
        <p><a class="button primary" href="/">Zur Startseite</a></p>
      </section>
    </main>
    ${footer()}
  </body>
</html>
`;
}

function renderSitemap(paths) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url>
    <loc>${absolute(path)}</loc>
    <lastmod>${site.dateModified}</lastmod>
    <changefreq>${path.startsWith("/wissen/") ? "monthly" : "weekly"}</changefreq>
    <priority>${path === "/" ? "1.0" : path === "/wissen/" ? "0.7" : "0.8"}</priority>
  </url>`).join("\n")}
</urlset>
`;
}

function renderLlms() {
  return `# KI packt an

> ${site.description}

KI packt an ist ein Angebot für Unternehmen, die wiederkehrende digitale Arbeit durch klar begrenzte KI-Assistenten vorbereiten oder automatisieren möchten. Typische Systeme sind E-Mail, CRM, ERP, Dokumentenablagen, Wissenssysteme und APIs. Verantwortlicher technischer Ansprechpartner ist Fabian Georgi.

## Leistungen

${services.map((page) => `- [${page.title}](${absolute(pagePath(page.slug))}): ${page.description}`).join("\n")}

## Wissen

${articles.map((page) => `- [${page.title}](${absolute(pagePath(page.slug))})`).join("\n")}

## Anbieter

- [Fabian Georgi](${absolute("/fabian-georgi/")}): Technischer Ansprechpartner für Softwareentwicklung, Integration und Betrieb.
- [Anfrage](${absolute("/#anfrage")}): Einen konkreten Unternehmensprozess prüfen lassen.

## Hinweise

- KI packt an verkauft keine Standard-Chatbot-Lösung.
- Automatisierungsgrad und Schreibrechte werden pro Prozess festgelegt.
- Externe Modell-, API-, Hosting- und Lizenzkosten werden transparent ausgewiesen.
- Für ChatGPT Search ist OAI-SearchBot relevant; GPTBot betrifft Modelltraining und ist dafür nicht erforderlich.
`;
}

function renderLlmsFull() {
  const blocks = [
    `# KI packt an\n\n${site.description}`,
    ...services.map((page) => `# ${page.title}\n\n${page.intro}\n\n${page.sections.map(([title, paragraphs]) => `## ${title}\n\n${paragraphs.join("\n\n")}`).join("\n\n")}`),
    `# Wissen\n\n${articles.map((page) => `## ${page.title}\n\n${page.intro}`).join("\n\n")}`,
    ...articles.map((page) => `# ${page.title}\n\nAutor: ${site.author}\n\nVeröffentlicht: ${site.datePublished}\nFachlich geprüft: ${site.dateModified}\n\n${page.intro}\n\n${page.sections.map(([title, paragraphs]) => `## ${title}\n\n${paragraphs.join("\n\n")}`).join("\n\n")}`),
    `# Fabian Georgi\n\n${authorPage.intro}\n\n${authorPage.sections.map(([title, paragraphs]) => `## ${title}\n\n${paragraphs.join("\n\n")}`).join("\n\n")}`,
  ];
  return `${blocks.join("\n\n")}\n`;
}

function updateHomepageHead() {
  let html = readFileSync("index.html", "utf8");
  html = html.replace(/<title>[^<]*<\/title>/, "<title>KI-Assistenten für Unternehmen | KI packt an</title>");
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*>/s,
    '<meta name="description" content="KI-Assistenten für Unternehmen: Wir richten Agenten ein, verbinden E-Mail, CRM, ERP und Dokumente und betreuen den laufenden Betrieb.">',
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*">/,
    '<meta property="og:title" content="KI-Assistenten für Unternehmen | KI packt an">',
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*>/s,
    '<meta property="og:description" content="KI packt an richtet KI-Assistenten für Unternehmen ein, verbindet bestehende Systeme und betreut den produktiven Betrieb.">',
  );
  html = html.replace(
    /<meta property="og:url" content="https:\/\/ki-packt-an\.de\/">[\s\S]*?<meta name="twitter:image" content="https:\/\/ki-packt-an\.de\/assets\/social\/ki-packt-an-social\.png">|<meta property="og:url" content="https:\/\/ki-packt-an\.de\/">/,
    `<meta property="og:url" content="https://ki-packt-an.de/">
    <meta property="og:site_name" content="KI packt an">
    <meta property="og:image" content="${absolute(site.socialImage)}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="KI-Assistenten für Unternehmen | KI packt an">
    <meta name="twitter:description" content="KI-Assistenten für Unternehmen: Einrichtung, Integration und Betrieb mit klaren Freigaben.">
    <meta name="twitter:image" content="${absolute(site.socialImage)}">`,
  );
  html = html.replace(
    /<link rel="icon" href="data:image\/svg\+xml,[^"]+">/,
    '<link rel="icon" href="/assets/icons/ki-packt-an-logo.svg" type="image/svg+xml">\n    <link rel="apple-touch-icon" href="/assets/social/ki-packt-an-logo-512.png">',
  );
  html = html.replace(/<link rel="stylesheet" href="assets\/styles.css">/, '<link rel="stylesheet" href="/assets/styles.css">');
  html = html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    jsonLd(
      {
        title: "KI-Assistenten für Unternehmen | KI packt an",
        description: "KI packt an richtet KI-Assistenten für Unternehmen ein, verbindet bestehende Systeme und betreut den produktiven Betrieb.",
      },
      "WebPage",
      "/",
      {
        mainEntity: {
          "@type": "Service",
          "@id": `${site.origin}/#service`,
          name: "KI-Assistenten Einrichtung und Betrieb",
          provider: { "@id": `${site.origin}/#organization` },
          areaServed: "DE",
          url: site.origin,
          description: site.description,
        },
      },
    ),
  );
  const singleMetaKeys = [
    'property="og:site_name"',
    'property="og:image"',
    'property="og:image:width"',
    'property="og:image:height"',
    'name="twitter:card"',
    'name="twitter:title"',
    'name="twitter:description"',
    'name="twitter:image"',
  ];
  for (const key of singleMetaKeys) {
    let seen = false;
    html = html
      .split("\n")
      .filter((line) => {
        if (!line.includes(key)) return true;
        if (seen) return false;
        seen = true;
        return true;
      })
      .join("\n");
  }
  html = html.replace(
    /<a class="brand" href="#top" aria-label="KI packt an Startseite">/,
    '<a class="brand" href="/" aria-label="KI packt an Startseite">',
  );
  html = html.replace(
    /<nav class="nav" aria-label="Hauptnavigation">[\s\S]*?<\/nav>/,
    `<nav class="nav" aria-label="Hauptnavigation">
        <a href="/ki-assistenten-unternehmen/">Leistungen</a>
        <a href="/email-assistent/">E-Mail</a>
        <a href="/openclaw-fuer-unternehmen/">OpenClaw</a>
        <a href="/wissen/">Wissen</a>
        <a href="/fabian-georgi/">Fabian Georgi</a>
        <a class="nav-cta" href="/#anfrage">Einsatz prüfen</a>
      </nav>`,
  );
  html = html.replace(
    /<p class="hero-lead">[\s\S]*?<\/p>/,
    `<p class="hero-lead">
            Ein KI-Assistent für Unternehmen erhält einen klaren Arbeitsauftrag, nutzt freigegebene Daten und Werkzeuge und bereitet wiederkehrende Vorgänge prüfbar vor.
          </p>`,
  );
  html = html.replace(/href="assets\//g, 'href="/assets/');
  html = html.replace(/src="assets\//g, 'src="/assets/');
  html = html.replace(/srcset="assets\//g, 'srcset="/assets/');
  html = html.replace(/, assets\//g, ", /assets/");
  write("index.html", html);
}

updateHomepageHead();

for (const page of services) {
  write(join(page.slug, "index.html"), renderService(page));
}

for (const page of articles) {
  write(join(page.slug, "index.html"), renderArticle(page));
}

write(join("wissen", "index.html"), renderKnowledgeIndex());
write(join("fabian-georgi", "index.html"), renderAuthor());
write("404.html", render404());

const publicPaths = [
  "/",
  ...services.map((page) => pagePath(page.slug)),
  "/wissen/",
  ...articles.map((page) => pagePath(page.slug)),
  "/fabian-georgi/",
];

write("sitemap.xml", renderSitemap(publicPaths));
write("llms.txt", renderLlms());
write("llms-full.txt", renderLlmsFull());

write(
  "robots.txt",
  `User-agent: *
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: GPTBot
Disallow: /

Sitemap: ${site.origin}/sitemap.xml
`,
);

write(
  "_redirects",
  `https://www.ki-packt-an.de/* https://ki-packt-an.de/:splat 301
`,
);

write(
  "_headers",
  `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

https://*.pages.dev/*
  X-Robots-Tag: noindex, nofollow
`,
);

write(
  "assets/icons/ki-packt-an-logo.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-labelledby="title">
  <title id="title">KI packt an Logo</title>
  <rect width="512" height="512" rx="72" fill="#18202f"/>
  <path d="M86 352V160h47v75l69-75h58l-78 83 84 109h-58l-58-77-17 18v59H86Zm207 0V160h49v192h-49Z" fill="#ffffff"/>
  <path d="M362 352V160h64v192h-64Z" fill="#d8f36a"/>
</svg>
`,
);

write(
  "assets/social/ki-packt-an-social.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f6f2ea"/>
  <rect x="62" y="66" width="220" height="220" rx="34" fill="#18202f"/>
  <text x="172" y="210" text-anchor="middle" font-family="Arial, sans-serif" font-size="84" font-weight="800" fill="#ffffff">KI</text>
  <text x="328" y="154" font-family="Arial, sans-serif" font-size="44" font-weight="800" fill="#18202f">KI packt an</text>
  <text x="328" y="240" font-family="Arial, sans-serif" font-size="68" font-weight="800" fill="#18202f">KI-Assistenten</text>
  <text x="328" y="318" font-family="Arial, sans-serif" font-size="68" font-weight="800" fill="#18202f">für Unternehmen</text>
  <text x="328" y="392" font-family="Arial, sans-serif" font-size="32" fill="#27324a">Einrichtung, Integration und Betrieb</text>
  <g font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#18202f">
    <rect x="328" y="456" width="138" height="54" rx="12" fill="#d8f36a"/>
    <text x="397" y="492" text-anchor="middle">E-Mail</text>
    <rect x="490" y="456" width="120" height="54" rx="12" fill="#ffffff"/>
    <text x="550" y="492" text-anchor="middle">CRM</text>
    <rect x="634" y="456" width="122" height="54" rx="12" fill="#ffffff"/>
    <text x="695" y="492" text-anchor="middle">ERP</text>
    <rect x="780" y="456" width="178" height="54" rx="12" fill="#ffffff"/>
    <text x="869" y="492" text-anchor="middle">Dokumente</text>
  </g>
</svg>
`,
);

console.log(`Generated ${publicPaths.length} indexable pages plus robots, sitemap and LLM files.`);
