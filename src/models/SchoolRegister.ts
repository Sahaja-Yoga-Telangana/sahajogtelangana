import mongoose, { Schema } from "mongoose";

const schoolRegisterSchema = new Schema({
  schoolName: {
    type: Schema.Types.String,
    required: [true, "School name is required."],
    trim: true,
    unique: true,
  },
  contactPerson: {
    name: {
      type: Schema.Types.String,
      required: [true, "Contact person's name is required."],
      trim: true,
    },
    role: {
      type: Schema.Types.String,
      required: [true, "Contact person's role is required."],
      trim: true,
    },
    email: {
      type: Schema.Types.String,
      required: [true, "Contact person's email is required."],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address.'],
    },
    phone: {
      type: Schema.Types.String,
      required: [true, "Contact person's phone number is required."],
      trim: true,
    },
  },
  schoolAddress: {
    street: {
      type: Schema.Types.String,
      required: [true, "Street address is required."],
      trim: true,
    },
    city: {
      type: Schema.Types.String,
      required: [true, "City is required."],
      trim: true,
    },
    state: {
      type: Schema.Types.String,
      required: [true, "State is required."],
      trim: true,
    },
  },
  preferredProgramDate: {
    type: Schema.Types.Date,
  },
  additionalRemarks: {
    type: Schema.Types.String,
    trim: true,
  },
}, {
  timestamps: true,
});

export const SchoolRegister = mongoose.models.SchoolRegister || mongoose.model("SchoolRegister", schoolRegisterSchema);
