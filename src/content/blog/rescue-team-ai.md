---
title: "Rescue Team AI: Gamified Agentic Orchestration"
date: 2026-05-11
excerpt: "I'm building a multi-agent AI orchestrator that looks like Pokemon Mystery Dungeon. Here's why, how, and when."
categories: ["featured", "technical"]
---

I'm an agentic nerd. I'm also a Pokemon nerd. Naturally, the only logical thing to do is smash them together and see what happens.

Rescue Team AI is my next big side project. The idea is simple on the surface: take the boring, invisible process of multi-agent AI orchestration and make it something you can actually *watch*. Specifically, make it look like Pokemon Mystery Dungeon. Your AI agents are Pokemon stationed at shops in a 2D market town. You chat with your team leader, and it physically walks across the map to delegate tasks to specialist agents. It's agentic AI with a personality.

Pokemon nerd not required for use. But it helps.

## Why This Exists

I've been working with agentic AI workflows at Ford for a while now, and the tooling is powerful but deeply unsexy. You fire off a prompt, stare at terminal logs, and hope for the best. There's no visual feedback loop, no sense of what's happening under the hood. I kept thinking about how much more engaging it would be if you could *see* the orchestration happening in real time.

Then I remembered that Pokemon Mystery Dungeon exists. A game built entirely around the concept of assembling a team, assigning roles, and sending them on missions. The parallels practically wrote themselves.

## The Stack

This project is intentionally multi-disciplinary, which is part of the fun:

- **AI Engine**: Python with Pydantic AI, model-agnostic support for Anthropic, OpenAI, and Gemini
- **Backend**: Django with SQLite for agent memory, state tracking, and team configs
- **State Management**: HTMX for async polling so you can see when an agent is "thinking"
- **Game Engine**: TypeScript and vanilla JS driving a 2D Canvas with static PNG backgrounds and sprite walking animations
- **Hosting**: Digital Ocean Droplet running the full DOSH stack (Django, SQLite, HTMX, Docker)

Everything runs locally on the user's machine. Agents interact with your file system, navigate cloned Git repos, and execute terminal commands. No cloud dependency for the core workflow.

## The Architecture

The routing model is what I'm calling "Supervisor Routing." You only ever talk to one agent, the team leader. Think of it like a project manager who knows which specialist to consult for any given task. When you send a prompt, the leader evaluates it, picks the right sub-agent, and walks over to their shop on the map. You watch this happen in real time on the canvas.

Each sub-agent has its own tools, its own memory context, and its own specialty. The orchestrator summarizes the conversation so far, hands off relevant context, and waits for a response. Then it walks back to you with the answer. All of this state is managed through HTMX polling, so the UI stays responsive without WebSockets.

## The Timeline

I'm working this at about 5 to 6 hours per week, so the timeline is realistic rather than aggressive:

- **Month 1**: Backend infrastructure. SQLite setup, Pydantic AI orchestration, and basic local git tools.
- **Month 2**: Frontend foundations. Django server, HTMX polling, static map rendering, and the live landing page.
- **Month 3**: Visual logic. TypeScript sprite animations and the market routing behavior where agents actually walk around.
- **Month 4**: MVP polish. Refine the chat interface, squash bugs, and ship it.

After the MVP, Phase 2 gets into the really interesting territory: custom skill ingestion (write your own Python tools and load them in), GitHub PR integration (agents generate PR links for you to approve), and cross-agent memory optimization.

## Follow Along

This project is being built in the open. If you want to follow the progress, you've got two options:

1. **Star the repo**: [github.com/adam-kenawell/rescue-team-ai](https://github.com/adam-kenawell/rescue-team-ai). You'll get notifications on new releases and activity.
2. **Subscribe to the RSS feed**: This blog has an [RSS feed](/rss.xml) and I'll be posting changelog updates here as major milestones land.

Either way, you'll see it when something ships. And something *will* ship. I've got four months of weekends mapped out and a very stubborn disposition.

Let's go rescue some code.
