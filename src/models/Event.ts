import mongoose, { Schema } from "mongoose";
import { EVENT_TYPES } from "@/lib/eventTypes";

const eventTypeField: any = {
  type: Schema.Types.String,
  enum: EVENT_TYPES,
  required: [true, "Event type field is required."],
  default: "public_program",
  trim: true,
};

const eventSchema = new Schema({
  title: {
    type: Schema.Types.String,
    required: [true, "Title field is required."],
    trim: true,
  },
  description: {
    type: Schema.Types.String,
    required: [true, "Description field is required."],
    trim: true,
  },
  eventType: eventTypeField,
  date: {
    type: Schema.Types.Date,
    required: [true, "Date field is required."],
  },
  endDate: {
    type: Schema.Types.Date,
    required: false,
  },
  time: {
    type: Schema.Types.String,
    required: [true, "Time field is required."],
    trim: true,
  },
  location: {
    type: Schema.Types.String,
    required: [true, "Location field is required."],
    trim: true,
  },
  googleMapLink: {
    type: Schema.Types.String,
    required: false,
    trim: true,
  },
  contactDetails: {
    type: Schema.Types.String,
    required: false,
    trim: true,
  },
  priceBelow12: {
    type: Schema.Types.Number,
    required: false,
    default: 1000,
  },
  price12To24: {
    type: Schema.Types.Number,
    required: false,
    default: 1800,
  },
  price25AndAbove: {
    type: Schema.Types.Number,
    required: false,
    default: 2600,
  },
  image: {
    type: Schema.Types.String,
    required: false,
    trim: true,
  },
  qrImage: {
    type: Schema.Types.String,
    required: false,
    trim: true,
  },
  isActive: {
    type: Schema.Types.Boolean,
    default: true,
  },
  subscriberNotificationSentAt: {
    type: Schema.Types.Date,
    required: false,
  },
  createdAt: {
    type: Schema.Types.Date,
    default: Date.now,
  },
});

const existingEventModel = mongoose.models.Event as any;

if (existingEventModel) {
  existingEventModel.schema.add({
    eventType: eventTypeField,
    endDate: { type: Schema.Types.Date, required: false },
    googleMapLink: { type: Schema.Types.String, required: false, trim: true },
    contactDetails: { type: Schema.Types.String, required: false, trim: true },
    priceBelow12: { type: Schema.Types.Number, required: false, default: 1000 },
    price12To24: { type: Schema.Types.Number, required: false, default: 1800 },
    price25AndAbove: { type: Schema.Types.Number, required: false, default: 2600 },
    qrImage: { type: Schema.Types.String, required: false, trim: true },
    subscriberNotificationSentAt: { type: Schema.Types.Date, required: false },
  });
}

export const Event: any = existingEventModel || mongoose.model("Event", eventSchema);
