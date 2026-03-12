import { COLORS } from "../data/constants.js";
import { fmt, getStyles } from "../utils/helpers.js";

const styles = getStyles(COLORS);

export default function Categories({ userCategories, expenseByCategory, deletingKey, onAdd, onDelete }) {
  return (
    <div>
      <div style={{ ...styles.row, justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap" }}>
        <div>
          <div style={styles.sectionTitle}>Categories</div>
          <div style={{ color: COLORS.muted, fontSize: 12 }}>
            Shared categories are visible to everyone. Custom ones stay private to the creator.
          </div>
        </div>
        <button style={styles.btn(COLORS.accent)} onClick={onAdd}>+ Add Category</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
        {userCategories.length === 0 && (
          <div style={styles.card}>
            <div style={{ color: COLORS.muted, fontSize: 13 }}>No categories available yet.</div>
          </div>
        )}
        {userCategories.map((category) => {
          const spent = expenseByCategory[category.id] || 0;
          const itemKey = `category-${category.id}`;
          return (
            <div key={category.id} style={{ ...styles.card, display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  background: category.color + "22",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                {category.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{category.name}</div>
                <div style={{ ...styles.pill(category.shared ? COLORS.accent : COLORS.yellow), display: "inline-block", marginTop: 6 }}>
                  {category.shared ? "shared" : "custom"}
                </div>
                {spent > 0 && (
                  <div style={{ fontSize: 12, color: category.color, fontWeight: 600, marginTop: 6 }}>Spent: {fmt(spent)}</div>
                )}
              </div>
              {!category.shared && (
                <button
                  style={styles.btnDanger}
                  onClick={() => onDelete(category.id)}
                  disabled={deletingKey === itemKey}
                >
                  {deletingKey === itemKey ? "Deleting..." : "Delete"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
