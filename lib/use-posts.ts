import { useEffect, useState } from "react";
import type { BlogPost } from "./blogs";

export default function usePosts(refreshKey = 0) {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [listError, setListError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/blogs")
      .then((res) => {
        if (!res.ok) throw new Error("list request failed");
        return res.json() as Promise<{ posts?: BlogPost[] }>;
      })
      .then((body) => {
        if (cancelled) return;
        setPosts(body.posts ?? []);
        setListError(null);
      })
      .catch(() => {
        if (cancelled) return;
        setListError("Couldn't load posts. Please refresh the page.");
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return { posts, listError, loading: posts === null };
}
