import { COLORS } from "../data/constants.js";
import { fmt, getStyles } from "../utils/helpers.js";

const styles = getStyles(COLORS);

export default function Modal({
  modal,
  form,
  setForm,
  error,
  loading,
  onClose,
  onSubmit,
  userCategories,
  userAccounts,
  userBudgets,
  paymentMethods,
}) {
  if (!modal) return null;

  const titles = {
    addTransaction: "Add Entry",
    editTransaction: "Edit Entry",
    addAccount: "Add Account",
    editAccount: "Edit Account",
    addCategory: "Add Category",
    addBudget: "Set Budget",
    editBudget: "Edit Budget",
  };

  const renderFields = () => {
    if (modal === "addTransaction" || modal === "editTransaction") {
      return (
        <>
          <div>
            <label style={styles.label}>Entry Type</label>
            <select
              style={styles.input}
              value={form.type || "expense"}
              onChange={(e) => setForm((current) => ({ ...current, type: e.target.value }))}
              disabled={modal === "editTransaction"}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label style={styles.label}>Amount</label>
            <input
              style={styles.input}
              type="number"
              placeholder="0"
              value={form.amount || ""}
              onChange={(e) => setForm((current) => ({ ...current, amount: e.target.value }))}
            />
          </div>

          {form.type === "income" ? (
            <>
              <div>
                <label style={styles.label}>Name</label>
                <input
                  style={styles.input}
                  placeholder="e.g. Salary"
                  value={form.name || ""}
                  onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                />
              </div>
              <div>
                <label style={styles.label}>Account</label>
                <select
                  style={styles.input}
                  value={form.accountId || ""}
                  onChange={(e) => setForm((current) => ({ ...current, accountId: e.target.value }))}
                >
                  <option value="">Select account</option>
                  {userAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} ({fmt(account.balance)})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={styles.label}>Date</label>
                <input
                  style={styles.input}
                  type="date"
                  value={form.date || ""}
                  onChange={(e) => setForm((current) => ({ ...current, date: e.target.value }))}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label style={styles.label}>Name</label>
                <input
                  style={styles.input}
                  placeholder="e.g. Grocery run"
                  value={form.name || ""}
                  onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                />
              </div>
              <div>
                <label style={styles.label}>Category</label>
                <select
                  style={styles.input}
                  value={form.categoryId || ""}
                  onChange={(e) => setForm((current) => ({ ...current, categoryId: e.target.value }))}
                >
                  <option value="">Select category</option>
                  {userCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={styles.label}>Account</label>
                <select
                  style={styles.input}
                  value={form.accountId || ""}
                  onChange={(e) => setForm((current) => ({ ...current, accountId: e.target.value }))}
                >
                  <option value="">Select account</option>
                  {userAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} ({fmt(account.balance)})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={styles.label}>Payment Method</label>
                <select
                  style={styles.input}
                  value={form.paymentMethodId || ""}
                  onChange={(e) => setForm((current) => ({ ...current, paymentMethodId: e.target.value }))}
                  disabled={paymentMethods.length === 0}
                >
                  <option value="">
                    {paymentMethods.length === 0 ? "No payment methods available" : "Select payment method"}
                  </option>
                  {paymentMethods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.name}
                    </option>
                  ))}
                </select>
                {paymentMethods.length === 0 && (
                  <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 6 }}>
                    Restart the backend once so the default payment methods can be seeded.
                  </div>
                )}
              </div>
              <div>
                <label style={styles.label}>Date</label>
                <input
                  style={styles.input}
                  type="date"
                  value={form.date || ""}
                  onChange={(e) => setForm((current) => ({ ...current, date: e.target.value }))}
                />
              </div>
            </>
          )}
        </>
      );
    }

    if (modal === "addAccount" || modal === "editAccount") {
      return (
        <>
          <div>
            <label style={styles.label}>Account Name</label>
            <input
              style={styles.input}
              placeholder="e.g. Primary Savings"
              value={form.name || ""}
              onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
            />
          </div>
          {modal === "addAccount" && (
          <div>
            <label style={styles.label}>Initial Balance</label>
            <input
              style={styles.input}
              type="number"
              placeholder="0"
              value={form.balance || ""}
              onChange={(e) => setForm((current) => ({ ...current, balance: e.target.value }))}
            />
          </div>
          )}
        </>
      );
    }

    if (modal === "addCategory") {
      return (
        <>
          <div>
            <label style={styles.label}>Category Name</label>
            <input
              style={styles.input}
              placeholder="e.g. Utilities"
              value={form.name || ""}
              onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
            />
          </div>
          <div>
            <label style={styles.label}>Emoji</label>
            <input
              style={styles.input}
              placeholder="e.g. ⚡"
              value={form.icon || ""}
              maxLength={8}
              onChange={(e) => setForm((current) => ({ ...current, icon: e.target.value }))}
            />
          </div>
        </>
      );
    }

    if (modal === "addBudget" || modal === "editBudget") {
      return (
        <>
          <div>
            <label style={styles.label}>Budget Scope</label>
            <select
              style={styles.input}
              value={form.budgetScope || "overall"}
              onChange={(e) => setForm((current) => ({
                ...current,
                budgetScope: e.target.value,
                categoryId: e.target.value === "overall" ? "" : current.categoryId,
              }))}
            >
              <option value="overall">Overall Month Budget</option>
              <option value="category">Category Budget</option>
            </select>
          </div>
          <div>
            <label style={styles.label}>Month (YYYY-MM)</label>
            <input
              style={styles.input}
              placeholder="2026-03"
              value={form.month || ""}
              onChange={(e) => setForm((current) => ({ ...current, month: e.target.value }))}
            />
          </div>
          {form.budgetScope === "category" && (
            <div>
              <label style={styles.label}>Category</label>
              <select
                style={styles.input}
                value={form.categoryId || ""}
                onChange={(e) => setForm((current) => ({ ...current, categoryId: e.target.value }))}
              >
                <option value="">Select category</option>
                {userCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label style={styles.label}>Budget Amount</label>
            <input
              style={styles.input}
              type="number"
              placeholder="5000"
              value={form.limitAmount || ""}
              onChange={(e) => setForm((current) => ({ ...current, limitAmount: e.target.value }))}
            />
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div style={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modalBox}>
        <div style={{ ...styles.row, justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{titles[modal]}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: COLORS.muted, fontSize: 20, cursor: "pointer" }}>x</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {renderFields()}
        </div>
        {error && (
          <div style={{ color: COLORS.red, fontSize: 13, marginTop: 12, padding: "8px 12px", background: COLORS.red + "11", borderRadius: 8 }}>
            {error}
          </div>
        )}
        <div style={{ ...styles.row, justifyContent: "flex-end", marginTop: 20, gap: 10 }}>
          <button style={styles.btnOutline} onClick={onClose} disabled={loading}>Cancel</button>
          <button style={styles.btn(COLORS.accent)} onClick={onSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
