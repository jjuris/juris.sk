---
title: "CUE templating"
date: 2025-04-01
draft: false
---

![](featured.png)

## Background
When I joined the team, our monorepo had around 20 components. Today, we manage nearly 200, making static configurations for CI pipelines, Docker images, Kubernetes manifests,
and Docker Compose files nearly impossible to handle without errors, exceptions, and hacks.

## The Challenge
Manually maintaining these configs led to inconsistencies and surprises in deployments. Static files couldn’t scale with our growth, creating maintenance nightmares across the repository.

## Our CUE Solution
We adopted CUE, a language designed exactly for this—templating, validating, and generating configurations. Our team built a custom framework that auto-generates
CI scripts, Dockerfiles, Docker Compose, Semgrep rules, and more for every component from shared templates.

## Key Benefits

* Taxonomy of components dropped sharply—no more custom hacks per service.
* Template changes propagate instantly across the entire repo, with immediate visibility of impacts.
* Everything is testable upfront, eliminating deployment surprises .
* All generated configs are fully standalone; I can easily extract a single component to its own repository where it runs independently.
* Or manually trigger CI locally if the main system goes down.

This approach brought real order to our monorepository, and I love how it scales with our team’s ambitions while giving us true flexibility.
