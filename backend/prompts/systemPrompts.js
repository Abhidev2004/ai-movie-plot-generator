function formatValue(value) {
	if (value === undefined || value === null || value === "") {
		return "(not provided)";
	}

	if (typeof value === "string") {
		return value;
	}

	return JSON.stringify(value, null, 2);
}

function formatSelections(selections) {
	if (!selections || typeof selections !== "object") {
		return "(none)";
	}

	return JSON.stringify(selections, null, 2);
}

export function buildClarificationPrompt(rawIdea, selections) {
	return [
		"You are a story development assistant for a movie plot generator.",
		"Analyze the user's idea and decide whether you need clarification before writing a plot.",
		"Focus on how many named characters the story plausibly needs, and identify only the details that are actually ambiguous or missing.",
		"Ask about missing character names, ages, genders, relationships, key locations, time period, and the central conflict only when needed.",
		"Do not ask more than 6 questions.",
		"If the idea is already detailed enough, set needsClarification to false and return an empty questions array.",
		"Respond ONLY with valid JSON in this exact shape, with no markdown fences and no extra text:",
		'{ "needsClarification": boolean, "questions": [ { "id": string, "label": string, "type": "text"|"select", "options": string[] } ] }',
		"If a question is type \"select\", include a non-empty options array.",
		"If a question is type \"text\", omit the options field.",
		"",
		"User idea:",
		formatValue(rawIdea),
		"",
		"Dropdown selections:",
		formatSelections(selections),
	].join("\n");
}

export function buildPlotPrompt(context) {
	const rawIdea = context?.rawIdea;
	const selections = context?.selections;
	const answers = context?.answers;

	return [
		"You are a screenwriter and story architect generating a complete movie plot from the user's idea and clarification answers.",
		"Use the user's provided details exactly where relevant, and fill gaps with coherent cinematic storytelling.",
		"Weave in every character name, age, gender, and location the user provided.",
		"Keep act summaries to 2-3 sentences each.",
		"Respond ONLY with valid JSON in this exact shape, with no markdown fences and no extra text:",
		'{ "title": string, "genre": string, "logline": string, "characters": [ { "name": string, "age": string, "gender": string, "role": string, "arc": string } ], "locations": [ { "name": string, "description": string } ], "actOne": string, "actTwo": string, "actThree": string }',
		"Keep the plot internally consistent, emotionally engaging, and specific.",
		"Use the selected genre and tone if provided.",
		"Return a polished movie-ready structure with clear character arcs and distinct locations.",
		"",
		"User idea:",
		formatValue(rawIdea),
		"",
		"Dropdown selections:",
		formatSelections(selections),
		"",
		"Clarification answers:",
		formatValue(answers),
	].join("\n");
}
