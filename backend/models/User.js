import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Please enter your name"], 
      trim: true 
    },
    email: { 
      type: String, 
      required: [true, "Please enter your email"], 
      unique: true, 
      lowercase: true, 
      trim: true 
    },
    phone: { 
      type: String, 
      trim: true 
    },
    password: { 
      type: String, 
      required: [true, "Password is required"], 
      minlength: [6, "Password must be at least 6 characters"], 
      select: false,
      unique: true // don't return password in queries
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // other users they add as friends
      },
    ],
    groups: [
      {
        type: String, // e.g. "Goa Trip", "Flatmates"
        trim: true,
      },
    ],
    totalBalance: {
      type: Number,
      default: 0, // net balance (owed vs owing)
    },
    profilePic: {
      type: String, // optional profile picture URL
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
