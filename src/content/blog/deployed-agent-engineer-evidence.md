---
title: "Badge or evidence: what a deployed-agent engineer should be able to show"
date: 2026-10-09
status: published
summary: "Anthropic plans to certify 10,000 Frontier Deployed Engineers. What Canadian FDE postings already ask for, and the evidence to build now."
tags: [agents, careers, canada, evals]
sources:
  - {
      title: "Anthropic, Claude Frontier Academy",
      url: "https://www.anthropic.com/news/claude-frontier-academy",
    }
  - {
      title: "Anthropic, Barclays scales Claude",
      url: "https://www.anthropic.com/news/barclays-scales-claude",
    }
  - {
      title: "Forbes, Palantir and forward deployed engineering: what should we believe?",
      url: "https://www.forbes.com/sites/stevebanker/2026/07/10/palantir-and-forward-deployed-engineering-what-should-we-believe/",
    }
  - {
      title: "Huron, Forward Deployed Engineer (AI Capability Center) - CANADA",
      url: "https://huron.wd1.myworkdayjobs.com/huroncareers/job/Toronto---55-University-Ave/Forward-Deployed-Engineer--AI-Capability-Center----CANADA_JR-0016659",
    }
  - {
      title: "Calliere, Forward Deployed Engineer, AI and Automation",
      url: "https://callieregroup.zohorecruit.com/jobs/Careers/531753000017308024/Forward-Deployed-Engineer-AI-and-Automation",
    }
  - {
      title: "Experience Bold AI, Forward Deployed Engineer (LinkedIn)",
      url: "https://ca.linkedin.com/jobs/view/forward-deployed-engineer-at-experience-bold-ai-4443024156",
    }
  - {
      title: "STAN AI, Forward Deployed Engineer (LinkedIn)",
      url: "https://ca.linkedin.com/jobs/view/forward-deployed-engineer-at-stan-ai-4468988190",
    }
devto: true
---

On October 2, Anthropic announced [Claude Frontier Academy](https://www.anthropic.com/news/claude-frontier-academy), a $100 million commitment to train 10,000 "Frontier Deployed Engineers" by the end of 2027. A day earlier, it published a [case study](https://www.anthropic.com/news/barclays-scales-claude) on Barclays' rollout of Claude. Read together, the two announcements show a vendor putting its own definition and credential around the increasingly prominent forward-deployed engineering role, alongside a customer story rich in deployment scale but sparse on measured outcomes.

That combination raises a practical question for anyone hiring or job hunting in Canada. When a company needs someone to put AI agents to work inside its operations, what should that person be able to show? Beyond the working system and its code, my answer is four concrete artifacts: a use-case memo, acceptance criteria, an evaluation harness and a rollback plan.

A credential tells you that a candidate passed someone else's assessment. A portfolio lets you inspect how they select a problem, define correctness, build and evaluate the system, and decide when it is safe to keep running. Canadian candidates do not need to wait for access to Anthropic's program to start producing that evidence.

## What Anthropic announced

Anthropic frames the Academy as an answer to "one of the most pressing issues in AI implementation: talent." Its first program is a residency for "hands-on software engineers with strong fundamentals." Entry is by nomination: "Organizations nominate their strongest engineers, each arriving with a named Claude project to lead when they return." Those who pass a multi-day, in-person program earn a Claude Resident Engineer badge and move into a 12-week residency, leading a real project at their own organization, and are assessed again before earning the Claude Frontier Deployed Engineer badge. Anthropic expects the first of those badges in early 2027.

The first cohorts come from Accenture, Bain, Capgemini, Commonwealth Bank of Australia, Deloitte, McKinsey, Morgan Stanley, Novo Nordisk and others, with programs in San Francisco, New York and London. The announcement does not name a Canadian organization or location.

The design deserves credit. Anthropic says the residency "follows the medical model for building expertise," and the curriculum is practical: trainees "work through a simulated enterprise deployment, from the right use case through security review to handover," and finish with "a graded practical on a new scenario." The title itself borrows from the forward deployed engineer (FDE), a role that a [Forbes analysis](https://www.forbes.com/sites/stevebanker/2026/07/10/palantir-and-forward-deployed-engineering-what-should-we-believe/) describes as "a software engineer who works on-site to solve complex, real-world problems."

## What the Barclays story measures

The Barclays post is full of scale. More than 16,000 colleagues have adopted an internal knowledge assistant, which "has handled over one million searches." An email platform "processes approximately 120,000 emails each day." Barclays expects Claude Code to reach half of its developers by the end of 2026 and a majority of its software engineers in 2027.

What the post does not report is a measured outcome. There is no accuracy figure, no error rate, and no time saved; the closest it comes is "faster access to information and quicker support for customers." That is not a criticism of Barclays, which may well measure these things internally, and a vendor case study is written to promote the product. It does, however, illustrate what adoption numbers alone cannot tell a hiring manager: whether the deployed system actually improved the process, by how much, and how its failures are detected.

## What Canadian employers are already asking FDEs to do

Anthropic's title has not reached Canadian job postings yet, but the role it borrows from has. On October 9, I read four FDE postings open in Canada: one at a consultancy, one for a manufacturer, one at an AI integration firm and one at an AI software company.

**Huron, Toronto (remote).** [Huron's posting](https://huron.wd1.myworkdayjobs.com/huroncareers/job/Toronto---55-University-Ave/Forward-Deployed-Engineer--AI-Capability-Center----CANADA_JR-0016659) puts the engineer in a pod with a solution architect and an engagement manager, so the seat is focused on building. The responsibilities are short and direct: build full-stack features on AWS and Azure "using Claude and other models," sit with the business day to day, and keep quality up with "tests and evaluations on everything that ships." Its preferred qualifications include exposure to "eval-driven pipelines."

**A Canadian manufacturer, Montréal region (on-site).** The most explicit of the four is a [posting by the recruiter Calliere](https://callieregroup.zohorecruit.com/jobs/Careers/531753000017308024/Forward-Deployed-Engineer-AI-and-Automation) for "an established Canadian manufacturer." The engineer takes work "from first conversation through to design, build, launch and adoption," turning unclear processes into "concrete requirements, measurable goals" and production software. The engineer must also "own what you ship," which the posting spells out as testing, access control, monitoring, documentation, training and support. In the first three months, the role is expected to produce a ranked roadmap with starting metrics, launch at least two tools that people use and that measurably improve results or turnaround time, and put testing and rollback in place. The requirements ask for experience putting AI into a live business process, "including how you measured quality and handled mistakes." Even part of the pay depends on evidence: the base salary comes with "a performance incentive tied to the measurable business results of your work."

**Experience Bold AI, Toronto (hybrid).** [Bold AI's posting](https://ca.linkedin.com/jobs/view/forward-deployed-engineer-at-experience-bold-ai-4443024156) describes an engineer sent into client businesses to build production systems rather than demos. The engineer turns a loosely defined brief into a scoped plan within the first week, then has to "deploy to production and stand behind it." The posting is blunt about what counts: "Monitoring, error handling, rollback plans, and runbooks are part of the deliverable, not extras." The handoff ends with "a named client-side owner who can run what you built," and the interview includes "a deep walkthrough of one production system you shipped: decisions, failures, fixes."

**STAN, North York.** [STAN's posting](https://ca.linkedin.com/jobs/view/forward-deployed-engineer-at-stan-ai-4468988190), for a company that builds AI for condominium and HOA property managers, puts quality monitoring at the centre of the role. The engineer owns "the technical health of your deployments end to end," and "when the AI gets something wrong, you find out why." The tasks include reviewing voice and chat logs for failure patterns and analyzing outcomes such as "resolution rates, escalation rates, ticket quality," then turning the findings into decision-ready reports for customers.

Put side by side, the four postings describe the same job in different industries. Each one expects a working system in production, not a demo. Beyond that, they ask for the things the Barclays post leaves out: choosing the problem (Calliere's ranked roadmap, Bold AI's scoped plan), defining what good looks like (Calliere's measurable goals), testing and evaluating what ships (Huron's tests and evaluations, STAN's reviews of failure patterns), and recovering when it goes wrong (Calliere's and Bold AI's rollback, Bold AI's runbooks). None of them mentions Anthropic's program. The only credentials any of them names are Huron's AWS and Azure AI certifications, listed as preferred qualifications rather than requirements.

## Four artifacts I would ask for

A working system comes first, and the postings above already ask for one. Alongside it, I would ask to see four artifacts. Each one is something a candidate can produce on their own, in public, without access to a vendor's program.

1. **A use-case selection memo.** One page explaining why this process, what it costs today (volume, error rate, time spent), what success would mean, and what was deliberately left out. Anthropic's own curriculum starts with "the right use case," and for good reason: a well-built agent on the wrong task still fails the business.
2. **Acceptance criteria.** Testable statements of what a correct result looks like, written before the agent runs. My [first post](/posts/dots-need-acceptance-criteria/) worked through an example for an invoice follow-up agent.
3. **An evaluation harness.** A labelled set of test cases, scored automatically where possible, with any LLM judge checked against human labels before it is trusted. It should report both kinds of failure: actions the agent should not have taken, and valid work it wrongly refused.
4. **A rollback plan.** What evidence widens the agent's autonomy, what failure withdraws it, who decides, and how the agent is switched off. My [last post](/posts/securing-agents-in-your-infrastructure/) argued that the monitor and the off switch belong outside the agent's reach.

These overlap with Anthropic's own sequence of use case, security review and handover, and with what the four postings ask for, which tells me the vendor, these employers and I largely agree on what the job is. The difference is who gets to inspect the evidence. A badge tells a hiring manager that someone passed an assessment that Anthropic designed and graded. The artifacts let the hiring manager see how that person thinks, and they give the interview something specific to argue about.

## Why the portfolio matters for Canadian candidates

Three things make a public portfolio the practical choice for Canadian candidates right now. The first is access. Most Canadian developers cannot independently pursue this credential: participation is by employer nomination, the initial cohorts are concentrated among large organizations, and the current program locations are outside Canada. The first full badges are not expected until 2027. The second is portability: the residency is built around Claude, while Canadian employers work with several model vendors, and a memo, a set of criteria and a working harness transfer across all of them. The third is visibility: a portfolio can be read before the first interview, by anyone, without taking the candidate's word for it.

None of this makes the badge worthless. A badge is third-party evidence that someone passed a demanding assessment. A portfolio lets the employer inspect the evidence themselves. The two are different signals, and if an employer offered me a nomination, I would take it. The strongest candidate will eventually have both. Until then, my advice is simple: do not wait for access to the credential. Build evidence of the same capabilities now.

## What I am still unsure about

I do not know whether Canadian employers will come to treat this badge as a hiring signal. Several of the first-cohort firms are large consultancies, and if they start staffing Canadian projects with certified engineers, the badge could become an expectation faster than I assume. Huron already lists cloud vendors' AI certifications as preferred qualifications, so vendor credentials clearly have some place in Canadian hiring. My evidence is also thin: four postings, read on one day, and a job posting describes what an employer hopes for rather than what the work turns out to be. Canadian postings that list the Frontier Deployed Engineer badge as a requirement, or a larger sample of deployment roles tracked over several months, would change my view.

## The takeaway

If you are hiring for this role in Canada, ask for the memo, the criteria, the harness and the rollback plan, and read them before the interview. If you want the role, build them in public. I do not have this badge, and because entry is by employer nomination, I could not apply for it on my own. What I can do is make each post on this blog add one of these artifacts, which is the standard I am trying to hold myself to.

Hiring managers: what is the first thing you would ask a deployed-agent engineer to show you?
