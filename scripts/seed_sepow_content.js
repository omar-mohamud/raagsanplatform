import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

let dbConnect; let Project; let Story;

async function main() {
  ({ dbConnect } = await import("../lib/dbConnect.js"));
  ({ default: Project } = await import("../models/Project.js"));
  ({ default: Story } = await import("../models/Story.js"));

  await dbConnect();
  const project = await Project.findOne({ slug: "sepow" });
  if (!project) throw new Error("Project 'sepow' not found");

  // Clean title/hero
  project.title = "SEPOW";
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (cloudName) {
    project.heroImage = `https://res.cloudinary.com/${cloudName}/image/upload/raagsan/sepow/hero`;
  }
  await project.save();

  // Find gallery story
  const story = await Story.findOne({ projectId: project._id, slug: "gallery" });
  if (!story) throw new Error("Story 'gallery' not found for sepow");

  // Add placeholder text under headings if missing
  const sections = [];
  for (const block of story.sections || []) {
    sections.push(block);
    if (block?.type === "heading") {
      sections.push({ type: "text", content: "Placeholder content for this section. Replace with SEPOW narrative." });
    }
  }
  story.sections = sections;
  await story.save();
  console.log("Seeded SEPOW content and cleaned project title/hero.");
}

main().catch((e) => { console.error(e); process.exit(1); });


