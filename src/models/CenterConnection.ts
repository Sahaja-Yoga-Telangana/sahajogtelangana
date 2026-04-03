import mongoose, { Schema } from "mongoose";

const centerConnectionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  userEmail: {
    type: Schema.Types.String,
    required: [true, "User email is required."],
    trim: true,
    lowercase: true,
  },
  centerId: {
    type: Schema.Types.ObjectId,
    ref: "Center",
    required: [true, "Center is required."],
  },
  connectionType: {
    type: Schema.Types.String,
    enum: ["saved", "joined"],
    required: [true, "Connection type is required."],
  },
  createdAt: {
    type: Schema.Types.Date,
    default: Date.now,
  },
});

centerConnectionSchema.index({ userEmail: 1, centerId: 1, connectionType: 1 }, { unique: true });
centerConnectionSchema.index({ userId: 1, createdAt: -1 });
centerConnectionSchema.index({ userEmail: 1, createdAt: -1 });
centerConnectionSchema.index({ centerId: 1, connectionType: 1 });

const existingCenterConnectionModel = mongoose.models.CenterConnection as any;

if (existingCenterConnectionModel) {
  existingCenterConnectionModel.schema.add({
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    userEmail: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      lowercase: true,
    },
    centerId: {
      type: Schema.Types.ObjectId,
      ref: "Center",
      required: true,
    },
    connectionType: {
      type: Schema.Types.String,
      enum: ["joined"],
      required: true,
    },
    createdAt: {
      type: Schema.Types.Date,
      default: Date.now,
    },
  });
}

export const CenterConnection =
  existingCenterConnectionModel ||
  mongoose.model("CenterConnection", centerConnectionSchema);
