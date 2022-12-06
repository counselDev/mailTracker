import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const StudentSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "Please provide your firstname"],
      minlength: 2,
      trim: true,
    },
    lastname: {
      type: String,
      required: [true, "Please provide your lastname"],
      minlength: 2,
      trim: true,
    },
    gender: {
      type: String,
      required: [true, "Please provide a gender"],
      enum: ["male", "female"],
    },
    phone: {
      type: String,
      required: [true, "Please provide a phone"],
    },

    department: {
      type: "String",
      required: [true, "Please provide your department"],
      minlength: 3,
    },
    regNum: {
      type: String,
      required: [true, "Please provide your regNum"],
      minlength: 3,
    },
    entryYear: {
      type: String,
      required: [true, "Please provide your entryYear"],
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
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 6,
      select: false,
    },
  },
  { timestamps: true }
);

StudentSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Instance mathod to create JWT
StudentSchema.methods.createJWT = function () {

  return jwt.sign(
    { userId: this._id, role: this.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

// Instance method to create JWT
StudentSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);

  return isMatch;
};


export default mongoose.model("Student", StudentSchema);
