---
title: CORTEX
tagline: "AR + computer vision airport ecosystem. 1st overall at TAMUhack 2026."
period: Jan. 2026
start: "2026-01"
end: "2026-01"
stack: [Swift, SwiftUI, RealityKit, MapKit, Node.js]
links:
  github: https://github.com/premiumfriedrice/CortexiOSApp
diagram: cortex.svg
diagramCaption: The iOS app and what it talks to
bullets:
  - Won 1st Place Overall at TAMUhack 2026 (650+ competitors) by building airport travel ecosystem.
  - Architected iOS app with AR anchors to relocate set-down items and CV to detect bags on airport carousels.
  - Built search and interactive map UI, integrated CoreML/OpenCV models, and deployed backend endpoints.
---

CORTEX was our TAMUhack 2026 entry: an iOS app for getting through an airport without losing your stuff. You register your checked bags with photos, drop AR pins on things you set down, and get your flight and gate info on a map. It won first overall out of 650+ competitors. This page covers the iOS app, which is the part I wrote and the part that's public.

## What it does

The home screen is a map centered on the airport with your flight pulled from a live flight-data API, plus a search over gates, lounges, and services. A bags-and-items screen holds two kinds of things: checked bags, which you photograph from a few angles so the backend can recognize them on the carousel, and personal items, which you tag with an AR anchor when you set them down so the app can guide you back.

If a bag or item is marked lost, the app starts polling the backend and, while the status is "lost", pushes the phone's coordinates up so the thing can be found.

## How it's built

**App.** SwiftUI, one Xcode project, no third-party packages. Views are split into the home page (map, flight, search), the bags-and-items list, a chat page, and a find-my sheet.

**Flight data.** The airport service calls the AviationStack flights API and maps the response into the app's own models. If the API returns nothing or hits a rate limit, it falls back to built-in data so the demo never shows an empty screen.[^flight]

**Bag photos.** Each checked bag carries a set of images. Before upload the app compresses them so the JSON payload stays under the backend's request limit, then POSTs the bag to the backend's upload route with a bearer token. Bags are fetched back per user from a separate route.[^size]

**Lost-object tracking.** A small observable API object owns a timer. Every five seconds it checks the object's status on the backend, and only when the status is "lost" does it send the current coordinates.[^poll]

**AR relocation.** The AR view is RealityKit: a world anchor, a marker entity at the saved position, a 3D text label on top of it, and a guide line from you to the marker. A capture button flashes the screen when you take the reference photo.[^ar]

**Backend.** A Next.js API on Vercel, written by a teammate, with routes for upload, per-user baggage, object status, and lost reports. The bag-detection model behind the upload route is also on that side. That repo isn't public, so it's drawn dashed in the diagram.

## Decisions

**Compress on the phone, not the server.** Vercel caps request bodies, and the bag photos were blowing past it. Shrinking them on-device kept the backend simple.

**Poll instead of push.** For a hackathon, a five-second poll that only reports coordinates when something is actually lost was simpler than wiring notifications, and it kept location updates to the one case that needs them.

**Fallback flight data.** Demos fail when an API does. The airport service always has an answer.

**AR for items, CV for bags.** Set-down items are things you can anchor in the moment. Checked bags leave your hands, so the carousel camera has to recognize them instead.

## Results

- 1st Place Overall at TAMUhack 2026, out of 650+ competitors.
- One iOS app covering flights, bag registration, AR relocation, and lost-item reporting, built in a weekend.

[^flight]: The service also holds a hardcoded map region around the airport for the MapKit view, so the map opens in the right place before any API call finishes.

[^size]: The upload code prints the payload size in megabytes before sending, because the first few uploads failed on size and that was the fastest way to see why.

[^poll]: The poller cancels any existing timer before starting a new one, otherwise switching between objects stacked timers and spammed the backend.

[^ar]: Heads up if you read the repo: the AR view file is fully commented out at HEAD. It ran at the hackathon; it was disabled afterwards while the project was being cleaned up.
