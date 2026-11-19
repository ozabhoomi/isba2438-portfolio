import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");

const writeQueues = new Map<string, Promise<unknown>>();

function dataPath(filename: string): string {
  return path.join(dataDir, filename);
}

function enqueueOnKey<T>(key: string, task: () => Promise<T>): Promise<T> {
  const previous = writeQueues.get(key) ?? Promise.resolve();
  const next = previous.then(task, task);
  writeQueues.set(key, next);
  return next;
}

export async function readJsonArray<T>(filename: string): Promise<T[]> {
  let content: string | undefined;
  try {
    content = await readFile(dataPath(filename), "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  if (content === undefined) {
    return [];
  }

  const parsed: unknown = JSON.parse(content);
  if (!Array.isArray(parsed)) {
    throw new Error(`data/${filename} must contain a JSON array.`);
  }
  return parsed;
}

async function writeJsonArrayAtomic<T>(
  filename: string,
  items: T[]
): Promise<void> {
  const file = dataPath(filename);
  await mkdir(dataDir, { recursive: true });
  const tempFile = `${file}.${randomUUID()}.tmp`;
  await writeFile(tempFile, JSON.stringify(items, null, 2) + "\n", "utf8");
  await rename(tempFile, file);
}

export function writeJsonArray<T>(
  filename: string,
  items: T[]
): Promise<void> {
  return enqueueOnKey(filename, () => writeJsonArrayAtomic(filename, items));
}

export function updateJsonArray<T>(
  filename: string,
  update: (items: T[]) => T[]
): Promise<void> {
  return enqueueOnKey(filename, async () => {
    const items = await readJsonArray<T>(filename);
    await writeJsonArrayAtomic(filename, update(items));
  });
}
