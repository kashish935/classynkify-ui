import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Settings() {
  const { user, updatePassword, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("security");

  return (
    <div style={{ padding: "32px", background: "#F3F4F6", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#111827", margin: 0 }}>
          Settings
        </h1>
        <p style={{ color: "#6B7280", marginTop: 4, fontSize: 14 }}>
          Manage your account preferences
        </p>
      </div>

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>

        {/* Sidebar nav */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
            padding: "12px 8px",
            minWidth: 200,
            width: 210,
          }}
        >
          {SETTINGS_NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                background: activeSection === item.id ? "#EEF2FF" : "transparent",
                color: activeSection === item.id ? "#4F46E5" : "#374151",
                fontWeight: activeSection === item.id ? 600 : 400,
                fontSize: 14,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 300 }}>
          {activeSection === "security" && <SecuritySection updatePassword={updatePassword} />}
          {activeSection === "notifications" && <NotificationsSection />}
          {activeSection === "account" && <AccountSection user={user} logout={logout} navigate={navigate} />}
        </div>
      </div>
    </div>
  );
}

// ── Security — Change Password ────────────────────────────────────────────────
function SecuritySection({ updatePassword }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.currentPassword) e.currentPassword = "Current password is required";
    if (!form.newPassword) e.newPassword = "New password is required";
    else if (form.newPassword.length < 6) e.newPassword = "Minimum 6 characters";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (form.newPassword !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      await updatePassword(form.currentPassword, form.newPassword);
      toast.success("Password updated successfully!");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to update password";
      if (msg.toLowerCase().includes("current") || msg.toLowerCase().includes("incorrect") || msg.toLowerCase().includes("wrong")) {
        setErrors({ currentPassword: "Current password is incorrect" });
      } else {
        toast.error(msg);
      }
    } finally {
      setSaving(false);
    }
  };

  const strength = passwordStrength(form.newPassword);

  return (
    <form onSubmit={handleSubmit}>
      <SettingsCard title="Change Password" icon="🔒">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <PasswordField
            label="Current password"
            value={form.currentPassword}
            onChange={handleChange("currentPassword")}
            show={show.current}
            onToggle={() => setShow((s) => ({ ...s, current: !s.current }))}
            error={errors.currentPassword}
            placeholder="Enter your current password"
          />
          <PasswordField
            label="New password"
            value={form.newPassword}
            onChange={handleChange("newPassword")}
            show={show.new}
            onToggle={() => setShow((s) => ({ ...s, new: !s.new }))}
            error={errors.newPassword}
            placeholder="Minimum 6 characters"
          />
          {/* Strength meter */}
          {form.newPassword && (
            <div style={{ marginTop: -12 }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: 4,
                      borderRadius: 99,
                      background: i < strength.score ? strength.color : "#E5E7EB",
                      transition: "background 0.2s",
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: 11, color: strength.color, fontWeight: 500 }}>
                {strength.label}
              </span>
            </div>
          )}
          <PasswordField
            label="Confirm new password"
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
            show={show.confirm}
            onToggle={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
            error={errors.confirmPassword}
            placeholder="Re-enter new password"
          />
        </div>
      </SettingsCard>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
        <SaveButton saving={saving} label="Update Password" />
      </div>
    </form>
  );
}

// ── Notifications ─────────────────────────────────────────────────────────────
function NotificationsSection() {
  const [prefs, setPrefs] = useState({
    assignmentSubmissions: true,
    newEnrollments: true,
    courseUpdates: false,
    weeklyReport: true,
  });

  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const handleSave = () => toast.success("Notification preferences saved!");

  return (
    <div>
      <SettingsCard title="Notification Preferences" icon="🔔">
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {NOTIFICATION_OPTIONS.map((opt, i) => (
            <div
              key={opt.key}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 0",
                borderBottom: i < NOTIFICATION_OPTIONS.length - 1 ? "1px solid #F3F4F6" : "none",
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{opt.label}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{opt.desc}</div>
              </div>
              <Toggle
                checked={prefs[opt.key]}
                onChange={() => toggle(opt.key)}
              />
            </div>
          ))}
        </div>
      </SettingsCard>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
        <SaveButton label="Save Preferences" onClick={handleSave} />
      </div>
    </div>
  );
}

// ── Account / Danger Zone ─────────────────────────────────────────────────────
function AccountSection({ user, logout, navigate }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Account info */}
      <SettingsCard title="Account Information" icon="👤">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <InfoRow label="Full name" value={user?.name} />
          <InfoRow label="Email address" value={user?.email} />
          <InfoRow label="Account type" value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "—"} />
        </div>
        <div style={{ marginTop: 16 }}>
          <a
            href="/profile"
            style={{ fontSize: 13, color: "#4F46E5", fontWeight: 500, textDecoration: "none" }}
          >
            Edit profile →
          </a>
        </div>
      </SettingsCard>

      {/* Danger zone */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
          padding: "24px 28px",
          border: "1.5px solid #FEE2E2",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#991B1B", margin: 0 }}>
            Danger Zone
          </h3>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 0",
            borderBottom: "1px solid #FEF2F2",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>Sign out</div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
              Sign out of your account on this device
            </div>
          </div>
          <button
            onClick={handleSignOut}
            style={{
              background: "#FEF2F2",
              color: "#EF4444",
              border: "1.5px solid #FECACA",
              borderRadius: 10,
              padding: "8px 20px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#FEE2E2"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#FEF2F2"; }}
          >
            Sign Out
          </button>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 14,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>Delete account</div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
              Permanently delete your account and all data
            </div>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            style={{
              background: "#EF4444",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "8px 20px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#DC2626"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#EF4444"; }}
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete confirm modal */}
      {showConfirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowConfirm(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "28px 32px",
              maxWidth: 400,
              width: "90%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 32, textAlign: "center", marginBottom: 12 }}>⚠️</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", textAlign: "center", margin: "0 0 8px" }}>
              Delete your account?
            </h3>
            <p style={{ fontSize: 14, color: "#6B7280", textAlign: "center", lineHeight: 1.6, margin: "0 0 24px" }}>
              This will permanently delete your account, all your courses, and student data. This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  flex: 1, padding: "10px", borderRadius: 10,
                  border: "1.5px solid #E5E7EB", background: "#fff",
                  fontSize: 14, fontWeight: 600, color: "#374151", cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => { toast.error("Account deletion — contact admin"); setShowConfirm(false); }}
                style={{
                  flex: 1, padding: "10px", borderRadius: 10,
                  border: "none", background: "#EF4444",
                  fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Reusable sub-components ───────────────────────────────────────────────────

function SettingsCard({ title, icon, children }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
        padding: "24px 28px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: 0 }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function PasswordField({ label, value, onChange, show, onToggle, error, placeholder }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            width: "100%",
            border: `1.5px solid ${error ? "#EF4444" : "#E5E7EB"}`,
            borderRadius: 10,
            padding: "10px 42px 10px 14px",
            fontSize: 14,
            outline: "none",
            color: "#111827",
            background: "#fff",
            boxSizing: "border-box",
          }}
        />
        <button
          type="button"
          onClick={onToggle}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 16,
            color: "#9CA3AF",
            padding: 0,
            lineHeight: 1,
          }}
        >
          {show ? "🙈" : "👁️"}
        </button>
      </div>
      {error && <p style={{ fontSize: 12, color: "#EF4444", marginTop: 4 }}>{error}</p>}
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: 44,
        height: 24,
        borderRadius: 99,
        background: checked ? "#4F46E5" : "#E5E7EB",
        position: "relative",
        cursor: "pointer",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 23 : 3,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          transition: "left 0.2s",
        }}
      />
    </div>
  );
}

function SaveButton({ saving, label, onClick }) {
  return (
    <button
      type={onClick ? "button" : "submit"}
      onClick={onClick}
      disabled={saving}
      style={{
        background: saving ? "#E5E7EB" : "#3B4ED8",
        color: saving ? "#9CA3AF" : "#fff",
        border: "none",
        borderRadius: 10,
        padding: "11px 28px",
        fontSize: 14,
        fontWeight: 600,
        cursor: saving ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        gap: 8,
        transition: "background 0.15s",
      }}
    >
      {saving ? "Saving..." : label}
    </button>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0" }}>
      <span style={{ fontSize: 13, color: "#6B7280" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{value || "—"}</span>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function passwordStrength(pwd) {
  if (!pwd) return { score: 0, label: "", color: "#E5E7EB" };
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const levels = [
    { label: "Weak", color: "#EF4444" },
    { label: "Fair", color: "#F59E0B" },
    { label: "Good", color: "#3B82F6" },
    { label: "Strong", color: "#10B981" },
  ];
  return { score, ...levels[Math.max(0, score - 1)] };
}

const SETTINGS_NAV = [
  { id: "security", icon: "🔒", label: "Security" },
  { id: "notifications", icon: "🔔", label: "Notifications" },
  { id: "account", icon: "👤", label: "Account" },
];

const NOTIFICATION_OPTIONS = [
  { key: "assignmentSubmissions", label: "Assignment submissions", desc: "When a student submits an assignment" },
  { key: "newEnrollments", label: "New enrollments", desc: "When a student joins your course" },
  { key: "courseUpdates", label: "Course updates", desc: "Reminders to update your course content" },
  { key: "weeklyReport", label: "Weekly summary", desc: "A weekly digest of your classroom activity" },
];
