import openai
from typing import List, Dict
import json
from ..config import settings
from openai import OpenAI
client = OpenAI(api_key=settings.OPENAI_API_KEY)

openai.api_key = settings.OPENAI_API_KEY

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
    
    aggregated_prompt = f"""Based on these aggregated scores for a {category} test at {level}, provide overall analysis.

Session Summary:
- Total questions: {len(questions)}
- Average score: {overall_score:.1f}%
- Scores distribution: {[item.get("score", 0) for item in question_feedback]}

Provide analysis in JSON format:
{{
  "overall_score": {overall_score},
  "detailed_analysis": "<2-3 sentences about overall performance>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<area 1>", "<area 2>", "<area 3>"],
  "recommendations": "<personalized learning recommendation>"
}}

CRITICAL RULES:
- Do not infer or recall specific question content
- Do not assume continuity with previous sessions
- Base analysis ONLY on the provided aggregated scores
- Keep analysis general and constructive"""

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
        
        content = response.choices[0].message.content
        content = extract_json(content)
        aggregated_analysis = json.loads(content)
        
        return {
            "overall_score": overall_score,
            "detailed_analysis": aggregated_analysis.get("detailed_analysis", "Analysis completed."),
            "question_feedback": question_feedback,
            "strengths": aggregated_analysis.get("strengths", ["Completed the test"]),
            "improvements": aggregated_analysis.get("improvements", ["Review the material"]),
            "recommendations": [aggregated_analysis.get("recommendations", "Continue practicing")]
        }
    except Exception as e:
        print(f"Error creating aggregated analysis: {e}")
        return {
            "overall_score": overall_score,
            "detailed_analysis": "Analysis in progress. Please try again later.",
            "question_feedback": question_feedback,
            "strengths": ["Completion of test"],
            "improvements": ["Review concepts"],
            "recommendations": ["Continue practicing"]
        }