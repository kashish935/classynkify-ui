import { useState, useRef, useEffect, } from "react";
import { toast } from "react-toastify";
import { useAuth } from '../../context/AuthContext'
import axiosInstance from "../../api/axiosInstance";

/* ─────────────────────────────────────────────
   Helper — scroll chat to bottom smoothly
───────────────────────────────────────────── */
function scrollBottom(ref) {
  ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
}

/* ─────────────────────────────────────────────
   Suggested starter prompts
───────────────────────────────────────────── */
const SUGGESTIONS = [
  "Explain the concept of gradient descent simply.",
  "What is the difference between supervised and unsupervised learning?",
  "How does JWT authentication work?",
  "Can you give me an example of recursion in Python?",
  "What are REST API best practices?",
];

/* ─────────────────────────────────────────────
   Message bubble
───────────────────────────────────────────── */
function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div
      className={`flex gap-3 items-start animate-fadeIn ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md
          ${
            isUser
              ? "bg-indigo-600 text-white"
              : "bg-gradient-to-br from-amber-400 to-orange-500 text-white"
          }`}
      >
        {isUser ? "U" : "✦"}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm
          ${
            isUser
              ? "bg-indigo-600 text-white rounded-tr-sm"
              : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm"
          }`}
      >
        {/* Role label */}
        <p
          className={`text-[10px] font-semibold uppercase tracking-widest mb-1 ${
            isUser ? "text-indigo-200" : "text-amber-500"
          }`}
        >
          {isUser ? "You" : "Classynkify AI"}
        </p>

        {/* Content — preserve newlines */}
        <p className="whitespace-pre-wrap">{msg.content}</p>

        {/* Timestamp */}
        <p
          className={`text-[10px] mt-2 text-right ${
            isUser ? "text-indigo-300" : "text-slate-400"
          }`}
        >
          {msg.time}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Typing indicator (three bouncing dots)
───────────────────────────────────────────── */
function TypingIndicator() {
  return (
    <div className="flex gap-3 items-start animate-fadeIn">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
        ✦
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-500 mb-2">
          Classynkify AI
        </p>
        <div className="flex gap-1 items-center h-4">
          <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Empty / welcome state
───────────────────────────────────────────── */
function EmptyState({ onSuggestion }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 text-center gap-6 py-8">
      {/* Icon */}
      <div className="relative">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-4xl shadow-lg shadow-orange-200 rotate-3">
          ✦
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow">
          AI
        </div>
      </div>

      {/* Heading */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          Ask me anything
        </h2>
        <p className="text-slate-500 text-sm mt-1 max-w-xs">
          Your AI study companion. Get instant answers to course doubts,
          concepts, and coding questions.
        </p>
      </div>

      {/* Suggestions */}
      <div className="w-full max-w-lg space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
          Try asking
        </p>
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggestion(s)}
            className="w-full text-left px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-sm transition-all duration-150 shadow-sm group"
          >
            <span className="text-amber-500 mr-2 group-hover:text-indigo-500 transition-colors">
              →
            </span>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function DoubtSolver() {
  const { user } = useAuth()

  const [messages, setMessages] = useState([]); // { role, content, time }
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [courseContext, setCourseContext] = useState("");

  const chatRef = useRef(null);
  const textareaRef = useRef(null);

  /* Scroll to bottom whenever messages change */
  useEffect(() => {
    scrollBottom(chatRef);
  }, [messages, loading]);

  /* Auto-resize textarea */
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [input]);

  function now() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function sendMessage() {
    const question = input.trim();
    if (!question || loading) return;

    const userMsg = { role: "user", content: question, time: now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const payload = { question };
      if (courseContext.trim()) payload.courseContext = courseContext.trim();

      const { data } = await axiosInstance.post(
        "/student/doubt-solver",
        payload
      );

      const answer =
        data?.answer ||
        data?.response ||
        data?.message ||
        "Sorry, I couldn't generate a response. Please try again.";

      setMessages((prev) => [
        ...prev,
        { role: "ai", content: answer, time: now() },
      ]);
    } catch (err) {
      const errMsg =
        err?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errMsg);
      // Remove the optimistic user message on failure
      setMessages((prev) => prev.slice(0, -1));
      setInput(question); // restore input
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function clearChat() {
    if (messages.length === 0) return;
    setMessages([]);
    toast.info("Chat cleared.");
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50">
      {/* ── Header ────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-lg font-bold shadow rotate-3">
            ✦
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-none">
              AI Doubt Solver
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Ask any question — get instant, smart answers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Course context badge */}
          {courseContext && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              {courseContext.length > 24
                ? courseContext.slice(0, 24) + "…"
                : courseContext}
            </span>
          )}

          {/* Clear chat */}
          {hasMessages && (
            <button
              onClick={clearChat}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              Clear chat
            </button>
          )}
        </div>
      </div>

      {/* ── Chat area ─────────────────────────────────── */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-4"
      >
        {!hasMessages && !loading ? (
          <EmptyState onSuggestion={(s) => setInput(s)} />
        ) : (
          <>
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))}
            {loading && <TypingIndicator />}
          </>
        )}
      </div>

      {/* ── Input area ────────────────────────────────── */}
      <div className="flex-shrink-0 bg-white border-t border-slate-200 px-4 sm:px-8 py-4 space-y-3">
        {/* Optional course context */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-400 whitespace-nowrap">
            Course context:
          </label>
          <input
            type="text"
            value={courseContext}
            onChange={(e) => setCourseContext(e.target.value)}
            placeholder="e.g. React Fundamentals (optional)"
            className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
          />
        </div>

        {/* Message composer */}
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your doubt here… (Enter to send, Shift+Enter for newline)"
              rows={1}
              disabled={loading}
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 disabled:opacity-60 transition-all shadow-sm leading-relaxed"
            />
            {/* Character hint */}
            {input.length > 200 && (
              <span className="absolute bottom-2 right-3 text-[10px] text-slate-400">
                {input.length}
              </span>
            )}
          </div>

          {/* Send button */}
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="flex-shrink-0 w-11 h-11 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all duration-150 shadow-md hover:shadow-indigo-200 hover:shadow-lg active:scale-95"
            aria-label="Send"
          >
            {loading ? (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
                />
              </svg>
            )}
          </button>
        </div>

        <p className="text-[10px] text-center text-slate-400">
          AI can make mistakes. Verify important information with your
          instructor.
        </p>
      </div>

      {/* ── Tailwind animation keyframes (inline style tag) ── */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out both;
        }
      `}</style>
    </div>
  );
}