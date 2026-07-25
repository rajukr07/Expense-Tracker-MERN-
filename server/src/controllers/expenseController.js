const Expense = require("../models/Expense");

const createExpense = async (req, res) => {
  try {
    const { title, amount, category, date, note } = req.body;

    if (!title || !amount || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, amount and category are required",
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than zero",
      });
    }

    const expense = await Expense.create({
      user: req.user._id,
      title: title.trim(),
      amount: Number(amount),
      category,
      date: date || Date.now(),
      note: note ? note.trim() : "",
    });

    return res.status(201).json({
      success: true,
      message: "Expense created successfully",
      expense,
    });
  } catch (error) {
    console.error("Create expense error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create expense",
    });
  }
};

module.exports = {
  createExpense,
};