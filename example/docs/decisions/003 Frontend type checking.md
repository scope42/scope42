---
status: superseded
tags:
  - frontend
supersededBy: "[Frontend type checking (revisited)](004 Frontend type checking (revisited).md)"
assesses: []
---

# Frontend type checking

## Context

Should we use static type checking for the frontend JavaScript code?

## Options

### Use vanilla JavaScript

**Pros**
* Easy setup
* High development velocity for the MVP

**Cons**
* May become hard to maintain later

### Use static type checking

**Pros**
* Catch typing errors at build-time
* More robust to refactoring

**Cons**
* Needs some extra setup work
* Developers need to learn this on top of JavaScript

## Outcome

**Chosen option:** Use vanilla JavaScript

Based on the schedule for delivering the first prototype of the system and the fact that developers already need to learn JavaScript as a new language, we decide to go with vanilla JavaScript for now.

## Deciders

* John Doe
* Jane Doe
