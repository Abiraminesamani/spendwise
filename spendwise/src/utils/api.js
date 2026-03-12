const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

async function request(path, options = {}) {
  const { token, method = "GET", body } = options;
  const headers = {};

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    throw new Error(data?.error || data?.message || data || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  getCurrentUser: (token) => request("/api/users/me", { token }),
  getUsers: (token) => request("/api/users", { token }),
  getAccounts: (token) => request("/api/accounts", { token }),
  getCategories: (token) => request("/api/categories", { token }),
  getBudgets: (token) => request("/api/budgets", { token }),
  getExpenses: (token) => request("/api/expenses", { token }),
  getIncomes: (token) => request("/api/incomes", { token }),
  getPaymentMethods: (token) => request("/api/payment-methods", { token }),
  getMonthlySummary: (token) => request("/api/monthly-summary", { token }),
  createAccount: (token, payload) => request("/api/accounts", { token, method: "POST", body: payload }),
  createCategory: (token, payload) => request("/api/categories", { token, method: "POST", body: payload }),
  createBudget: (token, payload) => request("/api/budgets", { token, method: "POST", body: payload }),
  createExpense: (token, payload) => request("/api/expenses", { token, method: "POST", body: payload }),
  createIncome: (token, payload) => request("/api/incomes", { token, method: "POST", body: payload }),
  updateAccount: (token, id, payload) => request(`/api/accounts/${id}`, { token, method: "PUT", body: payload }),
  updateBudget: (token, id, payload) => request(`/api/budgets/${id}`, { token, method: "PUT", body: payload }),
  updateExpense: (token, id, payload) => request(`/api/expenses/${id}`, { token, method: "PUT", body: payload }),
  updateIncome: (token, id, payload) => request(`/api/incomes/${id}`, { token, method: "PUT", body: payload }),
  deleteAccount: (token, id) => request(`/api/accounts/${id}`, { token, method: "DELETE" }),
  deleteCategory: (token, id) => request(`/api/categories/${id}`, { token, method: "DELETE" }),
  deleteBudget: (token, id) => request(`/api/budgets/${id}`, { token, method: "DELETE" }),
  deleteExpense: (token, id) => request(`/api/expenses/${id}`, { token, method: "DELETE" }),
  deleteIncome: (token, id) => request(`/api/incomes/${id}`, { token, method: "DELETE" }),
};
