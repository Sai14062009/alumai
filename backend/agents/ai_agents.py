# import json
# import logging
# from typing import Dict, Optional
# from groq import AsyncGroq
# from ..config import settings

# class _BaseLLMAgent:
#     def __init__(self):
#         self.client = AsyncGroq(api_key=settings.GROQ_API_KEY)

#     async def _call_claude(self, prompt: str, schema=None) -> Optional[str]:
#         if not settings.GROQ_API_KEY:
#             print("!!! ERROR: No Groq API Key found in .env")
#             return None

#         system_prompt = "You are an expert industrial plant maintenance AI assistant for AlumAI."
#         if schema:
#             system_prompt += (
#                 f"\n\nRespond ONLY with valid JSON matching this schema, no extra text:\n"
#                 f"{json.dumps(schema, indent=2)}"
#             )

#         try:
#             response = await self.client.chat.completions.create(
#                 model="llama-3.3-70b-versatile",  # free and powerful
#                 messages=[
#                     {"role": "system", "content": system_prompt},
#                     {"role": "user", "content": prompt}
#                 ],
#                 max_tokens=1000,
#                 temperature=0.1
#             )
#             return response.choices[0].message.content

#         except Exception as e:
#             print(f"!!! GROQ ERROR: {str(e)}")
#             return None


# class TicketIntakeAgent(_BaseLLMAgent):
#     async def process(self, description: str) -> str:
#         prompt = (
#             f"Normalize this industrial maintenance note into a clean, "
#             f"professional one-paragraph description:\n\n{description}"
#         )
#         res = await self._call_claude(prompt)
#         return res.strip() if res else description


# class TicketClassifierAgent(_BaseLLMAgent):
#     async def classify(self, text: str) -> Dict:
#         schema = {
#             "type": "object",
#             "properties": {
#                 "asset": {"type": "string"},
#                 "system": {"type": "string"},
#                 "severity": {"type": "string", "enum": ["Low", "Medium", "High", "Critical"]}
#             },
#             "required": ["asset", "system", "severity"]
#         }
#         prompt = (
#             f"Extract the asset name, system/subsystem, and severity level "
#             f"from this maintenance ticket:\n\n{text}"
#         )
#         res = await self._call_claude(prompt, schema)
#         try:
#             return json.loads(res) if res else {"asset": "Unknown", "system": "Unknown", "severity": "Medium"}
#         except:
#             return {"asset": "Error", "system": "Error", "severity": "Medium"}


# class RCAAgent(_BaseLLMAgent):
#     async def analyze(self, data: Dict) -> Dict:
#         schema = {
#             "type": "object",
#             "properties": {
#                 "summary": {"type": "string"},
#                 "root_cause": {"type": "string"},
#                 "fix": {"type": "string"},
#                 "confidence_score": {"type": "number"},
#                 "escalate": {"type": "boolean"}
#             },
#             "required": ["summary", "root_cause", "fix", "confidence_score", "escalate"]
#         }
#         prompt = (
#             f"You are a senior industrial plant engineer. Perform a detailed "
#             f"Root Cause Analysis on this maintenance ticket:\n\n"
#             f"{json.dumps(data, indent=2)}\n\n"
#             f"Be specific about the root cause, recommended fix, confidence score (0.0-1.0), "
#             f"and whether this needs escalation to senior engineering."
#         )
#         res = await self._call_claude(prompt, schema)
#         try:
#             return json.loads(res) if res else {"escalate": True, "root_cause": "AI Analysis Failed", "summary": "", "fix": "", "confidence_score": 0.0}
#         except:
#             return {"escalate": True, "root_cause": "Parsing Error", "summary": "", "fix": "", "confidence_score": 0.0}

# import json
# import logging
# from typing import Dict, Optional
# from groq import AsyncGroq
# from ..config import settings

# logger = logging.getLogger(__name__)


# class _BaseLLMAgent:
#     def __init__(self):
#         self.client = AsyncGroq(api_key=settings.GROQ_API_KEY)

#     async def _call_llm(self, prompt: str, system_prompt: str = None) -> Optional[str]:
#         if not settings.GROQ_API_KEY:
#             print("!!! ERROR: No Groq API Key found in .env")
#             return None

#         if not system_prompt:
#             system_prompt = "You are an expert industrial plant maintenance AI. Respond ONLY with valid JSON, no extra text."

#         try:
#             response = await self.client.chat.completions.create(
#                 model="llama-3.3-70b-versatile",
#                 messages=[
#                     {"role": "system", "content": system_prompt},
#                     {"role": "user", "content": prompt}
#                 ],
#                 max_tokens=1200,
#                 temperature=0.2
#             )
#             raw = response.choices[0].message.content
#             print(f"\n>>> LLM RAW RESPONSE:\n{raw[:500]}\n")
#             return raw

#         except Exception as e:
#             print(f"!!! GROQ ERROR: {str(e)}")
#             return None


# class SingleCallAnalyzer(_BaseLLMAgent):
#     """
#     Combines Intake + Classifier + RCA + Evaluator into ONE single LLM call.
#     This avoids rate limiting on free Groq tier.
#     """

#     async def full_analysis(self, description: str) -> Dict:
#         prompt = (
#             f"You are a senior industrial maintenance engineer. Analyze this ticket in ONE response.\n\n"
#             f"TICKET: {description}\n\n"
#             f"Return a JSON object with ALL of these fields:\n\n"
#             f'{{\n'
#             f'  "clean_description": "rewrite the ticket professionally in 1 paragraph",\n'
#             f'  "asset": "name of the machine/equipment mentioned or implied",\n'
#             f'  "system": "which system (Hydraulic, Electrical, Mechanical, HVAC, Pneumatic, Control, etc)",\n'
#             f'  "severity": "Low or Medium or High or Critical",\n'
#             f'  "summary": "1-2 sentence overview of the problem",\n'
#             f'  "root_cause": "the most likely root cause based on symptoms described",\n'
#             f'  "fix": "1. First repair step\\n2. Second step\\n3. Third step\\n4. Fourth step\\n5. Fifth step",\n'
#             f'  "confidence_score": 0.85,\n'
#             f'  "escalate": false\n'
#             f'}}\n\n'
#             f"IMPORTANT RULES:\n"
#             f"- fix MUST have 4-6 numbered steps separated by \\n, specific to this exact equipment and problem\n"
#             f"- root_cause MUST be specific to the symptoms described, not generic\n"
#             f"- confidence_score: use 0.80-0.95 if symptoms are clear, 0.60-0.79 if somewhat vague, below 0.5 ONLY if ticket is nearly empty\n"
#             f"- escalate: false unless the ticket has zero useful information\n"
#             f"- If you can identify the asset from context, do it. Do NOT say Unknown unless there is truly no clue\n"
#             f"- Respond with ONLY the JSON object. No markdown, no backticks, no explanation."
#         )

#         res = await self._call_llm(prompt)

#         if not res:
#             return self._total_fallback(description)

#         try:
#             # Aggressively clean the response
#             cleaned = res.strip()

#             # Remove markdown wrappers
#             if cleaned.startswith("```json"):
#                 cleaned = cleaned[7:]
#             elif cleaned.startswith("```"):
#                 cleaned = cleaned[3:]
#             if cleaned.endswith("```"):
#                 cleaned = cleaned[:-3]
#             cleaned = cleaned.strip()

#             # Find JSON boundaries
#             start = cleaned.find("{")
#             end = cleaned.rfind("}") + 1
#             if start == -1 or end <= start:
#                 print(f"!!! No JSON object found in response")
#                 return self._total_fallback(description)

#             json_str = cleaned[start:end]
#             parsed = json.loads(json_str)

#             # Normalize confidence
#             conf = float(parsed.get("confidence_score", 0.8))
#             if conf > 1.0:
#                 conf = conf / 100.0
#             parsed["confidence_score"] = max(0.1, min(1.0, conf))

#             # Ensure fix has content
#             fix = str(parsed.get("fix", "")).strip()
#             if not fix or len(fix) < 20:
#                 asset = parsed.get("asset", "equipment")
#                 system = parsed.get("system", "system")
#                 parsed["fix"] = (
#                     f"1. Isolate {asset} and follow lockout/tagout procedures\n"
#                     f"2. Inspect {system} for visible damage or anomalies\n"
#                     f"3. Test and diagnose {system} components\n"
#                     f"4. Replace or repair faulty components\n"
#                     f"5. Run operational test and verify fix\n"
#                     f"6. Document findings in maintenance log"
#                 )

#             # Ensure all required fields exist
#             parsed.setdefault("clean_description", description)
#             parsed.setdefault("asset", "Unknown")
#             parsed.setdefault("system", "Unknown")
#             parsed.setdefault("severity", "Medium")
#             parsed.setdefault("summary", "Maintenance ticket analysis.")
#             parsed.setdefault("root_cause", "Requires further inspection.")
#             parsed.setdefault("escalate", False)

#             return parsed

#         except json.JSONDecodeError as e:
#             print(f"!!! JSON PARSE ERROR: {e}")
#             print(f"!!! Attempted to parse: {json_str[:300] if 'json_str' in dir() else 'N/A'}")
#             return self._total_fallback(description)
#         except Exception as e:
#             print(f"!!! ANALYSIS ERROR: {e}")
#             return self._total_fallback(description)

#     def _total_fallback(self, description: str) -> Dict:
#         return {
#             "clean_description": description,
#             "asset": "Unknown",
#             "system": "Unknown",
#             "severity": "Medium",
#             "summary": "AI could not process this ticket. Manual review needed.",
#             "root_cause": "Analysis failed — the AI service may be temporarily unavailable.",
#             "fix": "1. Review the ticket description manually\n2. Inspect the equipment on-site\n3. Identify root cause through physical inspection\n4. Apply corrective maintenance\n5. Document findings",
#             "confidence_score": 0.0,
#             "escalate": True
#         }


# # Keep these for the assistant chat — those only make 1 call each so they're fine
# class AssistantAgent(_BaseLLMAgent):
#     async def chat(self, prompt: str) -> Optional[str]:
#         return await self._call_llm(prompt, 
#             system_prompt="You are the AlumAI Diagnostic Partner. Help engineers solve maintenance issues. Be brief (max 3 sentences). State your hypothesis and ask ONE follow-up question."
#         )

#     async def finalize(self, prompt: str) -> Optional[str]:
#         return await self._call_llm(prompt,
#             system_prompt="You are an industrial maintenance AI. Respond ONLY with valid JSON, no extra text."
#         )



import json
import logging
from typing import Dict, Optional
from groq import AsyncGroq
from ..config import settings

logger = logging.getLogger(__name__)


class _BaseLLMAgent:
    def __init__(self):
        self.client = AsyncGroq(api_key=settings.GROQ_API_KEY)

    async def _call_llm(self, prompt: str, system_prompt: str = None) -> Optional[str]:
        if not settings.GROQ_API_KEY:
            print("!!! ERROR: No Groq API Key found in .env")
            return None

        if not system_prompt:
            system_prompt = "You are an expert industrial plant maintenance AI. Respond ONLY with valid JSON, no extra text."

        try:
            response = await self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1500,
                temperature=0.2
            )
            raw = response.choices[0].message.content
            print(f"\n>>> LLM RAW RESPONSE:\n{raw[:500]}\n")
            return raw

        except Exception as e:
            print(f"!!! GROQ ERROR: {str(e)}")
            return None


class SingleCallAnalyzer(_BaseLLMAgent):
    """
    Combines Intake + Classifier + RCA + Evaluator into ONE single LLM call.
    """

    async def full_analysis(self, description: str) -> Dict:
        prompt = (
            f"You are a senior industrial maintenance engineer with 25 years of field experience. "
            f"You write RCA reports that maintenance technicians can follow step-by-step on the shop floor.\n\n"
            f"TICKET: {description}\n\n"
            f"Return a JSON object with ALL of these fields:\n\n"
            f'{{\n'
            f'  "clean_description": "rewrite the ticket professionally in 1 paragraph with technical detail",\n'
            f'  "asset": "specific equipment name",\n'
            f'  "system": "Hydraulic or Electrical or Mechanical or HVAC or Pneumatic or Control or Structural",\n'
            f'  "severity": "Low or Medium or High or Critical",\n'
            f'  "summary": "1-2 sentence technical overview",\n'
            f'  "root_cause": "specific root cause with technical reasoning",\n'
            f'  "fix": "1. First step\\n2. Second step\\n3. Third step\\n4. Fourth step\\n5. Fifth step\\n6. Sixth step",\n'
            f'  "confidence_score": 0.85,\n'
            f'  "escalate": false\n'
            f'}}\n\n'
            f"FIX STEPS RULES — THIS IS CRITICAL:\n"
            f"- Step 1 must ALWAYS be safety: lockout/tagout, isolate power, PPE requirements\n"
            f"- Include specific diagnostic methods: vibration analysis, thermal imaging, megger testing, pressure gauges, etc.\n"
            f"- Include threshold values where applicable (e.g., 'bearing temp should not exceed 180°F', 'insulation resistance must be >1 MΩ')\n"
            f"- Include specific part types to inspect or replace (e.g., 'SKF 6205-2RS bearing', 'Class F insulation')\n"
            f"- Final step must be: verification test + documentation + monitoring period\n"
            f"- Minimum 5 steps, maximum 8 steps\n"
            f"- Each step must be actionable — a technician should be able to DO it, not just 'check things'\n\n"
            f"ROOT CAUSE RULES:\n"
            f"- Be specific: not 'motor issue' but 'bearing degradation causing increased friction and thermal buildup'\n"
            f"- Include the failure mechanism: what failed, why it failed, what evidence supports this\n\n"
            f"CONFIDENCE RULES:\n"
            f"- 0.85-0.95: Clear symptoms pointing to specific failure mode\n"
            f"- 0.70-0.84: Good detail, logical diagnosis\n"
            f"- 0.50-0.69: Vague ticket but reasonable inference possible\n"
            f"- Below 0.50: ONLY if ticket is nearly empty\n\n"
            f"Respond with ONLY the JSON object. No markdown, no backticks, no explanation."
        )

        res = await self._call_llm(prompt)

        if not res:
            return self._total_fallback(description)

        try:
            cleaned = res.strip()

            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            elif cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            cleaned = cleaned.strip()

            start = cleaned.find("{")
            end = cleaned.rfind("}") + 1
            if start == -1 or end <= start:
                print(f"!!! No JSON object found in response")
                return self._total_fallback(description)

            json_str = cleaned[start:end]
            parsed = json.loads(json_str)

            conf = float(parsed.get("confidence_score", 0.8))
            if conf > 1.0:
                conf = conf / 100.0
            parsed["confidence_score"] = max(0.1, min(1.0, conf))

            fix = str(parsed.get("fix", "")).strip()
            if not fix or len(fix) < 20:
                asset = parsed.get("asset", "equipment")
                system = parsed.get("system", "system")
                parsed["fix"] = self._make_contextual_fix(asset, system)

            parsed.setdefault("clean_description", description)
            parsed.setdefault("asset", "Unknown")
            parsed.setdefault("system", "Unknown")
            parsed.setdefault("severity", "Medium")
            parsed.setdefault("summary", "Maintenance ticket analysis.")
            parsed.setdefault("root_cause", "Requires further inspection.")
            parsed.setdefault("escalate", False)

            return parsed

        except json.JSONDecodeError as e:
            print(f"!!! JSON PARSE ERROR: {e}")
            return self._total_fallback(description)
        except Exception as e:
            print(f"!!! ANALYSIS ERROR: {e}")
            return self._total_fallback(description)

    def _total_fallback(self, description: str) -> Dict:
        return {
            "clean_description": description,
            "asset": "Unknown",
            "system": "Unknown",
            "severity": "Medium",
            "summary": "AI could not process this ticket. Manual review needed.",
            "root_cause": "Analysis failed — the AI service may be temporarily unavailable.",
            "fix": "1. Review the ticket description manually\n2. Inspect the equipment on-site\n3. Identify root cause through physical inspection\n4. Apply corrective maintenance\n5. Document findings",
            "confidence_score": 0.0,
            "escalate": True
        }

    def _make_contextual_fix(self, asset: str, system: str) -> str:
        return (
            f"1. Perform lockout/tagout on {asset} and verify zero energy state\n"
            f"2. Conduct visual and diagnostic inspection of {system} system\n"
            f"3. Identify and document all faulty {system} components\n"
            f"4. Replace or repair damaged components per OEM specifications\n"
            f"5. Test {asset} operation at reduced capacity and verify readings\n"
            f"6. Return to full operation, monitor for 24 hours, and update maintenance log"
        )


class AssistantAgent(_BaseLLMAgent):
    async def chat(self, prompt: str) -> Optional[str]:
        return await self._call_llm(prompt,
            system_prompt="You are the AlumAI Diagnostic Partner. Help engineers solve maintenance issues. Be brief (max 3 sentences). State your hypothesis and ask ONE follow-up question."
        )

    async def finalize(self, prompt: str) -> Optional[str]:
        return await self._call_llm(prompt,
            system_prompt="You are an industrial maintenance AI. Respond ONLY with valid JSON, no extra text."
        )