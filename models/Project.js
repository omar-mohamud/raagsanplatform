import mongoose from "mongoose";
const { Schema, models, model } = mongoose;

const ProjectSchema = new Schema(
  {
    slug: { type: String, unique: true, index: true, required: true },
    title: { type: String, required: true },
    summary: { type: String },
    heroImage: { type: String },
    tags: [{ type: String }],
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date }
  },
  { timestamps: true }
);

export default models.Project || model("Project", ProjectSchema);


