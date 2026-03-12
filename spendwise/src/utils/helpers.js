export const fmt = (value) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`;

export const getTransactionMonth = (date) => (date ? String(date).slice(0, 7) : "");

export function parseJwtPayload(token) {
  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = window.atob(normalized);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export const getStyles = (COLORS) => ({
  app: { minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "'DM Sans', sans-serif" },
  loginPage: { minHeight: "100vh", background: `radial-gradient(circle at top, ${COLORS.accentGlow}, transparent 40%), ${COLORS.bg}`, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  loginCard: { width: 420, maxWidth: "95vw", background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: 28, display: "flex", flexDirection: "column", gap: 18, boxShadow: `0 0 40px ${COLORS.accentGlow}` },
  loginSubtitle: { fontSize: 13, color: COLORS.muted, textAlign: "center" },
  loginError: { background: COLORS.red + "1f", border: `1px solid ${COLORS.red}66`, color: COLORS.red, borderRadius: 10, padding: "10px 12px", fontSize: 12, fontWeight: 600 },
  successBanner: { background: COLORS.green + "1a", border: `1px solid ${COLORS.green}66`, color: COLORS.green, borderRadius: 10, padding: "10px 12px", fontSize: 12, fontWeight: 600 },
  loginHint: { fontSize: 11, color: COLORS.muted, textAlign: "center" },
  authLink: { background: "transparent", color: COLORS.accent, border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", textAlign: "center" },
  header: { padding: "20px 24px 0", borderBottom: `1px solid ${COLORS.border}`, background: COLORS.surface },
  headerTop: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 16, gap: 12, flexWrap: "wrap" },
  logo: { fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", color: COLORS.text },
  logoAccent: { color: COLORS.accent },
  userBadge: { display: "flex", alignItems: "center", gap: 10, background: COLORS.card, padding: "8px 16px", borderRadius: 40, border: `1px solid ${COLORS.border}` },
  avatar: { width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.accent}, #ff6bff)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 },
  tabs: { display: "flex", gap: 4, overflowX: "auto", paddingBottom: 2 },
  tab: (active) => ({ padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", borderRadius: "8px 8px 0 0", color: active ? COLORS.accent : COLORS.muted, borderBottom: active ? `2px solid ${COLORS.accent}` : "2px solid transparent", background: "transparent", border: "none", transition: "all 0.2s", whiteSpace: "nowrap" }),
  content: { padding: 24, maxWidth: 1100, margin: "0 auto" },
  grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 },
  grid3: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 },
  grid4: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 },
  card: { background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 20 },
  cardTitle: { fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, color: COLORS.muted, marginBottom: 8 },
  bigNum: { fontSize: 32, fontWeight: 800, letterSpacing: "-1px" },
  sectionTitle: { fontSize: 16, fontWeight: 700, marginBottom: 16 },
  btn: (color) => ({ background: color, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "opacity 0.2s" }),
  btnOutline: { background: "transparent", color: "#6b6b8a", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  btnGhost: { background: "transparent", color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "8px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" },
  btnDanger: { background: "transparent", color: COLORS.red, border: `1px solid ${COLORS.red}55`, borderRadius: 10, padding: "8px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" },
  pill: (color) => ({ background: color + "22", color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }),
  input: { background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 14px", color: COLORS.text, fontSize: 14, width: "100%", boxSizing: "border-box", outline: "none" },
  label: { fontSize: 12, fontWeight: 600, color: COLORS.muted, marginBottom: 6, display: "block" },
  modalOverlay: { position: "fixed", inset: 0, background: "#000a", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
  modalBox: { background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: 28, width: 420, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto" },
  row: { display: "flex", alignItems: "center", gap: 12 },
  txRow: { display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: `1px solid ${COLORS.border}` },
});
