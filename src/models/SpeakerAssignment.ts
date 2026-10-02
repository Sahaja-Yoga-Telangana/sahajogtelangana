import mongoose, { Schema } from "mongoose";

const speakerAssignmentSchema = new Schema({
  sessionKey: {
    type: Schema.Types.String,
    required: true,
    trim: true,
    index: true,
  },
  speakerName: {
    type: Schema.Types.String,
    required: true,
    trim: true,
    maxlength: 80,
  },
  speakerPhone: {
    type: Schema.Types.String,
    required: true,
    trim: true,
    maxlength: 20,
  },
  createdAt: {
    type: Schema.Types.Date,
    default: Date.now,
  },
});

const existingModel = mongoose.models?.SpeakerAssignment as any;

if (existingModel) {
  existingModel.schema.add({
    sessionKey: { type: Schema.Types.String, required: true, trim: true, index: true },
    speakerName: { type: Schema.Types.String, required: true, trim: true, maxlength: 80 },
    speakerPhone: { type: Schema.Types.String, required: true, trim: true, maxlength: 20 },
  });
}

export const SpeakerAssignment = existingModel || mongoose.model("SpeakerAssignment", speakerAssignmentSchema);
