# Specification of item identifiers

* Status: accepted
* Deciders: erikhofer
* Date: 2022-01-25

## Context and Problem Statement

How should items be identified (references, file names).

## Decision Drivers

* Human-readability and -sayability
* Descriptivity
* Writabality (e.g. for references in Markdown text fields)
* URL patters and directory structure

## Considered Options

Format:
* UUID
* `2020-01-01-some-slug`
* `issues/2020-01-01-some-slug`
* `42`
* `issues/42`
* `issue-42`
* `ISSUE-42`
* `issue#42`
* `issue-0042`

Serial numbers:
* Per item type
* Global (like GitHub issues and PRs)

## Decision Outcome

Chosen option: `issue-42` with serial numbers per item type.

### Positive Consequences

* Identifier is stable when title changes (no slug).
* Item type is obvious from identifier in refernces (e.g. `cause: issue-2`).
* (Virtually) infinite items (no leading zeros).
* Each combination of type and number exists (if not deleted).

### Negative Consequences

* File name is not descriptive (no slug).
* No differentiation between multiple projects (like in JIRA).
* Files are not sorted properly (no leading zeros).
* Long indentifiers for improvements.
* Redundant information in path (e.g. `issues/issue-42`).

<!-- markdownlint-disable-file MD013 -->
