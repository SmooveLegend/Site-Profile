"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";
type UiChatMessage = { role: "user" | "assistant"; content: string };

export default function Home() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "dark";
    }
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) {
      return stored;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  const [chatMessages, setChatMessages] = useState<UiChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi, I am Tahsin's Digital Twin. Ask me about his career journey, strengths, or experience.",
    },
  ]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const journey = [
    {
      role: "Freelance Marketing Consultant",
      company: "Self-employed",
      period: "Aug 2024 - Present",
      location: "Canada",
      summary:
        "Advising brands on growth strategy, messaging, and execution frameworks that turn ideas into measurable outcomes.",
    },
    {
      role: "Retail Keyholder",
      company: "Freedom Mobile",
      period: "Oct 2024 - Apr 2025",
      location: "Edmonton, Alberta",
      summary:
        "Led front-line customer experiences while maintaining operational excellence and high-performance sales standards.",
    },
    {
      role: "Marketing Manager - North America",
      company: "Teltonika Canada",
      period: "Mar 2022 - Aug 2024",
      location: "Toronto, Ontario",
      summary:
        "Built data-driven campaigns, accelerated market-entry execution, and strengthened brand visibility across the region.",
    },
    {
      role: "Marketing Specialist",
      company: "TELUS",
      period: "Feb 2020 - Mar 2022",
      location: "Toronto, Ontario",
      summary:
        "Delivered strategic marketing initiatives and cross-functional programs to drive awareness and business growth.",
    },
    {
      role: "Social Media Community Manager",
      company: "FutureFit AI",
      period: "Oct 2019 - Oct 2020",
      location: "Toronto, Ontario",
      summary:
        "Supported product and community growth through user research, social strategy, and platform optimization.",
    },
    {
      role: "Operations Manager",
      company: "Parsons Corporation",
      period: "Sep 2017 - Jun 2020",
      location: "Toronto, Ontario",
      summary:
        "Streamlined operations and built reliable systems that improved team efficiency and service quality.",
    },
  ];

  const portfolioTargets = [
    {
      name: "North America Market Entry Blueprint",
      category: "Go-to-market strategy",
      outcome: "Template for region launches",
      href: "#",
    },
    {
      name: "Brand Visibility Performance Suite",
      category: "Reporting and analytics",
      outcome: "Live KPI narrative framework",
      href: "#",
    },
    {
      name: "Operational Growth Playbook",
      category: "Workflow optimization",
      outcome: "Scaled execution model",
      href: "#",
    },
  ];

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const handleAskDigitalTwin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const question = chatInput.trim();
    if (!question || isChatLoading) {
      return;
    }

    const nextMessages: UiChatMessage[] = [
      ...chatMessages,
      { role: "user", content: question },
    ];
    setChatMessages(nextMessages);
    setChatInput("");
    setChatError("");
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/digital-twin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const payload = (await response.json()) as { reply?: string; error?: string };

      if (!response.ok || !payload.reply) {
        throw new Error(payload.error ?? "Unable to get a response right now.");
      }

      setChatMessages((current) => [
        ...current,
        { role: "assistant", content: payload.reply as string },
      ]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected chat error.";
      setChatError(message);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className="hero-noise pointer-events-none absolute inset-0 -z-10" />

      <main className="mx-auto flex w-full max-w-6xl flex-col px-6 pb-20 pt-10 sm:px-10 lg:px-14">
        <header className="glass-panel animate-in mb-12 flex flex-wrap items-center justify-between gap-4 px-5 py-4">
          <p className="text-sm font-semibold tracking-[0.35em] text-cyan-200/85">
            TAHSIN ELAHI
          </p>
          <div className="flex items-center gap-5">
            <nav className="flex flex-wrap gap-4 text-sm text-zinc-300">
              <a className="link-glow" href="#about">
                About
              </a>
              <a className="link-glow" href="#journey">
                Journey
              </a>
              <a className="link-glow" href="#portfolio">
                Portfolio
              </a>
              <a className="link-glow" href="#digital-twin">
                Digital Twin
              </a>
            </nav>
            <button className="theme-toggle" onClick={toggleTheme} type="button">
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </header>

        <section className="animate-in grid items-end gap-10 pb-16 [animation-delay:120ms] lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.24em] text-zinc-300">
              Brand Management | Strategic Planning | Marketing Operations
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Enterprise precision.
              <span className="block bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-violet-300 bg-clip-text text-transparent">
                Edgy execution.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              Marketing leader based in Toronto, turning ambitious ideas into
              market-ready growth engines through strategy, innovation, and
              data-backed decisions.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                className="btn-primary"
                href="https://www.linkedin.com/in/tahsin-elahi1"
                target="_blank"
                rel="noreferrer"
              >
                Connect on LinkedIn
              </a>
              <a className="btn-secondary" href="#portfolio">
                Explore Portfolio Direction
              </a>
            </div>
          </div>

          <aside className="glass-panel floating-panel p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
              Contact
            </p>
            <p className="mt-4 text-xl font-semibold text-zinc-100">
              tahsin.elahi97@gmail.com
            </p>
            <p className="mt-1 text-zinc-300">+1 (647) 909-5017</p>
            <p className="mt-5 border-t border-white/10 pt-5 text-sm leading-7 text-zinc-300">
              Core strengths: Microsoft Power Automate, Application Support,
              Reporting and Analysis, and high-impact execution across brand,
              operations, and growth.
            </p>
          </aside>
        </section>

        <section id="about" className="glass-panel animate-in mb-8 p-8 [animation-delay:200ms]">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-cyan-200">
            About Me
          </p>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            Building bold ideas into scalable outcomes.
          </h2>
          <p className="mt-4 text-base leading-8 text-zinc-300">
            My career has been shaped by a relentless pursuit of excellence and
            a drive to make meaningful impact. I specialize in crafting
            strategic growth initiatives, orchestrating market-entry campaigns,
            and optimizing workflows that keep teams aligned and moving fast. I
            thrive where innovation meets accountability.
          </p>
        </section>

        <section id="journey" className="glass-panel animate-in mb-8 p-8 [animation-delay:280ms]">
          <div className="mb-6 flex items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-200">
                Career Journey
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                Progression across marketing and operations
              </h2>
            </div>
          </div>
          <div className="space-y-4">
            {journey.map((item, index) => (
              <article
                key={`${item.company}-${item.role}`}
                className="animate-in rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:border-cyan-300/40 hover:bg-white/[0.06]"
                style={{ animationDelay: `${360 + index * 65}ms` }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-zinc-100">
                    {item.role}
                  </h3>
                  <p className="text-sm text-cyan-200">{item.period}</p>
                </div>
                <p className="mt-1 text-sm text-zinc-400">
                  {item.company} | {item.location}
                </p>
                <p className="mt-3 leading-7 text-zinc-300">{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="portfolio" className="glass-panel animate-in p-8 [animation-delay:360ms]">
          <p className="text-xs uppercase tracking-[0.25em] text-violet-200">
            Portfolio Direction
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            A curated strategic portfolio, structured to launch.
          </h2>
          <p className="mt-4 max-w-3xl leading-8 text-zinc-300">
            This preview is designed as a high-credibility bridge until full
            case studies are published. Each item is ready to become a complete
            portfolio page.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {portfolioTargets.map((target) => (
              <a
                key={target.name}
                href={target.href}
                className="portfolio-card"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-violet-200/90">
                  {target.category}
                </p>
                <p className="mt-3 text-base font-semibold text-zinc-100">
                  {target.name}
                </p>
                <p className="mt-2 text-sm text-zinc-300">{target.outcome}</p>
              </a>
            ))}
          </div>
          <p className="mt-8 text-sm text-zinc-500">
            Seneca College | B.Com. in Accounting and Finance
          </p>
        </section>

        <section
          id="digital-twin"
          className="glass-panel animate-in mt-8 p-8 [animation-delay:420ms]"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">
            AI Career Assistant
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            Chat with Tahsin&apos;s Digital Twin
          </h2>
          <p className="mt-3 max-w-3xl text-zinc-300">
            Ask about career highlights, role progression, strengths, and areas
            of expertise.
          </p>

          <div className="chat-shell mt-6">
            <div className="chat-messages">
              {chatMessages.map((message, index) => (
                <article
                  key={`${message.role}-${index}`}
                  className={`chat-bubble ${
                    message.role === "user" ? "chat-bubble-user" : "chat-bubble-assistant"
                  }`}
                >
                  <p className="chat-role">
                    {message.role === "user" ? "You" : "Digital Twin"}
                  </p>
                  <p className="whitespace-pre-wrap leading-7">{message.content}</p>
                </article>
              ))}
              {isChatLoading && (
                <article className="chat-bubble chat-bubble-assistant">
                  <p className="chat-role">Digital Twin</p>
                  <p>Thinking...</p>
                </article>
              )}
            </div>

            <form className="chat-form mt-4" onSubmit={handleAskDigitalTwin}>
              <textarea
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                className="chat-input"
                placeholder="Ask: What are Tahsin's strongest strategic capabilities?"
                rows={3}
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-rose-300">{chatError}</p>
                <button className="btn-primary" type="submit" disabled={isChatLoading}>
                  {isChatLoading ? "Sending..." : "Ask Digital Twin"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
