---
title: Secure Kiosk Network for Vysocina Museums and Galleries
date: 2013-12-11
---

![](featured.jpg)

## The project

In summer 2013, Vysocina region tasked us with deploying 47 interactive kiosks across museums and galleries to showcase digitized exhibits on https://mgvysociny.cz.
Beyond hardware, I designed a monitored network with remote management, self-restarts, content lockdown, and The Dude integration—turning remote sites into reliable digital hubs.

## Key Challenges

Museums often lacked technically skilled personnel. Kiosks needed auto-recovery and VPN-secured access to the central management site.
Hurdles included automating RouterOS scripting, building OpenVPN certificate hierarchies, and training non-technical colleagues on static LAN/WiFi setups.

## Software & Hardware Stack

Windows PC with [SiteKiosk](www.sitekiosk.com) provided terminal lockdown and central Server console for configs/updates. Each terminal featured MikroTik RouterBOARD as OpenVPN client,
plus a device for temp/humidity monitoring and remote power cycling. Kiosks acted as LAN clients.

## Results & Lessons
All 47 kiosks went live that summer and run reliably today. Automation cut deploy time and mitigated configuration errors. Key takeaway: script early for edge infra.
This honed my DevOps skills for remote resilience.
