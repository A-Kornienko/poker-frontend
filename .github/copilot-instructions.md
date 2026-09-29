# Copilot Instructions

## Core Principles

* Prefer simple, readable, maintainable solutions.
* Follow SOLID pragmatically, not mechanically.
* Avoid overengineering and premature abstraction.
* Prefer composition over inheritance.
* Keep responsibilities clear and components cohesive.
* Prefer a small amount of duplication over a premature abstraction.
* Do not build abstractions for hypothetical future requirements.
* Reuse code when there is real reuse or a clear responsibility boundary.
* Preserve existing project conventions unless there is a concrete reason to change them.

## Changes & Refactoring

Before creating, modifying, deleting, or refactoring files, stop and ask the user for confirmation.

Before requesting confirmation:

* Explain the proposed implementation approach and user flow/scenario.
* Describe the sequence of actions and expected behavior.
* List the files that will be created or modified.
* Explain why each change is needed.
* Highlight important assumptions, dependencies, or API changes.

Do not make file changes until the user explicitly approves both:

1. The proposed implementation scenario.
2. The planned file changes.

Do not infer approval from discussion, suggestions, or implied intent.

## React & Architecture

* Use React functional components and hooks.
* Prefer `React.FC<Props>` with an `interface` for component props, following the project's established style.
* Keep components focused on rendering, user interaction, and orchestration.
* Move non-trivial business logic into hooks, services, or domain utilities.
* Keep feature-specific code close to the feature that owns it.
* Put genuinely reusable, feature-agnostic UI in `src/components/ui`.
* Put feature-specific components in `src/components/features`.
* Use `src/pages` for top-level routing components.
* Do not move code into shared/common/utils directories prematurely.
* Keep state as local as practical.
* Use Context for genuinely shared application state, not as a default replacement for local state.
* Avoid unnecessary `useMemo`, `useCallback`, `React.memo`, and `useEffect`.
* Prefer derived values over duplicated state.

## TypeScript

* Use strict TypeScript. Never use `any`.
* Prefer explicit, domain-oriented types and type-safe APIs.
* Prefer type narrowing over unsafe type assertions.
* Use `unknown` for untrusted external data.
* Use `type` for unions and compositions; use `interface` for object contracts where appropriate.
* Do not duplicate types unnecessarily.

## API & Data

* Centralize Axios configuration, interceptors, and API communication in `src/api` or `src/services`.
* Never call Axios directly from presentation components.
* Define explicit request and response types for API endpoints.
* Keep API contracts explicit and consistent with backend DTOs.
* Map backend DTOs to frontend/domain models when the backend representation should not leak into the UI.
* Do not duplicate endpoint URLs, request logic, or error handling across components.
* Handle relevant loading, empty, and error states explicitly.

## Code Quality

* Use PascalCase for components and camelCase for hooks, utilities, and functions.
* Use `handleX` for internal event handlers and `onX` for callback props.
* Prefer semantic HTML and accessible UI.
* Ensure interactive elements are keyboard accessible.
* Use responsive Tailwind utilities such as `md:` and `lg:` where appropriate.
* Prefer self-explanatory code over comments.
* Add comments only for non-obvious business rules, constraints, or important implementation decisions.
* Prefer correctness, readability, and maintainability over premature optimization.

## Token Efficiency

* Prefer concise, focused implementations.
* Reuse existing components, hooks, utilities, types, and services before creating new ones.
* Do not duplicate existing logic.
* Do not generate boilerplate unless it is required.
* When modifying code, change only what is necessary for the requested behavior.
* Avoid repeating unchanged context or code.
* Avoid unnecessary architectural refactors.
* Do not introduce new abstractions, files, dependencies, or layers unless they solve a concrete problem.

## Repo-specific guidance

* This project is a Vite React TypeScript SPA focused on the poker client UI.
* Keep page-level views in `src/pages`, route configuration in `src/router/Router.ts`, and app bootstrap in `src/App.tsx`.
* Put API access in the dedicated services under `src/api` and route all HTTP calls through the shared Axios instance in `src/api/AxiosInstans/AxiosApiInstance.ts`.
* Authentication uses cookies and the request/refresh token flow in the helpers and axios interceptors; preserve that pattern when adding auth-related work.
* Table/game data is held in module-level stores under `src/store`; keep that pattern unless a task clearly requires a different state structure.
* Prefer working within existing hooks, services, and component conventions instead of introducing new cross-cutting layers or global libraries.
