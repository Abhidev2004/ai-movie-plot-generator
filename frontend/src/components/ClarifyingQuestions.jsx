import { useMemo, useState } from "react";

export default function ClarifyingQuestions({ questions, onSubmit }) {
  const initialAnswers = useMemo(() => {
    const answers = {};

    for (const question of questions || []) {
      if (question?.type === "select") {
        answers[question.id] = question.options?.[0] || "";
      } else {
        answers[question.id] = "";
      }
    }

    return answers;
  }, [questions]);

  const [answers, setAnswers] = useState(initialAnswers);

  function handleChange(questionId, value) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(answers);
  }

  return (
    <div className="relative mx-auto w-full max-w-3xl rounded-3xl bg-gradient-to-r from-cyan-400/40 via-blue-500/30 to-pink-400/40 p-[1px] shadow-[0_0_40px_rgba(56,189,248,0.2)]">
      <div className="card rounded-3xl bg-base-100/95 backdrop-blur">
        <div className="card-body">
          <h2 className="card-title text-2xl">A few quick details before I write this</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {(questions || []).map((question) => (
              <div key={question.id} className="form-control">
                <label className="label" htmlFor={`question-${question.id}`}>
                  <span className="label-text font-medium">{question.label}</span>
                </label>

                {question.type === "select" ? (
                  <select
                    id={`question-${question.id}`}
                    className="select select-bordered w-full"
                    value={answers[question.id] ?? ""}
                    onChange={(event) => handleChange(question.id, event.target.value)}
                    required
                  >
                    {(question.options || []).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={`question-${question.id}`}
                    type="text"
                    className="input input-bordered w-full"
                    value={answers[question.id] ?? ""}
                    onChange={(event) => handleChange(question.id, event.target.value)}
                    required
                  />
                )}
              </div>
            ))}

            <div className="card-actions justify-end pt-2">
              <button type="submit" className="btn btn-primary px-8">
                Generate Plot
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
