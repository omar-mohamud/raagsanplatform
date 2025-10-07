/*
  Usage (PowerShell):
  node scripts/import_from_folder.js ./sepow_photos sepow "SEPOW Photos" photos
  Args:
    1) localFolderPath (required) - path to folder with images
    2) projectSlug (required)
    3) projectTitle (required)
    4) storySlug (optional, default: "gallery")
*/

import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config({ path: path.join(process.cwd(), ".env.local") });
let cloudinary;
let dbConnect;
let Project;
let Story;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const [,, localFolderPathArg, projectSlug, projectTitle, storySlugArg] = process.argv;
  if (!localFolderPathArg || !projectSlug || !projectTitle) {
    console.error("Usage: node scripts/import_from_folder.js <folder> <projectSlug> <projectTitle> [storySlug]");
    process.exit(1);
  }
  const storySlug = storySlugArg || "gallery";
  const localFolderPath = path.isAbsolute(localFolderPathArg)
    ? localFolderPathArg
    : path.join(process.cwd(), localFolderPathArg);

  // Load modules that depend on env AFTER dotenv is configured
  ({ default: cloudinary } = await import("../lib/cloudinary.js"));
  ({ dbConnect } = await import("../lib/dbConnect.js"));
  ({ default: Project } = await import("../models/Project.js"));
  ({ default: Story } = await import("../models/Story.js"));

  await dbConnect();

  let project = await Project.findOne({ slug: projectSlug });
  if (!project) {
    project = await Project.create({ slug: projectSlug, title: projectTitle, status: "published" });
    console.log("Created project:", project.slug);
  } else {
    console.log("Using existing project:", project.slug);
  }

  const entries = await fs.readdir(localFolderPath, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile()).map((e) => path.join(localFolderPath, e.name));
  const allowed = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
  const images = files.filter((f) => allowed.has(path.extname(f).toLowerCase()));
  if (images.length === 0) {
    console.error("No image files found in:", localFolderPath);
    process.exit(1);
  }

  const folder = `raagsan/${projectSlug}`;
  const sections = [];
  for (const imgPath of images) {
    const publicIdBase = path.basename(imgPath, path.extname(imgPath));
    console.log("Uploading:", imgPath);
    const uploaded = await cloudinary.uploader.upload(imgPath, { folder, public_id: publicIdBase, overwrite: false });
    sections.push({ type: "image", url: uploaded.secure_url, alt: publicIdBase });
  }

  let story = await Story.findOne({ slug: storySlug });
  if (!story) {
    story = await Story.create({ projectId: project._id, slug: storySlug, title: projectTitle, sections, visibility: "public" });
    console.log("Created story:", story.slug);
  } else {
    story.sections = sections;
    await story.save();
    console.log("Updated story sections:", story.slug);
  }

  console.log("Done. View at /projects/" + project.slug + " and /stories/" + story.slug);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


