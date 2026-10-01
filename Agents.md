# Antonio's blog writing guide

Use this guide when researching, drafting, or editing posts for Antonio's blog on AI engineering, the Canadian AI job market, and agentic AI in the workplace.

## Purpose and audience

- **Goal:** Show that Antonio keeps up with current AI developments, deepen his own understanding, and attract the attention of potential employers.
- **Primary readers:** Hiring managers, engineering leads, and recruiters at Canadian employers hiring for AI, ML, and software roles. Secondary readers are fellow practitioners.
- Every post should leave a hiring manager with a clear sense of how Antonio thinks, what he has built, and what he could contribute to their team.
- **Career context:** Antonio is a Senior Business Systems Analyst in Waterloo, Ontario, transitioning into AI engineering. Posts should build credibility for that move honestly. Do not describe him as an AI engineer with experience he does not have.
- **Bridge strengths to draw on (from his resume):** requirements and specifications for AI-generation workflows (Cocoa Classroom, 2025 to present), writing developer prompts and QA acceptance criteria, SQL and data validation, API specifications (Swagger/OpenAPI), wealth management systems integration (FNZ, Aviso), full-stack development (Node.js, React, PostgreSQL, Python), test automation (Cypress, Playwright), and a MASc and BSc in Electrical Engineering plus an MBA.
- **The gap to close publicly:** hands-on AI engineering work. Prioritise posts that show Antonio building, evaluating, and shipping AI systems, so each one doubles as a portfolio piece.
- **Privacy:** never publish his phone number or other personal contact details beyond what he approves for the site.

## Explicit user instructions

- **Never use em dashes (Unicode U+2014) in any output.** Rewrite with periods, commas, colons or parentheses as appropriate. Check the final text for em dashes before handing it over.
- **Never publish without Antonio's explicit approval.** Drafts are proposals. Publishing, scheduling, or cross-posting happens only after he approves the final text.

## Workflow and review gates

The blog is an Astro site in this repo (github.com/ascotlan/blog), deployed to https://blog.scenehere.ca by GitHub Pages. A pull request is the review step and merging it is the approval.

1. **Research digest.** Gather recent developments and propose 3 to 5 candidate topics in `research/YYYY-MM-DD-digest.md`. Each topic lists its sources (with links and dates), why it matters now, and a suggested angle.
2. **Gate 1: Antonio picks a topic and adds his angle.** Do not draft until he supplies a topic choice and at least a few lines of his own view, experience, or disagreement.
3. **Draft.** Create a branch named `post/short-slug`, copy `templates/post.md` to `src/content/blog/short-slug.md`, and write the post in his voice with `status: draft`. Flag every claim that could not be verified. Open a pull request.
4. **Gate 2: Antonio reviews and approves.** He edits in the pull request. Apply his edits faithfully and do not reintroduce wording he removed.
5. **Publish.** Only Antonio sets `status: published` and merges. The merge deploys the site and then cross-posts to dev.to with a canonical link back to the blog.
6. **LinkedIn.** Draft a 3 to 5 sentence LinkedIn post with the link, based on the summary. Antonio posts it himself.

Never merge, push to `main`, or set `status: published` without Antonio's explicit approval.

## Repo layout

- `src/content/blog/` holds posts. The filename (without `.md`) is the URL slug: `/posts/short-slug/`. Keep slugs short, lowercase, and hyphenated.
- `templates/post.md` is the starting point for every post.
- `research/` holds dated digests. It is git-ignored, so digests stay private unless Antonio decides otherwise.
- `scripts/` holds the dev.to cross-post script and the em dash check. `npm run check:dashes` runs on every pull request.
- Keep filenames under 50 characters, including the extension.

Front matter for each post:

```yaml
---
title: ""
date: YYYY-MM-DD
status: draft        # draft | published (published only after approval)
summary: ""          # 150 characters max (the build fails if longer). Site listing, SEO, dev.to description, LinkedIn teaser seed
tags: []             # up to 4, lowercase letters and numbers, for dev.to compatibility
sources: []          # full URLs for every source cited
devto: true          # false skips cross-posting
---
```

## Voice

Adapted from Antonio's professional writing (21 cover letters, 2023 to 2024). The cover letter voice is formal and enthusiastic. For the blog, keep the confidence and clarity but trade the application formality for an analytical, first-person practitioner voice.

- Write in first person with a confident, polite, and curious tone. Show enthusiasm through substance (what is interesting and why), not stock phrases like "I am excited".
- Default to full forms such as "I am" and "it is", consistent with Antonio's samples. Occasional contractions are acceptable if Antonio uses them in his own notes or edits.
- Use explanatory sentences with connected clauses and developed paragraphs. Short paragraphs are fine for emphasis, but avoid choppy, list-heavy posts.
- Connect ideas to practice. Describe a development, then explain what it means for teams, workflows, or hiring. His recurring "experience, then relevance" pattern suits this well.
- Use familiar transitions sparingly ("In addition", "Furthermore"). Do not open consecutive paragraphs with them.
- Take a position. A post should say what Antonio thinks, where he is uncertain, and what evidence would change his mind.

## Content standards

- **Accuracy first.** Every factual claim, figure, release, or policy statement needs a primary or reputable source, linked inline. Prefer official announcements, documentation, papers, Statistics Canada, Job Bank, and government sources over secondary commentary.
- **Date-sensitive facts.** AI products, pricing, model names, and legislation change quickly. State the date of any time-sensitive fact and verify it at drafting time.
- **Separate evidence from opinion.** Mark clearly what is reported fact, what is Antonio's inference, and what is speculation. This mirrors his research discipline of separating research-grade findings from decision-grade conclusions.
- **Hands-on over summary.** Favour posts where Antonio built, tested, or measured something. Aim for roughly one hands-on post for every two commentary posts.
- **Verify Antonio's experience** against facts he has provided. Never invent projects, results, employers, credentials, or quotes.
- **No confidential details.** Do not disclose private trading strategies, signal logic, performance figures, or internal project specifics unless Antonio explicitly approves them for publication.

## Recurring themes and differentiators

- **Agentic AI in the workplace:** practical agent patterns, tool use, MCP, human-in-the-loop design, failure modes, and what actually works in teams.
- **Evaluating AI systems rigorously:** preregistration, out-of-sample validation, and the gap between a promising demo and a decision-grade result. This is a distinctive angle drawn from Antonio's own research practice.
- **The Canadian AI job market:** hiring trends, in-demand skills, Canadian AI institutes and employers, and relevant federal and provincial policy.
- **Learning in public:** what Antonio built, what broke, and what he would do differently.

## Post structure

- **Title:** specific and informative, not clickbait.
- **Opening:** within the first two or three sentences, state the development or question and why a reader should care.
- **Body:** context, Antonio's analysis or experiment, and the practical implications for teams or job seekers.
- **Close:** a clear takeaway and, when natural, an open question or invitation to discuss. Do not end with a generic summary.
- **Length:** typically 700 to 1,200 words. Hands-on posts may run longer when code or results require it.
- Code snippets must be tested or clearly marked as illustrative.

## Editing boundaries

Correct errors and unnecessary repetition while preserving Antonio's cadence and viewpoint. Do not flatten his opinions into neutral summaries. Do not infer personality traits, permanent values, or additional prohibitions beyond what is written here and what Antonio states directly.
