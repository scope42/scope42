# Store all data as YAML files on the local machine

* Status: accepted
* Deciders: erikhofer
* Date: 2021-06-19

## Context and Problem Statement

Where and how should data be stored?

## Decision Drivers

* Data ownership
* Privacy
* Collaboration
* Implementation effort
* Implications for hosting

## Considered Options

Where?
* Backend server
* Local machine

How?
* Database
* JSON files
* Markdown files with frontmatter
* YAML files

## Decision Outcome

Chosen option:
* "Local machine", because we don't have to concern ourselves with hosting and legal obligations and promote data ownership.
* "YAML files", because they are more human-readable and versionable (e.g. with Git) than JSON files. Markdown is also suitable and open to re-consideration.

### Positive Consequences

* No database hosting
* No backend and API
* Data ownership for users
* Privacy for users
* Open data format for interoperability

### Negative Consequences

* Users have to care about data themselves (e.g. backups)
* Users have to care about collaboration themselves

<!-- markdownlint-disable-file MD013 -->
