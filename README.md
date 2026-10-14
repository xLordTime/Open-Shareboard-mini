# Open Shareboard Mini

**Live:** https://open-share-board.lord-time.chatgpt.site

**Quellcode:** https://github.com/xLordTime/Open-Shareboard-mini

Ein Open-Source-Shareboard für private Dateibibliotheken, Freigabelinks und PDF-Anmerkungen. Eigener Anwendungscode: MIT-Lizenz. Abhängigkeiten behalten ihre jeweiligen Lizenzen.

## Funktionen

- Dauerhafte Datei-Uploads in Cloudflare R2, maximal 25 MB pro Datei und 500 Dateien je Konto.
- Persönliche Bibliothek, Suche, Typfilter, Sortierung, Favoriten, Kachel- und Listenansicht.
- Einzeldateien über kryptografisch zufällige Links teilen und Freigaben widerrufen.
- PDF-Seiten rendern, zoomen, im Vollbild präsentieren und mit Maus, Stift oder Finger kommentieren.
- Farben, Strichstärke, Textmarker, Rückgängig; PDF-Export mit eingebrannten Anmerkungen.
- Export als neue Datei im Board speichern; das Original bleibt unverändert.
- Bild-, Video-, Audio- und Textvorschau; andere Formate als Download.
- Responsive deutsche Oberfläche und reduzierte Animationen bei entsprechendem Betriebssystemwunsch.

## Start auf ChatGPT Sites

Node.js >=22.13.0 und pnpm erforderlich. Die App basiert auf React, Vinext und dem Sites-Starter.

```bash
pnpm install
# postinstall erzeugt automatisch die lokalen PDF.js-Assets.
pnpm dev
pnpm exec tsc --noEmit
node --test tests/api.test.mjs
pnpm build
```

Ein neues Sites-Projekt registrieren und seine eigene Identität in `.openai/hosting.json` eintragen. `r2` auf `BUCKET` setzen, `d1` bleibt `null`. Der Sites-Build provisioniert R2; es werden keine Datenbankmigrationen benötigt. Vor dem Veröffentlichen den exakten Quellcode in das zum Projekt gehörende Quellrepository pushen. Für anonyme Freigabelinks muss die Site öffentliche Besucher zulassen. Die API schützt private Dateien unabhängig von dieser Plattformfreigabe.

## Identität und eigenes Hosting

Die gehostete Version verwendet die von Sites geprüften `oai-authenticated-user-id`- und E-Mail-Header. Ein unabhängiger Host muss `app/chatgpt-auth.ts` durch eine echte serverseitige Sitzung ersetzen. Niemals beliebige, von Besuchern gesendete Identitätsheader vertrauen. Verfügbarkeit von R2 über `cloudflare:workers` und eine serverseitige `BUCKET`-Binding sicherstellen. Die App ist kein sofort startbares Docker-Paket: Authentifizierung und Worker-Konfiguration müssen für die eigene Infrastruktur angepasst werden.

## Datenschutz und Freigaben

Die API listet nur Dateien des angemeldeten Kontos. Lesen, Ändern und Löschen werden serverseitig geprüft. Schreiben erfordert dieselbe Origin. Eine Freigabe gewährt jedem mit dem Link Lese- und Downloadzugriff auf genau eine Datei; sie enthält keine Kontoidentität. Nach einem Widerruf sind alte Tokens ungültig. Bereits heruntergeladene Kopien können nicht zurückgerufen werden.

PDF-Anmerkungen befinden sich während der Sitzung im Speicher des Browsers. Vor Schließen/Neuladen exportieren oder als neue PDF im Board speichern. Geteilte Besucher dürfen lokal kommentieren und exportieren, aber nicht in die Bibliothek des Besitzers schreiben. Geschützte oder beschädigte PDFs können Vorschau oder Export verhindern. PDF-Formulare, digitale Signaturen und interaktive Elemente sind keine zugesicherten Exportfunktionen. Eingebrannte Anmerkungen werden nicht als editierbare PDF-Kommentarobjekte gespeichert.

## Formate

PDF, PNG, JPEG, GIF, WebP, MP4, WebM, MP3, WAV und TXT/MD: Vorschau abhängig vom Browser-Codec. PowerPoint und Office: Upload, Download und Freigabe; für Folienpräsentation zunächst als PDF exportieren. SVG/HTML werden aus Sicherheitsgründen als Download ausgeliefert. Es erfolgt keine Office-Konvertierung, Virenprüfung oder gemeinsame Echtzeitbearbeitung.

## Grenzen der ersten Version

Keine Upload-Rate-Begrenzung oder Gesamtspeicherquote, keine administrativen Kontoverwaltung, keine Link-Ablaufzeiten oder Passwörter. Vor einem größeren öffentlichen Mehrbenutzerbetrieb entsprechende Quoten und Missbrauchsschutz ergänzen. Dateianzahl-Limit ist kein atomarer Quotenmechanismus bei parallelen Uploads. R2-Metadaten und Freigaben werden getrennt gespeichert, ohne Transaktionen. Kein automatischer Dateiversionsverlauf.

## Verifikation

Typprüfung und Produktionsbuild. API-Tests prüfen Kontotrennung, anonyme Zugriffsverweigerung, Dateispeicherung, Tokenfreigaben, Widerruf, Cross-Origin-Schutz und Löschbereinigung mit einem R2-Testdouble. Sie ersetzen keinen echten Browser-/Stift-Test und keinen Test gegen produktives R2.

## Credits

- React / React DOM: Meta und Mitwirkende (MIT).
- Vinext und Cloudflare Workers/R2: Cloudflare und Mitwirkende; Lizenzen siehe Pakete.
- PDF.js: Mozilla und Mitwirkende (Apache-2.0).
- pdf-lib: Andrew Dillon und Mitwirkende (MIT).
- Lucide: Lucide-Mitwirkende (ISC).
- DM Sans und Manrope: Schrift-Autoren, Open Font License; geladen über Google Fonts.

Siehe `THIRD_PARTY_NOTICES.md` und paketbezogene Lizenzdateien. PDF.js Worker, Zeichentabellen, Standardschriften und WASM-Dateien werden lokal bereitgestellt; Vorschauen senden keine Dateibytes an einen externen Viewer.

## GitHub und Quellcode-Download

Die Sites-Version bietet einen Quellcode-ZIP-Download. Im Repository verweist die Oberfläche auf das öffentliche GitHub-Archiv. GitHub-Releases können später für feste Versionen ergänzt werden.
