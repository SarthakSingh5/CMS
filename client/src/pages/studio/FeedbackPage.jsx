import { useState } from "react";
import { MessageSquare, Send, CheckCircle2 } from "lucide-react";

export default function FeedbackPage() {
  const [type, setType] = useState("general");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const feedbackTypes = [
    { value: "general", label: "General Feedback" },
    { value: "bug", label: "Bug Report" },
    { value: "feature", label: "Feature Request" },
  ];

  function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
    setMessage("");
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <MessageSquare size={24} strokeWidth={1.5} className="text-zinc-500" />
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Feedback & Ideas</h1>
        </div>

        {submitted ? (
          <div className="bg-white dark:bg-[#0d0d12] border border-black/5 dark:border-white/10 rounded-2xl p-10 text-center shadow-sm">
            <CheckCircle2 size={48} strokeWidth={1.5} className="text-emerald-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
              Thank you for your feedback!
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-md mx-auto">
              Your feedback directly shapes the development of Forged. We review every submission.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Submit another response
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white dark:bg-[#0d0d12] border border-black/5 dark:border-white/10 rounded-2xl p-6 shadow-sm">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-5">
                Have a template idea, found a visual bug, or want a new export feature? Let us know.
              </p>

              {/* Feedback type pill buttons */}
              <div className="flex flex-wrap gap-2 mb-5">
                {feedbackTypes.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setType(value)}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      type === value
                        ? "border-indigo-600 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm"
                        : "border-black/5 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-indigo-500/30"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Feedback textarea */}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  type === "bug"
                    ? "Describe what happened and which template or browser you were using..."
                    : type === "feature"
                      ? "Describe the feature or template design you'd love to see in Forged..."
                      : "Share your thoughts, suggestions, or ideas..."
                }
                rows={6}
                className="w-full bg-zinc-50 dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={!message.trim()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Send size={15} strokeWidth={1.5} />
              Submit Feedback
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

