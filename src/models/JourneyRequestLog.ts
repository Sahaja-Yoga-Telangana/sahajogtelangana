import mongoose, { Schema } from "mongoose";

const journeyRequestLogSchema = new Schema({
  routeKey: {
    type: Schema.Types.String,
    required: true,
    trim: true,
  },
  fingerprint: {
    type: Schema.Types.String,
    required: true,
    trim: true,
    index: true,
  },
  createdAt: {
    type: Schema.Types.Date,
    default: Date.now,
    expires: 60 * 60 * 24,
  },
});

journeyRequestLogSchema.index({ routeKey: 1, fingerprint: 1, createdAt: -1 });

const existingJourneyRequestLogModel = mongoose.models.JourneyRequestLog as any;

export const JourneyRequestLog =
  existingJourneyRequestLogModel || mongoose.model("JourneyRequestLog", journeyRequestLogSchema);
