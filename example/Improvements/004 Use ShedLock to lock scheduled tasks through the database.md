---
status: proposed
tags:
  - backend
resolves:
  - "[Scheduled tasks on multiple nodes would interfere](../issues/005 Scheduled tasks on multiple nodes would interfere.md)"
modifies: []
creates: []
---

# Use ShedLock to lock scheduled tasks through the database

The library [ShedLock](https://github.com/lukas-krecan/ShedLock) provides an easy way to lock scheduled tasks through the database. It makes sure that each task is only executed by one instance of the application at a time.
