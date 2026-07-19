const API_BASE_URL = import.meta.env.VITE_API_URL;

async function postJson(path, payload) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();
  let data = null;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }
  }

  if (!response.ok) {
    const errorMessage =
      data && typeof data === "object" && "error" in data
        ? data.error
        : response.statusText || "Request failed";

    throw new Error(errorMessage);
  }

  return data;
}

export async function analyzeIdea({ rawIdea, selections }) {
  return postJson("/analyze-idea", { rawIdea, selections });
}

export async function generatePlot({ rawIdea, selections, answers }) {
  return postJson("/generate-plot", { rawIdea, selections, answers });
}
