import { COLORS } from "../data/constants.js";
import { fmt, getStyles } from "../utils/helpers.js";

const styles = getStyles(COLORS);

export default function Dashboard({
  summary,
  transactions,
  userAccounts,
  userCategories,
  userBudgets,
  expenseByCategory,
  paymentMethods,
}) {
  const topCategories = Object.entries(expenseByCategory)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 4);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={styles.grid4}>
        {[
          { label: "Total Balance", value: summary.totalBalance, color: COLORS.accent },
          { label: `${summary.month} Income`, value: summary.income, color: COLORS.green },
          { label: `${summary.month} Expenses`, value: summary.expenses, color: COLORS.red },
          { label: `${summary.month} Savings`, value: summary.savings, color: COLORS.yellow },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ ...styles.card, borderTop: `3px solid ${color}` }}>
            <div style={styles.cardTitle}>{label}</div>
            <div style={{ ...styles.bigNum, color, fontSize: 24 }}>{fmt(value)}</div>
          </div>
        ))}
      </div>

      <div style={styles.grid2}>
        <div style={styles.card}>
          <div style={{ ...styles.row, justifyContent: "space-between", marginBottom: 16 }}>
            <div style={styles.sectionTitle}>Recent Activity</div>
          </div>
          {transactions.length === 0 && (
            <div style={{ fontSize: 13, color: COLORS.muted }}>No income or expense entries yet.</div>
          )}
          {transactions.slice(0, 5).map((tx) => {
            const category = userCategories.find((item) => item.id === tx.categoryId);
            return (
              <div key={tx.id} style={styles.txRow}>
                <div style={{ fontSize: 20 }}>{category?.icon || (tx.type === "income" ? "💰" : "💸")}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{tx.note}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted }}>
                    {tx.date} · {tx.paymentMethodName} · {tx.accountName}
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: tx.type === "income" ? COLORS.green : COLORS.red }}>
                  {tx.type === "income" ? "+" : "-"}
                  {fmt(tx.amount)}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Accounts</div>
            {userAccounts.length === 0 && (
              <div style={{ fontSize: 13, color: COLORS.muted }}>No accounts created yet.</div>
            )}
            {userAccounts.map((account) => (
              <div key={account.id} style={styles.txRow}>
                <div style={{ fontSize: 22 }}>🏦</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{account.name}</div>
                  <div style={{ ...styles.pill(COLORS.muted), display: "inline-block", marginTop: 2 }}>
                    account
                  </div>
                </div>
                <div style={{ fontWeight: 800, color: COLORS.accent }}>{fmt(account.balance)}</div>
              </div>
            ))}
          </div>

          <div style={styles.card}>
            <div style={styles.sectionTitle}>Top Spending Categories</div>
            {topCategories.length === 0 && (
              <div style={{ fontSize: 13, color: COLORS.muted }}>
                Categories will rank here once expenses are added for {summary.month}.
              </div>
            )}
            {topCategories.map(([categoryId, amount]) => {
              const category = userCategories.find((item) => item.id === Number(categoryId));
              if (!category) {
                return null;
              }

              return (
                <div key={categoryId} style={{ marginBottom: 12 }}>
                  <div style={{ ...styles.row, justifyContent: "space-between", marginBottom: 4 }}>
                    <div style={{ ...styles.row, gap: 8 }}>
                      <span style={{ fontSize: 16 }}>{category.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{category.name}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: category.color }}>{fmt(amount)}</span>
                  </div>
                  <div style={{ height: 5, background: COLORS.border, borderRadius: 3 }}>
                    <div
                      style={{
                        width: `${Math.min((amount / Math.max(summary.expenses || 1, 1)) * 100, 100)}%`,
                        height: "100%",
                        background: category.color,
                        borderRadius: 3,
                        transition: "width 0.5s",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={styles.card}>
            <div style={styles.sectionTitle}>Backend Coverage</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <span style={styles.pill(COLORS.accent)}>{paymentMethods.length} payment methods</span>
              <span style={styles.pill(COLORS.green)}>{userBudgets.length} budgets</span>
              <span style={styles.pill(COLORS.yellow)}>{userCategories.length} categories</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
