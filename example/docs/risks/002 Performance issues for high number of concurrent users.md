---
status: current
tags:
  - backend
causedBy:
  - "[Clustering is not possible](../issues/004 Clustering is not possible.md)"
---

# Performance issues for high number of concurrent users

Currently, we can only scale the application vertically which is sufficient now. For a growing number of users, at a certain point, horizontal scaling becomes necessary.

If we do not take care of this in time, we will run into performance issues.
