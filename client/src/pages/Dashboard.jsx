import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useAuth } from "../context/AuthContext";

import {
  createExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from "../services/expenseService";

const CHART_COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
];

function Dashboard() {
  const { user, logout } = useAuth();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [savingExpense, setSavingExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getExpenses();

      setExpenses(data.expenses || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load expenses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const totalExpenses = useMemo(() => {
    return expenses.reduce(
      (total, expense) =>
        total + Number(expense.amount || 0),
      0
    );
  }, [expenses]);

  const currentMonthExpenses = useMemo(() => {
    const now = new Date();

    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);

        return (
          expenseDate.getMonth() === now.getMonth() &&
          expenseDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce(
        (total, expense) =>
          total + Number(expense.amount || 0),
        0
      );
  }, [expenses]);

  const selectedMonthTotal = useMemo(() => {
    if (!selectedMonth) {
      return null;
    }

    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);

        const expenseMonth = `${expenseDate.getFullYear()}-${String(
          expenseDate.getMonth() + 1
        ).padStart(2, "0")}`;

        return expenseMonth === selectedMonth;
      })
      .reduce(
        (total, expense) =>
          total + Number(expense.amount || 0),
        0
      );
  }, [expenses, selectedMonth]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const title = expense.title || "";

      const matchesSearch = title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        expense.category === selectedCategory;

      let matchesMonth = true;

      if (selectedMonth) {
        const expenseDate = new Date(expense.date);

        const expenseMonth = `${expenseDate.getFullYear()}-${String(
          expenseDate.getMonth() + 1
        ).padStart(2, "0")}`;

        matchesMonth = expenseMonth === selectedMonth;
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMonth
      );
    });
  }, [
    expenses,
    searchTerm,
    selectedCategory,
    selectedMonth,
  ]);

  const categoryChartData = useMemo(() => {
    const totals = {};

    expenses.forEach((expense) => {
      const category = expense.category || "Other";

      totals[category] =
        (totals[category] || 0) +
        Number(expense.amount || 0);
    });

    return Object.entries(totals).map(
      ([category, amount]) => ({
        category,
        amount,
      })
    );
  }, [expenses]);

  const monthlyChartData = useMemo(() => {
    const totals = {};

    expenses.forEach((expense) => {
      const expenseDate = new Date(expense.date);

      const key = expenseDate.toLocaleDateString(
        "en-IN",
        {
          month: "short",
          year: "numeric",
        }
      );

      totals[key] =
        (totals[key] || 0) +
        Number(expense.amount || 0);
    });

    return Object.entries(totals).map(
      ([month, amount]) => ({
        month,
        amount,
      })
    );
  }, [expenses]);

  const resetForm = () => {
    setFormData({
      title: "",
      amount: "",
      category: "Food",
      date: new Date().toISOString().split("T")[0],
      note: "",
    });

    setEditingExpense(null);
  };

  const handleFormChange = (event) => {
    setFormData((currentData) => ({
      ...currentData,
      [event.target.name]: event.target.value,
    }));
  };

  const openAddExpense = () => {
    resetForm();
    setShowExpenseForm(true);
  };

  const openEditExpense = (expense) => {
    setEditingExpense(expense);

    setFormData({
      title: expense.title || "",
      amount: expense.amount || "",
      category: expense.category || "Food",
      date: expense.date
        ? new Date(expense.date)
            .toISOString()
            .split("T")[0]
        : new Date().toISOString().split("T")[0],
      note: expense.note || "",
    });

    setShowExpenseForm(true);
  };

  const closeExpenseForm = () => {
    setShowExpenseForm(false);
    resetForm();
  };

  const handleSubmitExpense = async (event) => {
    event.preventDefault();

    try {
      setSavingExpense(true);
      setError("");

      const payload = {
        ...formData,
        amount: Number(formData.amount),
      };

      if (editingExpense) {
        const data = await updateExpense(
          editingExpense._id,
          payload
        );

        setExpenses((currentExpenses) =>
          currentExpenses.map((expense) =>
            expense._id === editingExpense._id
              ? data.expense
              : expense
          )
        );
      } else {
        const data = await createExpense(payload);

        setExpenses((currentExpenses) => [
          data.expense,
          ...currentExpenses,
        ]);
      }

      closeExpenseForm();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save expense."
      );
    } finally {
      setSavingExpense(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteExpense(id);

      setExpenses((currentExpenses) =>
        currentExpenses.filter(
          (expense) => expense._id !== id
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete expense."
      );
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Expense Tracker</h1>
          <p>
            Track and manage your daily expenses.
          </p>
        </div>

        <div className="dashboard-user">
          <div>
            <strong>{user?.name || "User"}</strong>
            <span>{user?.email}</span>
          </div>

          <Link
            to="/profile"
            className="profile-button"
          >
            Profile
          </Link>

          <button
            className="logout-button"
            type="button"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-container">
        <section className="welcome-section">
          <h2>
            Welcome back, {user?.name || "User"} 👋
          </h2>

          <p>
            Here is an overview of your spending.
          </p>
        </section>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <section className="summary-grid">
          <div className="summary-card">
            <span>Total Expenses</span>

            <h3>
              ₹{totalExpenses.toLocaleString("en-IN")}
            </h3>

            <p>All time spending</p>
          </div>

          <div className="summary-card">
            <span>
              {selectedMonth
                ? "Selected Month"
                : "This Month"}
            </span>

            <h3>
              ₹
              {(
                selectedMonthTotal ??
                currentMonthExpenses
              ).toLocaleString("en-IN")}
            </h3>

            <p>
              {selectedMonth
                ? "Filtered month spending"
                : "Current month spending"}
            </p>
          </div>

          <div className="summary-card">
            <span>Transactions</span>

            <h3>
              {selectedMonth
                ? filteredExpenses.length
                : expenses.length}
            </h3>

            <p>
              {selectedMonth
                ? "Filtered transactions"
                : "Total transactions"}
            </p>
          </div>
        </section>

        <section className="charts-grid">
          <div className="chart-card">
            <h2>Spending by Category</h2>

            {categoryChartData.length === 0 ? (
              <p className="chart-empty">
                Add expenses to view category insights.
              </p>
            ) : (
              <div className="chart-wrapper">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      dataKey="amount"
                      nameKey="category"
                      cx="50%"
                      cy="45%"
                      innerRadius={55}
                      outerRadius={95}
                      paddingAngle={3}
                      stroke="#111827"
                      strokeWidth={2}
                    >
                      {categoryChartData.map(
                        (entry, index) => (
                          <Cell
                            key={entry.category}
                            fill={
                              CHART_COLORS[
                                index %
                                  CHART_COLORS.length
                              ]
                            }
                          />
                        )
                      )}
                    </Pie>

                    <Tooltip
                      formatter={(value, name) => [
                        `₹${Number(
                          value
                        ).toLocaleString("en-IN")}`,
                        name,
                      ]}
                      contentStyle={{
                        backgroundColor: "#111827",
                        border:
                          "1px solid #334155",
                        borderRadius: "8px",
                      }}
                      labelStyle={{
                        color: "#f8fafc",
                      }}
                      itemStyle={{
                        color: "#f8fafc",
                      }}
                    />

                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      formatter={(value) => (
                        <span
                          style={{
                            color: "#cbd5e1",
                          }}
                        >
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="chart-card">
            <h2>Monthly Spending</h2>

            {monthlyChartData.length === 0 ? (
              <p className="chart-empty">
                Add expenses to view monthly insights.
              </p>
            ) : (
              <div className="chart-wrapper">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={monthlyChartData}
                    margin={{
                      top: 10,
                      right: 15,
                      left: 5,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid
                      stroke="#334155"
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="month"
                      tick={{
                        fill: "#94a3b8",
                      }}
                      axisLine={{
                        stroke: "#334155",
                      }}
                      tickLine={false}
                    />

                    <YAxis
                      tick={{
                        fill: "#94a3b8",
                      }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) =>
                        `₹${Number(
                          value
                        ).toLocaleString("en-IN")}`
                      }
                    />

                    <Tooltip
                      formatter={(value) => [
                        `₹${Number(
                          value
                        ).toLocaleString("en-IN")}`,
                        "Expenses",
                      ]}
                      cursor={{
                        fill:
                          "rgba(59, 130, 246, 0.08)",
                      }}
                      contentStyle={{
                        backgroundColor: "#111827",
                        border:
                          "1px solid #334155",
                        borderRadius: "8px",
                      }}
                      labelStyle={{
                        color: "#f8fafc",
                      }}
                      itemStyle={{
                        color: "#f8fafc",
                      }}
                    />

                    <Bar
                      dataKey="amount"
                      name="Expenses"
                      fill="#3b82f6"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={80}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </section>

        <section className="expense-panel">
          <div className="expense-panel-header">
            <div>
              <h2>Recent Expenses</h2>
              <p>Your latest transactions.</p>
            </div>

            <button
              className="add-expense-button"
              type="button"
              onClick={openAddExpense}
            >
              + Add Expense
            </button>
          </div>

          <div className="expense-filters">
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />

            <select
              value={selectedCategory}
              onChange={(event) =>
                setSelectedCategory(
                  event.target.value
                )
              }
            >
              <option value="All">
                All Categories
              </option>

              <option value="Food">
                Food
              </option>

              <option value="Travel">
                Travel
              </option>

              <option value="Shopping">
                Shopping
              </option>

              <option value="Bills">
                Bills
              </option>

              <option value="Health">
                Health
              </option>

              <option value="Entertainment">
                Entertainment
              </option>

              <option value="Other">
                Other
              </option>
            </select>

            <input
              type="month"
              value={selectedMonth}
              onChange={(event) =>
                setSelectedMonth(
                  event.target.value
                )
              }
              aria-label="Filter expenses by month"
            />

            {selectedMonth && (
              <button
                type="button"
                className="clear-filter-button"
                onClick={() =>
                  setSelectedMonth("")
                }
              >
                Clear Month
              </button>
            )}
          </div>

          {loading ? (
            <div className="empty-expenses">
              <p>Loading expenses...</p>
            </div>
          ) : expenses.length === 0 ? (
            <div className="empty-expenses">
              <h3>No expenses yet</h3>

              <p>
                Add your first expense to start
                tracking your spending.
              </p>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="empty-expenses">
              <h3>No matching expenses</h3>

              <p>
                Try another search term, category,
                or month.
              </p>
            </div>
          ) : (
            <div className="expense-list">
              {filteredExpenses.map(
                (expense) => (
                  <div
                    className="expense-item"
                    key={expense._id}
                  >
                    <div>
                      <h3>
                        {expense.title}
                      </h3>

                      <p>
                        {expense.category} •{" "}
                        {new Date(
                          expense.date
                        ).toLocaleDateString(
                          "en-IN"
                        )}
                      </p>

                      {expense.note && (
                        <p>
                          {expense.note}
                        </p>
                      )}
                    </div>

                    <div className="expense-item-actions">
                      <strong>
                        ₹
                        {Number(
                          expense.amount
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                      <button
                        className="edit-button"
                        type="button"
                        onClick={() =>
                          openEditExpense(
                            expense
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        type="button"
                        onClick={() =>
                          handleDelete(
                            expense._id
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>
      </main>

      {showExpenseForm && (
        <div className="modal-overlay">
          <div className="expense-modal">
            <div className="modal-header">
              <div>
                <h2>
                  {editingExpense
                    ? "Edit Expense"
                    : "Add Expense"}
                </h2>

                <p>
                  {editingExpense
                    ? "Update your expense details."
                    : "Create a new expense transaction."}
                </p>
              </div>

              <button
                className="modal-close"
                type="button"
                onClick={closeExpenseForm}
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleSubmitExpense}
            >
              <div className="form-group">
                <label htmlFor="title">
                  Title
                </label>

                <input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="e.g. Dinner"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="amount">
                  Amount
                </label>

                <input
                  id="amount"
                  type="number"
                  name="amount"
                  placeholder="Enter amount"
                  min="1"
                  value={formData.amount}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">
                  Category
                </label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                >
                  <option value="Food">
                    Food
                  </option>

                  <option value="Travel">
                    Travel
                  </option>

                  <option value="Shopping">
                    Shopping
                  </option>

                  <option value="Bills">
                    Bills
                  </option>

                  <option value="Health">
                    Health
                  </option>

                  <option value="Entertainment">
                    Entertainment
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="date">
                  Date
                </label>

                <input
                  id="date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="note">
                  Note
                </label>

                <textarea
                  id="note"
                  name="note"
                  placeholder="Optional note"
                  value={formData.note}
                  onChange={handleFormChange}
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeExpenseForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="auth-button"
                  disabled={savingExpense}
                >
                  {savingExpense
                    ? "Saving..."
                    : editingExpense
                      ? "Update Expense"
                      : "Save Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;