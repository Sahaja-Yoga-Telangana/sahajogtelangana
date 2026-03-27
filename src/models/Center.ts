import mongoose, { Schema } from "mongoose";

const centerSchema = new Schema({
  address: {
    type: Schema.Types.String,
    required: [true, "Address field is required."],
    trim: true,
  },
  day: {
    type: Schema.Types.String,
    required: [true, "Day field is required."],
    trim: true,
  },
  time: {
    type: Schema.Types.String,
    required: [true, "Time field is required."],
    trim: true,
  },
  zone: {
    type: Schema.Types.String,
    required: [true, "Contact persons field is required."],
    trim: true,
  },
  contactNumbers: {
    type: Schema.Types.String,
    required: [true, "Contact numbers field is required."],
    trim: true,
  },
  link: {
    type: Schema.Types.String,
    trim: true,
    default: "",
  },
  createdAt: {
    type: Schema.Types.Date,
    default: Date.now,
  },
});

export const Center = mongoose.models.Center || mongoose.model("Center", centerSchema);
