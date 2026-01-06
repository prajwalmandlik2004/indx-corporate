import asyncio
import json
from typing import List, Dict
from openai import OpenAI
from anthropic import Anthropic
import httpx
from ..config import settings


import random
import re


# Initialize clients
openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)
anthropic_client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)
# groq_client = OpenAI(
#     api_key=settings.GROQ_API_KEY,
#     base_url="https://api.groq.com/openai/v1"
# )
groq_client = OpenAI(api_key=settings.OPENAI_API_KEY)
 

def extract_json(text: str) -> str:
    """Extract JSON from markdown code blocks"""
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:] 
    elif text.startswith("```"):
        text = text[3:] 
    if text.endswith("```"):
        text = text[:-3]  
    return text.strip()

def sanitize_mistral_json(text: str) -> str:
    """
    Fix invalid JSON produced by Mistral:
    - Escapes raw newlines inside strings
    - Removes illegal control characters
    """
    text = text.replace('\r', '')
    text = re.sub(r'(?<!\\)\n', '\\n', text)
    text = text.replace('\t', ' ')
    text = text.replace('“', '"').replace('”', '"')
    return text





async def analyze_with_openai(session_payload: Dict, role_prompt: str) -> str:
    """Analyze with GPT-4o"""
    try:
        question_feedback = []
        
        for q in session_payload["questions"]:
            answer = next((a for a in session_payload["answers"] if a["question_id"] == q["question_id"]), None)
            
            isolated_prompt = f"""{role_prompt}

Question: {q["question_text"]}
Expected Criteria: {q.get("expected_criteria", "N/A")}
User Answer: {answer["answer_text"] if answer else "No answer provided"}

Provide analysis in JSON format with ONLY these fields:
{{
  "question_number": {q["question_id"]},
  "score": <number between 0-100>,
  "feedback": "<brief feedback about THIS answer only>"
}}"""

            response = openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are an independent question evaluator. Return ONLY valid JSON, no markdown."},
                    {"role": "user", "content": isolated_prompt}
                ],
                temperature=0.3,
                max_tokens=500
            )
            
            content = extract_json(response.choices[0].message.content)
            question_feedback.append(json.loads(content))
        
        total_score = sum(item.get("score", 0) for item in question_feedback)
        overall_score = total_score / len(question_feedback) if question_feedback else 0
        
        aggregated_prompt = f"""{role_prompt}

Analyze the user's cognitive interaction with AI systems based on these scores.

Session Summary:
- Total questions: {len(session_payload["questions"])}
- Average score: {overall_score:.1f}%

Provide analysis in STRICT JSON format with EXACTLY these fields:
{{
  "overall_score": {overall_score},
  "index": ["<item1>", "<item2>", "<item3>", "<item4>", "<item5>", "<item6>", "<item7>"],
  "analysis": "<paragraph1>\\n\\n<paragraph2>\\n\\n<paragraph3>",
  "operational_projection": "<one paragraph>"
}}

CRITICAL FORMATTING RULES:
- index: Exactly 6-7 items, each 5-6 words maximum, descriptive phrases
  Example: "Rapport à l'intention initiale", "Gestion de la continuité par rupture volontaire"
- analysis: MUST be 2-3 separate paragraphs separated by \\n\\n (double newline)
  Each paragraph should be 3-5 sentences
  NO bullet points, NO sections, continuous prose only
- operational_projection: ONE paragraph, 3-4 sentences, conditional phrasing
- Do NOT use special characters, quotes, or control characters in strings
- Score is already calculated: {overall_score} - do NOT recalculate
- Write in a neutral, analytical tone similar to academic assessment"""

        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an educational assessor. Return ONLY valid JSON, no markdown."},
                {"role": "user", "content": aggregated_prompt}
            ],
            temperature=0.5,
            max_tokens=1000
        )
        
        # Clean the content to remove control characters before parsing
        content = extract_json(response.choices[0].message.content)  # or anthropic equivalent
        # Add this line to remove control characters
        content = content.replace('\r', '').replace('\t', ' ')

        aggregated_analysis = json.loads(content)

        return json.dumps({
            "overall_score": overall_score * 10,
            "index": aggregated_analysis.get("index", [])[:7],  # Limit to 7 items
            "analysis": aggregated_analysis.get("analysis", ""),
            "operational_projection": aggregated_analysis.get("operational_projection", ""),
            "question_feedback": question_feedback
        })
    except Exception as e:
        print(f"OpenAI error: {e}")
        return json.dumps({"error": str(e)})
    






# async def analyze_with_claude(session_payload: Dict, role_prompt: str) -> str:
#     """Analyze with Claude"""
#     try:
#         question_feedback = []
        
#         for q in session_payload["questions"]:
#             answer = next((a for a in session_payload["answers"] if a["question_id"] == q["question_id"]), None)
            
#             isolated_prompt = f"""{role_prompt}

# Question: {q["question_text"]}
# Expected Criteria: {q.get("expected_criteria", "N/A")}
# User Answer: {answer["answer_text"] if answer else "No answer provided"}

# Provide analysis in JSON format with ONLY these fields:
# {{
#   "question_number": {q["question_id"]},
#   "score": <number between 0-100>,
#   "feedback": "<brief feedback about THIS answer only>"
# }}"""

#             message = anthropic_client.messages.create(
#                 model="claude-sonnet-4-20250514",
#                 max_tokens=500,
#                 temperature=0.3,
#                 messages=[
#                     {"role": "user", "content": isolated_prompt}
#                 ]
#             )
            
#             content = extract_json(message.content[0].text)
#             question_feedback.append(json.loads(content))
        
#         total_score = sum(item.get("score", 0) for item in question_feedback)
#         overall_score = total_score / len(question_feedback) if question_feedback else 0
        
#         aggregated_prompt = f"""{role_prompt}

# Analyze the user's cognitive interaction with AI systems based on these scores.

# Session Summary:
# - Total questions: {len(session_payload["questions"])}
# - Average score: {overall_score:.1f}%

# Provide analysis in STRICT JSON format with EXACTLY these fields:
# {{
#   "overall_score": {overall_score},
#   "index": ["<item1>", "<item2>", "<item3>", "<item4>", "<item5>", "<item6>", "<item7>"],
#   "analysis": "<paragraph1>\\n\\n<paragraph2>\\n\\n<paragraph3>",
#   "operational_projection": "<one paragraph>"
# }}

# CRITICAL FORMATTING RULES:
# - index: Exactly 6-7 items, each 5-6 words maximum, descriptive phrases
#   Example: "Rapport à l'intention initiale", "Gestion de la continuité par rupture volontaire"
# - analysis: MUST be 2-3 separate paragraphs separated by \\n\\n (double newline)
#   Each paragraph should be 3-5 sentences
#   NO bullet points, NO sections, continuous prose only
# - operational_projection: ONE paragraph, 3-4 sentences, conditional phrasing
# - Do NOT use special characters, quotes, or control characters in strings
# - Score is already calculated: {overall_score} - do NOT recalculate
# - Write in a neutral, analytical tone similar to academic assessment"""

#         message = anthropic_client.messages.create(
#             model="claude-sonnet-4-20250514",
#             max_tokens=1000,
#             temperature=0.5,
#             messages=[
#                 {"role": "user", "content": aggregated_prompt}
#             ]
#         )
        
#         # Clean the content to remove control characters before parsing
#        # CORRECT - Use 'message' and access Anthropic's response format
#         content = extract_json(message.content[0].text)  # or anthropic equivalent
#         # Add this line to remove control characters
#         content = content.replace('\r', '').replace('\t', ' ')

#         aggregated_analysis = json.loads(content)

#         return json.dumps({
#             "overall_score": overall_score * 10,
#             "index": aggregated_analysis.get("index", [])[:7],  # Limit to 7 items
#             "analysis": aggregated_analysis.get("analysis", ""),
#             "operational_projection": aggregated_analysis.get("operational_projection", ""),
#             "question_feedback": question_feedback
#         })
#     except Exception as e:
#         print(f"Claude error: {e}")
#         return json.dumps({"error": str(e)})
    


async def analyze_with_claude(session_payload: Dict, role_prompt: str) -> str:
    """Analyze with Groq (LLaMA 3.1)"""
    try:
        question_feedback = []

        for q in session_payload["questions"]:
            answer = next(
                (a for a in session_payload["answers"] if a["question_id"] == q["question_id"]),
                None
            )

            isolated_prompt = f"""{role_prompt}

Question: {q["question_text"]}
Expected Criteria: {q.get("expected_criteria", "N/A")}
User Answer: {answer["answer_text"] if answer else "No answer provided"}

Provide analysis in JSON format with ONLY these fields:
{{
  "question_number": {q["question_id"]},
  "score": <number between 0-100>,
  "feedback": "<brief feedback>"
}}"""

            response = groq_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "Return ONLY valid JSON, no markdown."},
                    {"role": "user", "content": isolated_prompt}
                ],
                temperature=0.3,
                max_tokens=500
            )

            content = extract_json(response.choices[0].message.content)
            question_feedback.append(json.loads(content))

        total_score = sum(item.get("score", 0) for item in question_feedback)
        overall_score = total_score / len(question_feedback) if question_feedback else 0

        aggregated_prompt = f"""{role_prompt}

Analyze the user's cognitive interaction with AI systems based on these scores.

Session Summary:
- Total questions: {len(session_payload["questions"])}
- Average score: {overall_score:.1f}%

Provide analysis in STRICT JSON format with EXACTLY these fields:
{{
  "overall_score": {overall_score},
  "index": ["<item1>", "<item2>", "<item3>", "<item4>", "<item5>", "<item6>", "<item7>"],
  "analysis": "<paragraph1>\\n\\n<paragraph2>\\n\\n<paragraph3>",
  "operational_projection": "<one paragraph>"
}}

CRITICAL FORMATTING RULES:
- index: Exactly 6-7 items, each 5-6 words maximum, descriptive phrases
  Example: "Rapport à l'intention initiale", "Gestion de la continuité par rupture volontaire"
- analysis: MUST be 2-3 separate paragraphs separated by \\n\\n (double newline)
  Each paragraph should be 3-5 sentences
  NO bullet points, NO sections, continuous prose only
- operational_projection: ONE paragraph, 3-4 sentences, conditional phrasing
- Do NOT use special characters, quotes, or control characters in strings
- Score is already calculated: {overall_score} - do NOT recalculate
- Write in a neutral, analytical tone similar to academic assessment"""

        response = groq_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Return ONLY valid JSON, no markdown."},
                {"role": "user", "content": aggregated_prompt}
            ],
            temperature=0.5,
            max_tokens=1000
        )

        content = extract_json(response.choices[0].message.content)
        content = content.replace('\r', '').replace('\t', ' ')
        aggregated_analysis = json.loads(content)

        return json.dumps({
            "overall_score": overall_score * 10,
            "index": aggregated_analysis.get("index", [])[:7],  # Limit to 7 items
            "analysis": aggregated_analysis.get("analysis", ""),
            "operational_projection": aggregated_analysis.get("operational_projection", ""),
            "question_feedback": question_feedback
        })
    
    except Exception as e:
        print(f"Groq error: {e}")
        return json.dumps({"error": str(e)})







    

async def analyze_with_groq(session_payload: Dict, role_prompt: str) -> str:
    """Analyze with Groq (LLaMA 3.1)"""
    try:
        question_feedback = []

        for q in session_payload["questions"]:
            answer = next(
                (a for a in session_payload["answers"] if a["question_id"] == q["question_id"]),
                None
            )

            isolated_prompt = f"""{role_prompt}

Question: {q["question_text"]}
Expected Criteria: {q.get("expected_criteria", "N/A")}
User Answer: {answer["answer_text"] if answer else "No answer provided"}

Provide analysis in JSON format with ONLY these fields:
{{
  "question_number": {q["question_id"]},
  "score": <number between 0-100>,
  "feedback": "<brief feedback>"
}}"""

            response = groq_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "Return ONLY valid JSON, no markdown."},
                    {"role": "user", "content": isolated_prompt}
                ],
                temperature=0.3,
                max_tokens=500
            )

            content = extract_json(response.choices[0].message.content)
            question_feedback.append(json.loads(content))

        total_score = sum(item.get("score", 0) for item in question_feedback)
        overall_score = total_score / len(question_feedback) if question_feedback else 0

        aggregated_prompt = f"""{role_prompt}

Analyze the user's cognitive interaction with AI systems based on these scores.

Session Summary:
- Total questions: {len(session_payload["questions"])}
- Average score: {overall_score:.1f}%

Provide analysis in STRICT JSON format with EXACTLY these fields:
{{
  "overall_score": {overall_score},
  "index": ["<item1>", "<item2>", "<item3>", "<item4>", "<item5>", "<item6>", "<item7>"],
  "analysis": "<paragraph1>\\n\\n<paragraph2>\\n\\n<paragraph3>",
  "operational_projection": "<one paragraph>"
}}

CRITICAL FORMATTING RULES:
- index: Exactly 6-7 items, each 5-6 words maximum, descriptive phrases
  Example: "Rapport à l'intention initiale", "Gestion de la continuité par rupture volontaire"
- analysis: MUST be 2-3 separate paragraphs separated by \\n\\n (double newline)
  Each paragraph should be 3-5 sentences
  NO bullet points, NO sections, continuous prose only
- operational_projection: ONE paragraph, 3-4 sentences, conditional phrasing
- Do NOT use special characters, quotes, or control characters in strings
- Score is already calculated: {overall_score} - do NOT recalculate
- Write in a neutral, analytical tone similar to academic assessment"""

        response = groq_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Return ONLY valid JSON, no markdown."},
                {"role": "user", "content": aggregated_prompt}
            ],
            temperature=0.5,
            max_tokens=1000
        )

        content = extract_json(response.choices[0].message.content)
        content = content.replace('\r', '').replace('\t', ' ')
        aggregated_analysis = json.loads(content)

        return json.dumps({
            "overall_score": overall_score * 10,
            "index": aggregated_analysis.get("index", [])[:7],  # Limit to 7 items
            "analysis": aggregated_analysis.get("analysis", ""),
            "operational_projection": aggregated_analysis.get("operational_projection", ""),
            "question_feedback": question_feedback
        })
    
    except Exception as e:
        print(f"Groq error: {e}")
        return json.dumps({"error": str(e)})














# async def analyze_with_mistral(session_payload: Dict, role_prompt: str) -> str:
#     """Analyze with Mistral"""
#     try:
#         async with httpx.AsyncClient() as client:
#             question_feedback = []
            
#             for q in session_payload["questions"]:
#                 answer = next((a for a in session_payload["answers"] if a["question_id"] == q["question_id"]), None)
                
#                 isolated_prompt = f"""{role_prompt}

# Question: {q["question_text"]}
# Expected Criteria: {q.get("expected_criteria", "N/A")}
# User Answer: {answer["answer_text"] if answer else "No answer provided"}

# Provide analysis in JSON format with ONLY these fields:
# {{
#   "question_number": {q["question_id"]},
#   "score": <number between 0-100>,
#   "feedback": "<brief feedback>"
# }}"""

#                 response = await client.post(
#                     "https://api.mistral.ai/v1/chat/completions",
#                     headers={
#                         "Authorization": f"Bearer {settings.MISTRAL_API_KEY}",
#                         "Content-Type": "application/json"
#                     },
#                     json={
#                         "model": "mistral-large-latest",
#                         "messages": [
#                             {"role": "system", "content": "Return ONLY valid JSON, no markdown."},
#                             {"role": "user", "content": isolated_prompt}
#                         ],
#                         "temperature": 0.3,
#                         "max_tokens": 500
#                     },
#                     timeout=30.0
#                 )
                
#                 result = response.json()
#                 content = extract_json(result["choices"][0]["message"]["content"])
#                 content = sanitize_mistral_json(content) 
#                 question_feedback.append(json.loads(content))
            
#             total_score = sum(item.get("score", 0) for item in question_feedback)
#             overall_score = total_score / len(question_feedback) if question_feedback else 0
            
#             aggregated_prompt = f"""{role_prompt}

# Analyze the user's cognitive interaction with AI systems based on these scores.

# Session Summary:
# - Total questions: {len(session_payload["questions"])}
# - Average score: {overall_score:.1f}%

# Provide analysis in STRICT JSON format with EXACTLY these fields:
# {{
#   "overall_score": {overall_score},
#   "index": ["<item1>", "<item2>", "<item3>", "<item4>", "<item5>", "<item6>", "<item7>"],
#   "analysis": "<paragraph1>\\n\\n<paragraph2>\\n\\n<paragraph3>",
#   "operational_projection": "<one paragraph>"
# }}

# CRITICAL FORMATTING RULES:
# - index: Exactly 6-7 items, each 5-6 words maximum, descriptive phrases
#   Example: "Rapport à l'intention initiale", "Gestion de la continuité par rupture volontaire"
# - analysis: MUST be 2-3 separate paragraphs separated by \\n\\n (double newline)
#   Each paragraph should be 3-5 sentences
#   NO bullet points, NO sections, continuous prose only
# - operational_projection: ONE paragraph, 3-4 sentences, conditional phrasing
# - Do NOT use special characters, quotes, or control characters in strings
# - Score is already calculated: {overall_score} - do NOT recalculate
# - Write in a neutral, analytical tone similar to academic assessment"""

#             response = await client.post(
#                 "https://api.mistral.ai/v1/chat/completions",
#                 headers={
#                     "Authorization": f"Bearer {settings.MISTRAL_API_KEY}",
#                     "Content-Type": "application/json"
#                 },
#                 json={
#                     "model": "mistral-large-latest",
#                     "messages": [
#                         {"role": "user", "content": aggregated_prompt}
#                     ],
#                     "temperature": 0.5,
#                     "max_tokens": 1000
#                 },
#                 timeout=30.0
#             )
            
#             result = response.json()
#             content = extract_json(result["choices"][0]["message"]["content"])
#             content = sanitize_mistral_json(content) 
#             aggregated_analysis = json.loads(content)

#             return json.dumps({
#                 "overall_score": overall_score * 10,
#                 "index": aggregated_analysis.get("index", [])[:7],  # Limit to 7 items
#                 "analysis": aggregated_analysis.get("analysis", ""),
#                 "operational_projection": aggregated_analysis.get("operational_projection", ""),
#                 "question_feedback": question_feedback
#             })
#     except Exception as e:
#         print(f"Mistral error: {e}")
#         return json.dumps({"error": str(e)})
    
async def analyze_with_mistral(session_payload: Dict, role_prompt: str) -> str:
    """Analyze with Grok (xAI) - Production Fixed for grok-4-1"""
    try:
        # Use a longer timeout for reasoning models
        async with httpx.AsyncClient(timeout=120.0) as client:
            
            async def fetch_grok_completion(payload_data):
                headers = {
                    "Authorization": f"Bearer {settings.XAI_API_KEY}",
                    "Content-Type": "application/json"
                }
                
                # 1. Try the exact model from your screenshot
                try:
                    payload_data["model"] = "grok-4-1-fast-reasoning" 
                    response = await client.post(
                        "https://api.x.ai/v1/chat/completions", # FULL URL to prevent protocol error
                        headers=headers, 
                        json=payload_data
                    )
                    
                    if response.status_code in [404, 403, 400]:
                         print(f"Primary model failed {response.status_code}, trying alias...")
                         raise Exception("Model unavailable")
                    
                    response.raise_for_status()
                    return response
                    
                except Exception as e:
                    # 2. Fallback to the alias 'grok-beta' which is usually safest
                    print(f"Grok primary failed ({e}), switching to grok-beta...")
                    payload_data["model"] = "grok-beta"
                    return await client.post(
                        "https://api.x.ai/v1/chat/completions", # FULL URL
                        headers=headers, 
                        json=payload_data
                    )

            # --- Processing Logic ---
            async def process_single_question(q):
                answer = next((a for a in session_payload["answers"] if a["question_id"] == q["question_id"]), None)
                isolated_prompt = f"""{role_prompt}

Question: {q["question_text"]}
Expected Criteria: {q.get("expected_criteria", "N/A")}
User Answer: {answer["answer_text"] if answer else "No answer provided"}

Provide analysis in JSON format with ONLY these fields:
{{
  "question_number": {q["question_id"]},
  "score": <number between 0-100>,
  "feedback": "<brief feedback>"
}}"""
                try:
                    response = await fetch_grok_completion({
                        "messages": [
                            {"role": "system", "content": "Return ONLY valid JSON, no markdown."},
                            {"role": "user", "content": isolated_prompt}
                        ],
                        "temperature": 0.3,
                        "max_tokens": 1000 # Increased for reasoning model
                    })
                    
                    response.raise_for_status()
                    result = response.json()
                    content = extract_json(result["choices"][0]["message"]["content"])
                    return json.loads(content)
                except Exception as e:
                    print(f"Grok error for Q{q['question_id']}: {e}")
                    return {"question_number": q["question_id"], "score": 0, "feedback": "Analysis unavailable"}

            # Execute Parallel
            question_feedback = await asyncio.gather(
                *[process_single_question(q) for q in session_payload["questions"]]
            )
            
            # Aggregate
            total_score = sum(item.get("score", 0) for item in question_feedback)
            overall_score = total_score / len(question_feedback) if question_feedback else 0
            
            aggregated_prompt = f"""{role_prompt}

Analyze the user's cognitive interaction with AI systems based on these scores.

Session Summary:
- Total questions: {len(session_payload["questions"])}
- Average score: {overall_score:.1f}%

Provide analysis in STRICT JSON format with EXACTLY these fields:
{{
  "overall_score": {overall_score},
  "index": ["<item1>", "<item2>", "<item3>", "<item4>", "<item5>", "<item6>", "<item7>"],
  "analysis": "<paragraph1>\\n\\n<paragraph2>\\n\\n<paragraph3>",
  "operational_projection": "<one paragraph>"
}}

CRITICAL FORMATTING RULES:
- index: Exactly 6-7 items, each 5-6 words maximum, descriptive phrases
  Example: "Rapport à l'intention initiale", "Gestion de la continuité par rupture volontaire"
- analysis: MUST be 2-3 separate paragraphs separated by \\n\\n (double newline)
  Each paragraph should be 3-5 sentences
  NO bullet points, NO sections, continuous prose only
- operational_projection: ONE paragraph, 3-4 sentences, conditional phrasing
- Do NOT use special characters, quotes, or control characters in strings
- Score is already calculated: {overall_score} - do NOT recalculate
- Write in a neutral, analytical tone similar to academic assessment"""

            response = await fetch_grok_completion({
                "messages": [{"role": "user", "content": aggregated_prompt}],
                "temperature": 0.5,
                "max_tokens": 1000
            })
            
            response.raise_for_status()
            result = response.json()
            content = extract_json(result["choices"][0]["message"]["content"])  # ✅ Use 'result'
            content = content.replace('\r', '').replace('\t', ' ')

            aggregated_analysis = json.loads(content)

            return json.dumps({
                "overall_score": overall_score * 10,
                "index": aggregated_analysis.get("index", [])[:7],  # Limit to 7 items
                "analysis": aggregated_analysis.get("analysis", ""),
                "operational_projection": aggregated_analysis.get("operational_projection", ""),
                "question_feedback": question_feedback
            })

    except Exception as e:
        print(f"Grok critical error: {e}")
        return json.dumps({"error": f"Grok unavailable: {str(e)}"})






async def analyze_with_grok(session_payload: Dict, role_prompt: str) -> str:
    """Analyze with Grok (xAI) - Production Fixed for grok-4-1"""
    try:
        # Use a longer timeout for reasoning models
        async with httpx.AsyncClient(timeout=120.0) as client:
            
            async def fetch_grok_completion(payload_data):
                headers = {
                    "Authorization": f"Bearer {settings.XAI_API_KEY}",
                    "Content-Type": "application/json"
                }
                
                # 1. Try the exact model from your screenshot
                try:
                    payload_data["model"] = "grok-4-1-fast-reasoning" 
                    response = await client.post(
                        "https://api.x.ai/v1/chat/completions", # FULL URL to prevent protocol error
                        headers=headers, 
                        json=payload_data
                    )
                    
                    if response.status_code in [404, 403, 400]:
                         print(f"Primary model failed {response.status_code}, trying alias...")
                         raise Exception("Model unavailable")
                    
                    response.raise_for_status()
                    return response
                    
                except Exception as e:
                    # 2. Fallback to the alias 'grok-beta' which is usually safest
                    print(f"Grok primary failed ({e}), switching to grok-beta...")
                    payload_data["model"] = "grok-beta"
                    return await client.post(
                        "https://api.x.ai/v1/chat/completions", # FULL URL
                        headers=headers, 
                        json=payload_data
                    )

            # --- Processing Logic ---
            async def process_single_question(q):
                answer = next((a for a in session_payload["answers"] if a["question_id"] == q["question_id"]), None)
                isolated_prompt = f"""{role_prompt}

Question: {q["question_text"]}
Expected Criteria: {q.get("expected_criteria", "N/A")}
User Answer: {answer["answer_text"] if answer else "No answer provided"}

Provide analysis in JSON format with ONLY these fields:
{{
  "question_number": {q["question_id"]},
  "score": <number between 0-100>,
  "feedback": "<brief feedback>"
}}"""
                try:
                    response = await fetch_grok_completion({
                        "messages": [
                            {"role": "system", "content": "Return ONLY valid JSON, no markdown."},
                            {"role": "user", "content": isolated_prompt}
                        ],
                        "temperature": 0.3,
                        "max_tokens": 1000 # Increased for reasoning model
                    })
                    
                    response.raise_for_status()
                    result = response.json()
                    content = extract_json(result["choices"][0]["message"]["content"])
                    return json.loads(content)
                except Exception as e:
                    print(f"Grok error for Q{q['question_id']}: {e}")
                    return {"question_number": q["question_id"], "score": 0, "feedback": "Analysis unavailable"}

            # Execute Parallel
            question_feedback = await asyncio.gather(
                *[process_single_question(q) for q in session_payload["questions"]]
            )
            
            # Aggregate
            total_score = sum(item.get("score", 0) for item in question_feedback)
            overall_score = total_score / len(question_feedback) if question_feedback else 0
            
            aggregated_prompt = f"""{role_prompt}

Analyze the user's cognitive interaction with AI systems based on these scores.

Session Summary:
- Total questions: {len(session_payload["questions"])}
- Average score: {overall_score:.1f}%

Provide analysis in STRICT JSON format with EXACTLY these fields:
{{
  "overall_score": {overall_score},
  "index": ["<item1>", "<item2>", "<item3>", "<item4>", "<item5>", "<item6>", "<item7>"],
  "analysis": "<paragraph1>\\n\\n<paragraph2>\\n\\n<paragraph3>",
  "operational_projection": "<one paragraph>"
}}

CRITICAL FORMATTING RULES:
- index: Exactly 6-7 items, each 5-6 words maximum, descriptive phrases
  Example: "Rapport à l'intention initiale", "Gestion de la continuité par rupture volontaire"
- analysis: MUST be 2-3 separate paragraphs separated by \\n\\n (double newline)
  Each paragraph should be 3-5 sentences
  NO bullet points, NO sections, continuous prose only
- operational_projection: ONE paragraph, 3-4 sentences, conditional phrasing
- Do NOT use special characters, quotes, or control characters in strings
- Score is already calculated: {overall_score} - do NOT recalculate
- Write in a neutral, analytical tone similar to academic assessment"""

            response = await fetch_grok_completion({
                "messages": [{"role": "user", "content": aggregated_prompt}],
                "temperature": 0.5,
                "max_tokens": 1000
            })
            
            response.raise_for_status()
            result = response.json()
            content = extract_json(result["choices"][0]["message"]["content"])  # ✅ Use 'result'
            content = content.replace('\r', '').replace('\t', ' ')

            aggregated_analysis = json.loads(content)

            return json.dumps({
                "overall_score": overall_score * 10,
                "index": aggregated_analysis.get("index", [])[:7],  # Limit to 7 items
                "analysis": aggregated_analysis.get("analysis", ""),
                "operational_projection": aggregated_analysis.get("operational_projection", ""),
                "question_feedback": question_feedback
            })

    except Exception as e:
        print(f"Grok critical error: {e}")
        return json.dumps({"error": f"Grok unavailable: {str(e)}"})



async def analyze_with_gemini(session_payload: Dict, role_prompt: str) -> str:
    """Analyze with Gemini - Sequential & Robust Retry (Fixes 429 Errors)"""
    try:
        # TIMEOUT: Increased to 120s because we are waiting nicely between requests
        async with httpx.AsyncClient(timeout=120.0) as client:
            
            # SEMAPHORE 1: Strictly process ONE question at a time.
            # This ensures we don't accidentally flood the 15 RPM limit.
            sem = asyncio.Semaphore(1) 

            async def process_single_question(q):
                async with sem:
                    answer = next((a for a in session_payload["answers"] if a["question_id"] == q["question_id"]), None)
                    isolated_prompt = f"""{role_prompt}

Question: {q["question_text"]}
Expected Criteria: {q.get("expected_criteria", "N/A")}
User Answer: {answer["answer_text"] if answer else "No answer provided"}

Provide analysis in JSON format with ONLY these fields:
{{
  "question_number": {q["question_id"]},
  "score": <number between 0-100>,
  "feedback": "<brief feedback>"
}}"""
                    
                    # Robust Retry Loop (Exponential Backoff)
                    max_retries = 5
                    base_delay = 4 # Wait 4 seconds minimum between successful requests
                    
                    for attempt in range(max_retries):
                        try:
                            # 1. Enforce a rate-limit sleep BEFORE the request
                            # This ensures we naturally stay under ~15 RPM
                            await asyncio.sleep(base_delay)

                            response = await client.post(
                                f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={settings.GEMINI_API_KEY}",
                                headers={"Content-Type": "application/json"},
                                json={
                                    "contents": [{"parts": [{"text": isolated_prompt}]}],
                                    "generationConfig": {
                                        "temperature": 0.3, 
                                        "maxOutputTokens": 500,
                                        "responseMimeType": "application/json"
                                    }
                                }
                            )
                            
                            # 2. Handle Rate Limit (429) specifically
                            if response.status_code == 429:
                                wait_time = (2 ** attempt) * 5  # Exponential: 5s, 10s, 20s...
                                print(f"Gemini Q{q['question_id']} hit rate limit (429). Retrying in {wait_time}s...")
                                await asyncio.sleep(wait_time)
                                continue # Try loop again

                            response.raise_for_status()
                            result = response.json()
                            text_content = result["candidates"][0]["content"]["parts"][0]["text"]
                            content = extract_json(text_content)
                            return json.loads(content)

                        except Exception as e:
                            print(f"Attempt {attempt+1} failed for Q{q['question_id']}: {e}")
                            if attempt == max_retries - 1:
                                return {
                                    "question_number": q["question_id"],
                                    "score": 0,
                                    "feedback": "Analysis unavailable after retries"
                                }
                            await asyncio.sleep(2) # Small sleep for non-429 errors

            # Run strictly sequential but managed by asyncio
            question_feedback = await asyncio.gather(
                *[process_single_question(q) for q in session_payload["questions"]]
            )
            
            # Aggregate Results
            total_score = sum(item.get("score", 0) for item in question_feedback)
            overall_score = total_score / len(question_feedback) if question_feedback else 0
            
            aggregated_prompt = f"""{role_prompt}

Analyze the user's cognitive interaction with AI systems based on these scores.

Session Summary:
- Total questions: {len(session_payload["questions"])}
- Average score: {overall_score:.1f}%

Provide analysis in STRICT JSON format with EXACTLY these fields:
{{
  "overall_score": {overall_score},
  "index": ["<item1>", "<item2>", "<item3>", "<item4>", "<item5>", "<item6>", "<item7>"],
  "analysis": "<paragraph1>\\n\\n<paragraph2>\\n\\n<paragraph3>",
  "operational_projection": "<one paragraph>"
}}

CRITICAL FORMATTING RULES:
- index: Exactly 6-7 items, each 5-6 words maximum, descriptive phrases
  Example: "Rapport à l'intention initiale", "Gestion de la continuité par rupture volontaire"
- analysis: MUST be 2-3 separate paragraphs separated by \\n\\n (double newline)
  Each paragraph should be 3-5 sentences
  NO bullet points, NO sections, continuous prose only
- operational_projection: ONE paragraph, 3-4 sentences, conditional phrasing
- Do NOT use special characters, quotes, or control characters in strings
- Score is already calculated: {overall_score} - do NOT recalculate
- Write in a neutral, analytical tone similar to academic assessment"""
            
            # Final Aggregation Request (Retry logic included inline)
            for attempt in range(3):
                try:
                    await asyncio.sleep(2) # Brief pause before summary
                    response = await client.post(
                        f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={settings.GEMINI_API_KEY}",
                        headers={"Content-Type": "application/json"},
                        json={
                            "contents": [{"parts": [{"text": aggregated_prompt}]}],
                            "generationConfig": {
                                "temperature": 0.5, 
                                "maxOutputTokens": 1000,
                                "responseMimeType": "application/json"
                            }
                        }
                    )
                    if response.status_code == 429:
                        await asyncio.sleep(5 * (attempt + 1))
                        continue
                        
                    response.raise_for_status()
                    result = response.json()
                    text_content = result["candidates"][0]["content"]["parts"][0]["text"]
                    content = extract_json(response.choices[0].message.content)  # or anthropic equivalent
                    # Add this line to remove control characters
                    content = content.replace('\r', '').replace('\t', ' ')

                    aggregated_analysis = json.loads(content)
                    break
                except:
                    if attempt == 2: # Fallback if summary fails
                         aggregated_analysis = {}

            return json.dumps({
                "overall_score": overall_score * 10,
                "index": aggregated_analysis.get("index", [])[:7],  # Limit to 7 items
                "analysis": aggregated_analysis.get("analysis", ""),
                "operational_projection": aggregated_analysis.get("operational_projection", ""),
                "question_feedback": question_feedback
            })
            
    except Exception as e:
        print(f"Gemini critical error: {e}")
        return json.dumps({"error": f"Gemini unavailable: {str(e)}"})


async def orchestrate_analysis(questions: List[Dict], answers: List[Dict], category: str, level: str) -> Dict:
    """Orchestrate analysis across all 5 AI engines"""
    
    # Create frozen session payload
    session_payload = {
        "session_id": f"{category}_{level}",
        "questions": questions,
        "answers": answers,
        "metadata": {
            "category": category,
            "level": level
        }
    }
    
    # Define role-specific prompts
    role_prompts = {
        "gpt4o": "You are a technical evaluator analyzing cognitive framing abilities. Analyze each question independently.",
        "claude": "You are a pedagogical expert evaluating reasoning patterns. Analyze each question independently.",
        "grok": "You are a critical thinking assessor evaluating decision-making. Analyze each question independently.",
        "groq": "You are a cognitive skills evaluator analyzing analytical thinking. Analyze each question independently.",
        # "gemini": "You are a strategic analyst evaluating problem-solving approaches. Analyze each question independently.",
        "mistral": "You are an AI interaction specialist evaluating meta-cognitive awareness. Analyze each question independently."
    }
    
    # Run all analyses in parallel
    results = await asyncio.gather(
        analyze_with_openai(session_payload, role_prompts["gpt4o"]),
        analyze_with_claude(session_payload, role_prompts["claude"]),
        analyze_with_grok(session_payload, role_prompts["grok"]),
        analyze_with_groq(session_payload, role_prompts["groq"]),
        # analyze_with_gemini(session_payload, role_prompts["gemini"]),
        analyze_with_mistral(session_payload, role_prompts["mistral"]),
        return_exceptions=True
    )
    
    # Structure the output
    return {
        "session_id": session_payload["session_id"],
        "analyses": {
            "gpt4o": results[0],
            "claude": results[1],
            "grok": results[2],
            'groq': results[3],
            # "gemini": results[3],
            "mistral": results[4]
        }
    }