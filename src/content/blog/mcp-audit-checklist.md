---
title: "Before you connect another MCP server: an audit checklist for workplace teams"
date: 2026-10-16
status: published
summary: "What MCP is, how a tool call works after the July 2026 revision, and seven questions to ask before an MCP server touches your work systems."
tags: [mcp, agents, security, workflows]
sources:
  - {
      title: "Anthropic, Introducing the Model Context Protocol",
      url: "https://www.anthropic.com/news/model-context-protocol",
    }
  - {
      title: "Anthropic, Donating the Model Context Protocol and establishing the Agentic AI Foundation",
      url: "https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation",
    }
  - {
      title: "MCP, Architecture overview",
      url: "https://modelcontextprotocol.io/docs/learn/architecture",
    }
  - {
      title: "MCP, Specification changelog for 2026-07-28",
      url: "https://modelcontextprotocol.io/specification/2026-07-28/changelog",
    }
  - {
      title: "MCP, Versioning (2026-07-28)",
      url: "https://modelcontextprotocol.io/docs/2026-07-28/learn/versioning",
    }
  - {
      title: "MCP, Server features overview (2026-07-28)",
      url: "https://modelcontextprotocol.io/specification/2026-07-28/server/index",
    }
  - {
      title: "MCP, Tools (2026-07-28)",
      url: "https://modelcontextprotocol.io/specification/2026-07-28/server/tools",
    }
  - {
      title: "MCP, Streamable HTTP transport (2026-07-28)",
      url: "https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http",
    }
  - {
      title: "MCP, Authorization (2026-07-28)",
      url: "https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization",
    }
  - {
      title: "MCP, Security best practices",
      url: "https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices",
    }
  - {
      title: "MCP, Deprecated features registry",
      url: "https://modelcontextprotocol.io/specification/2026-07-28/deprecated",
    }
  - {
      title: "MCP, Enterprise-Managed Authorization extension",
      url: "https://modelcontextprotocol.io/extensions/auth/enterprise-managed-authorization",
    }
  - {
      title: "MCP, Roadmap",
      url: "https://modelcontextprotocol.io/development/roadmap",
    }
  - {
      title: "MCP specification releases on GitHub",
      url: "https://github.com/modelcontextprotocol/modelcontextprotocol/releases",
    }
  - {
      title: "Cloudflare, The next generation of MCP",
      url: "https://blog.cloudflare.com/mcp-v2/",
    }
  - {
      title: "Google Cloud, Welcome to Gemini at Work 2026",
      url: "https://cloud.google.com/blog/products/ai-machine-learning/welcome-to-gemini-at-work-2026",
    }
  - {
      title: "Linux Foundation Events, MCP Dev Summit Toronto",
      url: "https://events.linuxfoundation.org/mcp-dev-summit-toronto/",
    }
devto: true
---

The Model Context Protocol (MCP) revision dated [July 28](https://github.com/modelcontextprotocol/modelcontextprotocol/releases) remains the current one. MCP's [versioning rules](https://modelcontextprotocol.io/docs/2026-07-28/learn/versioning) let a current revision keep receiving backwards-compatible changes without a new version number, so the specification is not frozen, but there has been no further breaking revision since July. I think that is the right moment for workplace teams to take stock. The July revision changed how an AI application connects to the systems it works with, and it started a clock on features that existing servers rely on: under the protocol's new deprecation policy, Roots, Sampling, Logging and Dynamic Client Registration become eligible for removal in the first revision released on or after July 28, 2027, according to the [deprecated features registry](https://modelcontextprotocol.io/specification/2026-07-28/deprecated). That is the minimum twelve-month deprecation window counted from the July 2026 revision.

MCP is also widely adopted for connecting workplace agents to business systems. On October 8, Google [said](https://cloud.google.com/blog/products/ai-machine-learning/welcome-to-gemini-at-work-2026) its new Gemini agent can connect to any MCP server, inside or outside the company network. A few days earlier, on October 5 and 6, the [MCP Dev Summit](https://events.linuxfoundation.org/mcp-dev-summit-toronto/) came to Toronto with a focus on deploying MCP in regulated enterprise settings: identity, authorization, auditability, gateways, registries, evaluation and production reliability.

My position is that an MCP server is not a plugin. It is a system integration that holds credentials and acts on a model's decisions, so it deserves the same review we already give any integration that touches production data. Below, I explain what MCP is and how a tool call works, then list the seven questions I would ask before connecting a server.

## What MCP is

Anthropic [introduced MCP](https://www.anthropic.com/news/model-context-protocol) on November 25, 2024, as an open standard that lets AI assistants connect to the places where information lives, such as document repositories, business applications and development tools. In December 2025, Anthropic [donated it](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation) to the Agentic AI Foundation, "a directed fund under the Linux Foundation" co-founded by Anthropic, Block and OpenAI. At that point, Anthropic counted "more than 10,000 active public MCP servers" and listed ChatGPT, Cursor, Gemini, Microsoft Copilot and Visual Studio Code among the products that had adopted it.

The problem it solves will be familiar to anyone who has worked on integrations. Without a shared protocol, every AI application needs its own connector for every system, so ten applications and twenty systems can mean two hundred connectors to build and maintain. With MCP, a system exposes its capabilities once, as an MCP server, and any compliant application can discover and use them.

As a business systems analyst, the closest analogy I know is an API specification. An OpenAPI document describes a REST API so that developers can write code against it. An MCP server describes its capabilities so that an AI application can call them. For MCP tools, the important difference is who consumes the description: the host puts the tool definitions into the model's context at run time, and the model can choose which tool to invoke.

### Hosts, clients and servers

MCP has three participants, described in the [architecture overview](https://modelcontextprotocol.io/docs/learn/architecture). The **host** is the AI application, such as Claude, ChatGPT, VS Code or an agent your team built. The **server** is a program that exposes a system's capabilities. Between them, the host creates one **MCP client** for each server it connects to, so a host connected to three servers runs three clients.

[![Diagram of MCP's architecture. An MCP host, the AI application, contains a model and three MCP clients. Each client connects to one server: a local filesystem server over stdio on the same machine, and two remote servers, for ticketing and a CRM, over Streamable HTTP, using OAuth when the server is protected. Each server can offer tools, resources and prompts, and sits in front of a real system: files, a ticketing API or a CRM database.](/images/mcp-audit/mcp-architecture.png)](/images/mcp-audit/mcp-architecture.png)
_Figure 1. One host, one MCP client per server. The server names are examples._

Servers offer three kinds of building blocks, which the specification calls primitives. **Tools** are actions the model can call, such as creating a ticket or running a query. **Resources** are data the application can read, such as a file or a database schema. **Prompts** are reusable templates that a person can choose to run. The [server overview](https://modelcontextprotocol.io/specification/2026-07-28/server/index) sums up who is in charge of each: tools are model-controlled, resources are application-controlled, and prompts are user-controlled. In the other direction, a server can ask the client to collect input from the user, which MCP calls elicitation.

Underneath, every message is JSON-RPC 2.0, and two transports carry it. A **local** server runs on the same machine as the host and talks over standard input and output (stdio). A **remote** server uses Streamable HTTP, where every message from the client is a new HTTPS POST. Remote servers are where OAuth comes in: a protected MCP server acts as an [OAuth 2.1 resource server](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization) and accepts only tokens issued for it.

It matters just as much to know what MCP does not do. The architecture overview says the protocol covers only the exchange of context, and leaves it to the AI application to decide how it uses the model and the context it receives. MCP standardizes the interface and the exchange. It does not decide whether a call was a good idea, or whether the result is correct.

### How a tool call works

Figure 2 follows one call through the current version of the protocol, using an illustrative `create_ticket` tool on a ticketing server.

[![Sequence diagram with three participants: the host and model, the MCP client, and the MCP server. Step 1, the client optionally calls server/discover and receives versions and capabilities. Step 2, it calls tools/list and receives names, descriptions and schemas. Step 3, the definitions go to the model, which picks create_ticket and its arguments. Step 4, the host may require a person's approval for a risky action. Step 5, the client sends tools/call as an HTTP POST to /mcp, with Mcp-Method and Mcp-Name headers that a gateway can read, while the arguments stay in the body. Step 6, the server returns a complete result, which goes to the model. Alternatively, the server returns input_required, the client asks the user, and retries the request with the answers and a new request ID.](/images/mcp-audit/mcp-tool-call.png)](/images/mcp-audit/mcp-tool-call.png)
_Figure 2. One tool call under MCP 2026-07-28, simplified from the specification._

1. **Discover (optional).** The client can call `server/discover` to learn which protocol versions and capabilities the server supports. Every server must implement it, but because every request now carries its own protocol version, clients may skip it.
2. **List the tools.** `tools/list` returns each tool's name, description and input schema. The result also carries caching hints (`ttlMs` and `cacheScope`), so the client does not need to ask on every turn.
3. **Choose.** The host puts those definitions into the model's context, and the model picks a tool and fills in its arguments. The [tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) calls tools "model-controlled" for this reason.
4. **Approve, if the host requires it.** The same page says there "SHOULD always be a human in the loop with the ability to deny tool invocations," but MCP does not supply that approval gate. The host decides which calls need a person's approval, and the host has to implement the check.
5. **Call.** The client sends `tools/call` as an HTTP POST to the server's single MCP endpoint (`/mcp` in this example), not to a route named after the method. Two headers repeat what is in the body, `Mcp-Method` and `Mcp-Name`, so a gateway can see which tool is being called without parsing the JSON.
6. **Return.** The server answers with `resultType: "complete"`, and the host passes the result to the model. If the server needs more information first, it returns `input_required` instead; the client asks the user, then retries the original request with the answers and a new request ID.

Here is what step 5 looks like on the wire. It is adapted from the examples in the [Streamable HTTP specification](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http), and the tool and its arguments are fabricated.

```http title="tools/call request (illustrative)"
POST /mcp HTTP/1.1
Content-Type: application/json
Accept: application/json, text/event-stream
Authorization: Bearer <token issued for this server>
MCP-Protocol-Version: 2026-07-28
Mcp-Method: tools/call
Mcp-Name: create_ticket

{
  "jsonrpc": "2.0",
  "id": 7,
  "method": "tools/call",
  "params": {
    "name": "create_ticket",
    "arguments": { "project": "OPS", "summary": "Printer on floor 3 is offline" },
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientCapabilities": { "elicitation": {} }
    }
  }
}
```

## What changed on July 28

Until July, MCP was stateful. A client opened a session with an `initialize` handshake, and a remote server could track that session with an `Mcp-Session-Id` header. The [2026-07-28 changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog) removed both, so each request now carries its own protocol version and client capabilities, and any server instance can handle any request. Cloudflare, which hosts MCP servers, [described the result](https://blog.cloudflare.com/mcp-v2/) as servers that no longer need sticky sessions or held-open streams. The same revision replaced server-initiated requests with the `input_required` retry, added the routing headers and caching hints, tightened authorization, and gave every feature a lifecycle (Active, Deprecated or Removed) with a minimum twelve-month deprecation window. The questions below cover the parts that matter for an audit.

## Seven questions to ask before you connect a server

None of these questions will surprise anyone who has reviewed a system integration. What MCP adds is that the caller is a model choosing actions at run time, often for a person who is not watching. The [MCP roadmap](https://modelcontextprotocol.io/development/roadmap) says it plainly: "MCP authorization assumes a person with a browser at consent time. Increasingly the caller is an agent." For each question, I list what the specification expects and the evidence I would ask for.

### 1. Which servers are connected, where did they come from, and where do they run?

Start with an inventory. A local server may run under the user's operating-system identity and inherit substantial local privileges unless the host isolates it, so the question is not only where it runs but under which identity and inside which isolation boundary. The authorization specification tells stdio servers to "retrieve credentials from the environment" rather than use OAuth. The [security best practices](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices) also require that a client offering one-click setup of a local server show the exact command it will run, without truncation, and get explicit approval first. That protects against hidden execution, but it does not establish that the code you chose to run is trustworthy. Before connecting a server, I would also want to know who published it, which exact version is running, how it is updated, and who reviews an update before it runs with your credentials. **Evidence:** a register of every server with its owner, source repository, package version or commit, update mechanism and reviewer, execution identity and isolation, transport, protocol revision, and the systems and data it can reach.

### 2. Is every token issued for this server, and only this server?

A remote MCP server must check that each access token was issued for it, and the specification says servers "MUST NOT accept or transit any other tokens." That rules out token passthrough, where a server forwards a user's token for some other API, which the best-practices guide links to confused-deputy attacks and broken audit trails. On the client side, the July revision requires checking the issuer, when the authorization server includes it, before redeeming an authorization code, which defends against mix-up attacks. **Evidence:** a negative test showing that a token issued for another service is rejected with a 401.

### 3. How much can a token do, and who can take it away?

The best-practices guide lists "Publishing all possible scopes in `scopes_supported`" as a common mistake, and the reason is practical: when a server does not say which scopes an operation needs, clients fall back to requesting everything it publishes. The tools specification also allows a server to return only the tools that the caller's scopes permit, so a narrow token can shrink the set of tools the model even sees. For organizations, the [Enterprise-Managed Authorization](https://modelcontextprotocol.io/extensions/auth/enterprise-managed-authorization) extension lets the company's identity provider decide which servers each employee can use, and revoke that access in one place. **Evidence:** the scopes each role receives, and an offboarding test showing that access ends when the account does.

### 4. Can you see and control which tool is called?

The new headers make MCP traffic visible to ordinary infrastructure. A gateway can allow specific tools for specific roles, or rate-limit them, by reading `Mcp-Method` and `Mcp-Name`, and the server must reject a request whose headers disagree with its body, so the gateway and the server act on the same facts.

There is a limit, though, and Figure 2 shows it: the headers expose which capability is being invoked, not the business meaning of its arguments, which stay in the body. A gateway can cheaply block or rate-limit `create_ticket`, but the headers do not tell it which project or customer the ticket concerns. For a `transfer_funds` tool, they would not say whether the amount is $10 or $100,000, or who receives it. Header-level enforcement controls which capability may be invoked; policy that depends on the arguments still belongs in a gateway that reads the body, or in the server itself.

The specification adds two cautions. Intermediaries that enforce policy on these headers should reject requests from older protocol versions rather than trust headers nobody validated, and sensitive parameters such as tokens or personal data should not be mirrored into headers. Logging over MCP itself is deprecated in favour of OpenTelemetry, and the specification now documents how to carry trace context in each request's metadata. As I argued in my post on [securing agents](/posts/securing-agents-in-your-infrastructure/), those logs belong somewhere the agent's own credentials cannot write. **Evidence:** the gateway policy, and one end-to-end trace of a single tool call.

### 5. What does a state handle prove?

Without sessions, a server that needs to remember something (a shopping cart, an open browser, a database transaction) returns a handle that the model passes back as an ordinary tool argument. The best-practices guide is explicit that servers "MUST NOT treat possession of a state handle as authentication," and that they should bind each handle to the authenticated user. **Evidence:** a test where one user presents another user's handle and is refused.

### 6. What breaks when deprecated features are removed?

Every deprecated feature is a migration with a date. The registry lists the following, and notes that the earliest removal date marks when a feature becomes eligible; the actual removal is a maintainer decision and may come later.

| Deprecated feature          | Migrate to                                                     | Earliest removal                          |
| --------------------------- | -------------------------------------------------------------- | ----------------------------------------- |
| Roots                       | Directories or files passed as tool parameters, URIs or config | First revision on or after July 28, 2027  |
| Sampling                    | Calling an LLM provider's API directly                         | First revision on or after July 28, 2027  |
| Logging                     | `stderr` for stdio servers, OpenTelemetry for observability    | First revision on or after July 28, 2027  |
| Dynamic Client Registration | Client ID Metadata Documents                                   | First revision on or after July 28, 2027  |
| HTTP+SSE transport          | Streamable HTTP                                                | Three months after SEP-2596 reaches Final |

**Evidence:** for each server and client you depend on, which of these it uses and a migration item with an owner and a date.

### 7. Who approves risky calls, and how do you know the result is right?

The specification asks for a human who can deny tool calls, and it adds a warning I would underline: clients "MUST consider tool annotations to be untrusted unless they come from trusted servers." A server describing its own tool as read-only is a claim, not a control, so approval rules should not rest on that description alone. Servers, for their part, must validate inputs, enforce access controls, rate-limit calls and sanitize outputs.

This is also where my evaluation habit comes in. Tool names and descriptions go straight into the model's context, so my assumption is that a server-side edit to a description can change which tool the model picks without any change on your side. Because servers should return tools in a deterministic order, the tool list can be treated like a contract. There may not be a single list, though: as question 3 noted, a server can show different tools to callers with different scopes. So for each relevant role or authorization profile, I would keep an expected tool contract under version control (names, descriptions, schemas and annotations), diff it when the server changes, and rerun the evaluation set before the change reaches users. The actions themselves still need acceptance criteria, as I argued in my [first post](/posts/dots-need-acceptance-criteria/). **Evidence:** approval rules per tool, a versioned tool contract for each role, and evaluation results from the last change.

## What this means for Canadian teams and job seekers

The Toronto summit's agenda reads like a fair summary of what regulated Canadian employers will ask before an agent reaches their systems. Banks, insurers and public-sector teams already run integration reviews, and my expectation (an assumption, not something I have measured) is that MCP servers will be routed through those reviews rather than around them. Teams that can answer these seven questions will get through review faster.

For job seekers, the checklist doubles as a portfolio template. If you have built an MCP server, answer the seven questions in its README: the transport, the token audience check, the scopes, the gateway headers, the handle binding, the deprecation exposure and the tests. That is the kind of evidence I argued for in my post on [what a deployed-agent engineer should be able to show](/posts/deployed-agent-engineer-evidence/).

## What I am still unsure about

I have not measured how many public servers and clients have moved to the July revision, and the documentation for Enterprise-Managed Authorization notes that client support for it varies. While versions are mixed, the advice to reject older requests at the gateway has a real cost, and I do not know how teams are handling that trade-off. Finally, the roadmap admits that "Existing MCP servers lean on pasted API keys and long-lived refresh tokens," and its agent identity work is still forming. Independent data on how teams deploy MCP gateways, or published conformance results for the major clients and servers, would change my view in either direction.

## The takeaway

MCP makes it easy to connect an agent to a work system, and that is exactly why the connection deserves a review. Treat each server as an integration with an owner, a token audience, a scope list, a gateway policy and a test suite. The cheapest time to do that work is while the July revision is still current, before the deprecations land and before the next breaking revision adds more to review.

If your team runs MCP servers today, which of these seven questions would be the hardest to answer?
