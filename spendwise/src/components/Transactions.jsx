import { COLORS } from "../data/constants.js";
import { fmt, getStyles } from "../utils/helpers.js";

const styles = getStyles(COLORS);

export default function Transactions({
  transactions,
  userCategories,
  userAccounts,
  deletingKey,
  onAdd,
  onEdit,
  onDelete,
}) {
  return (
    <div>
      <div style={{ ...styles.row, justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap" }}>
        <div>
          <div style={styles.sectionTitle}>Income and Expenses</div>
          <div style={{ color: COLORS.muted, fontSize: 12 }}>Create entries quickly, edit mistakes, and remove anything invalid.</div>
        </div>
        <button style={styles.btn(COLORS.accent)} onClick={onAdd}>+ Add Entry</button>
      </div>
      <div style={styles.card}>
        {transactions.length === 0 && (
          <div style={{ fontSize: 13, color: COLORS.muted }}>No transactions available yet.</div>
        )}
        {transactions.map((tx) => {
          const category = userCategories.find((item) => item.id === tx.categoryId);
          const account = userAccounts.find((item) => item.id === tx.accountId);
          const badgeColor = tx.type === "income" ? COLORS.green : COLORS.red;
          const itemKey = `transaction-${tx.recordId}`;

          return (
            <div key={tx.id} style={styles.txRow}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: ((category?.color || badgeColor) + "22"),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {category?.icon || (tx.type === "income" ? "💰" : "💸")}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{tx.note}</div>
                <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>
                  {tx.categoryName} · {(account?.name || tx.accountName)} · {tx.paymentMethodName} · {tx.date}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: badgeColor }}>
                  {tx.type === "income" ? "+" : "-"}
                  {fmt(tx.amount)}
                </div>
                <div style={{ ...styles.pill(badgeColor), display: "inline-block", marginTop: 2 }}>
                  {tx.type}
                </div>
              </div>
              <button style={styles.btnGhost} onClick={() => onEdit(tx)}>
                Edit
              </button>
              <button
                style={styles.btnDanger}
                onClick={() => onDelete(tx.recordId)}
                disabled={deletingKey === itemKey}
              >
                {deletingKey === itemKey ? "Deleting..." : "Delete"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
