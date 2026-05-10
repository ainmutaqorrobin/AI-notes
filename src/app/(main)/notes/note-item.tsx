"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNoteDate, getNoteWordCount } from "@/lib/note-metadata";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { Doc } from "../../../../convex/_generated/dataModel";
import { NotePreviewDialog } from "./note-preview-dialog";

interface NoteItemProps {
  note: Doc<"notes">;
}

export function NoteItem({ note }: NoteItemProps) {
  const metadata = `${getNoteWordCount(note.body)} words`;

  function openNote() {
    window.history.pushState(null, "", `?noteId=${note._id}`);
  }

  return (
    <>
      <Card
        className="group cursor-pointer gap-5 rounded-[1.8rem] px-1 py-1 transition duration-200 hover:-translate-y-0.5 hover:border-primary/30"
        onClick={openNote}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openNote();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <CardHeader className="gap-4 px-5 pt-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="eyebrow">{formatNoteDate(note._creationTime)}</p>
              <CardTitle className="text-2xl leading-tight">{note.title}</CardTitle>
            </div>
            <div className="rounded-full border border-border/80 bg-background/60 p-2 text-muted-foreground transition group-hover:text-primary">
              <ArrowUpRight className="size-4" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-5 pb-5">
          <div className="surface-soft rounded-[1.4rem] border p-4">
            <p className="line-clamp-5 whitespace-pre-line text-sm leading-7 text-muted-foreground">
              {note.body}
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Clock3 className="size-3.5" />
            <span>{metadata}</span>
          </div>
        </CardContent>
      </Card>
      <NotePreviewDialog note={note} key={note._id} />
    </>
  );
}
