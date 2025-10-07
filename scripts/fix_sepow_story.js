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

  // Try to find a story under the project; prefer slug 'gallery'
  let story = await Story.findOne({ projectId: project._id, slug: "gallery" });
  if (!story) {
    story = await Story.findOne({ projectId: project._id }).sort({ createdAt: -1 });
  }
  if (!story) throw new Error("No story found for 'sepow'");

  story.slug = "gallery";
  story.title = "SEPOW Photos";
  await story.save();

  // Set a hero image on the project using the Cloudinary upload public id 'hero'
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (cloudName) {
    project.heroImage = `https://res.cloudinary.com/${cloudName}/image/upload/raagsan/sepow/hero`;
  }
  if (!project.summary) {
    project.summary = "SEPOW explores how women-led households navigate displacement, livelihoods, and aspirations.";
  }
  await project.save();

  console.log("Updated story to slug 'gallery' and title 'SEPOW Photos'. Set hero image and summary on project.");
}

main().catch((e) => { console.error(e); process.exit(1); });


