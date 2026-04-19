import mongoose, { Schema } from "mongoose";

const eventRequestSchema = new Schema({
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
  eventName: {
    type: Schema.Types.String,
    required: [true, "Event name is required."],
    trim: true,
  },
  description: {
    type: Schema.Types.String,
    required: [true, "Description is required."],
    trim: true,
  },
  proposedStartDate: {
    type: Schema.Types.Date,
    required: [true, "A proposed start date is required."],
  },
  proposedEndDate: {
    type: Schema.Types.Date,
    required: false,
  },
  time: {
    type: Schema.Types.String,
    required: [true, "Time is required."],
    trim: true,
  },
  location: {
    type: Schema.Types.String,
    required: [true, "Location or center is required."],
    trim: true,
  },
  googleMapLink: {
    type: Schema.Types.String,
    trim: true,
    default: "",
  },
  contactDetails: {
    type: Schema.Types.String,
    trim: true,
    default: "",
  },
  priceBelow12: {
    type: Schema.Types.Number,
    default: 0,
  },
  price12To24: {
    type: Schema.Types.Number,
    default: 0,
  },
  price25AndAbove: {
    type: Schema.Types.Number,
    default: 0,
  },
  image: {
    type: Schema.Types.String,
    trim: true,
    default: "",
  },
  qrImage: {
    type: Schema.Types.String,
    trim: true,
    default: "",
  },
  additionalNotes: {
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
  approvedEventId: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: false,
  },
  createdAt: {
    type: Schema.Types.Date,
    default: Date.now,
  },
});

eventRequestSchema.index({ createdAt: -1 });
eventRequestSchema.index({ email: 1, status: 1 });

export const EventRequest =
  mongoose.models.EventRequest ||
  mongoose.model("EventRequest", eventRequestSchema);
