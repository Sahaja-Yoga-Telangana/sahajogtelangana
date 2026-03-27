import mongoose, { Schema } from "mongoose";

const testimonialSchema = new Schema({
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
  city: {
    type: Schema.Types.String,
    trim: true,
    default: "",
  },
  yearsInSahajaYoga: {
    type: Schema.Types.String,
    trim: true,
    default: "",
  },
  experience: {
    type: Schema.Types.String,
    required: [true, "Experience is required."],
    trim: true,
  },
  isApproved: {
    type: Schema.Types.Boolean,
    default: false,
  },
  approvedAt: {
    type: Schema.Types.Date,
    required: false,
  },
  approvedBy: {
    type: Schema.Types.String,
    trim: true,
    default: "",
  },
  createdAt: {
    type: Schema.Types.Date,
    default: Date.now,
  },
});

testimonialSchema.index({ createdAt: -1 });
testimonialSchema.index({ email: 1 });
testimonialSchema.index({ isApproved: 1, createdAt: -1 });

export const Testimonial =
  mongoose.models.Testimonial || mongoose.model("Testimonial", testimonialSchema);
