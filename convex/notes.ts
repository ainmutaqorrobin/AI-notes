import { getAuthUserId } from "@convex-dev/auth/server";
import { mutationGeneric } from "convex/server";
import { v } from "convex/values";

export const createNote = mutationGeneric({
  args: {
    title: v.string(),
    body: v.string(),
  },
  returns: v.id("notes"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User must be logged in to create a note");

    return await ctx.db.insert("notes", {
      title: args.title,
      body: args.body,
      userId,
    });
  },
});
