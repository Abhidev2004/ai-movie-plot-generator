import jsPDF from "jspdf";

export function exportPlotAsPdf(plot) {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const bottomMargin = 40;
  const contentWidth = pageWidth - margin * 2;
  const lineHeight = 14;
  let y = margin;

  function ensureSpace(requiredHeight) {
    if (y + requiredHeight > pageHeight - bottomMargin) {
      doc.addPage();
      y = margin;
    }
  }

  function addTitle(text, fontSize, style, extraAfter = 0) {
    const lines = doc.splitTextToSize(String(text || ""), contentWidth);
    const height = lines.length * (fontSize * 1.2) + extraAfter;
    ensureSpace(height);
    doc.setFont("helvetica", style);
    doc.setFontSize(fontSize);
    doc.text(lines, margin, y);
    y += lines.length * (fontSize * 1.2) + extraAfter;
  }

  function addWrappedParagraph(text, fontSize = 11, style = "normal", extraBefore = 0, extraAfter = 0) {
    const lines = doc.splitTextToSize(String(text || ""), contentWidth);
    if (!lines.length) {
      return;
    }

    const height = extraBefore + lines.length * lineHeight + extraAfter;
    ensureSpace(height);
    y += extraBefore;
    doc.setFont("helvetica", style);
    doc.setFontSize(fontSize);
    doc.text(lines, margin, y);
    y += lines.length * lineHeight + extraAfter;
  }

  function addHeading(text) {
    const headingLines = doc.splitTextToSize(String(text || ""), contentWidth);
    const height = headingLines.length * 18 + 8;
    ensureSpace(height);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(headingLines, margin, y);
    y += headingLines.length * 18 + 8;
  }

  const title = plot?.title || "movie-plot";
  const genre = plot?.genre || "";
  const logline = plot?.logline || "";
  const characters = Array.isArray(plot?.characters) ? plot.characters : [];
  const locations = Array.isArray(plot?.locations) ? plot.locations : [];
  const acts = Array.isArray(plot?.acts)
    ? plot.acts
    : [
        { title: "Act One", content: plot?.actOne || "" },
        { title: "Act Two", content: plot?.actTwo || "" },
        { title: "Act Three", content: plot?.actThree || "" },
      ].filter((act) => String(act.content || "").trim());

  addTitle(title, 24, "bold", 6);

  if (genre) {
    addWrappedParagraph(genre, 13, "normal", 0, 8);
  }

  if (logline) {
    addWrappedParagraph(logline, 12, "italic", 0, 14);
  }

  addHeading("Characters");
  characters.forEach((character) => {
    const details = `${character?.name || "Unnamed"} | Age: ${character?.age || ""} | Gender: ${character?.gender || ""} | Role: ${character?.role || ""}`;
    addWrappedParagraph(details, 11, "normal", 0, 4);

    if (character?.arc) {
      addWrappedParagraph(`Arc: ${character.arc}`, 11, "normal", 0, 8);
    } else {
      y += 4;
    }
  });

  addHeading("Locations");
  locations.forEach((location) => {
    addWrappedParagraph(location?.name || "Untitled Location", 12, "bold", 0, 2);
    if (location?.description) {
      addWrappedParagraph(location.description, 11, "normal", 0, 8);
    } else {
      y += 6;
    }
  });

  acts.forEach((act, index) => {
    const actTitle = act?.title || `Act ${index + 1}`;
    const actContent = act?.content || "";

    addHeading(actTitle);
    if (actContent) {
      const lines = doc.splitTextToSize(String(actContent), contentWidth);
      ensureSpace(lines.length * lineHeight + 4);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(lines, margin, y);
      y += lines.length * lineHeight + 10;
    }
  });

  doc.save(`${plot?.title || "movie-plot"}.pdf`);
}
