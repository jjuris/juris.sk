---
title: "Self-service deployment into the production"
date: 2020-01-01
draft: false
---

![](featured.png)

## Project overview
Self-service deployment into production marked a key evolution in our team’s operations. As a former admin, I witnessed firsthand how manual processes created bottlenecks,
but Kubernetes and GitOps tools like ArgoCD empowered developers to take ownership.

## From Admin Dependency to Autonomy
Back when I managed deployments, every production release required admins to manually move Debian packages to the right branch, select servers with enough capacity, and deploy components.
Kubernetes eliminated this routine work, yet admins still controlled production access. With our internal cloud maturing and admin teams specializing, developers gained independent
deployment rights—shifting mindsets from gatekeeping to collaboration.

## CI/CD Pipeline Evolution
Initially, we adapted our CI/CD with an internal tool that generated Kubernetes manifests for web-based deployment. Today, ArgoCD handles this seamlessly via GitOps, syncing changes
declaratively and reducing errors. This upgrade cut deployment times dramatically, much like cases where teams saw 90% faster releases.

## Developer Ownership and On-Call Impact
Our team now holds production on-call because no one understands our product better than its builders. Reliable production quality means each weekly rotator gets financial compensation
plus a personal day off—a fair win that boosts motivation. This autonomy fosters faster feedback and accountability, aligning with industry gains in productivity and reduced bottlenecks.
