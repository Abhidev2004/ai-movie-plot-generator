import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL;

const ai = new GoogleGenAI({ apiKey });

function stripCodeFences(text) {
	const trimmedText = text.trim();

	if (trimmedText.startsWith("```")) {
		return trimmedText
			.replace(/^```(?:json)?\s*/i, "")
			.replace(/\s*```\s*$/i, "")
			.trim();
	}

	return trimmedText;
}

export async function askGemini(promptText) {
	const response = await ai.models.generateContent({
		model: modelName,
		contents: promptText,
	});

	const rawText = response?.text ?? "";
	const cleanedText = stripCodeFences(rawText);

	try {
		return JSON.parse(cleanedText);
	} catch (error) {
		throw new Error(
			`Failed to parse Gemini response as JSON. Raw text: ${rawText}`
		);
	}
}
