import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const StaffSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Please provide your name"],
      minlength: 2,
      trim: true,
    },
    course: {
      type: String,
      required: [true, "Please provide a course"],
      minlength: 2,
    },
    courseAdvisorFor: {
      type: String,
      default: "100",
    },

    department: {
      type: String,
      required: [true, "Please provide your department"],
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      validate: {
        validator: validator.isEmail,
        message: (props) => `${props.value} is not a valid email`,
      },
      unique: true,
    },
    role: {
      type: String,
      emun: ["lecturer", "HOD", "admin"],
      default: "lecturer",
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 6,
      select: false,
    },
  },
  { timestamps: true }
);

StaffSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Instance mathod to create JWT
StaffSchema.methods.createJWT = function () {
  console.log(this, "this");
  return jwt.sign(
    { userId: this._id, role: this.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

// Instance method to create JWT
StaffSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);

  return isMatch;
};

export default mongoose.model("Staff", StaffSchema);
