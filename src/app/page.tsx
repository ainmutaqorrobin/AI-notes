import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BrainCircuit,
  FileSearch,
  NotebookPen,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const proofPoints = [
  {
    title: "Readable by default",
    description:
      "Capture raw thinking, meeting notes, and project fragments without turning your workspace into clutter.",
    icon: NotebookPen,
  },
  {
    title: "Ask across your notes",
    description:
      "Use AI to surface the line, paragraph, or note you forgot without manually hunting for it.",
    icon: FileSearch,
  },
  {
    title: "Built for real work",
    description:
      "A focused interface for professionals who need retrieval, synthesis, and calm under pressure.",
    icon: BrainCircuit,
  },
];

export default function Home() {
  return (
    <div className="page-shell">
      <main className="page-container relative py-8 sm:py-10 lg:py-14">
        <section className="surface-card relative overflow-hidden rounded-[2rem] border px-5 py-6 sm:px-8 lg:px-12 lg:py-10">
          <div className="absolute inset-x-10 top-0 h-px editorial-rule" />
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-center">
            <div className="space-y-8">
              <div className="surface-soft inline-flex items-center gap-3 rounded-full border border-border/70 px-4 py-2 text-sm">
                <Image
                  src={logo}
                  alt="AI Notes logo"
                  width={24}
                  height={24}
                  className="opacity-70"
                />
                <span className="eyebrow text-foreground/80 tracking-[0.22em]">
                  AI Notes for Knowledge Work
                </span>
              </div>

              <div className="space-y-5">
                <p className="eyebrow">Editorial intelligence workspace</p>
                <h1 className="text-balance max-w-4xl text-5xl leading-[0.92] font-semibold sm:text-6xl lg:text-7xl">
                  Notes that still make sense when the week gets noisy.
                </h1>
                <p className="text-balance max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                  AI Notes helps professionals capture context, retrieve the
                  right idea fast, and turn scattered documents into a workspace
                  that answers back.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="group">
                  <Link href="/notes">
                    Open workspace
                    <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/signin">See the sign-in flow</Link>
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="surface-soft rounded-[1.5rem] border p-4">
                  <div className="eyebrow">Retrieval</div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Semantic search across your own writing, not a generic chat
                    feed.
                  </p>
                </div>
                <div className="surface-soft rounded-[1.5rem] border p-4">
                  <div className="eyebrow">Workflow</div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Capture, revisit, and refine decisions in a calmer product
                    shell.
                  </p>
                </div>
                <div className="surface-soft rounded-[1.5rem] border p-4">
                  <div className="eyebrow">Clarity</div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Strong reading hierarchy across notes, summaries, and AI
                    answers.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="mb-3 hidden justify-end lg:flex">
                <div className="surface-soft inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm text-muted-foreground">
                  <Sparkles className="size-4 text-primary" />
                  Assistant grounded in your notes
                </div>
              </div>
              <div className="surface-strong relative overflow-hidden rounded-[2rem] border p-4 shadow-[0_30px_80px_-45px_rgba(var(--shadow-color)/0.55)] sm:p-5">
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/8 to-transparent" />
                <div className="relative space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="eyebrow">Workspace preview</p>
                      <h2 className="mt-2 text-2xl font-semibold">
                        Decision notebook
                      </h2>
                    </div>
                    <div className="surface-soft rounded-full border px-3 py-1 text-xs text-muted-foreground">
                      Live with AI
                    </div>
                  </div>

                  <div className="surface-card rounded-[1.6rem] border p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="eyebrow">This morning</p>
                        <h3 className="mt-2 text-xl font-semibold">
                          Q3 launch review
                        </h3>
                      </div>
                      <div className="rounded-full bg-primary/12 px-3 py-1 text-xs font-semibold text-primary">
                        3 linked answers
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">
                      We need a tighter launch brief, one pricing rationale,
                      and fewer disconnected meeting notes before the next exec
                      review.
                    </p>
                    <div className="mt-5 rounded-[1.35rem] border border-border/70 bg-background/70 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Sparkles className="size-4 text-primary" />
                        AI answer
                      </div>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        Across your recent notes, the strongest recurring risk
                        is inconsistent positioning between the pricing memo and
                        launch narrative.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="surface-card rounded-[1.4rem] border p-4">
                      <p className="eyebrow">Notes captured</p>
                      <p className="mt-3 text-3xl font-semibold">126</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Personal research, meetings, drafts, and decision logs.
                      </p>
                    </div>
                    <div className="surface-card rounded-[1.4rem] border p-4">
                      <p className="eyebrow">Useful answer speed</p>
                      <p className="mt-3 text-3xl font-semibold">&lt; 10 sec</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Ask once and get grounded responses from your own notes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 py-8 sm:py-10 lg:grid-cols-3">
          {proofPoints.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="surface-card rounded-[1.75rem] border p-6"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <Icon className="size-5" />
                </div>
                <h2 className="text-2xl font-semibold">{title}</h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {description}
              </p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
