---
status: current
tags:
  - backend
causedBy: []
---

# Scheduled tasks on multiple nodes would interfere

We have some scheduled task in the application that run regularly, e.g. clean-up tasks. I we deploy multiple instances of the application, the scheduled tasks would be executed on all of them and interfere with each other.

In a cluster deployment, a mechanism is needed that ensures that each scheduled task is only executed on one node at a time.
