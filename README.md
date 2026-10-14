# Open Shareboard Mini

Ein Open-Source-Shareboard für private Dateien, Freigaben, Präsentationen und PDF-Anmerkungen. Eigener Anwendungscode: MIT-Lizenz.

**Live:** https://open-share-board.lord-time.chatgpt.site

**Repository:** https://github.com/xLordTime/Open-Shareboard-mini

## Start und Entwicklung

Node.js >=22.13.0 und pnpm.

```bash
pnpm install
# postinstall erzeugt lokale PDF.js-Assets
pnpm typecheck
pnpm test
pnpm build
pnpm dev
```

Für lokales D1 die Drizzle-Migrationen vor dem Start auf die lokale Datenbank anwenden. Sites wendet die Migrationen beim Veröffentlichen auf die gehostete Datenbank an. `.openai/hosting.json` deklariert `DB` und `BUCKET`; ein eigenes Sites-Projekt braucht seine eigene Projektidentität.

## Eigenes Hosting

Die App basiert auf React, Vinext und Cloudflare Workers mit R2 und D1. Ein unabhängiger Host muss `app/chatgpt-auth.ts` durch eine echte serverseitige Sitzung ersetzen und die Speicherbindungen bereitstellen. Die von Sites authentifizierten Identitätsheader sind außerhalb dieser Plattform **keine** zuverlässige Anmeldung. Es gibt noch kein fertiges Docker-Paket. Geheimnisse gehören ausschließlich in serverseitige Umgebungsvariablen.

## Formate

PDF, PNG, JPEG, GIF, WebP, MP4, WebM, MP3, WAV und TXT/MD: direkte Vorschau, bei Medien abhängig vom Browser-Codec. DOCX und PPTX: Text-Inhaltsvorschau. XLSX, CSV und ZIP: Download. DOC, PPT, SVG, HTML und ausführbare Dateien sind keine zugelassenen Uploadformate. Für exaktes Office-Layout als PDF exportieren. Keine gemeinsame Echtzeitbearbeitung und keine automatische Office-zu-PDF-Konvertierung.

## Version 0.2: Arbeitsbereiche und Sicherheit

Live: https://open-share-board.lord-time.chatgpt.site
Quellcode: https://github.com/xLordTime/Open-Shareboard-mini

- PDF-Anmerkungen und private Referentennotizen werden automatisch serverseitig gespeichert, mit atomarem Versionsvergleich. Konflikte überschreiben keine neueren Entwürfe. Bei Verbindungsfehlern wird nach Möglichkeit ein Sitzungsspeicher-Entwurf gesichert; PDF-Export ist die zusätzliche Sicherung.
- Linien, Pfeile, Rahmen, Textnotizen, Radierer und Verschieben; Rückgängig/Wiederholen. Textnotizen im PDF-Export verwenden Helvetica: Zeichen außerhalb des unterstützten lateinischen Zeichensatzes werden durch `?` ersetzt.
- Ordner, Verschieben, Umbenennen, Löschen leerer Ordner und widerrufbare Sammlungslinks. Sammlungen enthalten **auch zukünftig hinzugefügte Dateien** im Ordner. Herausgeschobene Dateien verlieren den Zugriff über dessen Link.
- Links mit Ablaufdatum. Neu erstellte Links in der Oberfläche gelten standardmäßig sieben Tage. Die API unterstützt optional unbefristete Links; die Oberfläche setzt ein Datum. Vorhandene unbefristete Links bleiben bis Widerruf gültig.
- Präsentationsansicht mit Anpassung an die Bildschirmhöhe, Seitennavigation, Laserpointer und privaten Referentennotizen. Die Seitenübersicht ist eine beschriftete Navigationsliste, keine gerenderte Thumbnail-Galerie.
- DOCX/PPTX: lokale Text-Inhaltsvorschau ohne Dateiübermittlung an Drittanbieter. Word-Absätze/Überschriften bzw. PowerPoint-Folientexte. Bilder, Diagramme, Animationen und exaktes Layout werden nicht rekonstruiert. DOC/PPT/ODT/ODP sind keine Vorschauformate.
- Upload-Fortschritt, Warteschlange und Abbruch; Abbruch nach vollständiger Übertragung kann die bereits serverseitig laufende Speicherung nicht rückgängig machen.
- Limit: 25 MB pro Datei, 500 Dateien, insgesamt 1 GB. Quotenreservierung in D1 ist atomar. Bestandsdateien werden vor weiteren Uploads in die Quotenliste übernommen. Die vorhandenen R2-Daten werden nicht verschoben oder gelöscht.

### Betrieb und Konfiguration

`.openai/hosting.json`: `d1: "DB"`, `r2: "BUCKET"`. Migrationen in `drizzle/` werden vom Sites-Deployment angewendet. Für eigenes Hosting dieselben Migrationen vor dem Start anwenden.

`BOARD_OWNER_EMAIL` als serverseitige Umgebungsvariable konfigurieren. Ohne sie bleiben Bibliothek und Schreiboperationen gesperrt. Nur das von der Plattform authentifizierte Besitzerkonto darf Dateien, Ordner und Anmerkungen verwalten. Freigabelinks bleiben anonym lesbar. Nie die Identitätsheader im unabhängigen Hosting ungeprüft von Browsern übernehmen.

Serverseitig geprüft: Eigentümerschaft, Same-Origin-Schreiben, begrenzte Anfragegrößen, Anmerkungsschema, erlaubte Dateiendungen und ausgewählte Dateisignaturen. Ausführbare Dateien und aktive HTML/SVG-Dateien sind nicht zugelassen. Schreiblimits: 20 Uploadversuche/Stunde, 200 Verwaltungsanfragen/Minute, 120 Anmerkungsspeicherungen/Minute. Office-ZIP-Verzeichnisse haben Größen-, Eintrags- und Entpackgrenzen; nur ausgewählte XML-Teile werden extrahiert, DTDs/Entities werden abgewiesen.

Geteilte Besucher sehen **keine** gespeicherten Anmerkungen oder Referentennotizen. Um Zeichnungen zu teilen, eine neue PDF mit Anmerkungen exportieren und diese Datei freigeben. Lokale Anmerkungen eines geteilten Besuchers werden nicht in die Besitzerbibliothek geschrieben.

HTTP-Schutz: `nosniff`, `no-referrer`, eingeschränkte Content Security Policy, keine Plugin-/Objekt-Einbettungen und eingeschränkte Browser-Berechtigungen. Framework-Inlineskripte benötigen aktuell `unsafe-inline`; es besteht keine vollständige nonce-basierte CSP. Keine automatische Virenprüfung, keine DDoS-Garantie, keine Inhaltsverschlüsselung mit einem vom Nutzer gehaltenen Schlüssel. Links sind Zugriffstokens: wer sie erhält, darf die Datei lesen und herunterladen; bereits heruntergeladene Kopien bleiben erhalten.

### Aktueller Prüfumfang

13 automatisierte Tests prüfen reale SQLite-Quota- und Versionsabfragen mit einem D1-Adapter sowie R2-Testdouble: Kontotrennung, Freigaben, Ablauf und Widerruf, Sammlungszugehörigkeit, private Notizen, Versionskonflikte, Quoten, Schreiblimits, Dateitypen, Origin-Prüfung, ZIP-Entpackgrenzen und Löschbereinigung. Zusätzlich Typprüfung und Produktionsbuild. Ein praktischer Browser-/Stift-Test und ein unabhängiges Security-Audit stehen aus.

Die Angaben in diesem Abschnitt ersetzen abweichende Grenzen der ersten Version weiter oben.

## Credits

React (Meta/MIT), Vinext und Cloudflare, Mozilla PDF.js (Apache-2.0), pdf-lib (Andrew Dillon/MIT), fflate (Arjun Barrett/MIT), Lucide (ISC), DM Sans und Manrope (Open Font License). Paketlizenzen bleiben bestehen. Siehe `THIRD_PARTY_NOTICES.md`, `public/PDFJS-LICENSE.txt` und die Lizenzdateien des Sites-Starter-Builds. PDF.js-Assets werden lokal bereitgestellt, Dateien nicht an externe Viewer übertragen. Schriftarten kommen von Google Fonts.
