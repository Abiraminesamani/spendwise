import { COLORS } from "../data/constants.js";
import { fmt, getStyles } from "../utils/helpers.js";

const styles = getStyles(COLORS);

export default function Accounts({ userAccounts, deletingKey, onAdd, onEdit, onDelete }) {
  return (
    <div>
      <div style={{ ...styles.row, justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap" }}>
        <div>
          <div style={styles.sectionTitle}>Accounts</div>
          <div style={{ color: COLORS.muted, fontSize: 12 }}>Keep account names clean and remove unused accounts safely.</div>
        </div>
        <button style={styles.btn(COLORS.accent)} onClick={onAdd}>+ Add Account</button>
      </div>
      <div style={styles.grid3}>
        {userAccounts.length === 0 && (
          <div style={styles.card}>
            <div style={{ color: COLORS.muted, fontSize: 13 }}>No accounts found for this user.</div>
          </div>
        )}
        {userAccounts.map((account) => (
          <div key={account.id} style={{ ...styles.card, borderTop: `3px solid ${COLORS.accent}` }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>AC</div>
            <div style={styles.cardTitle}>Stored Balance</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{account.name}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.accent }}>{fmt(account.balance)}</div>
            <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                style={styles.btnGhost}
                onClick={() => onEdit(account)}
              >
                Edit
              </button>
              <button
                style={styles.btnDanger}
                onClick={() => onDelete(account.id)}
                disabled={deletingKey === `account-${account.id}`}
              >
                {deletingKey === `account-${account.id}` ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
