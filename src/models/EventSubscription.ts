import mongoose, { Schema } from "mongoose";

const eventSubscriptionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  email: {
    type: Schema.Types.String,
    required: [true, "Email is required."],
    trim: true,
    lowercase: true,
    unique: true,
  },
  name: {
    type: Schema.Types.String,
    trim: true,
    default: "",
  },
  isActive: {
    type: Schema.Types.Boolean,
    default: true,
  },
  createdAt: {
    type: Schema.Types.Date,
    default: Date.now,
  },
});

eventSubscriptionSchema.index({ createdAt: -1 });

export const EventSubscription =
  mongoose.models.EventSubscription ||
  mongoose.model("EventSubscription", eventSubscriptionSchema);
