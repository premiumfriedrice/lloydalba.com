---
title: "Building a Production-Grade MVP of an On-Prem LLM Inference Server"
date: Nov 5, 2026
diagram: 2026-11-05-on-prem-inference-what-we-built.svg
diagramCaption: The four layers, from a request to the dashboard
diagramTheme: dark
---

Handwritten (+ AI revised) notes from my internship project, deploying an on-prem high performance LLM inference server on a single GPU box. This writing documents what we built, the design decisions I made, and the trouble I ran into while working with AI on this project.

I'm leaving out the how on purpose. I'm not naming the specific tools, models, or config files, because writing up exactly how a company's internal stack is wired together gives bad actors a head start on exploiting it. So the layers below are described generically.

The purpose of this server is to allow a team of 12 engineers to have access to inference without paying subscriptions to 3rd party providers.

## Why we built it

Everyone on the team was either paying for their own API access or not using inference at all. We wanted one shared endpoint that any OpenAI-compatible client could point at, that only people we handed a key to could use, and that we could actually see into. Everything runs on a single GPU machine with no monthly bill.

## The layers

The whole thing is four layers. Each one is its own service, all running on the same machine:

- **Inference layer:** an open-source inference engine running an open-weight 8B model. It's quantized to 8-bit so it fits on a single 16 GB consumer GPU.[^fit]
- **API serving layer:** a gateway that sits in front of the engine. It speaks the OpenAI API, hands out one key per engineer, and maps a friendly model alias to whatever the engine is actually running.
- **Hosting layer:** everything runs as containers from one definition file. A reverse proxy handles TLS with a cert from our own internal certificate authority. Only HTTPS to the proxy is forwarded in from the outside, so engineers can hit the endpoint from anywhere with a key. Everything else on the box stays on our private mesh network behind a firewall.
- **Observability layer:** the engine, the host, and the GPU all export metrics using a vendor-neutral telemetry standard. A collector gathers them and ships them to a small ingest service we wrote, which stores everything in a database and serves a dashboard.

## Design decisions

**Everything in containers.** We want a clean and repeatable way to run software without polluting the OS, so containers fit the job. One file contains all 8 services, wired together, and it restarts them if they crash or the box reboots.[^secrets]

**Engineers never talk to the engine directly.** The gateway is the only thing that knows the engine's password. There are three different keys in play: the engine's one password, an admin key that creates and revokes keys (never goes to an app), and the app keys that engineers actually use. Each app key has its own rate limit, budget, and model list.[^keys]

**Only the endpoint is public.** At first the proxy only listened on the private network address, so you had to be on the mesh to use it. My boss and I then set up port forwarding so the endpoint can be reached from outside, but only over HTTPS through the proxy, and only with a key. Everything else (SSH, the engine, the dashboard) still only answers on the private network, and the firewall's default deny backs that up. This is what makes "anyone with a key, nothing else exposed" actually true.

**Our own certificate authority.** One sentence version: we made a small internal CA and use it to sign the server's cert, so engineers trust the CA once and get warning-free HTTPS after that.[^ca]

**Size the model to the card.** We picked the biggest open-weight model that fits on the GPU with room left for the KV cache, then turned the engine's concurrency and context length down from the defaults to match.[^oom]

**Our own dashboard instead of an off-the-shelf stack.** We standardized on the telemetry standard with a dashboard we wrote ourselves. That way the metrics sit next to the gateway's usage data and we can show exactly what we want: request history per key, throughput, cache residency, GPU and host stats, and alerts.[^plumbing]

## Stuff I learned

- Check the secrets file with your own eyes. Most of my unauthorized errors traced back to one file that looked right and wasn't.
- The engine's defaults are written for datacenter GPUs. Out of memory on a consumer card usually means a concurrency default, not the model.
- Weights are only part of the memory budget. Context length and simultaneous requests take the rest.
- Security is layers. TLS, the firewall, the private network for everything that isn't the one endpoint, and per-person keys with their own rate limits and budgets each cover a gap the others leave.
- Pull keys out of the response, not the terminal. Copy-pasting cost me more keys than anything else.[^burned]
- Monitoring bugs are plumbing bugs. Every blank dashboard had a boring cause: wrong encoding, compressed payloads, a blocked port, a missing route.

## Still to do

- bring the stack up on boot
- nightly backup of the database, the secrets file, and the certs
- move the CA key off the server
- internal DNS record instead of hosts entries on every laptop
- load test and tune context length / per-key rate limits
- bigger models, which needs a bigger card

[^fit]: I ran into an issue where the full-precision model couldn't run because it needed about 16 GB for the weights alone (the whole card), so I downsized to the 8-bit quantized version (~9 GB) and it was able to run properly. This generation of GPU runs 8-bit natively.

[^secrets]: My first real bug was the secrets file. I wrapped the generator commands in a sudo wrapper with single quotes, so the commands didn't expand and the literal command text ended up in the file. That's what caused the unauthorized errors later: the containers got the literal string, while sourcing the file in my shell ran the command and made a different random key every time. Running it as a normal user (no sudo wrapper) fixed it.

[^keys]: I lost a couple of keys early on by copy-pasting them out of the terminal: they kept coming out one character short and the gateway said the key didn't exist. The gateway only stores a hash, so a lost key is gone. Pulling the key straight out of the JSON response fixed that.

[^ca]: For now I'm keeping the CA on the inference server itself. Before I sign certs for anything else, the CA key needs to move off the box to an admin machine (if the server ever gets compromised, whoever has that key can forge certs for the whole network).

[^oom]: It still OOM'd once more on startup after the model fit, because the engine warms up for 256 simultaneous requests by default, which is way more than a 16 GB card needs. Capping it at 32 and leaving a bit more GPU memory free fixed it. End result: about 36k tokens of context across requests.

[^plumbing]: Issues I hit getting data to flow, in order: the collector was sending a binary encoding the ingest service didn't expect, then it was gzipping payloads the ingest service wasn't decompressing, then the firewall's default deny was also blocking container-to-host traffic, then the proxy didn't have a route for the dashboard yet.

[^burned]: Anything I pasted into a chat or a ticket I treat as burned and delete.
