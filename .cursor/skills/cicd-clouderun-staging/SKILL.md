---
name: cicd-clouderun-staging
description: >-
  Create and maintain a GitHub Actions CI/CD workflow that deploys a GitHub
  repository to Google Cloud Run staging through Artifact Registry and
  Workload Identity Federation, and applies schema migrations to an existing
  Neon Postgres database before the Cloud Run revision goes live. Use when
  the user asks for Cloud Run staging CI/CD, a staging deploy workflow, Neon
  staging database deployment, or mentions cicd-CloudeRun-staging.
---

# cloud-run-cicd-staging

## Purpose

Create and maintain a GitHub Actions CI/CD workflow for deploying a GitHub repository to Google Cloud Run staging, and for applying the application's schema migrations to an existing Neon Postgres database as part of that deploy.

The Skill's primary responsibility is to create the CI/CD configuration.

The Skill should NOT directly create or manage deployment infrastructure when that work can be performed by GitHub Actions.

## Required Input

Initially require only:

- GitHub repository URL
- GCP Project ID

Example:

```
GitHub Repository:
https://github.com/USER/REPO

GCP Project ID:
my-gcp-project
```

Do not require additional parameters upfront.

Neon connection settings are not extra upfront parameters. Detect them from the project's existing configuration (for example `.env.production` or the settings module). Reuse that Neon project. Do not ask for `NEON_API_KEY` or `NEON_PROJECT_ID` unless the user explicitly wants GitHub Actions to create a Neon project or branch through the Neon API.

If the existing Neon target cannot be determined safely, ask only:

- which existing Neon project staging should use;
- confirmation that `POSTGRES_PASSWORD` will be stored as a GitHub Environment Secret and not committed;
- whether the workflow should run schema migrations before the Cloud Run deploy.

If additional information is necessary and cannot be safely detected or derived, ask the user.

## Core Principle

The intended architecture is:

```
AI / Skill
    ↓
Create or update GitHub Workflow
    ↓
GitHub Actions
    ↓
Authenticate to GCP
    ↓
Apply schema migrations to existing Neon
    ↓
Build Docker Image
    ↓
Artifact Registry
    ↓
Cloud Run Staging (runtime uses the same Neon database)
```

The Skill configures automation.

GitHub Actions performs the deployment.

## Bootstrap Authentication

GitHub Actions must authenticate to Google Cloud before it can manage GCP resources.

Prefer:

```
GitHub OIDC
    ↓
Workload Identity Federation
    ↓
GCP Service Account
```

WIF and the deployment Service Account are bootstrap dependencies.

If they already exist, reuse them.

If they do not exist, explain that initial authentication must be configured before the deployment workflow can manage GCP resources.

Ask the user for confirmation or missing information when bootstrap configuration is required.

Do not use long-lived Service Account JSON keys unless explicitly requested.

## GitHub Environment

Use a GitHub Environment named:

```
staging
```

Use GitHub Environment Variables for non-sensitive configuration.

Use GitHub Environment Secrets for sensitive configuration.

Never commit secrets or `.env` files.

If a local `.env` exists, inspect it and propose which values belong in Variables and which belong in Secrets.

Ask for confirmation before transferring sensitive application configuration.

## Artifact Registry

The GitHub Actions workflow should check whether the required Artifact Registry repository exists.

If it does not exist:

- create it;
- use it for Docker images;
- keep access private by default.

If it already exists:

- reuse it;
- do not reset or overwrite its IAM/public access configuration during normal deployments.

Normal image pushes must not modify repository access permissions.

## Docker

Detect the project's Dockerfile when possible.

If multiple Dockerfiles exist and the intended one cannot be determined safely, ask the user.

GitHub Actions should:

```
Checkout
↓
Authenticate to GCP
↓
Configure Docker authentication
↓
Build image
↓
Tag image
↓
Push image to Artifact Registry
```

Use the Git commit SHA as an immutable image tag when appropriate.

## Cloud Run

Cloud Run deployment should be performed by GitHub Actions.

The workflow should check whether the staging Cloud Run service exists.

If it does not exist, the workflow may create it through the normal Cloud Run deployment command.

If it already exists, deploy the new image to the existing service.

Normal CI/CD behavior should be:

```
Push
↓
GitHub Actions
↓
Apply schema migrations to existing Neon
↓
Build new image
↓
Push image
↓
Deploy new Cloud Run revision
↓
Staging service updated
```

Do not delete and recreate the Cloud Run service during normal deployments.

## Database (Neon)

Staging Postgres is an existing Neon database. GitHub Actions does not create, delete, or reconfigure the Neon project on a normal deploy.

Reuse the Neon endpoint already recorded in project configuration. Follow the application's existing connection shape. When the app builds the URL from separate fields, keep that shape:

- Variables: `POSTGRES_SERVER`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_DB`, `POSTGRES_SSLMODE`, and pool settings such as `DB_POOL_SIZE` and `DB_MAX_OVERFLOW`
- Secret: `POSTGRES_PASSWORD`

`POSTGRES_SSLMODE` for Neon is `require`. Do not commit the password, a full connection string, or any `.env` file. The workflow and this Skill may name `POSTGRES_PASSWORD`; they must not contain its value.

Schema changes are deployed by the project's migration tool. When Alembic is present, run `alembic upgrade head` in GitHub Actions after checkout and before the new Cloud Run revision is deployed. Pass the same `POSTGRES_*` values into that step. Never print secret values.

Migrations use the Neon direct endpoint. If the running service should use a pooled host (hostname containing `-pooler`), keep the direct host for Alembic and pass only the pooled host to Cloud Run. If only one host is configured, use that host for both.

Do not add Neon API provisioning (`NEON_API_KEY`, project creation, branch creation) unless the user explicitly asks for it.

Normal database behavior should be:

```
Existing Neon project
↓
GitHub Actions
↓
alembic upgrade head against the direct endpoint
↓
Cloud Run revision starts with POSTGRES_* pointing at that database
```

Do not drop, recreate, or reset the Neon database during normal deployments.

## Resource Naming

When names such as Artifact Registry repository, Cloud Run service, or region can be safely determined from existing project configuration, reuse them.

Otherwise choose a simple staging-oriented default when safe.

If choosing automatically could target the wrong resource or cause ambiguity, ask the user.

Do not guess when multiple existing resources could be affected.

## Workflow Trigger

The generated workflow should support manual execution with:

```
workflow_dispatch:
```

It should also support automatic staging deployment from the appropriate branch.

If the staging branch cannot be determined, ask the user before choosing one.

## Runtime Environment

GitHub Environment configuration and Cloud Run runtime configuration are separate concerns.

Values stored in GitHub Variables or Secrets are not automatically available inside Cloud Run.

The workflow must explicitly provide the required runtime configuration to Cloud Run.

Never expose secret values in logs.

## Idempotency

The workflow should be safe to run repeatedly.

Prefer:

```
resource missing → create
resource exists → reuse/update
```

Do not recreate Artifact Registry, Cloud Run services, the Neon project, IAM configuration, or other persistent resources unnecessarily on every push. Schema migrations must be forward-only and safe to retry.

## Scope

This Skill is specifically for:

```
GitHub Actions
+
Google Cloud
+
Artifact Registry
+
Cloud Run
+
existing Neon Postgres
+
Staging CI/CD
```

Neon is only the staging database: reuse it and migrate it. Do not introduce Terraform, Kubernetes, Cloud Build, Cloud SQL, AWS, Docker Hub, or the Neon API unless the user explicitly requests them.

## Completion

The Skill's main deliverable is a working GitHub Actions workflow under:

```
.github/workflows/
```

After initial bootstrap authentication is available, the expected result is:

```
Developer pushes code
        ↓
GitHub Actions starts
        ↓
Authenticates through WIF
        ↓
Applies Alembic migrations to the existing Neon database
        ↓
Builds Docker image
        ↓
Pushes to private Artifact Registry
        ↓
Creates or updates Cloud Run staging
        ↓
New revision becomes available and uses that Neon database
```

At completion, report:

- workflow file created or modified;
- deployment trigger;
- detected Dockerfile;
- Artifact Registry repository name;
- Cloud Run service name;
- GCP region;
- Neon database target (host, database name, and whether migrations use the direct endpoint);
- migration command;
- GitHub Environment used;
- required GitHub Variables;
- required GitHub Secrets by name only;
- any bootstrap authentication steps still required.
