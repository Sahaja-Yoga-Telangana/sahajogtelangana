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
    required: [true, "Zone field is required."],
    trim: true,
  },
  city: {
    type: Schema.Types.String,
    trim: true,
    default: "Hyderabad",
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
  weeklyUpdate: {
    type: Schema.Types.String,
    trim: true,
    default: "",
  },
  announcement: {
    type: Schema.Types.String,
    trim: true,
    default: "",
  },
  createdAt: {
    type: Schema.Types.Date,
    default: Date.now,
  },
});

const existingCenterModel = mongoose.models?.Center as any;

if (existingCenterModel) {
  existingCenterModel.schema.add({
    city: {
      type: Schema.Types.String,
      trim: true,
      default: "Hyderabad",
    },
    link: {
      type: Schema.Types.String,
      trim: true,
      default: "",
    },
    weeklyUpdate: {
      type: Schema.Types.String,
      trim: true,
      default: "",
    },
    announcement: {
      type: Schema.Types.String,
      trim: true,
      default: "",
    },
  });
}

export const Center = existingCenterModel || mongoose.model("Center", centerSchema);
