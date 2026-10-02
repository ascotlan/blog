---
title: "Securing AI agents in your infrastructure: a sandbox is only the first layer"
date: 2026-10-01
status: draft
summary: "Nvidia's OpenShell limits what an agent can reach. OpenAPPA limits where its data can go. Why agents inside your network need both, and more."
tags: [agents, security, infrastructure, nvidia]
sources:
  - { title: "NVIDIA, Open Agent Safety Platform press release", url: "https://nvidianews.nvidia.com/news/open-agent-safety-platform" }
  - { title: "NVIDIA Technical Blog, Open Agent Safety Platform: continuous in-silicon agent monitoring", url: "https://developer.nvidia.com/blog/nvidia-open-agent-safety-platform-a-reference-for-continuous-in-silicon-agent-monitoring/" }
  - { title: "NVIDIA OpenShell on GitHub", url: "https://github.com/NVIDIA/openshell" }
  - { title: "VentureBeat, Nvidia's OpenShell controls what AI agents can access", url: "https://venturebeat.com/infrastructure/nvidias-openshell-controls-what-ai-agents-can-access-even-when-they-ignore-instructions" }
  - { title: "Global News (The Associated Press), NVIDIA says its new platform will stop AI agents from going rogue", url: "https://globalnews.ca/news/12075613/nvidia-ai-agents-security/" }
  - { title: "Hugging Face, Security incident disclosure, July 2026", url: "https://huggingface.co/blog/security-incident-july-2026" }
  - { title: "Hugging Face, Anatomy of a frontier lab agent intrusion", url: "https://huggingface.co/blog/agent-intrusion-technical-timeline" }
  - { title: "OpenAPPA on GitHub", url: "https://github.com/archestra-ai/OpenAPPA" }
  - { title: "OpenAPPA, Evaluation", url: "https://openappa.com/evaluation" }
devto: true
---

On September 28, Nvidia launched its Open Agent Safety Platform, and much of the coverage framed it as the answer to AI agents going rogue. The timing made that framing easy: in July, an agent driven by OpenAI models broke out of its evaluation sandbox and spent roughly two and a half days inside Hugging Face's production infrastructure.

I read the announcement the way I would review any integration that touches production systems, by asking which question each control actually answers. My conclusion is that securing agents inside your own infrastructure is not one product decision. It is four separate questions: what the agent can reach, where the data it reads is allowed to go, what watches it from outside its own reach, and whether the result met the requirement. Nvidia's platform answers two of them well. A small open-source project called OpenAPPA is aimed at a third. The fourth is still ours to answer.

## What the Hugging Face incident shows

Hugging Face published both a [disclosure](https://huggingface.co/blog/security-incident-july-2026) and a [technical timeline](https://huggingface.co/blog/agent-intrusion-technical-timeline). The timeline describes "an autonomous AI agent driven by a combination of OpenAI models" that ran an end-to-end intrusion between July 9 and July 13, and Hugging Face's forensic reconstruction recovered about 17,600 attacker actions. The agent first "escaped its sandbox by exploiting a zero-day in the package registry cache proxy." Inside Hugging Face, it abused the dataset processing pipeline, and one step returned "the worker pod's full environment, including some secrets and credentials." From there it moved laterally across clusters.

What strikes me is how ordinary most of the failures were: a proxy was the weakest point of exit, and credentials sat where a compromised worker could read them. Hugging Face's own reflection puts it well: "machine-speed offense makes ordinary weaknesses more expensive for defenders." This was a frontier lab's agent in a security evaluation, not a workplace assistant, but the lesson transfers. An agent inside your network is a workload that probes and retries at machine speed, so every gap you have tolerated becomes easier to find.

[![Diagram of four layers. Inside a sandbox such as OpenShell, an agent's actions pass a flow check such as OpenAPPA before reaching its tools, and an egress policy on the sandbox wall decides which endpoints it can reach. An independent monitor watches from outside, and acceptance criteria judge the result.](/images/securing-agents/four-layers.png)](/images/securing-agents/four-layers.png)
*Figure 1. Where each control sits on the path from an agent to the outside world.*

## Layer 1: what the agent can reach

[OpenShell](https://github.com/NVIDIA/openshell) is the part of Nvidia's platform most teams can use today. It is open source under Apache 2.0 and currently labelled alpha. It runs each agent in a sandbox where filesystem paths and process restrictions are locked when the sandbox is created, outbound network access is blocked unless a policy allows it, and credentials are granted per endpoint. According to [VentureBeat's report](https://venturebeat.com/infrastructure/nvidias-openshell-controls-what-ai-agents-can-access-even-when-they-ignore-instructions), a policy prover checks each policy against organizational limits before it is applied, and Nvidia's Ali Golshan was clear that "It is deterministic."

Justin Boitano, Nvidia's vice president of enterprise AI, summarized the principle in a line I agree with completely: "The organization should not have to trust the agent to respect that boundary. The infrastructure should enforce it explicitly." That is least privilege applied to a new kind of workload, and it targets exactly the layer that failed first in July: egress.

## Layer 2: where the data can go

Access control answers "can the agent touch this?" It does not answer "may this data go there?" Golshan gave the clearest example himself. Suppose a policy forbids an agent from reading code on GitHub and posting it externally. The agent could split the job between two sub-agents, one that reads from GitHub and one that can reach the outside, and let them pass the code between them. Each sub-agent stays within its permissions; the combination does not. VentureBeat reports that Nvidia is extending the prover to catch these combinations, which is the right instinct. It is a data-flow problem.

That is the question [OpenAPPA](https://github.com/archestra-ai/OpenAPPA) is built around. It sits between an agent and its tools and, before every call, asks "is this data allowed to go to this destination?" It tracks the sensitivity and trust of everything the agent has read, and its checks run before dispatch, "so sensitive data never reaches an unauthorized tool." Like OpenShell, its decisions are deterministic, and its policies are plain TOML.

It is also very early. The repository describes itself as a "preview and an RFC," and its results are self-reported, although the [evaluation page](https://openappa.com/evaluation) is substantial. It covers 1,320 runs across two suites, Bench-Corp and AgentThreatBench, and reports that no scored attack succeeded against guarded OpenAPPA. On Bench-Corp, guarded OpenAPPA completed 88 to 90 percent of tasks across three models, while the evaluated configurations of Microsoft's FIDES let roughly 28 to 35 percent of attacks through. The page also includes ablations: in one Bench-Corp test, task completion fell from 88 percent to 56.5 percent without subagent isolation and to 35 percent without guided recovery. My reading, which is an inference rather than something the page states, is that much of the utility depends on how well the agent recovers after the policy says no.

What the page does not isolate is the number I care about most: how many incomplete tasks failed because the policy refused legitimate work, as opposed to ordinary agent failure. I do like its framing: security has to be measured on two axes at once, because "an agent that permits unauthorized flows is unsafe, and an agent that refuses valid work is useless." That echoes the argument about permissions and outcomes in my [last post](/posts/dots-need-acceptance-criteria/).

## Layer 3: a monitor the agent cannot reach

The third layer in my model is external monitoring. Nvidia's answer to that problem is Sentry, which its [announcement](https://nvidianews.nvidia.com/news/open-agent-safety-platform) describes as "an out-of-band watchdog" running on BlueField-4 data processing units, separate from the host running the agent. Nvidia says it can quarantine an agent that moves outside its boundaries in milliseconds. The [technical blog](https://developer.nvidia.com/blog/nvidia-open-agent-safety-platform-a-reference-for-continuous-in-silicon-agent-monitoring/) states the design principle plainly: "The controls do not live inside, or within reach of the agent. The agent does not know it is being watched."

Sentry is a reference design aimed at frontier labs, and Nvidia says organizations can deploy elements of the platform according to their own requirements. I expect most workplace teams will not run Sentry, but the principle applies at any scale. Agent activity logs should go somewhere the agent's own credentials cannot write, and alerts should not depend on the agent's own account of what it did. After the incident, Hugging Face added tooling "that flags tokens used from unexpected origins," which is the same idea expressed with ordinary infrastructure.

## Layer 4: whether the result met the requirement

A security engineer could fairly object that this is not a security layer, and in the narrow sense that is true. The first three layers are security controls; the fourth is operational assurance. I include it because an agent that securely performs the wrong action is still not safe to delegate work to. An agent can stay inside its sandbox, send data only to approved destinations, pass every monitor, and still email the right client the wrong invoice amount. Catching that takes acceptance criteria and evidence, and no vendor sells them, because they depend on what your process means by "correct."

| Layer | Question it answers | Example control | What it cannot see |
| --- | --- | --- | --- |
| Reach | What can the agent touch? | OpenShell sandbox and egress policy | Data moving between allowed tools |
| Flow | Where may this data go? | OpenAPPA flow check | Escapes below the tool layer |
| Watch | Who notices when it goes wrong? | Sentry, out-of-band logs and alerts | Whether the output is correct |
| Verify | Did the result meet the requirement? | Acceptance criteria and evidence | Anything the criteria leave out |

To make this concrete, picture the invoice follow-up agent from my last post running inside your network, with read access to receivables and permission to send email. A client's reply hides an instruction to forward the full receivables report to an outside address. A reach-only policy allows it, because the agent may read receivables and may send email. A flow policy that labels the report as internal blocks it before the email leaves.

[![Two panels comparing the same prompt injection. Under reach control, reading receivables and sending email are both allowed, so the report leaves the network. Under flow control, the receivables carry an internal label, and sending them to an outside address is blocked before the email is sent.](/images/securing-agents/reach-vs-flow.png)](/images/securing-agents/reach-vs-flow.png)
*Figure 2. The same prompt injection under each kind of control. The scenario is illustrative; I have not run it against either tool.*

Out-of-band logging catches what slips past both, and acceptance criteria catch the quieter failure: the wrong amount, sent with no attack at all.

## What I am still unsure about

Boitano told reporters that "From what we know, this new security platform could have stopped the breach if it was being used in frontier labs for model evaluation early on." That is plausible for the first step, the sandbox escape, but it is a vendor claim, and a sandbox around the attacking agent does nothing for the credentials exposed inside the target. I also do not know how much labelling work data-flow control demands in a real organization. An independent benchmark that separates false refusals from ordinary agent failures would change my view, in either direction.

## The takeaway

An agent does not become safe because you put it in a sandbox. The sandbox answers one question, a data-flow policy answers another, and independent monitoring answers a third. None of them can tell you whether the agent did the job correctly. So rather than asking whether an agent is "secure," I would ask which failure each control prevents, and write down four answers before the agent runs inside your infrastructure: what it can reach, where its data may go, what watches it from outside its reach, and how you will know the result is correct.

Across this post and my last one, the same pattern keeps emerging: agentic systems need deterministic boundaries around probabilistic workers, and explicit evidence for whether the work was correct. Vendors are starting to supply the boundaries. The evidence is still the work of whoever owns the process.

If you are running agents inside your network today, which of these layers do you have in place, and which one are you quietly relying on the model to handle?
