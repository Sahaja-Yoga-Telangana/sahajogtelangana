import mongoose, { Schema } from "mongoose";

const journeySessionSchema = new Schema({
  sessionKey: {
    type: Schema.Types.String,
    required: [true, "Session key is required."],
    trim: true,
    unique: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  userEmail: {
    type: Schema.Types.String,
    trim: true,
    lowercase: true,
    default: "",
  },
  isNewToMeditation: {
    type: Schema.Types.Boolean,
    required: false,
  },
  preferredMode: {
    type: Schema.Types.String,
    enum: ["in_person", "online", ""],
    default: "",
  },
  city: {
    type: Schema.Types.String,
    trim: true,
    default: "",
  },
  sourcePage: {
    type: Schema.Types.String,
    trim: true,
    default: "",
  },
  latitude: {
    type: Schema.Types.Number,
    required: false,
  },
  longitude: {
    type: Schema.Types.Number,
    required: false,
  },
  startPagePath: {
    type: Schema.Types.String,
    trim: true,
    default: "",
  },
  recommendedCenterId: {
    type: Schema.Types.ObjectId,
    ref: "Center",
    required: false,
  },
  recommendedEventIds: [{
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: false,
  }],
  recommendedCenterSource: {
    type: Schema.Types.String,
    enum: ["local", "sycenters", ""],
    default: "",
  },
  recommendedCenterExternalId: {
    type: Schema.Types.Number,
    required: false,
  },
  recommendedCenterName: {
    type: Schema.Types.String,
    trim: true,
    default: "",
  },
  recommendedCenterCity: {
    type: Schema.Types.String,
    trim: true,
    default: "",
  },
  recommendedEventTitles: [{
    type: Schema.Types.String,
    trim: true,
  }],
  supportRequestedAt: {
    type: Schema.Types.Date,
    required: false,
  },
  status: {
    type: Schema.Types.String,
    enum: ["in_progress", "recommended", "support_requested", "completed"],
    default: "in_progress",
  },
}, {
  timestamps: true,
});

journeySessionSchema.index({ sessionKey: 1 }, { unique: true });
journeySessionSchema.index({ userEmail: 1, updatedAt: -1 });
journeySessionSchema.index({ city: 1, preferredMode: 1, updatedAt: -1 });

const existingJourneySessionModel = mongoose.models.JourneySession as any;

if (existingJourneySessionModel) {
  existingJourneySessionModel.schema.add({
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    userEmail: {
      type: Schema.Types.String,
      trim: true,
      lowercase: true,
      default: "",
    },
    isNewToMeditation: {
      type: Schema.Types.Boolean,
      required: false,
    },
    preferredMode: {
      type: Schema.Types.String,
      enum: ["in_person", "online", ""],
      default: "",
    },
    city: {
      type: Schema.Types.String,
      trim: true,
      default: "",
    },
    sourcePage: {
      type: Schema.Types.String,
      trim: true,
      default: "",
    },
    latitude: {
      type: Schema.Types.Number,
      required: false,
    },
    longitude: {
      type: Schema.Types.Number,
      required: false,
    },
    startPagePath: {
      type: Schema.Types.String,
      trim: true,
      default: "",
    },
    recommendedCenterId: {
      type: Schema.Types.ObjectId,
      ref: "Center",
      required: false,
    },
    recommendedEventIds: [{
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: false,
    }],
    recommendedCenterSource: {
      type: Schema.Types.String,
      enum: ["local", "sycenters", ""],
      default: "",
    },
    recommendedCenterExternalId: {
      type: Schema.Types.Number,
      required: false,
    },
    recommendedCenterName: {
      type: Schema.Types.String,
      trim: true,
      default: "",
    },
    recommendedCenterCity: {
      type: Schema.Types.String,
      trim: true,
      default: "",
    },
    recommendedEventTitles: [{
      type: Schema.Types.String,
      trim: true,
    }],
    supportRequestedAt: {
      type: Schema.Types.Date,
      required: false,
    },
    status: {
      type: Schema.Types.String,
      enum: ["in_progress", "recommended", "support_requested", "completed"],
      default: "in_progress",
    },
  });
}

export const JourneySession =
  existingJourneySessionModel || mongoose.model("JourneySession", journeySessionSchema);
