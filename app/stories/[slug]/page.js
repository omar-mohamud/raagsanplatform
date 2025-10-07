import { dbConnect } from "@/lib/dbConnect";
import Story from "@/models/Story";
import Project from "@/models/Project";

export default async function StoryPage({ params }) {
  const { slug } = await params;
  await dbConnect();
  const story = await Story.findOne({ slug }).lean();
  if (!story) {
    return (
      <main>
        <h1 className="text-xl font-semibold">Story not found</h1>
      </main>
    );
  }
  const project = await Project.findById(story.projectId).lean();
  return (
    <main>
      <a className="text-sm text-blue-600 hover:underline" href={`/projects/${project?.slug || ""}`}>← Back to {project?.title || "Project"}</a>
      <h1 className="mt-3 text-2xl font-semibold">{story.title}</h1>
      {/* Table of contents */}
      <nav className="mt-4 border-l pl-4">
        <ul className="space-y-1">
          {story.sections?.filter((b) => b?.type === "heading" && b.text)
            .map((b, i) => {
              const id = (b.text || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
              return (
                <li key={`toc-${i}`} className="text-sm">
                  <a className="text-blue-600 hover:underline" href={`#${id}`}>{b.text}</a>
                </li>
              );
            })}
        </ul>
      </nav>
      {Array.isArray(story.sections) && story.sections.length > 0 ? (
        <section className="mt-6 space-y-6">
          {story.sections.map((block, idx) => {
            if (block?.type === "heading") {
              const id = (block.text || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
              const Tag = `h${Math.min(Math.max(block.level || 2, 1), 3)}`;
              return <Tag key={idx} id={id} className="scroll-mt-20 text-xl font-semibold">{block.text}</Tag>;
            }
            if (block?.type === "text") return <p key={idx} className="leading-7">{block.content}</p>;
            if (block?.type === "image") return (
              <figure key={idx}>
                <img src={block.url} alt={block.alt || ""} className="max-h-[480px]" />
                {block.alt && <figcaption className="text-sm text-gray-500">{block.alt}</figcaption>}
              </figure>
            );
            if (block?.type === "embed") return (
              <div key={idx} className="aspect-video">
                <iframe src={block.url} className="w-full h-full" allowFullScreen />
              </div>
            );
            if (!block?.type && typeof block === "string") return <p key={idx}>{block}</p>;
            return null;
          })}
        </section>
      ) : (
        <p className="mt-4 text-gray-600">No content yet.</p>
      )}
    </main>
  );
}


