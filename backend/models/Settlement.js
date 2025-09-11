import mongoose from "mongoose";

const settlementSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    transactions: [
      {
        from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        amount: { type: Number, required: true },
      },
    ],
    settledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // user who triggered the settlement
      required: true,
    },
  },
  { timestamps: true }
);

const Settlement = mongoose.model("Settlement", settlementSchema);
export default Settlement;
