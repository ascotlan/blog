---
title: "Showing my work: the four artifacts behind an AI judge for generated courses (part 1)"
date: 2026-11-18
status: published
summary: "In October I said an AI deployment should come with four artifacts. Here are mine, from an AI judge I am building for generated courses."
tags: [evals, llm, agents, edtech]
sources:
  - {
      title: "Panickssery, Bowman and Feng, LLM Evaluators Recognize and Favor Their Own Generations (NeurIPS 2024)",
      url: "https://papers.nips.cc/paper_files/paper/2024/hash/7f1f0218e45f5414c79c0679633e47bc-Abstract-Conference.html",
    }
devto: true
---

In October I [argued](/posts/deployed-agent-engineer-evidence/) that, beyond a working system and its code, a deployed-agent engineer should be able to show four artifacts: a use-case memo, acceptance criteria, an evaluation harness and a rollback plan. I ended that post by saying I would hold myself to the same standard. This post is me doing that.

Since September I have been building an AI judge at Cocoa Classroom: a second model that reviews the courses the platform generates and records what it thinks is wrong. The judge is merged and switched on in shadow mode, but its accuracy has not been measured yet. It runs on our staging environment, where its findings are stored and nobody sees them, and annotate mode, which would show findings to teachers, is not built. So this is part 1. It publishes the targets before the results, and part 2 will report against them, pass or fail.

## The problem

Cocoa Classroom generates whole courses with AI: lessons, practice, quizzes, worksheets and visuals. A teacher approves each unit before it is published, but the automated checks only cover structure, such as counts, required fields, answer keys that agree with themselves, and simple arithmetic. Nothing in code checks whether what the AI wrote is true.

## Artifact 1: the use-case memo

The memo answers four questions: why this process, what it costs today, what success would mean, and what is deliberately left out. Its most useful decision was to start narrow, with two checks:

1. **The answer key is correct, for non-maths questions.** Maths already has an arithmetic check, and for anything beyond arithmetic, a deterministic checker should come before a model, because code is cheaper and more reliable.
2. **Each lesson teaches its unit's objectives.** The objectives are already part of the generation job, so this check needs no new data.

This first version does not certify that an entire course is factually correct. A lesson can teach its objectives and still contain a wrong fact. It targets two narrower problems that can be evaluated and measured.

The memo also says what the judge will not do: block or rewrite content. The judge annotates, and the teacher decides. It is honest about what was unknown, too. The rate of real errors of meaning had never been measured, and the memo says any figure before measuring it would be a guess.

## Artifact 2: acceptance criteria, fixed before the judge ran

I wrote the criteria before the judge had run once, and the document says so at the top. Any change before held-out scoring is recorded with its date and reason, and after held-out scoring the targets do not change.

The criteria start with definitions. A catch means the judge flags a real problem and names where it is; a false alarm is a finding on content that is correct. Every finding must state its location, the claim and the evidence. Because real wrong answers are probably rare, the set also includes seeded errors: for check 1, the mark is moved to a plausible wrong choice, and for check 2, a lesson is paired with the objectives of a different unit in the same subject, so the mismatch is a near miss rather than an obvious one.

| Target                                   | Check 1: answer keys  | Check 2: lessons and objectives |
| ---------------------------------------- | --------------------- | ------------------------------- |
| Problems caught                          | At least 34 of 40     | At least 24 of 30               |
| False alarms on correct items            | At most 5 of 120      | At most 3 of 60                 |
| Same verdict on each item when run twice | At least 90% of items | At least 90% of items           |
| Median judge cost per lesson             | At most $0.005        | At most $0.005                  |

The first three targets are measured on the held-out set; the cost target applies to every run. Run-to-run agreement is measured per item: the share of held-out items that get the same verdict, flagged or not flagged, in two separate runs. The counts come from 95% Wilson intervals rather than raw percentages, to reduce the chance of passing on an unusually favourable small sample. Thirty-four of 40 is the smallest count whose lower bound clears 70%, and five false alarms in 120 is the largest whose upper bound stays under 10%. False alarms are held tighter than misses on purpose: once teachers see findings, a judge that cries wolf gets ignored, while a missed error is no worse than today.

The criteria also measure the real error rate. At least 150 real generated questions are labelled, and if none of them is wrong, the 95% upper bound on the true rate is 2.5%. In that case, check 1 matters mainly as a safety net, and I would rather know that than assume the judge is catching a common problem.

## The working system so far

The code went in as small, reviewable pull requests. I wrote a detailed specification for each one, pointing back to the design documents, and built them with an AI coding agent.

- **The validation loop.** Before touching anything, I added tests that pin today's retry behaviour for worksheets and practice questions. Only then did I extract one shared validation loop: generate, run the code checks, and retry with feedback.
- **The judge, in shadow mode.** The two checks run during course generation. Lesson and question text is sent to the judge as untrusted data, never as instructions. To keep costs in cents, the judge makes one call per quiz for check 1 and one per unit for check 2, and returns structured findings. In shadow mode the findings are stored but never shown to teachers, and the judge can never fail a generation: if it errors or times out, generation carries on.
- **A read-only report.** An admin-only report shows the findings, timing and cost per lesson against the $0.005 target, and it can export a random sample of findings for labelling.

## Artifact 3: the evaluation harness

The evaluation set builder generates courses the way production does, then writes label sheets and review files for people to label. My first run was a useful failure: every non-maths quiz failed, because the builder was missing part of the setup that real course generation has. An evaluation set is only as good as its resemblance to production, and the fix was to configure the builder the way a teacher sets up a course.

The second run produced 239 quiz questions and 108 lessons from 10 courses, for about $0.40 of AI calls. A teacher is labelling them with a written labelling guide and a simple click-to-label web page, because a teacher's judgement is closer to that of the teachers who will eventually see the findings. A second labeller will label a random 20% blind, and agreement must reach 90% for check 1 and 80% for check 2, counting an ambiguous label against any other as a disagreement. If a check falls short, its definition is too loose: the labellers review the disagreements together, tighten the definition, relabel that check and draw a fresh sample. No scoring happens until both checks pass, and no label changes after its labeller has seen the judge's finding. Even so, agreement on a 20% sample is preliminary, especially for the more subjective lesson check.

The rule for splitting is fixed in advance, but the split itself happens after labelling: whole courses go to a working half or a held-out half, so no course contributes items to both, and then the known errors are seeded. I tune the judge's prompts on the working half only. The held-out half is scored once per judge version, and if a version fails and is changed, a fresh held-out sample is drawn, because the old one is spent.

## Artifact 4: the rollback plan

The judge has three modes, set in configuration: off, shadow, and annotate, which is not built yet and will show findings to teachers as warnings they can acknowledge. There is one setting for the whole judge and one for each check, and the overall setting wins. The judge reads its settings each time it runs, so rolling back is always a configuration change, never a code deploy or a data fix.

[![Diagram of course generation with the judge running beside it in shadow mode. Each unit goes through generate, code checks and retry with feedback, then into the draft that a teacher reviews and publishes. A copy of each finished unit goes to the judge, which runs check 1 on answer keys and check 2 on lessons and objectives. Its findings go to a findings store and a read-only admin report, and are not shown to teachers or learners yet. If the judge errors or times out, generation carries on. A mode setting switches the judge between off, shadow and, later, annotate.](/images/ai-judge/shadow-mode.png)](/images/ai-judge/shadow-mode.png)
_Figure 1. The judge in shadow mode: it sees everything the generator produces, and nothing it says reaches a teacher or learner yet._

The plan lists its triggers in advance, and any single one is enough to step back without debate:

- The judge causes a generation failure or slows generation noticeably: off, the same day.
- A finding reaches a learner or contains personal data: off, the same day.
- A teacher reports that a wrong finding led them to change correct content: that check goes back to shadow.
- Too many false alarms in a weekly sample of 30 shown findings (7 or more for check 1, 9 or more for check 2): that check goes back to shadow. Those counts are the points where the sample shows, with 95% confidence, that the false-alarm rate is above target.
- The median cost per lesson is above target for a week: back to shadow.
- The judge's model or prompt changes, including a change made by the AI provider: every check goes back to shadow, and the new version needs a fresh held-out sample.

The same thinking runs through my [post on securing agents](/posts/securing-agents-in-your-infrastructure/): the off switch belongs outside the system it controls, and nobody should have to argue for it under pressure.

## What I am still unsure about

Seeded errors may be easier to catch than real ones, so the two are reported separately, and if real errors are caught clearly less often, the seeds are too easy and I will say so. I also want to test whether a judge from the same model family as the generator is too generous to its output: [research](https://papers.nips.cc/paper_files/paper/2024/hash/7f1f0218e45f5414c79c0679633e47bc-Abstract-Conference.html) has found that LLM evaluators can recognize and favour their own generations. And the labels rest on one teacher plus a 20% second opinion, which is a small base for a judgement that will shape what other teachers see.

## What part 2 will report

Before the end of November I will use the admin report to check shadow mode on staging: no failures caused by the judge, and cost within target. After labelling, I will score the held-out set and report each check in the same format, pass or fail, with intervals, seeded and real results shown separately, and examples of misses and false alarms. Whether teachers start seeing a check's findings is then a product decision, made one check at a time.

## The takeaway

Writing the four artifacts before the judge existed took decisions away from the results. The targets, the definitions, the rule for the held-out split and the rollback triggers were all fixed while I still had no idea how the judge would perform, so part 2 cannot quietly move the goalposts.

It also keeps three claims apart that AI projects often blur. The system works: it runs, records findings and does not interfere with course generation. The system is accurate: its findings meet targets set in advance. The system is safe to show to users: its behaviour and the quality of its warnings justify putting them in front of teachers. The first is built and tested, and staging will confirm it this month. The second is what part 2 measures. The third waits for both.

If you run an LLM judge in production, what made you trust it enough to let people see its findings?
