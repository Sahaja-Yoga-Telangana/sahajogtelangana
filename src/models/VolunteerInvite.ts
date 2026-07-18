import mongoose, { Schema } from "mongoose";

const volunteerInviteSchema = new Schema({
  token: {
    type: Schema.Types.String,
    required: [true, "Token is required."],
    unique: true,
    trim: true,
  },
  createdBy: {
    type: Schema.Types.String,
    required: [true, "Creator is required."],
  },
  createdByEmail: {
    type: Schema.Types.String,
    required: [true, "Creator email is required."],
    trim: true,
    lowercase: true,
  },
  status: {
    type: Schema.Types.String,
    enum: ["active", "used", "expired"],
    default: "active",
  },
  usedByEmail: {
    type: Schema.Types.String,
    trim: true,
    lowercase: true,
    default: null,
  },
  usedAt: {
    type: Schema.Types.Date,
    default: null,
  },
  createdAt: {
    type: Schema.Types.Date,
    default: Date.now,
  },
});

volunteerInviteSchema.index({ token: 1 }, { unique: true });
volunteerInviteSchema.index({ createdBy: 1, createdAt: -1 });

export const VolunteerInvite =
  mongoose.models.VolunteerInvite ||
  mongoose.model("VolunteerInvite", volunteerInviteSchema);
