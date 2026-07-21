import asyncio
import json
import os
import re

from google import genai
from google.genai import errors
from dotenv import load_dotenv

load_dotenv()


client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
model_name = os.environ.get("GEMINI_MODEL")
fallback_model_name = "gemini-3.1-flash-lite"


def _get_lower_message(error):
	message = getattr(error, "message", None) or str(error)
	return str(message).lower()


def is_daily_quota_error(error) -> bool:
	message = _get_lower_message(error)

	if "daily quota" in message:
		return True

	if "quota for this api" in message:
		return True

	if "per day" in message:
		return True

	if "requests per day" in message:
		return True

	if "quota metric" in message and "day" in message:
		return True

	return False


def is_rate_limit_error(error) -> bool:
	code = getattr(error, "code", None)
	if code != 429:
		return False

	if is_daily_quota_error(error):
		return False

	message = _get_lower_message(error)

	if "rate limit" in message:
		return True

	if "per minute" in message:
		return True

	if "requests per minute" in message:
		return True

	if "quota metric" in message and "minute" in message:
		return True

	if "resource exhausted" in message:
		return True

	if "too many requests" in message:
		return True

	if "quota exceeded" in message:
		return True

	return False


async def generate_content_with_retry(prompt_text, model):
	delays = [1, 2, 4]

	for attempt in range(len(delays) + 1):
		try:
			return await client.aio.models.generate_content(model=model, contents=prompt_text)
		except Exception as error:
			if is_daily_quota_error(error):
				raise Exception("Daily Gemini quota reached, try again after the reset")

			if not is_rate_limit_error(error) or attempt == len(delays):
				raise

			await asyncio.sleep(delays[attempt])


def strip_code_fences(text: str) -> str:
	trimmed_text = text.strip()
	if not trimmed_text.startswith("```"):
		return trimmed_text

	cleaned_text = re.sub(r"^```(?:json)?\s*", "", trimmed_text, flags=re.IGNORECASE)
	cleaned_text = re.sub(r"\s*```$", "", cleaned_text, flags=re.IGNORECASE)
	return cleaned_text.strip()


async def ask_gemini(prompt_text):
	try:
		response = await generate_content_with_retry(prompt_text, model_name)
		raw_text = getattr(response, "text", "") or ""
		cleaned_text = strip_code_fences(raw_text)
		try:
			return json.loads(cleaned_text)
		except json.JSONDecodeError:
			raise Exception(f"Failed to parse Gemini response as JSON. Raw text: {raw_text}")
	except Exception as error:
		if not is_rate_limit_error(error):
			raise

		try:
			fallback_response = await client.aio.models.generate_content(
				model=fallback_model_name,
				contents=prompt_text,
			)
			raw_text = getattr(fallback_response, "text", "") or ""
			cleaned_text = strip_code_fences(raw_text)
			try:
				return json.loads(cleaned_text)
			except json.JSONDecodeError:
				raise Exception(f"Failed to parse Gemini response as JSON. Raw text: {raw_text}")
		except Exception as fallback_error:
			if is_daily_quota_error(fallback_error):
				raise Exception("Daily Gemini quota reached, try again after the reset")

			raise
