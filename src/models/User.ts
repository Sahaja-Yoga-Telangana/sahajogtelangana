import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    required: [true, "Name field is required."],
    minLength: [2, "Name must be 2 character long."],
    type: Schema.Types.String,
  },

  email: {
    required: [true, "Email field is required."],
    type: Schema.Types.String,
    unique: true,
    trim: true,
  },
  password: {
    type: Schema.Types.String,
  },
  avtar: {
    required: false,
    type: Schema.Types.String,
  },
  city: {
    required: false,
    type: Schema.Types.String,
    trim: true,
    default: "",
  },
  centerInterest: {
    required: false,
    type: Schema.Types.String,
    trim: true,
    default: "",
  },
  role: {
    required: true,
    type: Schema.Types.String,
    default: "User",
  },
  password_reset_token: {
    required: false,
    type: Schema.Types.String,
    trim: true,
  },
  magic_link_token: {
    required: false,
    type: Schema.Types.String,
    trim: true,
  },
  magic_link_sent_at: {
    required: false,
    type: Schema.Types.Date,
  },
});

const existingUserModel = mongoose.models.User as any;

if (existingUserModel) {
  existingUserModel.schema.add({
    city: {
      type: Schema.Types.String,
      required: false,
      trim: true,
      default: "",
    },
    centerInterest: {
      type: Schema.Types.String,
      required: false,
      trim: true,
      default: "",
    },
  });
}

export const User = existingUserModel || mongoose.model("User", userSchema);
