"use node";

import { action, internalAction } from "./_generated/server";
import { generateEmbedding, generateEmbeddings } from "../src/lib/embeddings";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { v } from "convex/values";

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

    const embeddings = await generateEmbeddings(text);

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

/**
 * Finds related notes for a user based on semantic similarity to a query.
 *
 * Steps:
 * 1. Generates an embedding vector from the input query text.
 * 2. Searches the `noteEmbeddings` vector index for the closest matches (filtered by userId).
 * 3. Filters out low-relevance results (score <= 0.3).
 * 4. Retrieves the full note documents using the matched embedding IDs.
 *
 * Returns an array of note documents that are semantically similar to the query.
 */
export const findRelatedNotes = internalAction({
  args: {
    query: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args): Promise<Array<Doc<"notes">>> => {
    const embedding = await generateEmbedding(args.query);

    const results = await ctx.vectorSearch("noteEmbeddings", "by_embedding", {
      vector: embedding,
      limit: 16,
      filter: (query) => query.eq("userId", args.userId),
    });
    console.log("vector search result:", results);

    const resultsAboveTreshold = results.filter(
      (result) => result._score > 0.3
    );

    const embeddingIds = resultsAboveTreshold.map((result) => result._id);

    const notes = await ctx.runQuery(internal.notes.fetchNotesByEmbeddingIds, {
      embeddingIds,
    });
    return notes;
  },
});
