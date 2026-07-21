import json


def format_value(value):
	if value is None or value == "":
		return "(not provided)"

	if isinstance(value, str):
		return value

	return json.dumps(value, indent=2, ensure_ascii=False)


def format_selections(selections):
	if selections is None or not isinstance(selections, (dict, list)):
		return "(none)"

	return json.dumps(selections, indent=2, ensure_ascii=False)


def _parse_int(value):
	if value is None:
		return None

	try:
		return int(str(value), 10)
	except (TypeError, ValueError):
		return None


def build_clarification_prompt(raw_idea, selections):
	return "\n".join([
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
		format_value(raw_idea),
		"",
		"Dropdown selections:",
		format_selections(selections),
	])


def build_plot_prompt(context):
	raw_idea = context.get("rawIdea") if isinstance(context, dict) else None
	selections = context.get("selections") if isinstance(context, dict) else None
	answers = context.get("answers") if isinstance(context, dict) else None
	plot_length = selections.get("plotLength") if isinstance(selections, dict) and selections.get("plotLength") else "Medium"
	parsed_act_count = _parse_int(selections.get("actCount")) if isinstance(selections, dict) else None
	act_count = 3 if parsed_act_count is None else parsed_act_count

	word_count_by_length = {
		"Short": "120-180 words",
		"Medium": "350-450 words",
		"Large": "600-800 words",
	}

	target_word_count = word_count_by_length.get(plot_length) or word_count_by_length["Medium"]

	structure_guidance = (
		"Build a coherent multi-act arc with clear setup, escalation, and payoff that fits the requested act count."
	)

	if act_count == 3:
		structure_guidance = (
			"For a 3-act structure: make Act One a focused setup/inciting incident, Act Two a sustained escalation with reversals and midpoint pressure, and Act Three a decisive climax and resolution."
		)
	elif act_count == 4:
		structure_guidance = (
			"For a 4-act structure: use Act One for setup, Act Two for first escalation, Act Three for deeper complications and a late turning point, and Act Four for climax plus denouement."
		)
	elif act_count == 5:
		structure_guidance = (
			"For a 5-act structure: pace progressively across five distinct movements (setup, rising conflict, major reversal, pre-climax crisis, final confrontation/resolution), ensuring each act has a unique dramatic purpose instead of padded repetition."
		)

	return "\n".join([
		"You are a screenwriter and story architect generating a complete movie plot from the user's idea and clarification answers.",
		"Use the user's provided details exactly where relevant, and fill gaps with coherent cinematic storytelling.",
		"Weave in every character name, age, gender, and location the user provided.",
		f"Write exactly {act_count} acts in the \"acts\" array.",
		f"Each act's content must be {target_word_count} and split into multiple paragraphs.",
		"Within each act, cover key scenes, character moments, dialogue beats, and rising tension.",
		"Separate paragraphs inside each act content string using \\n\\n.",
		structure_guidance,
		"Respond ONLY with valid JSON in this exact shape, with no markdown fences and no extra text:",
		f'{{ "title": string, "genre": string, "logline": string, "characters": [ {{ "name": string, "age": string, "gender": string, "role": string, "arc": string }} ], "locations": [ {{ "name": string, "description": string }} ], "acts": [ {{ "title": string, "content": string }} ] }}',
		f'The \"acts\" array must contain exactly {act_count} entries and together form a complete story arc for {act_count} acts.',
		"Use titles like \"Act One\", \"Act Two\", etc., matching the number of acts requested.",
		"Keep the plot internally consistent, emotionally engaging, and specific.",
		"Use the selected genre and tone if provided.",
		f"Use the selected plot length ({plot_length}) and act count ({act_count}) if provided.",
		"Return a polished movie-ready structure with clear character arcs and distinct locations.",
		"",
		"User idea:",
		format_value(raw_idea),
		"",
		"Dropdown selections:",
		format_selections(selections),
		"",
		"Clarification answers:",
		format_value(answers),
	])
