import { useState } from "react";
import {
  IdeaInput,
  ClarifyingQuestions,
  LoadingSkeleton,
  PlotDisplay,
} from "./components";
import { analyzeIdea, generatePlot } from "./api.js";

function App() {
  const [stage, setStage] = useState("idea");
  const [rawIdea, setRawIdea] = useState("");
  const [selections, setSelections] = useState({ genre: "", tone: "" });
  const [questions, setQuestions] = useState([]);
  const [plot, setPlot] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleIdeaSubmit(nextRawIdea, nextSelections) {
    setRawIdea(nextRawIdea);
    setSelections(nextSelections);
    setQuestions([]);
    setPlot(null);
    setErrorMessage("");
    setStage("loadingQuestions");

    try {
      const analysis = await analyzeIdea({
        rawIdea: nextRawIdea,
        selections: nextSelections,
      });

      if (analysis?.needsClarification && (analysis?.questions || []).length > 0) {
        setQuestions(analysis.questions);
        setStage("questions");
        return;
      }

      setStage("loadingPlot");

      const nextPlot = await generatePlot({
        rawIdea: nextRawIdea,
        selections: nextSelections,
        answers: {},
      });

      setPlot(nextPlot);
      setStage("result");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
      setStage("error");
    }
  }

  async function handleQuestionsSubmit(answers) {
    setErrorMessage("");
    setStage("loadingPlot");

    try {
      const nextPlot = await generatePlot({
        rawIdea,
        selections,
        answers,
      });

      setPlot(nextPlot);
      setStage("result");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
      setStage("error");
    }
  }

  function handleStartOver() {
    setStage("idea");
    setRawIdea("");
    setSelections({ genre: "", tone: "" });
    setQuestions([]);
    setPlot(null);
    setErrorMessage("");
  }

  function renderStage() {
    if (stage === "idea") {
      return <IdeaInput onSubmit={handleIdeaSubmit} />;
    }

    if (stage === "loadingQuestions") {
      return <LoadingSkeleton />;
    }

    if (stage === "questions") {
      return (
        <ClarifyingQuestions questions={questions} onSubmit={handleQuestionsSubmit} />
      );
    }

    if (stage === "loadingPlot") {
      return <LoadingSkeleton />;
    }

    if (stage === "result") {
      return (
        <div className="space-y-6">
          <PlotDisplay plot={plot} />
          <div className="flex justify-center">
            <button type="button" className="btn btn-outline" onClick={handleStartOver}>
              Start Over
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="card mx-auto w-full max-w-2xl bg-base-100 shadow-xl">
        <div className="card-body items-start gap-4">
          <h2 className="card-title text-error">Something went wrong</h2>
          <p>{errorMessage || "Unable to complete your request."}</p>
          <button type="button" className="btn btn-primary" onClick={handleStartOver}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      data-theme="synthwave"
      className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-fuchsia-950"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-8 md:py-14">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            AI Movie Plot Generator
          </h1>
        </header>
        {renderStage()}
      </div>
    </div>
  );
}

export default App;
