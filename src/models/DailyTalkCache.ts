import mongoose, { Schema } from "mongoose";

const dailyTalkCacheSchema = new Schema({
  key: {
    type: Schema.Types.String,
    required: [true, "Cache key is required."],
    unique: true,
    trim: true,
  },
  data: {
    type: Schema.Types.Mixed,
    default: null,
  },
  updatedAt: {
    type: Schema.Types.Date,
    default: Date.now,
  },
});

export const DailyTalkCache =
  (mongoose.models.DailyTalkCache as mongoose.Model<any>) ||
  mongoose.model("DailyTalkCache", dailyTalkCacheSchema);
