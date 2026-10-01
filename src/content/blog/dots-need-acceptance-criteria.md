---
title: "OpenAI's dots need acceptance criteria, not just Custom Rules"
date: 2026-09-30
status: published
summary: "OpenAI's new always-on agents come with Custom Rules that say what a dot may do. They do not say what a good result looks like. A systems analyst's case for earning agent autonomy through evidence against acceptance criteria."
tags: [agents, evals, openai, workflows]
sources:
  - { title: "OpenAI, Introducing dots", url: "https://openai.com/index/introducing-dots/" }
  - { title: "OpenAI Help Center, Getting started with your dot", url: "https://help.openai.com/en/articles/20001530-getting-started-with-your-dot" }
  - { title: "BetaNews, OpenAI launches dots, always-on ChatGPT agents with their own computers", url: "https://betanews.com/article/openai-dots-agents-chatgpt/" }
  - { title: "Android Authority, OpenAI cancels GPT-6.1 Astra", url: "https://www.androidauthority.com/open-ai-gpt-6-1-astra-canceled-security-concerns-3716551/" }
devto: true
---

On September 29, OpenAI introduced dots: always-on agents, powered by GPT-6 Astra, that keep working on your goals after you close the chat. Most of the coverage focused on the capability list and the plush, colourful avatars. The part that caught my attention was a settings screen called Custom Rules, because it is the closest thing in the product to a requirements document.

Reading it as a business systems analyst, I came away with one conclusion. Custom Rules describe permissions, not outcomes. They say what a dot may do; they do not say what a good result looks like. My argument in this post is that agent autonomy should be earned through evidence against acceptance criteria, and that writing those criteria is the real work of putting an agent to work.

## What OpenAI shipped

According to [OpenAI's announcement](https://openai.com/index/introducing-dots/), each dot has its own cloud computer and browser, can work toward your goals around the clock while you are offline, connects to more than 4,000 apps, and learns your preferences over time. You can reach it in ChatGPT, Slack, or Teams.

The control model has several layers. Dots start with built-in rules for when to act alone and when to ask. On top of those, OpenAI says, "Custom Rules let you allow specific actions, require approval, or block them." An auto-review step checks actions that could affect your accounts or share information "against your instructions, Custom Rules, and safety requirements." Password changes always stay with the user, and proactive background research is limited to read-only tools that cannot send messages, change app content, or control your computer.

For organizations, OpenAI describes "specialist dots" with their own identities and credentials, governed through Microsoft's Agent 365. The sentence I would underline is this one: "Our engineering teams will work directly with organizations to define each dot's responsibilities, the tools it can use, and how people review and approve its work." That is a requirements engagement, described in OpenAI's own words: responsibility, capability, authorization, exception handling, and human approval.

It is also a signal about where the work is moving. More capable agents do not remove the need for requirements. They raise the cost of ambiguous ones, because the system can now act on the ambiguity instead of waiting for someone to ask what you meant.

On availability, [OpenAI's help centre](https://help.openai.com/en/articles/20001530-getting-started-with-your-dot) says dots are rolling out to ChatGPT Pro users in markets outside the EEA, Switzerland, and the UK, to Business Premium users in all supported regions, and to Enterprise workspaces as a beta that admins can enable. Canada is not on the exclusion list.

## Why the timing matters

The launch came one day after OpenAI cancelled the release of GPT-6.1 Astra. As [reported by Android Authority](https://www.androidauthority.com/open-ai-gpt-6-1-astra-canceled-security-concerns-3716551/), citing the Wall Street Journal, safety testing found that the model did not follow its operators' instructions closely enough, tried to hide what it had and had not done, and took actions beyond its assignment without asking.

I do not read that as a reason to avoid agents. I read it as three different requirements failures: scope that was violated, actions taken without the required authorization, and unreliable evidence about what the system actually did. Custom Rules address part of that problem by constraining scope and authorization. Acceptance criteria and auditable evidence have to address the rest.

## Permissions are not outcomes

The [help centre](https://help.openai.com/en/articles/20001530-getting-started-with-your-dot) lists four behaviours you can assign to an action, and each one maps onto a familiar requirement type:

| Custom Rules behaviour | Requirement it expresses |
| --- | --- |
| Take action without asking | Pre-authorized scope: the agent owns this step |
| Take action if pre-approved | Conditional authorization: only when I explicitly requested it |
| Ask before taking action | An approval gate with a named reviewer |
| Hand off to you | A human-owned step in the process |

The announcement also says actions can be blocked entirely, which is the negative requirement every specification needs: this must never happen.

All of these are authorization rules. A rule can say that a dot may draft a follow-up email. It cannot say whether the email went to the right client, referenced the right invoice, or used the right tone. That second half is what acceptance criteria are for, and I did not find a place to write them in the announcement or the help article.

In my own work on AI-generation workflows, the most useful line I have learned to draw is the one between a successful model call and a successful outcome. A provider can return a well-formed response that passes every technical check and still fail the requirement it was meant to satisfy. My criteria now state the expected output format, the validation rules a response must pass, and the tests that decide whether it counts as done, rather than treating "the model responded" as "the work is complete." Agents raise the stakes on exactly that distinction: "the agent was allowed to do it" is not the same as "the result met the requirement."

## How I would specify a dot before trusting it

One of the launch examples is a dot that notices unsent invoices. Here is how I would specify that responsibility before switching it on, written the way I would hand it to a delivery team:

```text title="invoice-follow-up-dot.txt"
Responsibility: follow up on invoices more than 14 days overdue.

Permissions
  Take action without asking:  read invoices and client contacts
  Ask before taking action:    send any email to a client
  Hand off to me:              disputes, partial payments, anything over $5,000
  Block:                       changing payment details, issuing credits

Acceptance criteria
  Given an invoice 15 days overdue with no reply on record,
  when the dot drafts a follow-up,
  then the draft names the correct client, invoice number, amount and due date,
  and it waits for my approval before sending.

  Given a client who has replied in the last 7 days,
  when the invoice becomes overdue,
  then the dot does not send a reminder and flags the thread for me.

Evidence before widening authority
  Week 1: review every drafted email against the criteria above.
  Move "send email" to "Take action without asking" only after
  20 consecutive drafts that meet every criterion.

Rollback
  If any autonomous email has the wrong client, invoice, amount or due date,
  return "send email" to "Ask before taking action" until the failure is reviewed.
```

None of this is exotic. It is a user story with acceptance criteria, an explicit rule for earning more autonomy, and an explicit rule for losing it. Put together, it is an operating model rather than a one-time setup:

**Responsibility → permissions → acceptance criteria → evidence → autonomy → regression monitoring → rollback.**

The last two steps matter more for agents than for ordinary software. OpenAI's own help article says a dot "can make mistakes, including when following your rules." A dot that learns from feedback is also, by design, a system whose behaviour changes after you approved it. That turns acceptance criteria into a regression suite, not a sign-off.

## What I am still unsure about

I have not used dots yet, so this is a reading of the announcement and documentation, not a field report. Three things I would want to know before recommending them to a team:

- **How auto-review decides.** OpenAI describes what it checks, not how. If a model is reviewing another model's actions, I would want to see its error rate.
- **What the activity record captures.** An acceptance criterion is only testable if the log shows inputs, actions, and outcomes in enough detail to audit.
- **What learning is allowed to change.** The help article says a dot can create its own memories, including from connected apps. I want to know whether that learning can ever widen what it does without a rule changing.

That last question deserves a principle of its own: learning should be able to change how an agent performs an authorized responsibility, but never what responsibilities it is authorized to assume. Evidence on any of these points would change my view, in either direction.

## The takeaway

Custom Rules are a good start, and they are the right place to draw boundaries. They are not where you define success. Before you give an always-on agent standing access to your work, write down what a correct result looks like, what evidence proves it, and what failure takes autonomy away. If you cannot define all three, the responsibility is not ready to delegate, whichever vendor you choose.

That is also why I think systems analysis becomes more relevant in an agentic world, not less. The agent can increasingly do the work. Someone still has to specify the boundaries, define correctness, decide what counts as evidence, and judge when the system has earned the right to act unsupervised.

If you are piloting agents at work, what is the first responsibility you would trust one with, and what would it have to prove first?
