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
    """Analyze test answers using GPT-4"""
    
    qa_pairs = []
    for q in questions:
        answer = next((a for a in answers if a["question_id"] == q["question_id"]), None)
        qa_pairs.append({
            "question": q["question_text"],
            "expected_criteria": q.get("expected_criteria", ""),
            "user_answer": answer["answer_text"] if answer else "No answer provided"
        })
    
    prompt = f"""Analyze these test answers for a {category} test at {level}.

Questions and Answers:
{json.dumps(qa_pairs, indent=2)}

Provide a comprehensive analysis in JSON format with:
1. overall_score (0-100)
2. detailed_analysis (overall performance summary)
3. question_feedback (array of objects with question_number, score, and feedback for each question)
4. strengths (array of strength areas)
5. improvements (array of areas needing improvement)
6. recommendations (personalized learning recommendations)

Be constructive, specific, and encouraging in your feedback.
"""
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an expert educational assessor. Return ONLY valid JSON, no markdown formatting."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2500
        )

        content = response.choices[0].message.content
        content = extract_json(content)  # Add this line
        analysis = json.loads(content)
        
        analysis = json.loads(response.choices[0].message.content)
        return analysis
    except Exception as e:
        print(f"Error analyzing results: {e}")
        # Return default analysis if API fails
        return {
            "overall_score": 70.0,
            "detailed_analysis": "Analysis in progress. Please try again later.",
            "question_feedback": [
                {"question_number": i, "score": 70, "feedback": "Good effort"}
                for i in range(1, len(questions) + 1)
            ],
            "strengths": ["Completion of test"],
            "improvements": ["Review concepts"],
            "recommendations": "Continue practicing"
        }