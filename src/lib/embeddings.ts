import { openai } from "@ai-sdk/openai";
import { embedMany } from "ai";

interface EmbeddingObject {
  content: string;
  embedding: number[];
}

const embeddingModel = openai.embedding("text-embedding-3-small");

function generateChunk(input: string) {
  return input
    .split("\n\n")
    .map((chunk) => chunk.trim())
    .filter(Boolean);
}

export async function generateEmbedding(
  value: string
): Promise<Array<EmbeddingObject>> {
  const chunks = generateChunk(value);

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });

  return embeddings.map((embedding, index) => ({
    content: chunks[index],
    embedding,
  }));
}
