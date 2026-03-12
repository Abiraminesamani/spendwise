import { useState } from "react";
import { COLORS } from "../data/constants.js";
import { getStyles } from "../utils/helpers.js";

const styles = getStyles(COLORS);

export default function Login({ onLogin, error, loading, onSwitchToSignup }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin(name, password);
  };

  return (
    <div style={styles.loginPage}>
      <div style={styles.loginCard}>
        <div style={{ ...styles.logo, fontSize: 28, textAlign: "center" }}>
          spend<span style={styles.logoAccent}>wise</span>
        </div>
        <p style={styles.loginSubtitle}>Sign in to manage persisted accounts, budgets, and transactions</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />
          </div>
          <div>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>

          {error && <div style={styles.loginError}>{error}</div>}

          <button type="submit" style={styles.btn(COLORS.accent)} disabled={loading}>
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>

        <button style={styles.authLink} onClick={onSwitchToSignup}>
          New user? Create an account
        </button>
      </div>
    </div>
  );
}
