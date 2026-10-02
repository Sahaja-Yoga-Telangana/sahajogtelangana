import mongoose, { Schema } from "mongoose";

const tourSessionSchema = new Schema({
  sno: {
    type: Schema.Types.Number,
    default: 0,
  },
  speaker: {
    type: Schema.Types.String,
    default: "",
    trim: true,
  },
  speakerPhone: {
    type: Schema.Types.String,
    default: "",
    trim: true,
  },
  institution: {
    type: Schema.Types.String,
    required: true,
    trim: true,
  },
  branch: {
    type: Schema.Types.String,
    default: "",
    trim: true,
  },
  principal: {
    type: Schema.Types.String,
    default: "",
    trim: true,
  },
  phone: {
    type: Schema.Types.String,
    default: "",
    trim: true,
  },
  date: {
    type: Schema.Types.String,
    default: "",
  },
  dateKey: {
    type: Schema.Types.String,
    default: "",
    index: true,
  },
  time: {
    type: Schema.Types.String,
    default: "",
  },
  remarks: {
    type: Schema.Types.String,
    default: "",
  },
  students: {
    type: Schema.Types.Number,
    default: null,
  },
  direction: {
    type: Schema.Types.String,
    default: "",
  },
  approvalBy: {
    type: Schema.Types.String,
    default: "",
    trim: true,
  },
  approvalContact: {
    type: Schema.Types.String,
    default: "",
    trim: true,
  },
  mapUrl: {
    type: Schema.Types.String,
    default: "",
  },
  maxSpeakers: {
    type: Schema.Types.Number,
    default: 4,
  },
  createdAt: {
    type: Schema.Types.Date,
    default: Date.now,
  },
});

const existingModel = mongoose.models?.TourSession as any;

if (existingModel) {
  existingModel.schema.add({
    sno: { type: Schema.Types.Number, default: 0 },
    speaker: { type: Schema.Types.String, default: "", trim: true },
    speakerPhone: { type: Schema.Types.String, default: "", trim: true },
    institution: { type: Schema.Types.String, required: true, trim: true },
    branch: { type: Schema.Types.String, default: "", trim: true },
    principal: { type: Schema.Types.String, default: "", trim: true },
    phone: { type: Schema.Types.String, default: "", trim: true },
    date: { type: Schema.Types.String, default: "" },
    dateKey: { type: Schema.Types.String, default: "", index: true },
    time: { type: Schema.Types.String, default: "" },
    remarks: { type: Schema.Types.String, default: "" },
    students: { type: Schema.Types.Number, default: null },
    direction: { type: Schema.Types.String, default: "" },
    approvalBy: { type: Schema.Types.String, default: "", trim: true },
    approvalContact: { type: Schema.Types.String, default: "", trim: true },
    mapUrl: { type: Schema.Types.String, default: "" },
    maxSpeakers: { type: Schema.Types.Number, default: 4 },
  });
}

export const TourSession = existingModel || mongoose.model("TourSession", tourSessionSchema);
