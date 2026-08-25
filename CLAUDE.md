# CLAUDE.md

This file provides project-specific guidance for Claude Code when working on The Mom Notes.

---

# Project Overview

The Mom Notes is a standalone research application for capturing, organizing, and learning from customer conversations and qualitative research.

It originated as an internal research hub for Saga Software and was previously built with Base44 and hosted at themomnotes.com. It is now being developed as an independent application, detached from Base44.

The Mom Notes should support research across products and domains. Saga is an important current use case, but the application architecture and product language should not assume that all research belongs to Saga.

The primary goals are:

* Make it fast to capture notes from customer conversations.
* Keep qualitative research organized and easy to retrieve.
* Help researchers identify recurring themes, needs, pain points, behaviors, and opportunities.
* Preserve the context and nuance of what participants actually said.
* Make accumulated research useful over time rather than leaving it buried in individual notes.
* Reduce friction between conducting research and applying what was learned.
* Keep research data portable and under the user's control.
* Provide a simple, intuitive workflow without requiring specialized research software expertise.

The application is currently under active development.

When existing Base44 behavior conflicts with a cleaner standalone architecture, prefer the architecture that makes sense for the standalone application unless preserving that behavior is an explicit requirement.

---

# Product Model

The Mom Notes is fundamentally a **qualitative research repository**, not a CRM, task manager, or general-purpose note-taking application.

Core concepts may include things such as:

* research participants
* customer conversations
* interviews
* research notes
* observations
* quotes
* themes
* insights
* tags
* products or research areas

Use the terminology already established in the codebase.

Do not introduce new domain concepts merely because similar research applications use them. Inspect the existing product model first.

---

# Research Integrity

Research data must preserve the distinction between:

* what a participant actually said
* what the researcher observed
* interpretation
* synthesis
* product conclusions

Do not silently transform one into another.

When features summarize, categorize, analyze, or otherwise derive information from research notes, preserve provenance whenever practical.

A researcher should be able to understand where an insight came from.

Direct quotes must remain distinguishable from paraphrases or generated summaries.

Do not alter source research data merely to make derived analysis cleaner.

---

# Technology and Architecture

Before making architectural assumptions, inspect the repository.

Use the actual project configuration, package files, source structure, and existing conventions as the source of truth.

Do not carry assumptions from Saga Editor or the previous Base44 implementation into this codebase.

In particular, do not assume the application uses:

* Electron
* ProseMirror
* Git-based versioning
* Saga's manuscript architecture
* Saga's filesystem conventions

unless they actually exist in this repository.

When this file conflicts with concrete architectural decisions already established in the repository, identify the conflict before changing architecture.

---

# Core Engineering Philosophy

When making implementation decisions, prioritize:

1. Correctness
2. Maintainability
3. Data integrity
4. User experience
5. Performance at realistic research-library scale
6. Simplicity

## Design for Known Requirements

Design for product requirements that are already known.

Avoid speculative optimization for hypothetical problems, but address scaling, correctness, data integrity, and architectural constraints that are already part of the application.

## Abstractions

Prefer clear, well-named abstractions when they:

* encode domain concepts
* enforce invariants
* eliminate meaningful duplication
* establish useful boundaries between storage, domain logic, and presentation

Avoid abstractions that merely hide simple logic or anticipate unconfirmed future use cases.

## Code Quality

Write clean, readable, maintainable code.

Avoid code duplication.

Prefer generic, reusable components over feature-specific implementations when they genuinely simplify the codebase without sacrificing clarity.

## Documentation

Document complex logic and non-obvious design decisions.

Keep documentation concise, precise, and up to date.

Do not document code that is already self-explanatory.

---

# General Rules

## Inspect Before Implementing

Before implementing a feature or substantial change:

* inspect the relevant existing code
* understand the current data model
* search for reusable components and utilities
* identify established patterns
* identify any persistence or migration implications

Do not create parallel implementations of functionality that already exists.

---

## Reuse Existing Components

Before creating new UI components:

* search the existing codebase
* extend existing components when appropriate
* reuse the established design system
* only introduce new abstractions if they eliminate meaningful duplication or establish a useful shared primitive

---

## Keep Architecture Consistent

Follow the existing project structure.

Do not introduce new architectural patterns without a compelling reason.

Prefer feature/domain-based organization where it fits the existing architecture.

Do not recreate patterns from Saga simply because they are familiar.

---

## Minimize Changes

When fixing a bug:

* make the smallest correct fix
* identify the root cause
* avoid unrelated refactors
* preserve behavior unless intentionally changing it

For architectural work, make the smallest coherent change that actually resolves the architectural problem rather than layering a workaround over it.

---

## Preserve Comments

Do not remove comments unless:

* they are incorrect
* they are outdated
* the surrounding code has been removed

---

## Naming

Component filenames should match exported component names.

Use:

* PascalCase for React components
* camelCase for functions
* camelCase for variables
* SCREAMING_SNAKE_CASE only for true constants

Avoid abbreviations unless already established in the domain.

Prefer names based on research concepts over implementation details.

---

# Data Model and Persistence

Research data is the core asset of The Mom Notes.

Protect it accordingly.

## Single Source of Truth

Do not create multiple canonical representations of the same domain data.

Derived data should be clearly derived rather than competing with its source.

## Stable Identity

Persisted entities should have stable identities.

Do not regenerate entity IDs as a side effect of ordinary editing, sorting, filtering, importing, or UI operations.

## Relationships

Model relationships explicitly where they are meaningful.

Do not rely on display names, array positions, filenames, or other mutable presentation details as identifiers.

## Schema Changes

Treat persisted-data changes as migrations, not ordinary refactors.

Before changing a stored schema:

* inspect existing persisted data
* determine backward-compatibility implications
* add migration logic where required
* test migration behavior
* avoid destructive transformations

Never assume existing data can simply be discarded unless explicitly told that it can.

---

# Research Content

Preserve research content faithfully.

When editing or processing customer-conversation notes:

* do not silently rewrite participant statements
* preserve direct quotations accurately
* preserve relevant context
* keep researcher-authored interpretation distinguishable from source material
* avoid destructive normalization

Search, filtering, categorization, summarization, and AI-assisted analysis should operate on research content without corrupting the original source material.

---

# Search and Retrieval

Finding existing research is a core workflow.

When implementing search or filtering:

* prioritize predictable behavior
* make active filters visible
* avoid hidden filtering rules
* make it clear why a result matched when practical
* preserve access to the original source/context
* design for research libraries containing many conversations and notes

Search relevance should not obscure exact-match retrieval.

---

# Derived Insights and Analysis

Themes, summaries, insights, classifications, and similar analysis are derived from source research.

Whenever practical:

* retain links back to supporting source material
* distinguish generated or inferred content from researcher-authored content
* allow derived information to change without mutating the source
* avoid presenting weak inference as established fact

If AI-generated functionality is added, generated content must not be indistinguishable from original participant statements.

---

# Privacy and Sensitive Research Data

Customer conversations may contain personal, confidential, or commercially sensitive information.

Treat research content as sensitive by default.

Avoid:

* exposing research content unnecessarily
* logging full note contents without a compelling debugging need
* placing sensitive content in analytics events
* leaking data through error reporting
* sending research data to external services without an explicit product decision

Collect and transmit only the data necessary for the feature.

When introducing a service or dependency that receives customer research data, make that data flow explicit.

---

# TypeScript

If the project uses TypeScript, use strict TypeScript.

Avoid:

* `any`
* unnecessary type assertions
* duplicated interfaces
* weakening type safety to bypass errors

Prefer:

* explicit domain types
* discriminated unions where they clarify state
* reusable domain types
* validation at external or persistence boundaries

Do not trust persisted, imported, network, or user-provided data merely because a TypeScript type says it is valid.

---

# React

If the project uses React, prefer:

* functional components
* composition
* small focused hooks
* derived values rather than duplicated state
* clear boundaries between UI state and domain state

Avoid:

* deeply nested component trees
* unnecessary state
* effects used to synchronize state that could instead be derived
* giant feature components containing persistence, domain logic, and rendering together

---

# Styling

Use the application's established design system.

Where applicable, prefer:

* Tailwind utilities
* design tokens
* existing shared UI components
* established component variants

Do not:

* hardcode colors unnecessarily
* duplicate spacing systems
* create one-off button implementations
* bypass shared primitives without a reason

Respect light and dark themes if both are supported.

---

# Interaction Design

The Mom Notes should feel lightweight even when the underlying research structure is sophisticated.

Prefer interactions that:

* keep users close to the research content
* minimize administrative overhead
* reduce unnecessary modal flows
* make organization available without forcing excessive organization
* keep common actions obvious
* make destructive actions difficult to trigger accidentally
* preserve context while navigating between related research

Avoid turning routine note-taking into a form-filling exercise.

---

# Accessibility

Every new UI should support:

* keyboard navigation
* visible focus states
* screen readers
* semantic controls
* appropriate accessible names
* sufficient contrast

Do not make pointer interaction the only way to access functionality.

---

# Internationalization

If internationalization is established in the application, all user-visible strings must use the existing i18n system.

Do not hardcode user-visible strings in:

* components
* hooks
* dialogs
* menus
* tooltips
* labels
* placeholders
* accessibility labels
* error messages
* empty states

Follow the project's actual translation API and locale conventions.

Do not copy Saga-specific translation utilities or import paths unless this repository actually uses them.

Organize translation keys by feature and domain.

Prefer specific keys such as:

```ts
t("interviews.emptyState");
t("research.filters.participant");
```

over ambiguous keys such as:

```ts
t("message");
t("title");
t("empty");
```

Accessibility text is also user-visible content and must be localized where i18n is supported.

---

# RTL Support

The Mom Notes should support right-to-left content and interfaces where localization requires it.

When implementing UI:

* verify RTL layout
* verify text direction
* use logical CSS properties where practical
* avoid assuming left means start or right means end
* test mixed-direction content where relevant

Research notes themselves may contain content in multiple languages or writing directions.

Do not infer the semantic language of research content from the application's UI direction.

---

# Error Handling

Never silently discard research data.

Prefer:

* explicit failures
* recoverable states
* descriptive error messages
* safe persistence behavior
* retryable operations where appropriate

Protect user data above convenience.

An operation that partially succeeds must not pretend to have fully succeeded.

---

# Imports and Exports

Research data should remain portable.

When implementing import or export:

* preserve source content faithfully
* avoid lossy transformations unless explicitly documented
* validate imported data
* handle malformed input safely
* preserve stable relationships where the format supports them
* clearly communicate unsupported data

Do not couple the canonical application data model to one external file format.

---

# Performance

Optimize for realistic research-library scale.

Assume users may accumulate:

* many research projects or areas
* hundreds or thousands of conversations
* large collections of notes
* many tags, themes, quotes, and insights

Avoid algorithms or rendering patterns that require scanning or rerendering the entire research library for routine interactions when a simpler scalable approach exists.

Do not prematurely optimize without evidence, but do not knowingly introduce obvious scaling problems into core retrieval workflows.

---

# Dependencies

Do not introduce new dependencies unless they provide substantial long-term value.

Before adding one:

* check whether the capability already exists in the codebase
* consider platform/native capabilities
* evaluate maintenance quality
* consider bundle and runtime cost
* consider privacy implications, particularly if data leaves the application

---

# Refactoring Guidelines

When refactoring:

* preserve behavior unless intentionally changing it
* reduce duplication
* improve readability
* strengthen domain boundaries
* improve architecture where there is a demonstrated need
* preserve stored research data

Avoid large speculative abstractions.

Do not preserve awkward Base44-era architecture solely because it existed previously if a cleaner standalone design is now possible.

---

# Testing

When changing behavior:

* update existing tests if necessary
* add tests for new behavior
* test domain rules separately from presentation where practical
* test persistence and migration paths when affected
* avoid brittle implementation-specific tests

Prefer testing observable behavior and important invariants.

For research-data functionality, explicitly test cases where data could be lost, duplicated, incorrectly associated, or silently transformed.

---

# Before Finishing Work

Before considering a task complete:

* ensure TypeScript compiles if applicable
* ensure lint passes if affected
* ensure relevant tests pass
* verify no unnecessary files were changed
* check persistence and migration implications
* check accessibility implications
* check RTL implications
* check i18n implications
* check privacy implications
* verify that existing research data remains intact

Do not report a check as passing unless it was actually run.

If a check cannot be run, state that explicitly.

---

# Commit Quality

Changes should be:

* cohesive
* reviewable
* logically grouped

Avoid mixing unrelated changes.

Do not commit generated artifacts, temporary files, debug files, or environment-specific files unless they are intentionally part of the project.

---

# Product Philosophy

Every product and engineering decision should make accumulated customer knowledge easier to capture, understand, retrieve, and use.

When multiple implementations are possible, prefer the one that:

* reduces friction while taking research notes
* preserves the customer's actual voice
* keeps source material connected to conclusions
* reduces organizational busywork
* makes old research useful again
* makes important patterns easier to notice
* protects sensitive research data
* remains understandable as the research library grows

The application should add structure where structure helps researchers think, without forcing every conversation into a rigid schema.

---

# Decision Principles

When uncertain:

* Prefer source evidence over assumptions.
* Prefer explicit provenance over detached conclusions.
* Prefer maintainability over cleverness.
* Prefer correctness and data integrity over convenience.
* Prefer simple designs over generalized frameworks.
* Prefer established project conventions over imported conventions from Saga or Base44.
* Prefer architecture that remains understandable as the application grows.

If an implementation would require breaking these principles, explain the tradeoff before proceeding.
