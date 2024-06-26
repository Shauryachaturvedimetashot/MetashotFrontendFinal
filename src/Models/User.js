import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    companyname: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    type:{
      type: String,
      required: true,
      default: "company"
    }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
