import mongoose, { Schema } from "mongoose";

const volunteerInviteSchema = new Schema({
  token: {
    type: Schema.Types.String,
    required: [true, "Token is required."],
    unique: true,
    trim: true,
  },
  tokenHash: {
    type: Schema.Types.String,
    unique: true,
    sparse: true,
    trim: true,
  },
  expiresAt: {
    type: Schema.Types.Date,
    default: null,
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
volunteerInviteSchema.index({ tokenHash: 1 }, { unique: true, sparse: true });
volunteerInviteSchema.index({ createdBy: 1, createdAt: -1 });
volunteerInviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const VolunteerInvite =
  mongoose.models.VolunteerInvite ||
  mongoose.model("VolunteerInvite", volunteerInviteSchema);
