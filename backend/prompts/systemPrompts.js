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
	const plotLength = selections?.plotLength || "Medium";
	const parsedActCount = Number.parseInt(selections?.actCount, 10);
	const actCount = Number.isNaN(parsedActCount) ? 3 : parsedActCount;

	const wordCountByLength = {
		Short: "120-180 words",
		Medium: "350-450 words",
		Large: "600-800 words",
	};

	const targetWordCount = wordCountByLength[plotLength] || wordCountByLength.Medium;

	let structureGuidance =
		"Build a coherent multi-act arc with clear setup, escalation, and payoff that fits the requested act count.";

	if (actCount === 3) {
		structureGuidance =
			"For a 3-act structure: make Act One a focused setup/inciting incident, Act Two a sustained escalation with reversals and midpoint pressure, and Act Three a decisive climax and resolution.";
	} else if (actCount === 4) {
		structureGuidance =
			"For a 4-act structure: use Act One for setup, Act Two for first escalation, Act Three for deeper complications and a late turning point, and Act Four for climax plus denouement.";
	} else if (actCount === 5) {
		structureGuidance =
			"For a 5-act structure: pace progressively across five distinct movements (setup, rising conflict, major reversal, pre-climax crisis, final confrontation/resolution), ensuring each act has a unique dramatic purpose instead of padded repetition.";
	}

	return [
		"You are a screenwriter and story architect generating a complete movie plot from the user's idea and clarification answers.",
		"Use the user's provided details exactly where relevant, and fill gaps with coherent cinematic storytelling.",
		"Weave in every character name, age, gender, and location the user provided.",
		`Write exactly ${actCount} acts in the \"acts\" array.`,
		`Each act's content must be ${targetWordCount} and split into multiple paragraphs.`,
		"Within each act, cover key scenes, character moments, dialogue beats, and rising tension.",
		"Separate paragraphs inside each act content string using \\n\\n.",
		structureGuidance,
		"Respond ONLY with valid JSON in this exact shape, with no markdown fences and no extra text:",
		`{ "title": string, "genre": string, "logline": string, "characters": [ { "name": string, "age": string, "gender": string, "role": string, "arc": string } ], "locations": [ { "name": string, "description": string } ], "acts": [ { "title": string, "content": string } ] }`,
		`The \"acts\" array must contain exactly ${actCount} entries and together form a complete story arc for ${actCount} acts.`,
		"Use titles like \"Act One\", \"Act Two\", etc., matching the number of acts requested.",
		"Keep the plot internally consistent, emotionally engaging, and specific.",
		"Use the selected genre and tone if provided.",
		`Use the selected plot length (${plotLength}) and act count (${actCount}) if provided.`,
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
