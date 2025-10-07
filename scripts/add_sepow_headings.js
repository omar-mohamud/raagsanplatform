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
  if (!project) {
    throw new Error("Project 'sepow' not found. Run the import first.");
  }

  // target story slug: gallery
  let story = await Story.findOne({ slug: "gallery", projectId: project._id });
  if (!story) {
    // fallback to any story under project
    story = await Story.findOne({ projectId: project._id });
  }
  if (!story) {
    throw new Error("No story found for project 'sepow'.");
  }

  const headings = [
    { type: "heading", level: 1, text: "Socio-Economic Participation of Women-led Households (SEPOW)" },
    { type: "heading", level: 2, text: "Introduction" },
    { type: "heading", level: 2, text: "Study objectives & methodology" },
    { type: "heading", level: 2, text: "Demographic data" },
    { type: "heading", level: 2, text: "Access to social services" },
    { type: "heading", level: 2, text: "Household income & food security" },
    { type: "heading", level: 2, text: "Social capital" },
    { type: "heading", level: 2, text: "Vocational training & business" },
    { type: "heading", level: 2, text: "Field voices" },
    { type: "heading", level: 2, text: "Recommendations" },
    { type: "heading", level: 2, text: "Conclusions" },
    { type: "heading", level: 2, text: "About & co-creation" }
  ];

  // If story already has headings, avoid duplicating by filtering
  const existingTexts = new Set((story.sections || []).filter(b => b?.type === "heading").map(b => (b.text || "").toLowerCase()));
  const newHeadings = headings.filter(h => !existingTexts.has((h.text || "").toLowerCase()));

  story.sections = [...newHeadings, ...(story.sections || [])];
  await story.save();
  console.log("Updated story:", story.slug, "with", newHeadings.length, "new headings");
}

main().catch((err) => { console.error(err); process.exit(1); });


