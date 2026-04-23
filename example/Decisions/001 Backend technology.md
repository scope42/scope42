---
status: accepted
tags:
  - backend
decided: 2022-05-01T13:52:12.262Z
assesses: []
deciders:
  - John Doe
  - Jane Doe
---

# Backend technology

## Context

As discussed in the solution strategy and the building block view (TODO: add links to docs), the core of the system is a backend application. Because this is a greenfield project, we have to decide on a technology stack.

Skill matrix of the development team:

|        | Java | Kotlin | Go | JavaScript |
|--------|:----:|:------:|:--:|:----------:|
| Amelia |  ✔   |   ✔    | ❌  |     ✔      |
| Noah   |  ✔   |   ❌    | ✔  |     ❌      |
| Emma   |  ✔   |   ❌    | ❌  |     ✔      |
| James  |  ✔   |   ✔    | ❌  |     ❌      |
| Olivia |  ✔   |   ❌    | ❌  |     ❌      |
| Liam   |  ✔   |   ✔    | ❌  |     ❌      |

For the frontend, JavaScript is used as per [Frontend paradigm](002 Frontend paradigm.md).

## Drivers

* Maturity of the technology stack
* Performance
* Language features and DX
* Existing developer know-how => mainly Java with Spring Boot

## Options

### Java with Spring Boot

**Pros**
* Mature and focus on compatibility
* Well-known among the team

**Cons**
* Limited language features (recently getting better)

### Kotlin with Spring Boot

**Pros**
* Modern language
* Based in the JVM and usable with the Spring Framework -> much of the existing know-how can be applied

**Cons**
* Langauge itself is not well-known among developers
* In practice a lock-in to JetBrains tooling

### Go

Framework?

**Pros**
* Modern language
* Native performance

**Cons**
* Low existing know-how of language and frameworks

### JavaScript with Node.js

**Pros**
* Modern language
* Same language is used for frontend and backend

**Cons**
* Not well-known among developers
* Performance at scale?

## Outcome

**Chosen option:** Kotlin with Spring Boot

Combining the experience of developers with the JVM and Spring boot with a modern language.

**Positive consequences**
* We do not have to conduct training on the basic technology stack
* We can start quickly with the implementation of the prototype

**Negative consequences**
* We have to conduct basic Kotlin training
* We have to setup a project structure with Kotlin for the backend and JavaScript for the frontend
