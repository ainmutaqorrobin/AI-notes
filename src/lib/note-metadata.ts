export function getNoteWordCount(body: string) {
  return body.trim().split(/\s+/).filter(Boolean).length;
}

export function formatNoteDate(creationTime: number) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(creationTime));
}

export function getReadingMinutes(body: string) {
  return Math.max(1, Math.ceil(getNoteWordCount(body) / 180));
}
