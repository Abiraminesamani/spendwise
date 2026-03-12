import { useEffect, useMemo, useState } from "react";
import { COLORS } from "../data/constants.js";
import { fmt, getStyles } from "../utils/helpers.js";

const styles = getStyles(COLORS);

export default function Budgets({
  userBudgets,
  currentMonth,
  currentMonthExpenses,
  userExpenses,
  userCategories,
  deletingKey,
  onAdd,
  onEdit,
  onDelete,
}) {
  const monthOptions = useMemo(() => {
    const months = new Set([currentMonth, ...userBudgets.map((budget) => budget.month).filter(Boolean)]);
    return [...months].sort((left, right) => right.localeCompare(left));
  }, [currentMonth, userBudgets]);

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  useEffect(() => {
    if (!monthOptions.includes(selectedMonth)) {
      setSelectedMonth(currentMonth);
    }
  }, [monthOptions, selectedMonth, currentMonth]);

  const monthBudgets = useMemo(
    () => userBudgets.filter((budget) => budget.month === selectedMonth),
    [selectedMonth, userBudgets],
  );

  const overallBudget = monthBudgets.find((budget) => !budget.category) || null;
  const categoryBudgets = monthBudgets.filter((budget) => budget.category);
  const monthExpenseByCategory = useMemo(() => {
    const totals = {};
    userExpenses
      .filter((expense) => String(expense.date || "").slice(0, 7) === selectedMonth)
      .forEach((expense) => {
        const categoryId = expense.category?.id;
        if (!categoryId) {
          return;
        }
        totals[categoryId] = (totals[categoryId] || 0) + (expense.amount || 0);
      });
    return totals;
  }, [selectedMonth, userExpenses]);
  const overallSpent = selectedMonth === currentMonth
    ? currentMonthExpenses
    : userExpenses
        .filter((expense) => String(expense.date || "").slice(0, 7) === selectedMonth)
        .reduce((sum, expense) => sum + (expense.amount || 0), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ ...styles.row, justifyContent: "space-between", flexWrap: "wrap" }}>
        <div>
          <div style={styles.sectionTitle}>Budget Management</div>
          <div style={{ color: COLORS.muted, fontSize: 12 }}>
            Overall month budget first, category budgets below it.
          </div>
        </div>
        <button style={styles.btn(COLORS.accent)} onClick={onAdd}>+ Set Budget</button>
      </div>

      <div style={styles.card}>
        <div style={{ ...styles.row, justifyContent: "space-between", flexWrap: "wrap", marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Month Toggle</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {monthOptions.map((month) => (
              <button
                key={month}
                style={month === selectedMonth ? styles.btn(COLORS.accent) : styles.btnGhost}
                onClick={() => setSelectedMonth(month)}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={{ ...styles.row, marginBottom: 14 }}>
          <div style={{ fontSize: 28 }}>🗓️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700 }}>Overall Monthly Budget</div>
            <div style={{ fontSize: 11, color: COLORS.muted }}>{selectedMonth}</div>
          </div>
          {overallBudget ? (
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 800, color: overallSpent > (overallBudget.limitAmount || 0) ? COLORS.red : COLORS.green }}>
                {fmt(overallSpent)}
              </div>
              <div style={{ fontSize: 11, color: COLORS.muted }}>of {fmt(overallBudget.limitAmount || 0)}</div>
            </div>
          ) : (
            <div style={{ fontSize: 12, color: COLORS.muted }}>No overall budget for this month</div>
          )}
        </div>

        {overallBudget ? (
          <>
            <div style={{ height: 8, background: COLORS.border, borderRadius: 4 }}>
              <div
                style={{
                  width: `${Math.min((overallSpent / Math.max(overallBudget.limitAmount || 1, 1)) * 100, 100)}%`,
                  height: "100%",
                  background: overallSpent > (overallBudget.limitAmount || 0) ? COLORS.red : COLORS.green,
                  borderRadius: 4,
                }}
              />
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button style={styles.btnGhost} onClick={() => onEdit(overallBudget)}>Edit</button>
              <button
                style={styles.btnDanger}
                onClick={() => onDelete(overallBudget.id)}
                disabled={deletingKey === `budget-${overallBudget.id}`}
              >
                {deletingKey === `budget-${overallBudget.id}` ? "Deleting..." : "Delete"}
              </button>
            </div>
          </>
        ) : (
          <div style={{ marginTop: 12, color: COLORS.muted, fontSize: 12 }}>
            Create one from the budget form by keeping the scope as overall.
          </div>
        )}
      </div>

      <div>
        <div style={{ ...styles.sectionTitle, marginBottom: 12 }}>Category Wise Budget</div>
        <div style={styles.grid2}>
          {categoryBudgets.length === 0 && (
            <div style={styles.card}>
              <div style={{ color: COLORS.muted, fontSize: 13 }}>
                No category budgets configured for {selectedMonth}.
              </div>
            </div>
          )}
          {categoryBudgets.map((budget) => {
            const category = userCategories.find((item) => item.id === budget.category?.id);
            const spent = monthExpenseByCategory[budget.category?.id] || 0;
            const limit = budget.limitAmount || 0;
            const pct = limit > 0 ? (spent / limit) * 100 : 0;
            const statusColor = pct > 90 ? COLORS.red : pct > 70 ? COLORS.yellow : COLORS.green;

            return (
              <div key={budget.id} style={styles.card}>
                <div style={{ ...styles.row, marginBottom: 14 }}>
                  <div style={{ fontSize: 28 }}>{category?.icon || "📦"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{category?.name || "Category Budget"}</div>
                    <div style={{ fontSize: 11, color: COLORS.muted }}>{budget.month}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800, color: statusColor }}>{fmt(spent)}</div>
                    <div style={{ fontSize: 11, color: COLORS.muted }}>of {fmt(limit)}</div>
                  </div>
                </div>
                <div style={{ height: 8, background: COLORS.border, borderRadius: 4 }}>
                  <div
                    style={{
                      width: `${Math.min(pct, 100)}%`,
                      height: "100%",
                      background: statusColor,
                      borderRadius: 4,
                      transition: "width 0.5s",
                    }}
                  />
                </div>
                <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button style={styles.btnGhost} onClick={() => onEdit(budget)}>Edit</button>
                  <button
                    style={styles.btnDanger}
                    onClick={() => onDelete(budget.id)}
                    disabled={deletingKey === `budget-${budget.id}`}
                  >
                    {deletingKey === `budget-${budget.id}` ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
