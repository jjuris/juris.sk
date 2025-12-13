---
title: From Simple Recommendations to MLOps
date: 2021-01-01
---

![](featured.webp)


### Background
At the beginning of our recommendation system’s development, we used simple algorithms focused on popularity, trending topics, and readership metrics. These early methods were easy to implement and produced acceptable results. However, as the user base and content volume grew, it became clear that automated content recommendations were far more effective in engaging users than editorial selection. This realization led us toward building a data-driven recommendation system powered by modern machine learning techniques.


### Challenge
The initial architecture relied on manually configured models, trained and deployed by developers. Every adjustment to the training setup required rebuilding Docker images and creating a new deployment release. This process slowed experimentation and limited iteration speed.

As we added more complex models using **Vowpal Wabbit** and later **TensorFlow**, new challenges emerged:
- The need for **systematic A/B testing** to evaluate model performance.
- High **resource costs** from idle trainers waiting for manual configuration.
- Inefficient **memory usage** caused by the serving layer loading all trained models into a single production server.

These architectural limitations restricted both scalability and experimentation freedom.


### Solution
To overcome these challenges, we introduced several technological improvements that gradually evolved into a comprehensive **ML Ops** framework.

1. **Consul-Based Configuration**
   We redefined the training process by introducing multiple trainers with dynamic configurations stored in **Consul**. This allowed non-technical team members to configure experiments directly without developer involvement.
   *Result:* Faster testing cycles and easier experiment management.

2. **AdminWeb Platform**
   We developed **AdminWeb**, a user-facing interface for product and research teams. It centralized experiment definitions, making configuration management accessible and transparent.
   *Result:* Unified control and visibility of experiments.

3. **Model Manager and Terraform Integration**
   The **Model Manager** retrieved configuration data from AdminWeb and used **Terraform** to provision all necessary **Kubernetes** resources — including trainers, serving deployments, services, and configuration maps.
   *Result:* Fully automated lifecycle management. When an experiment was removed, Terraform automatically cleaned up all related resources, ensuring a consistent and efficient infrastructure.


### Outcome
This transformation ultimately shaped a functional and scalable **ML Ops pipeline** for our recommendation system. It allowed:
- Rapid experimentation and controlled A/B testing.
- Reduced operational overhead and better resource utilization.
- Seamless integration between machine learning workflows and production infrastructure.

The result was a more stable, efficient, and transparent system for delivering personalized recommendations — a process that evolved from simple heuristics into a robust ML-driven operation.
