import { useEffect, useMemo, useState } from "react";
import { COLORS, DEFAULT_CATEGORY_META, FALLBACK_CATEGORY_EMOJIS, TABS } from "./data/constants.js";
import { getStyles, getTransactionMonth, parseJwtPayload } from "./utils/helpers.js";
import { api } from "./utils/api.js";
import Dashboard from "./components/Dashboard.jsx";
import Transactions from "./components/Transactions.jsx";
import Accounts from "./components/Accounts.jsx";
import Budgets from "./components/Budgets.jsx";
import Categories from "./components/Categories.jsx";
import Modal from "./components/Modal.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";

const styles = getStyles(COLORS);
const STORAGE_KEY = "spendwise-session";

const EMPTY_DATA = {
  currentUser: null,
  accounts: [],
  categories: [],
  budgets: [],
  expenses: [],
  incomes: [],
  paymentMethods: [],
  monthlySummary: [],
};

function loadStoredSession() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { token: "", username: "" };
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      token: parsed.token || "",
      username: parsed.username || "",
    };
  } catch {
    return { token: "", username: "" };
  }
}

function getCategoryVisual(category, index) {
  if (category?.icon) {
    return {
      icon: category.icon,
      color: DEFAULT_CATEGORY_META[category?.name]?.color || ["#ff9f43", "#54a0ff", "#ff6b81", "#a29bfe", "#00d2d3", "#22d98a"][index % 6],
    };
  }

  if (DEFAULT_CATEGORY_META[category?.name]) {
    return DEFAULT_CATEGORY_META[category.name];
  }

  const fallback = [
    { icon: FALLBACK_CATEGORY_EMOJIS[0], color: "#ff9f43" },
    { icon: FALLBACK_CATEGORY_EMOJIS[1], color: "#54a0ff" },
    { icon: FALLBACK_CATEGORY_EMOJIS[2], color: "#ff6b81" },
    { icon: FALLBACK_CATEGORY_EMOJIS[3], color: "#a29bfe" },
    { icon: FALLBACK_CATEGORY_EMOJIS[4], color: "#00d2d3" },
    { icon: FALLBACK_CATEGORY_EMOJIS[5], color: "#22d98a" },
  ];

  return fallback[index % fallback.length];
}

export default function App() {
  const [session, setSession] = useState(loadStoredSession);
  const [data, setData] = useState(EMPTY_DATA);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [appError, setAppError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingKey, setDeletingKey] = useState("");

  const currentMonth = new Date().toISOString().slice(0, 7);
  const sortTransactions = (left, right) => {
    const dateCompare = (right.date || "").localeCompare(left.date || "");
    if (dateCompare !== 0) {
      return dateCompare;
    }

    if (left.type === right.type) {
      return Number(right.recordId || 0) - Number(left.recordId || 0);
    }

    return left.type.localeCompare(right.type);
  };

  const jwtPayload = session.token ? parseJwtPayload(session.token) : null;
  const currentUsername = data.currentUser?.username || session.username || jwtPayload?.sub || "";

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setNotice(""), 2000);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  const fetchAppData = async (token = session.token) => {
    if (!token) {
      return;
    }

    setLoading(true);
    setAppError("");

    try {
      const [
        currentUser,
        accounts,
        categories,
        budgets,
        expenses,
        incomes,
        paymentMethods,
        monthlySummary,
      ] = await Promise.all([
        api.getCurrentUser(token),
        api.getAccounts(token),
        api.getCategories(token),
        api.getBudgets(token),
        api.getExpenses(token),
        api.getIncomes(token),
        api.getPaymentMethods(token),
        api.getMonthlySummary(token),
      ]);

      setData({
        currentUser,
        accounts,
        categories,
        budgets,
        expenses,
        incomes,
        paymentMethods,
        monthlySummary,
      });
    } catch (fetchError) {
      setAppError(fetchError.message || "Unable to load application data");
      if (/401|403|Unauthorized/i.test(fetchError.message || "")) {
        localStorage.removeItem(STORAGE_KEY);
        setSession({ token: "", username: "" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session.token) {
      fetchAppData(session.token);
    }
  }, [session.token]);

  const userAccounts = data.accounts;
  const userBudgets = data.budgets;
  const userExpenses = data.expenses;
  const userIncomes = data.incomes;

  const categoriesWithVisuals = useMemo(
    () =>
      data.categories.map((category, index) => ({
        ...category,
        ...getCategoryVisual(category, index),
      })),
    [data.categories],
  );

  const expenseTransactions = useMemo(
    () =>
      userExpenses.map((expense) => ({
        id: `expense-${expense.id}`,
        recordId: expense.id,
        type: "expense",
        amount: expense.amount || 0,
        date: expense.date || "",
        note: expense.description || expense.category?.name || "Expense",
        description: expense.description || "",
        categoryId: expense.category?.id || null,
        categoryName: expense.category?.name || "Uncategorized",
        paymentMethodId: expense.paymentMethod?.id || null,
        paymentMethodName: expense.paymentMethod?.name || "Unknown",
        accountId: expense.account?.id || null,
        accountName: expense.account?.name || "No account",
      })),
    [userExpenses],
  );

  const incomeTransactions = useMemo(
    () =>
      userIncomes.map((income) => ({
        id: `income-${income.id}`,
        recordId: income.id,
        type: "income",
        amount: income.amount || 0,
        date: income.date || "",
        note: income.source || "Income",
        source: income.source || "",
        categoryId: null,
        categoryName: "Income",
        paymentMethodId: null,
        paymentMethodName: "Direct",
        accountId: income.account?.id || null,
        accountName: income.account?.name || "No account",
      })),
    [userIncomes],
  );

  const transactions = useMemo(
    () => [...expenseTransactions, ...incomeTransactions].sort(sortTransactions),
    [expenseTransactions, incomeTransactions],
  );

  const expenseByCategory = useMemo(() => {
    const totals = {};

    userExpenses
      .filter((expense) => getTransactionMonth(expense.date) === currentMonth)
      .forEach((expense) => {
        const categoryId = expense.category?.id;
        if (!categoryId) {
          return;
        }
        totals[categoryId] = (totals[categoryId] || 0) + (expense.amount || 0);
      });

    return totals;
  }, [userExpenses, currentMonth]);

  const summary = useMemo(() => {
    const income = userIncomes
      .filter((item) => getTransactionMonth(item.date) === currentMonth)
      .reduce((sum, item) => sum + (item.amount || 0), 0);

    const expenses = userExpenses
      .filter((item) => getTransactionMonth(item.date) === currentMonth)
      .reduce((sum, item) => sum + (item.amount || 0), 0);

    const totalBalance = userAccounts.reduce((sum, item) => sum + (item.balance || 0), 0);
    const monthlyBudget = userBudgets
      .filter((item) => item.month === currentMonth && !item.category)
      .reduce((sum, item) => sum + (item.limitAmount || 0), 0);

    return {
      month: currentMonth,
      income,
      expenses,
      savings: income - expenses,
      totalBalance,
      budgetLimit: monthlyBudget,
      budgetSpent: expenses,
    };
  }, [currentMonth, userAccounts, userBudgets, userExpenses, userIncomes]);

  const clearMessages = () => {
    setError("");
    setAppError("");
  };

  const openModal = (type, payload = null) => {
    setModal(type);
    setEditingItem(payload);

    if (type === "addBudget") {
      setForm({ month: currentMonth, budgetScope: "overall" });
    } else if (type === "addTransaction") {
      setForm({ type: "expense" });
    } else if (type === "editTransaction" && payload) {
      if (payload.type === "income") {
        setForm({
          type: "income",
          amount: String(payload.amount ?? ""),
          name: payload.source || payload.note || "",
          accountId: payload.accountId ? String(payload.accountId) : "",
          date: payload.date || "",
        });
      } else {
        setForm({
          type: "expense",
          amount: String(payload.amount ?? ""),
          name: payload.description || payload.note || "",
          categoryId: payload.categoryId ? String(payload.categoryId) : "",
          accountId: payload.accountId ? String(payload.accountId) : "",
          paymentMethodId: payload.paymentMethodId ? String(payload.paymentMethodId) : "",
          date: payload.date || "",
        });
      }
    } else if (type === "editAccount" && payload) {
      setForm({
        name: payload.name || "",
        balance: String(payload.balance ?? ""),
      });
    } else if ((type === "editBudget") && payload) {
      setForm({
        budgetScope: payload.category ? "category" : "overall",
        month: payload.month || "",
        limitAmount: String(payload.limitAmount ?? ""),
        categoryId: payload.category?.id ? String(payload.category.id) : "",
      });
    } else {
      setForm({});
    }
    clearMessages();
  };

  const closeModal = () => {
    setModal(null);
    setForm({});
    setEditingItem(null);
    setError("");
  };

  const persistSession = (responseToken, fallbackUsername) => {
    const payload = parseJwtPayload(responseToken);
    const nextSession = {
      token: responseToken,
      username: payload?.sub || fallbackUsername,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
    return nextSession;
  };

  const handleLogin = async (username, password) => {
    setSubmitting(true);
    setLoginError("");

    try {
      const response = await api.login({ username: username.trim(), password });
      persistSession(response.token, username.trim());
      setAuthMode("login");
      setNotice("Signed in successfully");
    } catch (loginFailure) {
      setLoginError(loginFailure.message || "Invalid username or password");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignup = async (username, password, confirmPassword) => {
    const normalizedUsername = username.trim();

    if (!normalizedUsername || !password || !confirmPassword) {
      setSignupError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setSignupError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    setSignupError("");

    try {
      await api.register({ username: normalizedUsername, password });
      const response = await api.login({ username: normalizedUsername, password });
      persistSession(response.token, normalizedUsername);
      setAuthMode("login");
      setNotice("Account created successfully");
    } catch (signupFailure) {
      setSignupError(signupFailure.message || "Unable to create account");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSession({ token: "", username: "" });
    setData(EMPTY_DATA);
    setActiveTab("Dashboard");
    setAuthMode("login");
    setAppError("");
    setNotice("");
    closeModal();
  };

  const handleRefresh = async () => {
    await fetchAppData(session.token);
    setNotice("Data refreshed");
  };

  const handleSubmit = async () => {
    if (!session.token) {
      setError("You must be logged in");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      if (modal === "addTransaction" || modal === "editTransaction") {
        if (form.type === "income") {
          const amount = Number(form.amount);
          if (!amount || amount <= 0 || !form.name || !form.accountId || !form.date) {
            throw new Error("Name, amount, account, and date are required");
          }

          const payload = {
            amount,
            source: form.name.trim(),
            date: form.date,
            accountId: Number(form.accountId),
          };

          if (modal === "editTransaction") {
            await api.updateIncome(session.token, editingItem.recordId, payload);
            setNotice("Income updated");
          } else {
            await api.createIncome(session.token, payload);
            setNotice("Income added");
          }
        } else {
          const amount = Number(form.amount);
          if (!amount || amount <= 0 || !form.categoryId || !form.accountId || !form.paymentMethodId || !form.date) {
            throw new Error("All expense fields are required");
          }

          const payload = {
            description: (form.name || "").trim(),
            amount,
            date: form.date,
            categoryId: Number(form.categoryId),
            paymentMethodId: Number(form.paymentMethodId),
            accountId: Number(form.accountId),
          };

          if (modal === "editTransaction") {
            await api.updateExpense(session.token, editingItem.recordId, payload);
            setNotice("Expense updated");
          } else {
            await api.createExpense(session.token, payload);
            setNotice("Expense added");
          }
        }
      }

      if (modal === "addAccount") {
        if (!form.name?.trim()) {
          throw new Error("Account name is required");
        }

        await api.createAccount(session.token, {
          name: form.name.trim(),
          balance: Number(form.balance || 0),
        });
        setNotice("Account created");
      }

      if (modal === "editAccount") {
        if (!form.name?.trim()) {
          throw new Error("Account name is required");
        }

        await api.updateAccount(session.token, editingItem.id, {
          name: form.name.trim(),
        });
        setNotice("Account updated");
      }

      if (modal === "addCategory") {
        if (!form.name?.trim()) {
          throw new Error("Category name is required");
        }

        await api.createCategory(session.token, {
          name: form.name.trim(),
          icon: (form.icon || "").trim(),
        });
        setNotice("Category added");
      }

      if (modal === "addBudget") {
        const limitAmount = Number(form.limitAmount);
        if (!form.month || !limitAmount || limitAmount <= 0 || (form.budgetScope === "category" && !form.categoryId)) {
          throw new Error("Month and budget amount are required");
        }

        await api.createBudget(session.token, {
          month: form.month,
          limitAmount,
          ...(form.budgetScope === "category" && form.categoryId ? { category: { id: Number(form.categoryId) } } : {}),
        });
        setNotice("Budget saved");
      }

      if (modal === "editBudget") {
        const limitAmount = Number(form.limitAmount);
        if (!form.month || !limitAmount || limitAmount <= 0 || (form.budgetScope === "category" && !form.categoryId)) {
          throw new Error("Month and budget amount are required");
        }

        await api.updateBudget(session.token, editingItem.id, {
          month: form.month,
          limitAmount,
          ...(form.budgetScope === "category" && form.categoryId ? { category: { id: Number(form.categoryId) } } : {}),
        });
        setNotice("Budget updated");
      }

      await fetchAppData(session.token);
      closeModal();
    } catch (submitFailure) {
      setError(submitFailure.message || "Unable to save changes");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (kind, id) => {
    if (!session.token) {
      return;
    }

    const labelMap = {
      transaction: "transaction",
      account: "account",
      budget: "budget",
      category: "category",
    };

    if (!window.confirm(`Delete this ${labelMap[kind]}? This action cannot be undone.`)) {
      return;
    }

    const operationKey = `${kind}-${id}`;
    setDeletingKey(operationKey);
    setAppError("");

    try {
      if (kind === "account") {
        await api.deleteAccount(session.token, id);
      }
      if (kind === "budget") {
        await api.deleteBudget(session.token, id);
      }
      if (kind === "category") {
        await api.deleteCategory(session.token, id);
      }
      if (kind === "transaction") {
        const transaction = transactions.find((item) => item.recordId === id || item.id === id);
        if (!transaction) {
          throw new Error("Transaction not found");
        }
        if (transaction.type === "expense") {
          await api.deleteExpense(session.token, id);
        } else {
          await api.deleteIncome(session.token, id);
        }
      }

      await fetchAppData(session.token);
      setNotice(`${labelMap[kind][0].toUpperCase()}${labelMap[kind].slice(1)} deleted`);
    } catch (deleteFailure) {
      setAppError(deleteFailure.message || "Unable to delete item");
    } finally {
      setDeletingKey("");
    }
  };

  if (!session.token) {
    return (
      <div style={styles.app}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: #0a0a0f; }
        `}</style>
        {authMode === "login" ? (
          <Login
            onLogin={handleLogin}
            error={loginError}
            loading={submitting}
            onSwitchToSignup={() => {
              setAuthMode("signup");
              setLoginError("");
            }}
          />
        ) : (
          <Signup
            onSignup={handleSignup}
            error={signupError}
            loading={submitting}
            onSwitchToLogin={() => {
              setAuthMode("login");
              setSignupError("");
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0a0a0f; }
        select option { background: #1a1a26; color: #e8e8f0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #12121a; }
        ::-webkit-scrollbar-thumb { background: #2a2a3d; border-radius: 3px; }
        button:hover { opacity: 0.85; }
      `}</style>

      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div>
            <div style={styles.logo}>
              spend<span style={styles.logoAccent}>wise</span>
            </div>
            <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>
              Manage your money with simpler create, edit, refresh, and delete flows.
            </div>
          </div>
          <div style={{ ...styles.row, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <button style={styles.btnGhost} onClick={handleRefresh} disabled={loading}>
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <div style={styles.userBadge}>
              <div style={styles.avatar}>{(currentUsername || "U")[0].toUpperCase()}</div>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{currentUsername || "User"}</span>
              <button
                style={{ ...styles.btnOutline, padding: "6px 10px", fontSize: 11 }}
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        <div style={styles.tabs}>
          {TABS.map((tab) => (
            <button key={tab} style={styles.tab(activeTab === tab)} onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.content}>
        {activeTab === "Dashboard" && notice && (
          <div style={{ ...styles.successBanner, marginBottom: 16 }}>
            {notice}
          </div>
        )}

        {appError && (
          <div style={{ ...styles.loginError, marginBottom: 16 }}>
            {appError}
          </div>
        )}

        {loading ? (
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Loading data</div>
            <div style={{ color: COLORS.muted, fontSize: 13 }}>
              Fetching accounts, categories, budgets, expenses, incomes, and payment methods.
            </div>
          </div>
        ) : (
          <>
            {activeTab === "Dashboard" && (
              <Dashboard
                summary={summary}
                transactions={transactions}
                userAccounts={userAccounts}
                userCategories={categoriesWithVisuals}
                userBudgets={userBudgets}
                expenseByCategory={expenseByCategory}
                paymentMethods={data.paymentMethods}
              />
            )}
            {activeTab === "Transactions" && (
              <Transactions
                transactions={transactions}
                userCategories={categoriesWithVisuals}
                userAccounts={userAccounts}
                deletingKey={deletingKey}
                onAdd={() => openModal("addTransaction")}
                onEdit={(item) => openModal("editTransaction", item)}
                onDelete={(id) => handleDelete("transaction", id)}
              />
            )}
            {activeTab === "Accounts" && (
              <Accounts
                userAccounts={userAccounts}
                deletingKey={deletingKey}
                onAdd={() => openModal("addAccount")}
                onEdit={(item) => openModal("editAccount", item)}
                onDelete={(id) => handleDelete("account", id)}
              />
            )}
            {activeTab === "Budgets" && (
              <Budgets
                userBudgets={userBudgets}
                currentMonth={currentMonth}
                currentMonthExpenses={summary.expenses}
                userExpenses={userExpenses}
                userCategories={categoriesWithVisuals}
                deletingKey={deletingKey}
                onAdd={() => openModal("addBudget")}
                onEdit={(item) => openModal("editBudget", item)}
                onDelete={(id) => handleDelete("budget", id)}
              />
            )}
            {activeTab === "Categories" && (
              <Categories
                userCategories={categoriesWithVisuals}
                expenseByCategory={expenseByCategory}
                deletingKey={deletingKey}
                onAdd={() => openModal("addCategory")}
                onDelete={(id) => handleDelete("category", id)}
              />
            )}
          </>
        )}
      </div>

      <Modal
        modal={modal}
        form={form}
        setForm={setForm}
        error={error}
        loading={submitting}
        onClose={closeModal}
        onSubmit={handleSubmit}
        userCategories={categoriesWithVisuals}
        userAccounts={userAccounts}
        userBudgets={userBudgets}
        paymentMethods={data.paymentMethods}
      />
    </div>
  );
}
