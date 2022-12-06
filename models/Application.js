import mongoose from "mongoose";
import validator from "validator";

const ApplicationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      minlength: 5,
      trim: true,
    },
    sender: {
      name: String,
      entryYear: String,
      studentId: {
        type: mongoose.Types.ObjectId,
        ref: "Student",
      },
      email: {
        type: String,
        required: [true, "Please provide email"],
        validate: {
          validator: validator.isEmail,
          message: (props) => `${props.value} is not a valid email`,
        },
      },
      regNum: String,
      department: String,
    },
    recipient: {
      name: String,
      email: {
        type: String,
        required: [true, "Please provide email"],
        validate: {
          validator: validator.isEmail,
          message: (props) => `${props.value} is not a valid email`,
        },
      },

      staffId: {
        type: mongoose.Types.ObjectId,
        ref: "Staff",
      },
      role: String,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      default: "message_sent",
      enum: [
        "message_sent",
        "CA_approval",
        "HOD_approval",
        "processing",
        "completed",
      ],
    },

    attachments: {
      type: [String],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Application", ApplicationSchema);
