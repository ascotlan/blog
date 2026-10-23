---
title: "PHP2Shell and the smarter-attacker test: which defences still hold when AI finds the bugs"
date: 2026-10-23
status: published
summary: "AI-assisted research found two critical PHP flaws. Which defences still work when the attacker is smarter than your whole team?"
tags: [security, ai, php, opensource]
sources:
  - {
      title: "BBC News, coverage of the PHP vulnerabilities",
      url: "https://www.bbc.com/news/articles/c3qjnwye0ep5o",
    }
  - {
      title: "PHP, Security advisory: Critical remote code execution vulnerabilities, update now",
      url: "https://www.php.net/archive/2026.php#2026-10-21-5",
    }
  - {
      title: "The PHP Foundation, Today's PHP security release and how we're strengthening PHP security",
      url: "https://thephp.foundation/blog/2026/10/21/todays-php-security-release-and-how-were-strengthening-php-security/",
    }
  - {
      title: "Wiz Research, PHP2Shell: AI uncovers critical RCE vulnerabilities affecting 70% of the Internet",
      url: "https://www.wiz.io/blog/php2shell-php-rce",
    }
  - {
      title: "OpenAI, Coordinated disclosure of critical vulnerabilities",
      url: "https://openai.com/index/coordinated-disclosure-of-critical-vulnerabilities/",
    }
  - {
      title: "Cloudflare, WAF protection for the PHP vulnerabilities",
      url: "https://blog.cloudflare.com/php-vulnerabilities-waf-protection/",
    }
  - {
      title: "Canadian Centre for Cyber Security, AL26-026 Critical vulnerabilities impacting PHP",
      url: "https://www.cyber.gc.ca/en/alerts-advisories/al26-026-critical-vulnerabilities-impacting-php-cve-2026-109618-cve-2026-109619",
    }
  - {
      title: "Associated Press via PBS News, AI discovered a software vulnerability that could impact 70% of websites worldwide",
      url: "https://www.pbs.org/newshour/nation/ai-discovered-a-software-vulnerability-that-could-impact-70-of-websites-worldwide-the-rush-is-on-to-patch-it",
    }
  - {
      title: "Google Security Blog, Eliminating Memory Safety Vulnerabilities at the Source",
      url: "https://security.googleblog.com/2024/09/eliminating-memory-safety-vulnerabilities-Android.html",
    }
  - { title: "seL4, Verification", url: "https://sel4.systems/Verification/" }
  - {
      title: "Anthropic, Using Claude to reduce the attack surface of code",
      url: "https://www.anthropic.com/research/attack-surface-reduction",
    }
devto: true
---

On October 21, PHP shipped [emergency fixes](https://www.php.net/archive/2026.php#2026-10-21-5) for two critical flaws that allow unauthenticated remote code execution on "all PHP installations serving web requests." By [Wiz's estimate](https://www.wiz.io/blog/php2shell-php-rce), also used by the [Associated Press](https://www.pbs.org/newshour/nation/ai-discovered-a-software-vulnerability-that-could-impact-70-of-websites-worldwide-the-rush-is-on-to-patch-it), PHP runs about 70 percent of websites. That figure describes how common PHP is, not how many sites were confirmed vulnerable. Researchers using frontier AI models helped find the bugs, and [BBC News](https://www.bbc.com/news/articles/c3qjnwye0ep5o) and others have covered the story.

The story raises a bigger question than one patch: how do we secure code that people wrote against AI systems that may soon be far better at reading it than we are? My answer is that we cannot make all of that code bug-free, so we should stop asking that question. A better one is to ask of each defence: does it still work if the attacker is smarter than everyone on my team?

## What made PHP2Shell different

The flaws, nicknamed PHP2Shell, are in PHP itself, not in the applications built on it. Wiz says "every PHP version released in the last decade is affected by at least one of these vulnerabilities," and that "even a simple 'Hello World' application running on an affected PHP version can be vulnerable." Canada's Cyber Centre [classifies both](https://www.cyber.gc.ca/en/alerts-advisories/al26-026-critical-vulnerabilities-impacting-php-cve-2026-109618-cve-2026-109619) as use-after-free bugs, a classic memory-safety error.

Credit is shared. Wiz used its own Atlas tool with Google's Gemini 4 Argon and OpenAI's GPT-5.6 Sol, [OpenAI](https://openai.com/index/coordinated-disclosure-of-critical-vulnerabilities/) says the security firm Calif found a critical flaw with GPT-5.6 Sol, and the [PHP Foundation](https://thephp.foundation/blog/2026/10/21/todays-php-security-release-and-how-were-strengthening-php-security/) says a core developer it contracts first saw signs of the problem while fixing an issue from a 2024 audit.

The detail I keep returning to is in the Wiz write-up. Exploitation required "an exceptionally complex chain of steps," and "frontier AI models substantially reduced that barrier, turning a longstanding flaw into an exploit." Wiz goes further: "complexity may no longer provide a meaningful barrier." For a decade, what protected these servers was not that the bugs were absent. It was that using them was too hard.

The evidence does not show an AI agent finding and weaponizing these flaws on its own; it shows skilled teams using models alongside their own tools and expertise. The claim it supports is still substantial: AI-assisted vulnerability research can reduce the expertise and effort needed to turn a hard-to-exploit bug into a practical attack. That is enough to undermine any defence that relied on the work being hard.

## The smarter-attacker test

That is the pattern I think teams should look for in their own defences. Some controls work because attackers have limited time, skill or patience: obscurity, complexity, pattern-matching filters, and the assumption that nobody would bother. Others change the conditions of attack: they remove a class of bugs, prove specific properties, put code out of reach, or limit what a successful exploit gives away. Their protection does not rest on the attacker running out of skill or patience. They are not equally strong, though, and each has limits, which I note below.

[![Diagram titled "Does this defence still work if the attacker is smarter than your whole team?" The left column, depends on attacker limitations (useful layers, not the last line), lists obscurity ("nobody will find it"), complexity ("too hard to exploit"), pattern filters (attackers vary the payload) and effort ("not worth anyone's time"), with a note that PHP2Shell sat behind complexity until AI-assisted research lowered it. The right column, changes the conditions of attack (durable, within stated limits), lists memory-safe languages (removes a whole class of bugs), proofs (hold for what you specify), attack surface reduction (less code an attacker can reach), isolation and least privilege (limits what an exploit gains) and fast patching (shortens how long a bug is exposed).](/images/smarter-attacker/smarter-attacker-test.png)](/images/smarter-attacker/smarter-attacker-test.png)
_Figure 1. Sorting defences by whether they depend on attacker limitations. Left-column controls are useful extra layers; the problem is relying on them as the last line._

Cloudflare's response shows the left column at work. It deployed firewall rules about nine hours before disclosure, then "observed how attackers were mutating the attack payload to try to bypass our protections." [Cloudflare](https://blog.cloudflare.com/php-vulnerabilities-waf-protection/) still tells customers to patch, calling the rules "an additional layer of defense-in-depth." A filter that matches known patterns buys time, but a capable attacker will vary the pattern.

## Five defences that hold up better, and their limits

**Remove the bug class.** The best evidence I know comes from Android. Google [reports](https://security.googleblog.com/2024/09/eliminating-memory-safety-vulnerabilities-Android.html) that memory-safety issues fell from 76 percent of Android vulnerabilities in 2019 to 24 percent in 2024, after the team began "transitioning new development to memory safe languages." Its conclusion matters for the "all human-written code" problem: "we do not need to throw away or rewrite all our existing memory-unsafe code," because "code matures and gets safer with time." Memory safety removes particular classes of defects, mostly in new code; it does not remove every vulnerability, and logic flaws remain. One caution, which is my assumption rather than Google's claim: that maturing assumes old bugs are found at human speed. PHP2Shell suggests AI can make decade-old code productive for attackers again, so old code that handles untrusted input deserves a second look.

**Prove the parts that matter most.** A proof does not care how intelligent the attacker is. The [seL4 kernel](https://sel4.systems/Verification/) has "machine-checked mathematical proofs from high-level specifications to binary code." The limit is in the wording: a proof covers the properties you specified, under assumptions you stated, and seL4 lists the assembly code, boot code and hardware among its assumptions. A proof can also be mathematically correct while the specification misses the security property the system actually needs. The hard part moves to writing the specification, which is the same acceptance-criteria problem I wrote about in my [first post](/posts/dots-need-acceptance-criteria/).

**Shrink what is reachable.** Code that an attacker cannot reach through a given attack path cannot be exploited through that path, however clever the attacker is. On October 20, [Anthropic described](https://www.anthropic.com/research/attack-surface-reduction) running Claude over 25 open-source projects and finding 493 issues of this kind. In OpenSSH, about 4,500 lines of post-quantum signature code made up "about 16% of OpenSSH's own pre-authentication code in a default sshd," and the maintainers shipped changes in version 10.6. Anthropic is clear that this does not remove unknown vulnerabilities; it makes them "harder to reach."

**Contain what you cannot fix.** When patching is delayed, the Cyber Centre advises organizations to "consider isolating internet-facing applications from public networks until a fix can be applied." The same idea applies permanently: run code that handles untrusted input with the least privilege it needs, so that a successful exploit gains little. Containment is not prevention, though: a compromised process can still do harm within what it is allowed to do, and isolation fails if its boundary is breached. My [post on securing agents](/posts/securing-agents-in-your-infrastructure/) made the same argument about where the boundary should sit.

**Shorten the window.** Disclosure "worked well until 2 days ahead of the targeted release date," according to the PHP Foundation, when details leaked. After the announcement, Cloudflare's Matthew Prince said there had been "millions" of attempts to exploit the flaws within hours, according to the AP. As of its alert, the Cyber Centre reported a public proof of concept but "no active exploitation being identified at this time." Patching is not fully independent of the attacker's capability, since a faster attacker can still win the race to an unpatched server. What a shorter window does is reduce the opportunity.

## The bottleneck is verification, not discovery

OpenAI says "frontier AI found these vulnerabilities before attackers did" and expects "similar findings to increase sharply in the coming months." That is the hopeful version: defenders use the same models first. The PHP Foundation's account shows the cost. Its team "worked through more than 100 reports that turned out to be invalid, duplicates, or not reproducible," and "a person makes every call and works on every patch," while the work "still depends on a small group of foundation-funded developers and a little volunteer help."

This is where my own interest in evaluation comes in. If AI makes finding candidate bugs cheap, the scarce skill becomes deciding which findings are real, reproducing them, and confirming that a fix works. That is an evaluation problem with a false-positive rate, a reproduction standard and a review queue, and it needs people and funding as much as it needs models. Spelled out, the work looks like this:

1. **Triage:** is the report new, in scope and relevant to security?
2. **Reproduce:** can an independent reviewer reliably trigger the failure?
3. **Assess:** which configurations are affected, what does an attack require, and what is the impact?
4. **Remediate:** does the fix remove the underlying defect without introducing regressions?
5. **Verify:** does a regression test fail before the fix and pass after it?

More discoveries do not automatically mean more security. Discovery creates work; verification and remediation turn it into lower risk.

## What this means for Canadian teams

The Cyber Centre's advice is a good starting order: "Prioritize Internet-facing systems and applications that process untrusted input." Its alert also notes that PHP 8.1 and earlier no longer receive security updates from the PHP project, so organizations still on those versions may need vendor-provided backports or a migration plan rather than an ordinary upstream update. For a workplace team, I would turn the test into five questions. Do we know every runtime we expose, and who patches it? (As Cloudflare points out, updating website code or plugins alone does not fix PHP2Shell.) How long does a critical runtime patch take us, from advisory to verified remediation? Deployed is not the same as fixed: a forgotten instance, an old container image, a staging server or a bundled runtime can stay vulnerable after the main servers are patched. Is new code that parses untrusted input written in a memory-safe language? What reachable code could we switch off? If one service were compromised tomorrow, what could it reach?

## What I am still unsure about

I do not know whether the defender's head start will last. In this case it was shortened by a leak, and discovery involved skilled human teams as well as models. Rewrites and proofs are also slow and expensive, so most human-written code will stay as it is for years, and triage is the realistic plan rather than full coverage. Data on how quickly exploitation follows disclosure over the next few months, and a measured false-report rate for AI-generated vulnerability reports, would sharpen or change my view.

## The takeaway

We cannot secure all human-written code against a much smarter attacker by finding every bug first. As the cost of finding bugs falls, we need systems that depend less on attackers failing to find them. What we need are memory-safe new code, proofs for the most critical parts, less reachable surface, real isolation, fast and verified patching, and enough human reviewers to confirm what the models find.

Which of your defences would fail first if the attacker were smarter than your whole team?
