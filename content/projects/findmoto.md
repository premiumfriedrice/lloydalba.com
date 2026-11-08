---
title: findMoto
tagline: "Scraper that ranks Marketplace motorcycle listings into Notion. 1st, Notion API Challenge."
period: Mar. 2025 – Jun. 2025
start: "2025-03"
end: "2025-06"
stack: [Python, Selenium, Notion API, cron]
links: {}
diagram: findmoto.svg
diagramCaption: Nightly run, from listings to the dashboard
bullets:
  - Won 1st Place Notion API Challenge at TAMU Computing Society Build4Good Hackathon over 13 teams.
  - Built a Selenium scraper that ranks Facebook Marketplace motorcycle listings by price, model year, and recency.
  - Processes 40–80 listings daily via cron into a Notion dashboard; used it to source and purchase 2 motorcycles.
---

<!-- Lloyd: the FindMotoV2 repo only has a README at HEAD, so this was written from the resume. Point me at the code and I'll rewrite it. -->

findMoto started because I wanted a motorcycle and was tired of refreshing Facebook Marketplace. It's a scraper that pulls the day's listings, ranks them, and drops them into a Notion dashboard every night. It won the Notion API Challenge at TAMU's Build4Good hackathon over 13 teams, and I bought two motorcycles with it.

## What it does

Once a day, a cron job runs the scraper. It walks Marketplace motorcycle listings with Selenium, pulls out price, model year, and how recently each was posted, ranks them, and pushes 40 to 80 listings into a Notion database that I read as a dashboard.

## How it's built

Python and Selenium for the scraping, since Marketplace renders client-side and there's no API. Regex to pull year and price out of the free-text titles. The Notion API for storage and display, so the dashboard is just a Notion view with no frontend to maintain. Cron to run it.

## Decisions

**Notion as the frontend.** I needed to look at listings on my phone and filter them. Notion already does that, so I skipped building a UI.

**Rank, don't just collect.** Forty listings a day is too many to read. Price, model year, and recency get combined into an order so the top of the list is the one worth messaging.

## Results

- 1st Place, Notion API Challenge, Build4Good, over 13 teams.
- 40–80 listings processed a day for three months.
- Two motorcycles bought off the top of the list.
