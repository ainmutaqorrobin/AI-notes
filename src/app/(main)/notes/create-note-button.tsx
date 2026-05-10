"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "convex/react";
import { NotebookPen, Plus, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "../../../../convex/_generated/api";

const noteFormSchema = z.object({
  title: z.string().min(1, {
    message: "Title cannot be empty.",
  }),
  body: z.string().min(1, {
    message: "Body cannot be empty.",
  }),
});

export function CreateNoteButton() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setDialogOpen(true)} size="lg">
        <Plus className="size-4" />
        Create note
      </Button>
      <CreateNoteDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}

interface CreateNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function CreateNoteDialog({ open, onOpenChange }: CreateNoteDialogProps) {
  const createNote = useAction(api.notesActions.createNote);

  const form = useForm<z.infer<typeof noteFormSchema>>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: "",
      body: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof noteFormSchema>) {
    try {
      await createNote({ title: values.title, body: values.body });
      toast.success("Note created successfully!");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Failed to create note. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="border-b border-border/70 pb-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">New note</p>
              <DialogTitle className="mt-2 text-3xl">Capture context</DialogTitle>
              <DialogDescription className="mt-3 max-w-xl leading-7">
                Write a note that your future self and the AI assistant can both
                understand. Titles should be specific. Bodies should keep the
                useful context.
              </DialogDescription>
            </div>
            <div className="surface-soft hidden rounded-[1.3rem] border p-3 text-primary sm:block">
              <NotebookPen className="size-5" />
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto pr-1">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Pricing narrative for Q3 launch"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      Body
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Key decisions, concerns, assumptions, and what needs follow-up..."
                        {...field}
                        className="min-h-44 resize-y"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="surface-soft rounded-[1.35rem] border p-4 text-sm leading-7 text-muted-foreground">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <Sparkles className="size-4 text-primary" />
                  AI will index this note after save
                </div>
                <p className="mt-2">
                  Clear titles and concrete details improve retrieval quality when
                  you later ask the assistant to find or summarize information.
                </p>
              </div>
            </div>

            <DialogFooter className="mt-6 border-t border-border/70 pt-5">
              <Button type="submit" disabled={isSubmitting} size="lg">
                {isSubmitting ? "Saving..." : "Save note"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
