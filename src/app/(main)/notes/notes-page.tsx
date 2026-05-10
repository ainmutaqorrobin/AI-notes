"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { getNoteWordCount } from "@/lib/note-metadata";
import { useQuery } from "convex/react";
import { Clock3, Files, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { api } from "../../../../convex/_generated/api";
import { AIChatButton } from "./ai-chat-button";
import { CreateNoteButton } from "./create-note-button";
import { NoteItem } from "./note-item";

export function NotesPage() {
  const notes = useQuery(api.notes.getUserNotes);

  const totalWords =
    notes?.reduce((sum, note) => sum + getNoteWordCount(note.body), 0) ?? 0;

  return (
    <div className="space-y-8">
      <section className="surface-card relative overflow-hidden rounded-[2rem] border px-5 py-6 sm:px-7 lg:px-8">
        <div className="absolute inset-x-10 top-0 h-px editorial-rule" />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <p className="eyebrow">Knowledge workspace</p>
            <div className="space-y-3">
              <h1 className="text-balance text-4xl leading-[0.95] font-semibold sm:text-5xl">
                A calmer archive for notes worth finding later.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Capture fragments, revisit decisions, and ask grounded questions
                across your notes without losing the thread of your work.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <AIChatButton />
            <CreateNoteButton />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Notes stored"
            value={notes?.length ?? "-"}
            detail="Personal research, meeting notes, and operating context."
            icon={<Files className="size-4" />}
          />
          <StatCard
            label="Words captured"
            value={notes === undefined ? "-" : totalWords.toLocaleString()}
            detail="Readable context that remains queryable by the assistant."
            icon={<Clock3 className="size-4" />}
          />
          <StatCard
            label="AI ready"
            value="Grounded"
            detail="Assistant responses are scoped to the notes you already wrote."
            icon={<Sparkles className="size-4" />}
          />
        </div>
      </section>

      {notes === undefined ? (
        <LoadingSkeleton />
      ) : notes.length === 0 ? (
        <EmptyView />
      ) : (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {notes.map((note) => (
            <NoteItem key={note._id} note={note} />
          ))}
        </section>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: ReactNode;
}) {
  return (
    <div className="surface-soft rounded-[1.5rem] border p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow">{label}</p>
        <div className="rounded-full bg-primary/10 p-2 text-primary">{icon}</div>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-[-0.05em]">{value}</p>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">{detail}</p>
    </div>
  );
}

function EmptyView() {
  return (
    <section className="surface-card rounded-[2rem] border px-6 py-12 text-center sm:px-10">
      <p className="eyebrow">No notes yet</p>
      <h2 className="mt-3 text-3xl font-semibold">
        Start with one decision, meeting, or research thread.
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
        Once you create your first note, the workspace becomes searchable and
        the AI assistant can help retrieve what matters later.
      </p>
      <div className="mt-6 flex justify-center">
        <CreateNoteButton />
      </div>
    </section>
  );
}

function LoadingSkeleton() {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="surface-card flex flex-col gap-5 rounded-[1.75rem] border p-6"
        >
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-8 w-3/4 rounded-xl" />
          <Skeleton className="h-20 w-full rounded-[1.25rem]" />
          <Skeleton className="h-20 w-5/6 rounded-[1.25rem]" />
        </div>
      ))}
    </section>
  );
}
