import { authTables } from "@convex-dev/auth/server";
import { defineSchema } from "convex/server";

const schema = defineSchema({
  ...authTables,
  //Others tables
});

export default schema;
