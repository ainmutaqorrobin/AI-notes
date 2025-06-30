"use node";

import { action } from "./_generated/server";
import { generateEmbedding } from "../src/lib/embeddings";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

/**
 * Creates a new note with title and body, and generates vector embeddings
 * using OpenAI to support semantic search or AI chat features.
 *
 * 1. Authenticates the user
 * 2. Generates embeddings from title + body
 * 3. Stores the note and embeddings in the database
 */
export const createNote = action({
  args: {
    title: v.string(),
    body: v.string(),
  },
  returns: v.id("notes"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User must be logged in to create a note");

    const text = `${args.title}\n\n${args.body}`;

    const embeddings = await generateEmbedding(text);

    const noteId: Id<"notes"> = await ctx.runMutation(
      internal.notes.createNoteWithEmbeddings,
      {
        title: args.title,
        body: args.body,
        userId,
        embeddings,
      }
    );

    return noteId;
  },
});
