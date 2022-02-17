# Distribution as a Progressive Web App (PWA)

* Status: accepted
* Deciders: erikhofer
* Date: 2021-12-14

## Context and Problem Statement

How should the tool be distributed to users?

## Decision Drivers

* Web technology for UI
* UX
* Delivering Updates
* Access to local files ([ADR-0001](0001-persistence-with-files.md))
* Code signing is not pratical
* Possibility for export in CI/CD

## Considered Options

* CLI with locally started web app (similar to pgAdmin)
* Electron App
* Pogressive Web App (with File System Access API)

## Decision Outcome

Chosen option: "Pogressive Web App", because it is the most practical for now (see below).

### Positive Consequences

* Proper UX, can be tried without any download.
* Updates don't require actions by the user.
* No code signing needed.

### Negative Consequences

* File System Access API is not supported by all browsers yet, most notably Firefox. Chromium (Chrom/Edge) works.
* Export feature will require a seperate tool that is distributed as CLI.

<!-- markdownlint-disable-file MD013 -->
