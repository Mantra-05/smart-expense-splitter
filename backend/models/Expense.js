import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  share: { type: Number, required: true }
});

const expenseSchema = new mongoose.Schema({
  group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  participants: [participantSchema]
});

// Custom validation for shares
expenseSchema.pre("save", function (next) {
  const totalShares = this.participants.reduce((sum, p) => sum + p.share, 0);
  if (totalShares !== this.amount) {
    return next(new Error("Sum of participant shares must equal the total expense amount"));
  }
  next();
});

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
