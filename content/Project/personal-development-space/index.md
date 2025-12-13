---
title: "Personal development space"
date: 2022-01-01
---

![](featured.png)

## Project overview
When I joined the development team, our research colleagues needed a reliable way to standardize their personal and shared virtual machine configurations.
What started as a solution for just 5 researchers has scaled to support 30 researchers, 15 developers plus a growing analytics team. This project became particularly valuable
with the shift to Apple M1 laptops, where x86_64 emulation caused brutal performance drops for some local components.

## Technical Solution
The system uses Terraform to provision VMs in OpenStack, handling infrastructure creation declaratively and scalably. Ansible then takes over for fine-grained OS configuration,
ensuring consistency across machines. Together, they manage more than 50 VMs under my control — personal ones, shared ones, and a few equipped with cutting-edge GPUs.
With minor adaptations, the same approach now configures my Kubernetes clusters too.

## Key Benefits
Remote terminal access to these VMs proved essential for colleagues traveling, letting them connect without running heavy local emulations and saving precious mobile data.
The automation eliminated manual setup errors and adapted smoothly as our team grew sixfold. Personally, building this gave me hands-on mastery of IaC tools while directly
boosting team productivity.
