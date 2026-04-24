import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

function Avatar({ name, size = 64 }) {
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
      }}
    >
      {initials}
    </div>
  );
}

function ProgressBar({ value, color, height = 8 }) {
  const c = color || (value >= 80 ? "#10B981" : value >= 50 ? "#3B82F6" : "#F59E0B");
  return (
    <div style={{ height, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
      <div
        style={{
          height: "100%",
          width: `${value}%`,
          background: c,
          borderRadius: 99,
          transition: "width 0.8s ease",
        }}
      />
    </div>
  );
}

function Tab({ label, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        fontSize: 14,
        fontWeight: active ? 600 : 400,
        color: active ? "#4F46E5" : "#6B7280",
        background: "transparent",
        border: "none",
        borderBottom: active ? "2.5px solid #4F46E5" : "2.5px solid transparent",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 6,
        transition: "all 0.15s",
      }}
    >
      {label}
      {count !== undefined && (
        <span
          style={{
            background: active ? "#EEF2FF" : "#F3F4F6",
            color: active ? "#4F46E5" : "#9CA3AF",
            fontSize: 11,
            fontWeight: 600,
            borderRadius: 99,
            padding: "1px 7px",
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export default function StudentDetail() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("courses");

  useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  async function fetchStudentData() {
    setLoading(true);
    try {
      const [studentRes, coursesRes, assignmentsRes] = await Promise.all([
        api.get(`/students/${studentId}`),
        api.get(`/students/${studentId}/courses`),
        api.get(`/students/${studentId}/assignments`),
      ]);
      setStudent(studentRes.data);
      setCourses(coursesRes.data);
      setAssignments(assignmentsRes.data);
    } catch (err) {
      console.error(err);
      // Fallback mock for preview
      setStudent(MOCK_STUDENT);
      setCourses(MOCK_ENROLLED_COURSES);
      setAssignments(MOCK_ASSIGNMENTS);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 32, background: "#F3F4F6", minHeight: "100vh" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: 32, marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#F3F4F6" }} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ width: "30%", height: 18, background: "#F3F4F6", borderRadius: 8 }} />
              <div style={{ width: "45%", height: 13, background: "#F3F4F6", borderRadius: 8 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div style={{ padding: 32, textAlign: "center", color: "#9CA3AF" }}>
        Student not found.
      </div>
    );
  }

  const avgProgress = courses.length
    ? Math.round(courses.reduce((s, c) => s + (c.progress || 0), 0) / courses.length)
    : 0;

  const submittedAssignments = assignments.filter((a) => a.submission);
  const pendingAssignments = assignments.filter((a) => !a.submission);
  const avgScore = submittedAssignments.length
    ? Math.round(submittedAssignments.reduce((s, a) => s + (a.submission?.score || 0), 0) / submittedAssignments.length)
    : null;

  const joinedDate = student.createdAt
    ? new Date(student.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "—";

  return (
    <div style={{ padding: "32px 32px", background: "#F3F4F6", minHeight: "100vh" }}>
      {/* Back */}
      <button
        onClick={() => navigate("/students")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: "#6B7280",
          fontSize: 13,
          fontWeight: 500,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          marginBottom: 20,
          padding: 0,
        }}
      >
        ← Back to Students
      </button>

      {/* Profile Card */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "28px 32px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
          marginBottom: 20,
          display: "flex",
          alignItems: "flex-start",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <Avatar name={student.name} size={72} />
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>
              {student.name}
            </h2>
            <span
              style={{
                background: "#F0FDF4",
                color: "#16A34A",
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 99,
                padding: "3px 10px",
              }}
            >
              Student
            </span>
          </div>
          <div style={{ color: "#6B7280", fontSize: 14, marginTop: 4 }}>{student.email}</div>
          <div style={{ display: "flex", gap: 20, marginTop: 12, flexWrap: "wrap" }}>
            <div style={{ fontSize: 13, color: "#9CA3AF" }}>
              📅 Joined <span style={{ color: "#374151", fontWeight: 500 }}>{joinedDate}</span>
            </div>
            <div style={{ fontSize: 13, color: "#9CA3AF" }}>
              📚 <span style={{ color: "#374151", fontWeight: 500 }}>{courses.length}</span> course{courses.length !== 1 ? "s" : ""} enrolled
            </div>
            {student.lastActive && (
              <div style={{ fontSize: 13, color: "#9CA3AF" }}>
                ⚡ Last active{" "}
                <span style={{ color: "#374151", fontWeight: 500 }}>
                  {new Date(student.lastActive).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <MiniStat label="Avg. Progress" value={`${avgProgress}%`} color="#4F46E5" bg="#EEF2FF" />
          <MiniStat label="Submitted" value={submittedAssignments.length} color="#10B981" bg="#F0FDF4" />
          <MiniStat label="Pending" value={pendingAssignments.length} color="#F59E0B" bg="#FFFBEB" />
          {avgScore !== null && (
            <MiniStat label="Avg. Score" value={`${avgScore}/100`} color="#3B82F6" bg="#EFF6FF" />
          )}
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", borderBottom: "1px solid #F3F4F6", padding: "0 12px" }}>
          <Tab label="Courses" active={activeTab === "courses"} onClick={() => setActiveTab("courses")} count={courses.length} />
          <Tab label="Assignments" active={activeTab === "assignments"} onClick={() => setActiveTab("assignments")} count={assignments.length} />
          <Tab label="Activity" active={activeTab === "activity"} onClick={() => setActiveTab("activity")} />
        </div>

        <div style={{ padding: "24px 28px" }}>
          {activeTab === "courses" && (
            <CoursesTab courses={courses} />
          )}
          {activeTab === "assignments" && (
            <AssignmentsTab assignments={assignments} />
          )}
          {activeTab === "activity" && (
            <ActivityTab student={student} courses={courses} assignments={assignments} />
          )}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, color, bg }) {
  return (
    <div
      style={{
        background: bg,
        borderRadius: 12,
        padding: "14px 20px",
        textAlign: "center",
        minWidth: 90,
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{label}</div>
    </div>
  );
}

function CoursesTab({ courses }) {
  if (!courses.length) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0", color: "#9CA3AF" }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>📚</div>
        <div>Not enrolled in any courses yet</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {courses.map((course, i) => {
        const progress = course.progress ?? 0;
        const progressColor = progress >= 80 ? "#10B981" : progress >= 50 ? "#3B82F6" : "#F59E0B";
        return (
          <div
            key={course._id || i}
            style={{
              border: "1.5px solid #F3F4F6",
              borderRadius: 14,
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#E0E7FF")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#F3F4F6")}
          >
            {/* Course icon */}
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                background: "#F0F4FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              {SUBJECT_ICONS[course.subject] || "📖"}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 15, color: "#111827" }}>{course.title}</div>
              <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
                {course.subject} · {course.gradeLevel || "Grade —"}
                {course.totalLectures ? ` · ${course.completedLectures || 0}/${course.totalLectures} lectures` : ""}
              </div>
              <div style={{ marginTop: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: "#6B7280" }}>Progress</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: progressColor }}>{progress}%</span>
                </div>
                <ProgressBar value={progress} color={progressColor} height={7} />
              </div>
            </div>

            {/* Status badge */}
            <div>
              {progress === 100 ? (
                <span style={{ background: "#F0FDF4", color: "#16A34A", fontSize: 12, fontWeight: 600, borderRadius: 99, padding: "4px 12px" }}>
                  ✓ Completed
                </span>
              ) : progress > 0 ? (
                <span style={{ background: "#EEF2FF", color: "#4F46E5", fontSize: 12, fontWeight: 600, borderRadius: 99, padding: "4px 12px" }}>
                  In Progress
                </span>
              ) : (
                <span style={{ background: "#F9FAFB", color: "#9CA3AF", fontSize: 12, fontWeight: 600, borderRadius: 99, padding: "4px 12px" }}>
                  Not Started
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AssignmentsTab({ assignments }) {
  if (!assignments.length) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0", color: "#9CA3AF" }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>📝</div>
        <div>No assignments yet</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {/* Header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1.5fr 1fr 1fr 100px",
          padding: "8px 14px",
          fontSize: 11,
          fontWeight: 600,
          color: "#9CA3AF",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          background: "#F9FAFB",
          borderRadius: 10,
          marginBottom: 6,
        }}
      >
        <div>Assignment</div>
        <div>Course</div>
        <div>Due Date</div>
        <div>Score</div>
        <div>Status</div>
      </div>

      {assignments.map((a, i) => {
        const submitted = !!a.submission;
        const score = a.submission?.score;
        const due = a.dueDate ? new Date(a.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—";
        const isLate = a.dueDate && !submitted && new Date(a.dueDate) < new Date();

        return (
          <div
            key={a._id || i}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1.5fr 1fr 1fr 100px",
              padding: "14px 14px",
              alignItems: "center",
              borderBottom: i < assignments.length - 1 ? "1px solid #F9FAFB" : "none",
              borderRadius: 8,
              transition: "background 0.12s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div style={{ fontWeight: 500, fontSize: 14, color: "#111827" }}>{a.title}</div>
            <div style={{ fontSize: 13, color: "#6B7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8 }}>
              {a.courseTitle || a.course?.title || "—"}
            </div>
            <div style={{ fontSize: 13, color: isLate ? "#EF4444" : "#6B7280" }}>
              {isLate ? `⚠ ${due}` : due}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: score >= 80 ? "#10B981" : score >= 50 ? "#F59E0B" : score !== undefined ? "#EF4444" : "#9CA3AF" }}>
              {score !== undefined ? `${score}/100` : "—"}
            </div>
            <div>
              {submitted ? (
                <span style={{ background: "#F0FDF4", color: "#16A34A", fontSize: 11, fontWeight: 600, borderRadius: 99, padding: "3px 10px" }}>
                  Submitted
                </span>
              ) : isLate ? (
                <span style={{ background: "#FEF2F2", color: "#EF4444", fontSize: 11, fontWeight: 600, borderRadius: 99, padding: "3px 10px" }}>
                  Overdue
                </span>
              ) : (
                <span style={{ background: "#FFFBEB", color: "#D97706", fontSize: 11, fontWeight: 600, borderRadius: 99, padding: "3px 10px" }}>
                  Pending
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ActivityTab({ student, courses, assignments }) {
  const submitted = assignments.filter((a) => a.submission).length;
  const totalA = assignments.length;
  const avgProgress = courses.length
    ? Math.round(courses.reduce((s, c) => s + (c.progress || 0), 0) / courses.length)
    : 0;

  // Build a timeline from available data
  const events = [
    ...assignments
      .filter((a) => a.submission?.submittedAt)
      .map((a) => ({
        date: new Date(a.submission.submittedAt),
        icon: "📝",
        label: `Submitted "${a.title}"`,
        sub: a.submission.score !== undefined ? `Score: ${a.submission.score}/100` : null,
        color: "#10B981",
      })),
    ...courses
      .filter((c) => c.enrolledAt)
      .map((c) => ({
        date: new Date(c.enrolledAt),
        icon: "📚",
        label: `Enrolled in "${c.title}"`,
        sub: null,
        color: "#4F46E5",
      })),
    student.createdAt && {
      date: new Date(student.createdAt),
      icon: "🎉",
      label: "Joined EduStream",
      sub: null,
      color: "#F59E0B",
    },
  ]
    .filter(Boolean)
    .sort((a, b) => b.date - a.date)
    .slice(0, 10);

  return (
    <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
      {/* Summary */}
      <div style={{ flex: 1, minWidth: 220 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 16 }}>Overview</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <ActivityStat label="Assignment completion" value={totalA ? Math.round((submitted / totalA) * 100) : 0} suffix="%" bar />
          <ActivityStat label="Course progress (avg)" value={avgProgress} suffix="%" bar barColor="#4F46E5" />
          <ActivityStat label="Assignments submitted" value={`${submitted} / ${totalA}`} />
          <ActivityStat label="Courses enrolled" value={courses.length} />
        </div>
      </div>

      {/* Timeline */}
      <div style={{ flex: 2, minWidth: 280 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 16 }}>Recent Activity</h3>
        {events.length === 0 ? (
          <div style={{ color: "#9CA3AF", fontSize: 13 }}>No activity recorded yet.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {events.map((ev, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                {/* Timeline line + dot */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 2 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: ev.color + "20",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      flexShrink: 0,
                    }}
                  >
                    {ev.icon}
                  </div>
                  {i < events.length - 1 && (
                    <div style={{ width: 2, flex: 1, background: "#F3F4F6", margin: "4px 0" }} />
                  )}
                </div>
                <div style={{ paddingBottom: i < events.length - 1 ? 16 : 0, paddingTop: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{ev.label}</div>
                  {ev.sub && <div style={{ fontSize: 12, color: "#6B7280", marginTop: 1 }}>{ev.sub}</div>}
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
                    {ev.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ActivityStat({ label, value, suffix = "", bar, barColor = "#10B981" }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: bar ? 5 : 0 }}>
        <span style={{ fontSize: 13, color: "#6B7280" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{value}{suffix}</span>
      </div>
      {bar && (
        <div style={{ height: 6, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${Math.min(value, 100)}%`,
              background: barColor,
              borderRadius: 99,
              transition: "width 0.8s ease",
            }}
          />
        </div>
      )}
    </div>
  );
}

const SUBJECT_ICONS = {
  Mathematics: "📐",
  Physics: "⚛️",
  Chemistry: "🧪",
  Biology: "🧬",
  English: "📖",
  History: "🏛️",
  Geography: "🌍",
  "Computer Science": "💻",
  Economics: "📊",
};

// ── Mock data ────────────────────────────────────────────────────────────────
const MOCK_STUDENT = {
  _id: "s1",
  name: "Rohan Sharma",
  email: "rohan@school.edu",
  createdAt: "2024-01-15",
  lastActive: new Date().toISOString(),
};

const MOCK_ENROLLED_COURSES = [
  { _id: "c1", title: "Mathematics — Grade 10", subject: "Mathematics", gradeLevel: "Grade 10", progress: 82, totalLectures: 12, completedLectures: 10, enrolledAt: "2024-01-16" },
  { _id: "c2", title: "Physics Fundamentals", subject: "Physics", gradeLevel: "Grade 11", progress: 61, totalLectures: 8, completedLectures: 5, enrolledAt: "2024-02-01" },
];

const MOCK_ASSIGNMENTS = [
  { _id: "a1", title: "Algebra Problem Set", courseTitle: "Mathematics — Grade 10", dueDate: "2024-03-10", submission: { submittedAt: "2024-03-09", score: 88 } },
  { _id: "a2", title: "Wave Equations", courseTitle: "Physics Fundamentals", dueDate: "2024-03-15", submission: { submittedAt: "2024-03-14", score: 74 } },
  { _id: "a3", title: "Geometry Quiz", courseTitle: "Mathematics — Grade 10", dueDate: "2024-04-01", submission: null },
  { _id: "a4", title: "Thermodynamics Lab", courseTitle: "Physics Fundamentals", dueDate: "2024-03-28", submission: null },
];
