import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL;
const fallbackModelName = "gemini-3.1-flash-lite";

const ai = new GoogleGenAI({ apiKey });

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function getErrorMessage(error) {
	if (error instanceof Error) {
		return error.message;
	}

	return String(error || "");
}

function getStatusCode(error) {
	return (
		error?.status ??
		error?.statusCode ??
		error?.response?.status ??
		error?.cause?.status ??
		null
	);
}

function isDailyQuotaError(error) {
	const message = getErrorMessage(error).toLowerCase();

	return (
		message.includes("daily quota") ||
		message.includes("quota for this api") ||
		message.includes("per day") ||
		message.includes("requests per day") ||
		message.includes("quota metric") && message.includes("day")
	);
}

function isRateLimitError(error) {
	const statusCode = getStatusCode(error);
	const message = getErrorMessage(error).toLowerCase();

	if (statusCode !== 429) {
		return false;
	}

	if (isDailyQuotaError(error)) {
		return false;
	}

	return (
		message.includes("rate limit") ||
		message.includes("per minute") ||
		message.includes("requests per minute") ||
		message.includes("quota metric") && message.includes("minute") ||
		message.includes("resource exhausted") ||
		message.includes("too many requests") ||
		message.includes("quota exceeded")
	);
}

function isFallbackEligibleRateLimit(error) {
	return isRateLimitError(error);
}

async function generateContentWithRetry(promptText, model) {
	const delays = [1000, 2000, 4000];
	let lastError = null;

	for (let attempt = 0; attempt <= delays.length; attempt += 1) {
		try {
			return await ai.models.generateContent({
				model,
				contents: promptText,
			});
		} catch (error) {
			lastError = error;

			if (isDailyQuotaError(error)) {
				throw new Error(
					"Daily Gemini quota reached, try again after the reset"
				);
			}

			if (!isRateLimitError(error) || attempt === delays.length) {
				throw error;
			}

			await sleep(delays[attempt]);
		}
	}

	throw lastError;
}

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
	try {
		const response = await generateContentWithRetry(promptText, modelName);

		const rawText = response?.text ?? "";
		const cleanedText = stripCodeFences(rawText);

		try {
			return JSON.parse(cleanedText);
		} catch (error) {
			throw new Error(
				`Failed to parse Gemini response as JSON. Raw text: ${rawText}`
			);
		}
	} catch (error) {
		if (!isFallbackEligibleRateLimit(error)) {
			throw error;
		}

		try {
			const fallbackResponse = await ai.models.generateContent({
				model: fallbackModelName,
				contents: promptText,
			});

			const rawText = fallbackResponse?.text ?? "";
			const cleanedText = stripCodeFences(rawText);

			try {
				return JSON.parse(cleanedText);
			} catch (parseError) {
				throw new Error(
					`Failed to parse Gemini response as JSON. Raw text: ${rawText}`
				);
			}
		} catch (fallbackError) {
			if (isDailyQuotaError(fallbackError)) {
				throw new Error(
					"Daily Gemini quota reached, try again after the reset"
				);
			}

			throw fallbackError;
		}
	}
}
