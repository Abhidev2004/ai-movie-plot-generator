import { useState } from "react";

export default function IdeaInput({ onSubmit }) {
  const [rawIdea, setRawIdea] = useState("");
  const [genre, setGenre] = useState("Sci-Fi");
  const [tone, setTone] = useState("Dark");
  const [plotLength, setPlotLength] = useState("Medium");
  const [actCount, setActCount] = useState("3");

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(rawIdea, { genre, tone, plotLength, actCount });
  }

  return (
    <div className="relative mx-auto w-full max-w-3xl rounded-3xl bg-gradient-to-r from-cyan-400/40 via-blue-500/30 to-pink-400/40 p-[1px] shadow-[0_0_40px_rgba(56,189,248,0.2)]">
      <div className="card rounded-3xl bg-base-100/95 backdrop-blur">
        <div className="card-body gap-5">
          <h2 className="card-title text-2xl">Pitch Your Movie Idea</h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label" htmlFor="raw-idea">
                <span className="label-text font-medium">Story Idea</span>
              </label>
              <textarea
                id="raw-idea"
                className="textarea textarea-bordered min-h-36 w-full"
                placeholder="e.g. A retired astronaut is pulled back for one last mission when..."
                value={rawIdea}
                onChange={(event) => setRawIdea(event.target.value)}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="form-control">
                <label className="label" htmlFor="genre-select">
                  <span className="label-text font-medium">Genre</span>
                </label>
                <select
                  id="genre-select"
                  className="select select-bordered w-full"
                  value={genre}
                  onChange={(event) => setGenre(event.target.value)}
                >
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Horror">Horror</option>
                  <option value="Rom-Com">Rom-Com</option>
                  <option value="Thriller">Thriller</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Drama">Drama</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label" htmlFor="tone-select">
                  <span className="label-text font-medium">Tone</span>
                </label>
                <select
                  id="tone-select"
                  className="select select-bordered w-full"
                  value={tone}
                  onChange={(event) => setTone(event.target.value)}
                >
                  <option value="Dark">Dark</option>
                  <option value="Whimsical">Whimsical</option>
                  <option value="Gritty">Gritty</option>
                  <option value="Uplifting">Uplifting</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="form-control">
                <label className="label" htmlFor="plot-length-select">
                  <span className="label-text font-medium">Plot Length</span>
                </label>
                <select
                  id="plot-length-select"
                  className="select select-bordered w-full"
                  value={plotLength}
                  onChange={(event) => setPlotLength(event.target.value)}
                >
                  <option value="Short">Short</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label" htmlFor="act-count-select">
                  <span className="label-text font-medium">Number of Acts</span>
                </label>
                <select
                  id="act-count-select"
                  className="select select-bordered w-full"
                  value={actCount}
                  onChange={(event) => setActCount(event.target.value)}
                >
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
            </div>

            <div className="card-actions justify-end">
              <button type="submit" className="btn btn-primary px-8">
                Generate
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
