# Development of a plain React app without SSR

* Status: accepted
* Deciders: erikhofer
* Date: 2022-02-17

## Context and Problem Statement

Basic technology stack is React with Ant Design. Which framework is used to create the app?

## Decision Drivers

* Export feature should be able to produce static HTML.
* Data is persisted on the local machine ([ADR-0001](0001-persistence-with-files.md)).

## Considered Options

* NextJS
* create-react-app

## Decision Outcome

Chosen option: "create-react-app", because NextJS has problems with client-only apps (e.g. `router.push` requires page reload) and we do not need SSR aside from export.

### Positive Consequences

* We do not have wo work around issues with NextJS.

### Negative Consequences

* For the export feature, we have to come up with another solution or go for a non-static approach.
* If we want a landing page with proper SEO, we cannot integrate it with the app as easily.

<!-- markdownlint-disable-file MD013 -->
