import mongoose, { Schema } from "mongoose";

const volunteerAssessmentSchema = new Schema({
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
  phone: {
    type: Schema.Types.String,
    trim: true,
    default: "",
  },
  city: {
    type: Schema.Types.String,
    trim: true,
    default: "",
  },
  interests: {
    type: [Schema.Types.String],
    default: [],
  },
  availability: {
    type: Schema.Types.String,
    trim: true,
    default: "",
  },
  experience: {
    type: Schema.Types.String,
    trim: true,
    default: "",
  },
  answers: {
    type: Schema.Types.Map,
    of: Schema.Types.String,
    default: {},
  },
  score: {
    type: Schema.Types.Number,
    default: 0,
  },
  maxScore: {
    type: Schema.Types.Number,
    default: 0,
  },
  wordCount: {
    type: Schema.Types.Number,
    default: 0,
  },
  status: {
    type: Schema.Types.String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  createdAt: {
    type: Schema.Types.Date,
    default: Date.now,
  },
  reviewedAt: {
    type: Schema.Types.Date,
    default: null,
  },
});

volunteerAssessmentSchema.index({ createdAt: -1 });
volunteerAssessmentSchema.index({ email: 1 });
volunteerAssessmentSchema.index({ status: 1, score: -1 });

export const VolunteerAssessment =
  mongoose.models.VolunteerAssessment ||
  mongoose.model("VolunteerAssessment", volunteerAssessmentSchema);
