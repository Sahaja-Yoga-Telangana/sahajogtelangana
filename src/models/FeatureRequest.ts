import mongoose, { Schema } from "mongoose";

const featureRequestSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  name: {
    type: Schema.Types.String,
    required: [true, "Name is required."],
    trim: true,
  },
  email: {
    type: Schema.Types.String,
    required: [true, "Email is required."],
    trim: true,
    lowercase: true,
  },
  title: {
    type: Schema.Types.String,
    required: [true, "Feature title is required."],
    trim: true,
  },
  description: {
    type: Schema.Types.String,
    required: [true, "Description is required."],
    trim: true,
  },
  category: {
    type: Schema.Types.String,
    trim: true,
    default: "",
  },
  useCase: {
    type: Schema.Types.String,
    trim: true,
    default: "",
  },
  status: {
    type: Schema.Types.String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  adminNotes: {
    type: Schema.Types.String,
    trim: true,
    default: "",
  },
  reviewedAt: {
    type: Schema.Types.Date,
    required: false,
  },
  reviewedBy: {
    type: Schema.Types.String,
    trim: true,
    default: "",
  },
  createdAt: {
    type: Schema.Types.Date,
    default: Date.now,
  },
});

featureRequestSchema.index({ createdAt: -1 });
featureRequestSchema.index({ email: 1, status: 1 });

export const FeatureRequest =
  mongoose.models.FeatureRequest ||
  mongoose.model("FeatureRequest", featureRequestSchema);
