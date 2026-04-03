import mongoose, { Schema } from "mongoose";

const volunteerRequestSchema = new Schema({
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
  status: {
    type: Schema.Types.String,
    trim: true,
    default: "Pending",
  },
  createdAt: {
    type: Schema.Types.Date,
    default: Date.now,
  },
});

volunteerRequestSchema.index({ createdAt: -1 });
volunteerRequestSchema.index({ email: 1, status: 1 });

export const VolunteerRequest =
  mongoose.models.VolunteerRequest ||
  mongoose.model("VolunteerRequest", volunteerRequestSchema);
