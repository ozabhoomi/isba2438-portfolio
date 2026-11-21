import type { Metadata } from "next";
import { Suspense } from "react";
import BlogPostView from "@/components/BlogPostView";
import PageContainer from "@/components/PageContainer";

export const metadata: Metadata = {
  title: "Blog | Bhoomi Oza",
};

type PostPageProps = { params: Promise<{ slug: string }> };

function Loading() {
  return (
    <p className="text-sm text-aubergine/75">Loading…</p>
  );
}

async function PostContent({ params }: PostPageProps) {
  const { slug } = await params;
  return <BlogPostView slug={slug} />;
}

export default function BlogPostPage({ params }: PostPageProps) {
  return (
    <PageContainer>
      <article className="py-16">
        <Suspense fallback={<Loading />}>
          <PostContent params={params} />
        </Suspense>
      </article>
    </PageContainer>
  );
}
