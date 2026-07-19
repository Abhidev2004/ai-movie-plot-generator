import { useEffect, useState } from "react";

export default function PlotDisplay({ plot }) {
  const characters = Array.isArray(plot?.characters) ? plot.characters : [];
  const locations = Array.isArray(plot?.locations) ? plot.locations : [];
  const acts = Array.isArray(plot?.acts) ? plot.acts : [];
  const [activeActIndex, setActiveActIndex] = useState(0);

  useEffect(() => {
    if (activeActIndex >= acts.length) {
      setActiveActIndex(0);
    }
  }, [activeActIndex, acts.length]);

  function renderActParagraphs(actText) {
    const paragraphs = String(actText || "")
      .split(/\n\n+/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);

    if (paragraphs.length === 0) {
      return <p className="mb-0">No act details available.</p>;
    }

    return paragraphs.map((paragraph, index) => (
      <p key={index} className="mb-4 whitespace-pre-line last:mb-0">
        {paragraph}
      </p>
    ));
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6">
      <header className="card bg-base-100 shadow-xl">
        <div className="card-body gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-4xl font-bold tracking-tight">{plot?.title || "Untitled"}</h2>
            <span className="badge badge-primary badge-lg">{plot?.genre || "Genre"}</span>
          </div>
          <p className="text-lg italic text-base-content/80">{plot?.logline || ""}</p>
        </div>
      </header>

      <section className="space-y-3">
        <h3 className="text-2xl font-semibold">Characters</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {characters.map((character, index) => (
            <article key={`${character.name}-${index}`} className="card bg-base-100 shadow-lg">
              <div className="card-body gap-2">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="card-title text-xl">{character.name}</h4>
                  <span className="badge badge-outline">{character.role}</span>
                </div>
                <p>
                  <span className="font-semibold">Age:</span> {character.age}
                </p>
                <p>
                  <span className="font-semibold">Gender:</span> {character.gender}
                </p>
                <p>
                  <span className="font-semibold">Arc:</span> {character.arc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card bg-base-100 shadow-xl">
        <div className="card-body gap-4">
          <h3 className="text-2xl font-semibold">Locations</h3>
          <ul className="space-y-3">
            {locations.map((location, index) => (
              <li
                key={`${location.name}-${index}`}
                className="rounded-box border border-base-300 bg-base-200/40 p-4"
              >
                <p className="text-lg font-semibold">{location.name}</p>
                <p className="text-base-content/80">{location.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card bg-base-100 shadow-xl">
        <div className="card-body gap-3">
          <h3 className="text-2xl font-semibold">Story Structure</h3>

          {acts.length > 0 ? (
            <>
              <div role="tablist" className="tabs tabs-boxed w-fit gap-1">
                {acts.map((act, index) => (
                  <button
                    key={`${act?.title || "Act"}-${index}`}
                    type="button"
                    role="tab"
                    className={`tab ${activeActIndex === index ? "tab-active" : ""}`}
                    onClick={() => setActiveActIndex(index)}
                  >
                    {act?.title || `Act ${index + 1}`}
                  </button>
                ))}
              </div>

              <div className="rounded-box border border-base-300 bg-base-100 p-4 text-base leading-7 text-base-content/90">
                <div className="max-h-[60vh] overflow-y-auto pr-1">
                  {renderActParagraphs(acts[activeActIndex]?.content)}
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-box border border-base-300 bg-base-100 p-4 text-base-content/80">
              No act details available.
            </div>
          )}
        </div>
      </section>
    </section>
  );
}
