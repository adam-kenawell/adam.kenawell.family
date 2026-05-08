---
title: "From Pixel One: How I Built This Website"
date: 2026-05-07
excerpt: "The full story of how a data engineer with no web dev experience built a personal website from scratch using Astro, GitHub Pages, and a locally-hosted LLM."
categories: ["featured"]
---

If you told me a year ago that I'd be building a personal website from scratch, I probably would have laughed. I'm a data engineer. I write SQL and Python all day. HTML and CSS? That's a different department. But here we are, and I'm genuinely proud of how it turned out. Here's the full story.

## Why Build a Personal Site?

I'd been meaning to create a home base on the internet for a while. LinkedIn is great, but it's not *yours*. I wanted a place where I could share my projects, write about things I'm learning, and have a little fun with design. Something that felt like me.

## Choosing the Tech Stack

I didn't want to over-engineer this. I'm not building a SaaS product. I'm building a personal site that should load fast, look good, and be easy to maintain. Here's what I landed on:

### Astro v6

[Astro](https://docs.astro.build) is a static site builder that ships zero JavaScript by default. You write components (similar to React or Svelte), but the output is plain HTML and CSS. No client-side framework bloat. For a content-focused site like mine, it's perfect.

Key Astro features I'm using:

- **File-based routing** in `src/pages/`
- **Content collections** with a glob loader for blog posts written in Markdown
- **View Transitions** via `ClientRouter` for smooth page crossfades
- **Scoped styles** so CSS doesn't leak between components

### GitHub Pages

Hosting is free via GitHub Pages with a custom domain (`adam.kenawell.family`). Deployment is fully automated through GitHub Actions. I push to `main`, and within a couple minutes the site is live. No FTP, no server management, no cost.

### Node 22 + Volta

Astro v6 requires Node 22+, which I manage through Volta. This keeps my Node version pinned to the project so I don't have to think about it.

### Fusion Pixel Font

The typography is a pixel font called **Fusion Pixel 12px Proportional KR** from Fontsource. I originally used the monospaced variant, but switched to proportional for better readability on longer text. It gives the site that retro terminal aesthetic I was going for.

## The Design Philosophy

I wanted something that felt **playful but polished**. Here's the design system I landed on:

- **Background:** Dark charcoal (`#1a1a1a`), not pure black
- **Accent:** Yellow (`#f5d000`) for headers, borders, and interactive elements
- **Body text:** White (`rgba(255,255,255,0.85)`) for readability and contrast
- **Cards:** Semi-transparent backgrounds with yellow borders, box shadows, and a subtle lift on hover
- **Header:** Sticky with backdrop blur so content scrolls behind it

Every element has a purpose. No filler text, no stock images, no Lorem Ipsum. If it's on the page, it means something.

## The Secret Sauce: A Locally-Hosted LLM

Here's the part that makes this story a little different. I built the foundation of this site using **Openclaw**, running large language models locally on my Samsung Galaxy Book 4 Ultra (RTX 4070, 32GB RAM). No cloud APIs, no subscription fees. Just my laptop and an open-source AI stack.

I used locally-hosted models for:

- Scaffolding the initial project structure
- Writing component boilerplate
- Debugging CSS layout issues
- Generating sample content to test with

It's not perfect, and cloud-hosted models are definitely faster, but there's something satisfying about building a website with AI that's running on your own hardware.

## The Fun Stuff

### Animated Pokemon Sprites

The background of every page has animated Pokemon Mystery Dungeon sprites walking around. They're rendered on a canvas layer behind the content. Each sprite has a full state machine: walking, idling, sleeping (after inactivity), and attacking (when you click them). There's even a "Spawn" button in the corner where you can add specific Pokemon by Dex number.

This was by far the most complex feature and also the most fun to build.

### 100 Rotating Taglines

The landing page shows a random tagline each time you visit. There are 100 of them, ranging from sincere ("Faith, family, and a well-tuned SQL query") to silly ("the blog post is in another castle"). It's a small touch, but it makes the site feel alive.

### Blog Category Filters

The blog page has four filter tabs: Featured, Technical, Lifestyle, and Monthly Report. Right now the content is light, but the infrastructure is ready to scale as I write more.

## Deployment Workflow

The deployment process is simple:

1. Run `npm run dev` to start the local Astro dev server
2. Make changes and preview at `http://localhost:4321/`
3. When everything looks good, run `npx astro build` to verify
4. Push to `main` with `git add -A && git commit && git push`
5. GitHub Actions automatically builds and deploys to GitHub Pages
6. Site is live within 1-2 minutes

No staging environment, no complex CI/CD. For a personal site, this is exactly the right amount of process.

## What I Learned

Building this site taught me a few things:

1. **Web development is more accessible than I thought.** Coming from a data engineering background, I expected a steeper learning curve. Astro made it approachable.
2. **Design decisions compound.** Small choices (font, spacing, color palette) add up to create a cohesive feel. Getting the details right matters.
3. **Local LLMs are genuinely useful.** Not just as a novelty, but as a real productivity tool for development workflows.
4. **Ship it and iterate.** The site isn't finished (is any project ever?), but getting it live and improving incrementally is more satisfying than perfecting it in isolation.

## What's Next

I'm planning to keep building on this foundation. More blog posts, more projects, and maybe some interactive data visualizations. The infrastructure is solid, and the creative possibilities are wide open.

If you've made it this far, thanks for reading. And if you're thinking about building your own site, just start. You don't need to be a frontend developer. You just need curiosity and a willingness to learn.
