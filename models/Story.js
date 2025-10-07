import mongoose from "mongoose";
const { Schema, models, model } = mongoose;

const StorySchema = new Schema(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", index: true, required: true },
    slug: { type: String, unique: true, index: true, required: true },
    title: { type: String, required: true },
    coverImage: { type: String },
    authors: [{ type: String }],
    sections: [{ type: Schema.Types.Mixed }],
    datasets: [{ type: String }],
    visibility: { type: String, enum: ["private", "public"], default: "public" },
    publishedAt: { type: Date }
  },
  { timestamps: true }
);

export default models.Story || model("Story", StorySchema);


