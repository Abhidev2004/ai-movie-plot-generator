from typing import Any, Dict, Optional

from fastapi import HTTPException
from pydantic import BaseModel

from services.gemini_service import ask_gemini
from prompts.system_prompts import build_clarification_prompt, build_plot_prompt


class AnalyzeIdeaRequest(BaseModel):
	rawIdea: Any = None
	selections: Optional[Dict[str, Any]] = None


class GeneratePlotRequest(BaseModel):
	rawIdea: Any = None
	selections: Optional[Dict[str, Any]] = None
	answers: Optional[Dict[str, Any]] = None


async def analyze_idea(payload: AnalyzeIdeaRequest):
	try:
		prompt = build_clarification_prompt(payload.rawIdea, payload.selections)
		return await ask_gemini(prompt)
	except Exception as error:
		raise HTTPException(status_code=500, detail=str(error))


async def generate_plot(payload: GeneratePlotRequest):
	try:
		prompt = build_plot_prompt(
			{
				"rawIdea": payload.rawIdea,
				"selections": payload.selections,
				"answers": payload.answers,
			}
		)
		return await ask_gemini(prompt)
	except Exception as error:
		raise HTTPException(status_code=500, detail=str(error))
