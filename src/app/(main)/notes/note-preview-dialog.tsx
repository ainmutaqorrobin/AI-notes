"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  formatNoteDate,
  getReadingMinutes,
  getNoteWordCount,
} from "@/lib/note-metadata";
import { useMutation } from "convex/react";
import { Clock3, FileText, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";
import { Doc } from "../../../../convex/_generated/dataModel";

interface NotePreviewDialogProps {
  note: Doc<"notes">;
}

export function NotePreviewDialog({ note }: NotePreviewDialogProps) {
  const searchParams = useSearchParams();
  const isOpen = searchParams.get("noteId") === note._id;
  const [deletePending, setDeletePending] = useState(false);
  const deleteNote = useMutation(api.notes.deleteNote);

  async function handleDelete() {
    setDeletePending(true);
    try {
      await deleteNote({ noteId: note._id });
      toast.success("Note deleted");
      handleClose();
    } catch (error) {
      console.error("Failed to delete note", error);
      toast.error("Failed to delete note. Please try again.");
    } finally {
      setDeletePending(false);
    }
  }

  function handleClose() {
    if (deletePending) return;
    window.history.pushState(null, "", window.location.pathname);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[85vh] overflow-hidden sm:max-w-3xl">
        <DialogHeader className="border-b border-border/70 pb-5">
          <p className="eyebrow">{formatNoteDate(note._creationTime)}</p>
          <DialogTitle className="mt-2 text-3xl leading-tight">
            {note.title}
          </DialogTitle>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <MetaChip icon={<FileText className="size-3.5" />}>
              {getNoteWordCount(note.body)} words
            </MetaChip>
            <MetaChip icon={<Clock3 className="size-3.5" />}>
              {getReadingMinutes(note.body)} min read
            </MetaChip>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto pr-1">
          <div className="surface-soft rounded-[1.6rem] border p-5">
            <div className="prose prose-neutral max-w-none whitespace-pre-wrap text-sm leading-8 text-foreground dark:prose-invert">
              {note.body}
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-border/70 pt-5">
          <Button
            variant="destructive"
            className="gap-2"
            onClick={handleDelete}
            disabled={deletePending}
          >
            <Trash2 className="size-4" />
            {deletePending ? "Deleting..." : "Delete note"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MetaChip({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <span className="surface-soft inline-flex items-center gap-2 rounded-full border px-3 py-1.5">
      {icon}
      {children}
    </span>
  );
}
