from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.utils import simpleSplit
from io import BytesIO
from datetime import datetime

def generate_qaa_pdf(test_name: str, user_name: str, completed_at: str, questions: list, 
                     answers: list, analysis: dict, model_name: str, score: float) -> BytesIO:
    """Generate Q&A with Analysis PDF"""
    
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    
    margin = 50
    y_position = height - 60
    
    # Helper function to wrap text
    def draw_wrapped_text(text, x, y, max_width, font_name, font_size, line_height):
        c.setFont(font_name, font_size)
        lines = simpleSplit(text, font_name, font_size, max_width)
        current_y = y
        for line in lines:
            c.drawString(x, current_y, line)
            current_y -= line_height
        return current_y
    
    # Header
    c.setFont("Helvetica-Bold", 22)
    c.setFillColor(colors.HexColor('#050E3C'))
    c.drawCentredString(width / 2, y_position, f"{test_name} - {model_name}")
    y_position -= 30
    
    # User info
    c.setFont("Helvetica", 10)
    c.setFillColor(colors.grey)
    date_str = datetime.fromisoformat(completed_at.replace('Z', '+00:00')).strftime('%B %d, %Y')
    c.drawCentredString(width / 2, y_position, f"{user_name} • {date_str}")
    y_position -= 40
    
    # Divider
    c.setStrokeColor(colors.HexColor('#050E3C'))
    c.setLineWidth(1)
    c.line(margin, y_position, width - margin, y_position)
    y_position -= 40
    
    # Questions, Answers, and Individual Analysis
    question_feedback = analysis.get("question_feedback", [])
    
    for q in questions:
        answer = next((a for a in answers if a["question_id"] == q["question_id"]), None)
        feedback = next((f for f in question_feedback if f["question_number"] == q["question_id"]), None)
        
        # Check if we need a new page
        if y_position < 250:
            c.showPage()
            y_position = height - 60
        
        # Question number box
        c.setFillColor(colors.HexColor('#050E3C'))
        c.rect(margin, y_position - 20, 30, 30, fill=1)
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 14)
        c.drawCentredString(margin + 15, y_position - 12, str(q["question_id"]))
        
        # Question text
        c.setFillColor(colors.HexColor('#050E3C'))
        question_y = draw_wrapped_text(
            q["question_text"],
            margin + 45,
            y_position - 5,
            width - margin * 2 - 50,
            "Helvetica-Bold",
            11,
            16
        )
        
        y_position = question_y - 15
        
        # Check page break
        if y_position < 200:
            c.showPage()
            y_position = height - 60
        
        # Answer section
        answer_text = answer["answer_text"] if answer else "No answer provided"
        c.setFillColor(colors.HexColor('#F0F0F0'))
        answer_lines = simpleSplit(answer_text, "Helvetica", 10, width - margin * 2 - 50)
        answer_height = len(answer_lines) * 14 + 20
        
        if y_position - answer_height < 100:
            c.showPage()
            y_position = height - 60
        
        c.rect(margin, y_position - answer_height, width - margin * 2, answer_height, fill=1, stroke=0)
        c.setFillColor(colors.black)
        answer_y = draw_wrapped_text(
            answer_text,
            margin + 45,
            y_position - 20,
            width - margin * 2 - 50,
            "Helvetica",
            10,
            14
        )
        
        y_position = y_position - answer_height - 20
        
        # Analysis section
        if feedback:
            if y_position < 150:
                c.showPage()
                y_position = height - 60
            
            c.setFillColor(colors.HexColor('#E8F4F8'))
            feedback_text = f"{feedback.get('feedback', 'No feedback')}"
            feedback_lines = simpleSplit(feedback_text, "Helvetica-Oblique", 9, width - margin * 2 - 50)
            feedback_height = len(feedback_lines) * 13 + 15
            
            if y_position - feedback_height < 50:
                c.showPage()
                y_position = height - 60
            
            c.rect(margin, y_position - feedback_height, width - margin * 2, feedback_height, fill=1, stroke=0)
            c.setFillColor(colors.HexColor('#0066CC'))
            draw_wrapped_text(
                feedback_text,
                margin + 45,
                y_position - 15,
                width - margin * 2 - 50,
                "Helvetica",
                10,
                14
            )
            
            y_position = y_position - feedback_height - 30
    
    # NEW PAGE for Main Analysis
    c.showPage()
    y_position = height - 60
    
    # Main Analysis Header
    c.setFont("Helvetica-Bold", 20)
    c.setFillColor(colors.HexColor('#050E3C'))
    c.drawCentredString(width / 2, y_position, "Analyse Globale")
    y_position -= 40
    
    c.setStrokeColor(colors.HexColor('#050E3C'))
    c.setLineWidth(1)
    c.line(margin, y_position, width - margin, y_position)
    y_position -= 30
    
    # Index de lecture
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(colors.black)
    c.drawString(margin, y_position, "Index de lecture")
    y_position -= 20
    
    for idx, item in enumerate(analysis.get("index", []), 1):
        if y_position < 100:
            c.showPage()
            y_position = height - 60
        c.setFont("Helvetica", 10)
        c.drawString(margin + 20, y_position, f"{idx}. {item}")
        y_position -= 15
    
    y_position -= 15
    
    # Analyse synthétique continue
    if y_position < 200:
        c.showPage()
        y_position = height - 60
    
    c.setFont("Helvetica-Bold", 12)
    c.drawString(margin, y_position, "Analyse synthétique continue")
    y_position -= 20
    
    analysis_text = analysis.get("analysis", "")
    for paragraph in analysis_text.split('\n\n'):
        if y_position < 100:
            c.showPage()
            y_position = height - 60
        y_position = draw_wrapped_text(paragraph.strip(), margin + 20, y_position, width - margin * 2 - 20, "Helvetica", 10, 14)
        y_position -= 10
    
    # Projection opératoire
    if y_position < 150:
        c.showPage()
        y_position = height - 60
    
    c.setFont("Helvetica-Bold", 12)
    c.drawString(margin, y_position, "Projection opératoire")
    y_position -= 20
    
    projection = analysis.get("operational_projection", "")
    y_position = draw_wrapped_text(projection, margin + 20, y_position, width - margin * 2 - 20, "Helvetica", 10, 14)
    y_position -= 30
    
    # INDX Score
    if y_position < 100:
        c.showPage()
        y_position = height - 60
    
    c.setFont("Helvetica-Bold", 12)
    c.drawString(margin, y_position, "Index intercognitif brut")
    y_position -= 25
    
    # c.setFont("Helvetica-Bold", 18)
    # c.setFillColor(colors.HexColor('#050E3C'))
    # c.drawString(margin + 20, y_position, f"INDX1000 : {int(score)}")

    # Draw INDX with subscript 1000
    c.setFont("Helvetica-Bold", 18)
    c.setFillColor(colors.HexColor('#050E3C'))
    c.drawString(margin + 20, y_position, "INDX")

    # Calculate position for subscript
    indx_width = c.stringWidth("INDX", "Helvetica-Bold", 18)

    # Draw subscript 1000
    c.setFont("Helvetica-Bold", 12)
    c.drawString(margin + 20 + indx_width, y_position - 2, "1000")

    # Calculate position for score
    subscript_width = c.stringWidth("1000", "Helvetica-Bold", 12)

    # Draw the score
    c.setFont("Helvetica-Bold", 18)
    c.drawString(margin + 20 + indx_width + subscript_width + 3, y_position, f" : {int(score)}")
    
    # Footer
    # c.setFont("Helvetica-Oblique", 8)
    # c.setFillColor(colors.grey)
    # c.drawCentredString(width / 2, 30, f"INDX1000 • {test_name} • {model_name}")
    
    c.save()
    buffer.seek(0)
    return buffer