import openai
from typing import List, Dict
import json
import re
from ..config import settings
from openai import OpenAI
client = OpenAI(api_key=settings.OPENAI_API_KEY)

openai.api_key = settings.OPENAI_API_KEY

# def extract_json(text: str) -> str:
#     """Extract JSON from markdown code blocks"""
#     text = text.strip()
#     if text.startswith("```json"):
#         text = text[7:] 
#     elif text.startswith("```"):
#         text = text[3:] 
#     if text.endswith("```"):
#         text = text[:-3]  
#     return text.strip()

def extract_json(text: str) -> str:
    """Extract JSON from markdown and fix common format errors"""
    text = text.strip()

    if text.startswith("```json"):
        text = text[7:] 
    elif text.startswith("```"):
        text = text[3:] 
    if text.endswith("```"):
        text = text[:-3]
    
    text = text.strip()

    # text = re.sub(r'\\(?![/u"bfnrt\\])', r'\\\\', text)
    text = re.sub(r'\\(?!(?:["\\/bfnrt]|u[0-9a-fA-F]{4}))', r'\\\\', text)
    
    return text

async def generate_test_questions(category: str, level: str, num_questions: int = 5) -> List[Dict]:
    """Generate test questions using GPT-4"""
    
    prompt = f"""Generate {num_questions} test questions for a {category} test at {level}.
    
    For each question, provide:
    1. A clear, concise question
    2. Expected answer criteria
    
    Format the response as a JSON array with objects containing 'question' and 'expected_answer_criteria'.
    Make questions progressively challenging based on the level.
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an expert test creator. Return ONLY valid JSON, no markdown formatting."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2000
        )

        content = response.choices[0].message.content
        content = extract_json(content)  # Add this line
        questions_data = json.loads(content)
        
        
        questions_data = json.loads(response.choices[0].message.content)
        
        # Format questions with IDs
        questions = []
        for idx, q in enumerate(questions_data, 1):
            questions.append({
                "question_id": idx,
                "question_text": q.get("question", ""),
                "expected_criteria": q.get("expected_answer_criteria", "")
            })
        
        return questions
    except Exception as e:
        print(f"Error generating questions: {e}")
        # Return default questions if API fails
        return [
            {
                "question_id": i,
                "question_text": f"Question {i} for {category} - {level}",
                "expected_criteria": "Provide a detailed answer"
            }
            for i in range(1, num_questions + 1)
        ]

async def analyze_test_results(questions: List[Dict], answers: List[Dict], category: str, level: str) -> Dict:
    """Analyze test answers using GPT-4 with strict context isolation"""
    
    question_feedback = []
    
    for q in questions:
        answer = next((a for a in answers if a["question_id"] == q["question_id"]), None)
        
        isolated_prompt = f"""Analyze this SINGLE question and answer independently. Do not reference any other questions or answers.

Question: {q["question_text"]}
Expected Criteria: {q.get("expected_criteria", "N/A")}
User Answer: {answer["answer_text"] if answer else "No answer provided"}

Provide analysis in JSON format with ONLY these fields:
{{
  "question_number": {q["question_id"]},
  "score": <number between 0-100>,
  "feedback": "<brief feedback about THIS answer only>"
}}

CRITICAL RULES:
- Do not infer or recall information beyond this single question
- Do not assume continuity with other questions
- Analyze ONLY the provided answer against the provided question
- Keep feedback focused solely on this question-answer pair"""

        try:
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are an independent question evaluator. Analyze each question in complete isolation. Return ONLY valid JSON, no markdown."},
                    {"role": "user", "content": isolated_prompt}
                ],
                temperature=0.3,  
                max_tokens=500
            )
            
            content = response.choices[0].message.content
            content = extract_json(content)
            feedback_item = json.loads(content)
            question_feedback.append(feedback_item)
        except Exception as e:
            print(f"Error analyzing question {q['question_id']}: {e}")
            question_feedback.append({
                "question_number": q["question_id"],
                "score": 0,
                "feedback": "Unable to analyze this answer"
            })
    
    total_score = sum(item.get("score", 0) for item in question_feedback)
    overall_score = total_score / len(question_feedback) if question_feedback else 0
    
    aggregated_prompt = f"""{isolated_prompt}

Analyze the user's cognitive interaction with AI systems based on these scores.

Session Summary:
- Total questions: {len(questions["questions"])}
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

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an educational assessor providing high-level analysis based on aggregated scores only. Return ONLY valid JSON, no markdown."},
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
        print(f"Error creating aggregated analysis: {e}")
        return {
            "overall_score": overall_score * 10,
            "detailed_analysis": "Analysis in progress. Please try again later.",
            "question_feedback": question_feedback,
            "strengths": ["Completion of test"],
            "improvements": ["Review concepts"],
            "recommendations": ["Continue practicing"]
        }