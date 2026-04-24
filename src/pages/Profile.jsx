import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const AVATAR_COLORS = [
  { bg: "#EEF2FF", text: "#4F46E5" },
  { bg: "#F0FDF4", text: "#16A34A" },
  { bg: "#FFF7ED", text: "#EA580C" },
  { bg: "#FDF2F8", text: "#C026D3" },
  { bg: "#F0F9FF", text: "#0284C7" },
  { bg: "#FFFBEB", text: "#D97706" },
];

function getAvatarColor(name) {
  const idx = (name?.charCodeAt(0) || 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function Avatar({ name, size = 80 }) {
  const { bg, text } = getAvatarColor(name);
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        color: text,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: size * 0.33,
        flexShrink: 0,
        border: "3px solid #fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
      }}
    >
      {initials}
    </div>
  );
}

export default function Profile() {
  const { user, updateProfile } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      await updateProfile({ name: form.name.trim(), email: form.email.trim() });
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const hasChanges =
    form.name.trim() !== (user?.name || "") ||
    form.email.trim() !== (user?.email || "");

  return (
    <div style={{ padding: "32px", background: "#F3F4F6", minHeight: "100vh" }}>
      {/* Page Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#111827", margin: 0 }}>
          My Profile
        </h1>
        <p style={{ color: "#6B7280", marginTop: 4, fontSize: 14 }}>
          Manage your personal information
        </p>
      </div>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>

        {/* Left — Avatar Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
            padding: "32px 28px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            minWidth: 220,
            width: 240,
          }}
        >
          <Avatar name={user?.name} size={88} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 17, color: "#111827" }}>
              {user?.name}
            </div>
            <div style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
              {user?.email}
            </div>
          </div>

          {/* Role Badge */}
          <span
            style={{
              background: user?.role === "teacher" ? "#EEF2FF" : "#F0FDF4",
              color: user?.role === "teacher" ? "#4F46E5" : "#16A34A",
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 99,
              padding: "5px 16px",
              textTransform: "capitalize",
            }}
          >
            {user?.role === "teacher" ? "🎓 Teacher" : "📚 Student"}
          </span>

          {/* Info rows */}
          <div
            style={{
              width: "100%",
              borderTop: "1px solid #F3F4F6",
              paddingTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <InfoRow icon="✉️" label={user?.email} />
            <InfoRow icon="🔒" label="Password protected" />
            <InfoRow
              icon="📅"
              label={`Member since ${new Date().getFullYear()}`}
            />
          </div>
        </div>

        {/* Right — Edit Form */}
        <div style={{ flex: 1, minWidth: 300 }}>
          <form onSubmit={handleSave}>
            <Card title="Personal Information" icon="👤">
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <Field
                  label="Full name"
                  required
                  error={errors.name}
                >
                  <input
                    value={form.name}
                    onChange={handleChange("name")}
                    placeholder="Your full name"
                    style={inputStyle(errors.name)}
                  />
                </Field>

                <Field
                  label="Email address"
                  required
                  error={errors.email}
                >
                  <input
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    placeholder="your@email.com"
                    style={inputStyle(errors.email)}
                  />
                </Field>

                <Field label="Role">
                  <input
                    value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ""}
                    disabled
                    style={{
                      ...inputStyle(),
                      background: "#F9FAFB",
                      color: "#9CA3AF",
                      cursor: "not-allowed",
                    }}
                  />
                  <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>
                    Role cannot be changed. Contact admin if needed.
                  </p>
                </Field>
              </div>
            </Card>

            {/* Save Button */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
              <button
                type="submit"
                disabled={saving || !hasChanges}
                style={{
                  background: hasChanges && !saving ? "#3B4ED8" : "#E5E7EB",
                  color: hasChanges && !saving ? "#fff" : "#9CA3AF",
                  border: "none",
                  borderRadius: 10,
                  padding: "11px 28px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: hasChanges && !saving ? "pointer" : "not-allowed",
                  transition: "all 0.15s",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {saving ? (
                  <>
                    <Spinner /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function InfoRow({ icon, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#6B7280" }}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
    </div>
  );
}

function Card({ title, icon, children }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
        padding: "24px 28px",
        marginBottom: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: 0 }}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function Field({ label, required, error, children }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 13,
          fontWeight: 500,
          color: "#374151",
          marginBottom: 6,
        }}
      >
        {label}
        {required && <span style={{ color: "#EF4444", marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {error && (
        <p style={{ fontSize: 12, color: "#EF4444", marginTop: 4 }}>{error}</p>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <div
      style={{
        width: 14,
        height: 14,
        border: "2px solid rgba(255,255,255,0.4)",
        borderTopColor: "#fff",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
      }}
    />
  );
}

const inputStyle = (error) => ({
  width: "100%",
  border: `1.5px solid ${error ? "#EF4444" : "#E5E7EB"}`,
  borderRadius: 10,
  padding: "10px 14px",
  fontSize: 14,
  outline: "none",
  color: "#111827",
  background: "#fff",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
});
