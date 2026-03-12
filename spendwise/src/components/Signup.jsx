import { useState } from "react";
import { COLORS } from "../data/constants.js";
import { getStyles } from "../utils/helpers.js";

const styles = getStyles(COLORS);

export default function Signup({ onSignup, error, loading, onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSignup(name, password, confirmPassword);
  };

  return (
    <div style={styles.loginPage}>
      <div style={styles.loginCard}>
        <div style={{ ...styles.logo, fontSize: 28, textAlign: "center" }}>
          spend<span style={styles.logoAccent}>wise</span>
        </div>
        <p style={styles.loginSubtitle}>Create an authenticated account backed by Spring Boot</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />
          </div>
          <div>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>
          <div>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
            />
          </div>

          {error && <div style={styles.loginError}>{error}</div>}

          <button type="submit" style={styles.btn(COLORS.accent)} disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <button style={styles.authLink} onClick={onSwitchToLogin}>
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}
