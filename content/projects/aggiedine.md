---
title: AggieDine
tagline: "Social dining app for Texas A&M. Scale-to-zero backend, $0 idle, 70k students."
period: Jan. 2026 – May 2026
start: "2026-01"
end: "2026-05"
stack: [Python, AWS, React Native]
links: {}
diagram: aggiedine.svg
diagramCaption: Request path, drawn from the resume, not the code
bullets:
  - Designed scale-to-zero AWS backend serving up to 70k students at $0 idle and under $25/month at capacity.
  - Led 6 backend engineers building a social dining platform for Texas A&M students, running sprint planning.
---

<!-- Lloyd: no repo was available when this was written. Point me at it and I'll rewrite from the code. -->

AggieDine is a social dining app for Texas A&M students, built over a semester with a team of six backend engineers that I led. The brief I set myself for the backend was simple: it has to be able to serve the whole student body, and it has to cost nothing while nobody is using it.

## What it does

Students find people to eat with. The app is React Native on the phone and a Python backend on AWS behind it.

## How it's built

The backend is scale-to-zero on AWS: nothing runs when nobody is making requests, so the idle bill is $0. Sized for up to 70k students, it stays under $25 a month at capacity. The team was six backend engineers plus me, running on sprints.

## Decisions

**Scale to zero or don't bother.** A student project with a monthly bill dies when the semester ends. Making idle cost nothing was the one constraint I wouldn't trade.

**Lead by running the sprints.** Six engineers on a semester project need a cadence more than they need another coder. I ran planning and kept the backlog honest.

## Results

- Backend sized for up to 70k students at $0 idle and under $25/month at capacity.
- Six backend engineers shipped on a sprint cadence for a full semester.
