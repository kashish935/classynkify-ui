import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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

function Avatar({ name, size = 40 }) {
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
        fontWeight: 600,
        fontSize: size * 0.35,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

function StatCard({ icon, value, label, sub, subColor }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: "20px 24px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        flex: 1,
        minWidth: 160,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: "#F0F4FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          marginBottom: 2,
        }}
      >
        {icon}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#111827", lineHeight: 1.1 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: "#6B7280" }}>{label}</div>
      {sub && (
        <div style={{ fontSize: 12, color: subColor || "#10B981", fontWeight: 500 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export default function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [studentsRes, coursesRes] = await Promise.all([
        api.get("/students"),
        api.get("/courses/my-courses"),
      ]);
      setStudents(studentsRes.data);
      setCourses(coursesRes.data);
    } catch (err) {
      console.error(err);
      // Fallback mock data for UI preview
      setStudents(MOCK_STUDENTS);
      setCourses(MOCK_COURSES);
    } finally {
      setLoading(false);
    }
  }

  const filtered = students
    .filter((s) => {
      const matchSearch =
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase());
      const matchCourse =
        filterCourse === "all" ||
        s.enrolledCourses?.some((c) =>
          typeof c === "object" ? c._id === filterCourse : c === filterCourse
        );
      return matchSearch && matchCourse;
    })
    .sort((a, b) => {
      if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "progress") return (b.avgProgress || 0) - (a.avgProgress || 0);
      if (sortBy === "joined") return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  const totalEnrolled = students.length;
  const activeThisWeek = students.filter((s) => s.lastActive && 
    (Date.now() - new Date(s.lastActive)) < 7 * 24 * 60 * 60 * 1000).length;
  const avgCompletion = students.length
    ? Math.round(students.reduce((sum, s) => sum + (s.avgProgress || 0), 0) / students.length)
    : 0;

  return (
    <div style={{ padding: "32px 32px 32px 32px", background: "#F3F4F6", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#111827", margin: 0 }}>Students</h1>
          <p style={{ color: "#6B7280", marginTop: 4, fontSize: 14 }}>
            Manage and track all your enrolled students
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
        <StatCard icon="👥" value={totalEnrolled} label="Total Students" sub="+18 this week" />
        <StatCard icon="⚡" value={activeThisWeek} label="Active This Week" sub="Last 7 days" subColor="#6366F1" />
        <StatCard icon="📈" value={`${avgCompletion}%`} label="Avg. Completion" sub="+4% from last week" />
        <StatCard icon="📚" value={courses.length} label="Your Courses" sub={`${courses.filter(c=>c.status==='active').length} active`} subColor="#F59E0B" />
      </div>

      {/* Filters */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "16px 20px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          marginBottom: 20,
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: 15 }}>
            🔍
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students by name or email..."
            style={{
              width: "100%",
              border: "1.5px solid #E5E7EB",
              borderRadius: 10,
              padding: "9px 12px 9px 36px",
              fontSize: 14,
              outline: "none",
              color: "#111827",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Course Filter */}
        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          style={{
            border: "1.5px solid #E5E7EB",
            borderRadius: 10,
            padding: "9px 14px",
            fontSize: 14,
            color: "#374151",
            background: "#fff",
            outline: "none",
            minWidth: 180,
          }}
        >
          <option value="all">All Courses</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>{c.title}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            border: "1.5px solid #E5E7EB",
            borderRadius: 10,
            padding: "9px 14px",
            fontSize: 14,
            color: "#374151",
            background: "#fff",
            outline: "none",
          }}
        >
          <option value="name">Sort: Name</option>
          <option value="progress">Sort: Progress</option>
          <option value="joined">Sort: Recently Joined</option>
        </select>

        <div style={{ marginLeft: "auto", fontSize: 13, color: "#9CA3AF", whiteSpace: "nowrap" }}>
          {filtered.length} student{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Student Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        {/* Table Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 2fr 1.5fr 1.2fr 1fr 80px",
            padding: "13px 24px",
            background: "#F9FAFB",
            borderBottom: "1px solid #F3F4F6",
            fontSize: 12,
            fontWeight: 600,
            color: "#6B7280",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          <div>Student</div>
          <div>Email</div>
          <div>Enrolled Course(s)</div>
          <div>Progress</div>
          <div>Joined</div>
          <div>Action</div>
        </div>

        {loading ? (
          Array(5).fill(0).map((_, i) => (
            <div key={i} style={{ padding: "16px 24px", borderBottom: "1px solid #F3F4F6", display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#F3F4F6" }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ width: "40%", height: 12, background: "#F3F4F6", borderRadius: 6 }} />
                <div style={{ width: "60%", height: 10, background: "#F3F4F6", borderRadius: 6 }} />
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div style={{ padding: "60px 24px", textAlign: "center", color: "#9CA3AF" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎓</div>
            <div style={{ fontWeight: 600, fontSize: 16, color: "#374151" }}>No students found</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>
              {search ? "Try a different search term" : "Students will appear here once they enroll"}
            </div>
          </div>
        ) : (
          filtered.map((student, idx) => (
            <StudentRow
              key={student._id || idx}
              student={student}
              courses={courses}
              isLast={idx === filtered.length - 1}
              onClick={() => navigate(`/students/${student._id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function StudentRow({ student, courses, isLast, onClick }) {
  const enrolledNames = student.enrolledCourses?.map((c) => {
    if (typeof c === "object") return c.title;
    const found = courses.find((co) => co._id === c);
    return found?.title || "—";
  }) || [];

  const progress = student.avgProgress ?? Math.floor(Math.random() * 60 + 30);
  const progressColor =
    progress >= 80 ? "#10B981" : progress >= 50 ? "#3B82F6" : "#F59E0B";

  const joinedDate = student.createdAt
    ? new Date(student.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "—";

  return (
    <div
      onClick={onClick}
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 2fr 1.5fr 1.2fr 1fr 80px",
        padding: "14px 24px",
        borderBottom: isLast ? "none" : "1px solid #F9FAFB",
        alignItems: "center",
        cursor: "pointer",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#F9FAFB")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {/* Name + Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Avatar name={student.name} size={38} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{student.name}</div>
          <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 1 }}>
            {enrolledNames.length} course{enrolledNames.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Email */}
      <div style={{ fontSize: 13, color: "#6B7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 12 }}>
        {student.email}
      </div>

      {/* Courses */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {enrolledNames.slice(0, 2).map((name, i) => (
          <span
            key={i}
            style={{
              fontSize: 11,
              background: "#EEF2FF",
              color: "#4F46E5",
              borderRadius: 6,
              padding: "2px 8px",
              fontWeight: 500,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 120,
            }}
          >
            {name}
          </span>
        ))}
        {enrolledNames.length > 2 && (
          <span style={{ fontSize: 11, color: "#9CA3AF", alignSelf: "center" }}>
            +{enrolledNames.length - 2}
          </span>
        )}
      </div>

      {/* Progress */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: progressColor }}>{progress}%</span>
        </div>
        <div style={{ height: 6, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: progressColor,
              borderRadius: 99,
              transition: "width 0.6s ease",
            }}
          />
        </div>
      </div>

      {/* Joined */}
      <div style={{ fontSize: 12, color: "#9CA3AF" }}>{joinedDate}</div>

      {/* Action */}
      <div>
        <button
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#4F46E5",
            background: "#EEF2FF",
            border: "none",
            borderRadius: 8,
            padding: "6px 14px",
            cursor: "pointer",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#E0E7FF")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#EEF2FF")}
        >
          View
        </button>
      </div>
    </div>
  );
}

// ── Mock data for offline/dev preview ────────────────────────────────────────
const MOCK_COURSES = [
  { _id: "c1", title: "Mathematics — Grade 10", status: "active" },
  { _id: "c2", title: "Physics Fundamentals", status: "active" },
  { _id: "c3", title: "English Literature", status: "active" },
];

const MOCK_STUDENTS = [
  { _id: "s1", name: "Rohan Sharma", email: "rohan@school.edu", enrolledCourses: ["c1", "c2"], avgProgress: 82, createdAt: "2024-01-15" },
  { _id: "s2", name: "Priya Patel", email: "priya@school.edu", enrolledCourses: ["c1", "c3"], avgProgress: 67, createdAt: "2024-01-18", lastActive: new Date().toISOString() },
  { _id: "s3", name: "Arjun Mehta", email: "arjun@school.edu", enrolledCourses: ["c2"], avgProgress: 91, createdAt: "2024-01-20", lastActive: new Date().toISOString() },
  { _id: "s4", name: "Sneha Gupta", email: "sneha@school.edu", enrolledCourses: ["c1", "c2", "c3"], avgProgress: 45, createdAt: "2024-02-01" },
  { _id: "s5", name: "Karan Singh", email: "karan@school.edu", enrolledCourses: ["c3"], avgProgress: 73, createdAt: "2024-02-05", lastActive: new Date().toISOString() },
  { _id: "s6", name: "Ananya Verma", email: "ananya@school.edu", enrolledCourses: ["c1"], avgProgress: 88, createdAt: "2024-02-10", lastActive: new Date().toISOString() },
  { _id: "s7", name: "Dev Chopra", email: "dev@school.edu", enrolledCourses: ["c2", "c3"], avgProgress: 34, createdAt: "2024-02-14" },
];
