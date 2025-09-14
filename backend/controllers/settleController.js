import Expense from "../models/Expense.js";
import User from "../models/User.js";
import Settlement from "../models/Settlement.js";

const round2 = (num) => Math.round(num * 100) / 100;

export const settleGroup = async (req, res) => {
    try {
        const { groupId } = req.params;

        // Fetch all expenses of the group and populate user references
        const expenses = await Expense.find({ group: groupId }).populate("paidBy participants.user");

        if (!expenses.length) {
            return res.status(404).json({ message: "No expenses found for this group" });
        }

        const balanceMap = {}; // userId -> net balance

        // Compute net balances
        for (const expense of expenses) {
            // Validate paidBy
            if (!expense.paidBy || !expense.paidBy._id) {
                console.error("Invalid paidBy in expense:", expense._id);
                continue;
            }
            balanceMap[expense.paidBy._id] = round2((balanceMap[expense.paidBy._id] || 0) + expense.amount);

            // Validate participants
            for (const p of expense.participants) {
                if (!p.user || !p.user._id) {
                    console.error("Invalid participant in expense:", expense._id);
                    continue;
                }
                balanceMap[p.user._id] = round2((balanceMap[p.user._id] || 0) - p.share);
            }
        }

        // Separate debtors and creditors
        const debtors = [], creditors = [];
        for (const [userId, balance] of Object.entries(balanceMap)) {
            const rounded = round2(balance);
            if (rounded < -0.01) debtors.push({ userId, amount: -rounded });
            else if (rounded > 0.01) creditors.push({ userId, amount: rounded });
        }

        debtors.sort((a, b) => b.amount - a.amount);
        creditors.sort((a, b) => b.amount - a.amount);

        // Greedy settlement
        const transactions = [];
        let i = 0, j = 0;
        while (i < debtors.length && j < creditors.length) {
            const debtor = debtors[i], creditor = creditors[j];
            const settledAmount = round2(Math.min(debtor.amount, creditor.amount));
            if (settledAmount > 0.01) {
                transactions.push({ from: debtor.userId, to: creditor.userId, amount: settledAmount });
            }
            debtor.amount = round2(debtor.amount - settledAmount);
            creditor.amount = round2(creditor.amount - settledAmount);
            if (debtor.amount <= 0.01) i++;
            if (creditor.amount <= 0.01) j++;
        }

        // Populate names for frontend
        const populatedTx = await Promise.all(
            transactions.map(async tx => ({
                from: (await User.findById(tx.from))?.name || "Unknown",
                to: (await User.findById(tx.to))?.name || "Unknown",
                amount: tx.amount
            }))
        );

        // Save settlement record
        const settlementRecord = new Settlement({
            group: groupId,
            transactions,
            settledBy: req.user._id  // <-- add this
        });
        await settlementRecord.save();

        // Optional: mark all expenses as settled
        await Expense.updateMany({ group: groupId }, { $set: { settled: true } });

        res.json({ message: "Settlement calculated successfully", transactions: populatedTx });

    } catch (error) {
        console.error("Error in settleGroup:", error);
        res.status(500).json({ message: "Server error in settlement" });
    }
};

export const getSettlements = async (req, res) => {
    try {
        const { groupId } = req.params;

        // Fetch settlements for the group
        const settlements = await Settlement.find({ group: groupId })
            .sort({ createdAt: -1 }) // newest first
            .populate("transactions.from transactions.to", "name");

        // Format for frontend
        const formatted = settlements.map(s => ({
            id: s._id,
            date: s.createdAt,
            transactions: s.transactions.map(t => ({
                from: t.from?.name || "Unknown",
                to: t.to?.name || "Unknown",
                amount: t.amount
            }))
        }));

        res.json({ groupId, settlements: formatted });

    } catch (error) {
        console.error("Error in getSettlements:", error);
        res.status(500).json({ message: "Server error fetching settlements" });
    }
};




