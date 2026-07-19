import { askGemini } from "../services/geminiService.js";
import {
	buildClarificationPrompt,
	buildPlotPrompt,
} from "../prompts/systemPrompts.js";

export async function analyzeIdea(req, res) {
	try {
		const { rawIdea, selections } = req.body;
		const prompt = buildClarificationPrompt(rawIdea, selections);
		const result = await askGemini(prompt);

		return res.json(result);
	} catch (error) {
		return res.status(500).json({
			error: error instanceof Error ? error.message : "Failed to analyze idea",
		});
	}
}

export async function generatePlot(req, res) {
	try {
		const { rawIdea, selections, answers } = req.body;
		const prompt = buildPlotPrompt({ rawIdea, selections, answers });
		const result = await askGemini(prompt);

		return res.json(result);
	} catch (error) {
		return res.status(500).json({
			error: error instanceof Error ? error.message : "Failed to generate plot",
		});
	}
}
