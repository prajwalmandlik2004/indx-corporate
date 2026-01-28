from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.utils import simpleSplit
from io import BytesIO
from datetime import datetime

def generate_qa_pdf(test_name: str, user_name: str, completed_at: str, questions: list, answers: list) -> BytesIO:
    """Generate a Q&A PDF with questions and user answers"""
    
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    
    margin = 50
    y_position = height - 60
    
    # Header
    c.setFont("Helvetica-Bold", 22)
    c.setFillColor(colors.HexColor('#050E3C'))
    c.drawCentredString(width / 2, y_position, test_name)
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
    
    # Helper function to wrap text
    def draw_wrapped_text(text, x, y, max_width, font_name, font_size, line_height):
        c.setFont(font_name, font_size)
        lines = simpleSplit(text, font_name, font_size, max_width)
        current_y = y
        for line in lines:
            c.drawString(x, current_y, line)
            current_y -= line_height
        return current_y
    
    # Questions and Answers
    for q in questions:
        answer = next((a for a in answers if a["question_id"] == q["question_id"]), None)
        
        # Check if we need a new page (reserve space for question + answer)
        if y_position < 200:
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
        
        # Check if we need a new page for answer
        if y_position < 150:
            c.showPage()
            y_position = height - 60
        
        # Answer background box
        answer_text = answer["answer_text"] if answer else "No answer provided"
        c.setFillColor(colors.HexColor('#F5F5F5'))
        
        # Calculate answer height
        c.setFont("Helvetica", 10)
        answer_lines = simpleSplit(answer_text, "Helvetica", 10, width - margin * 2 - 30)
        answer_height = len(answer_lines) * 14 + 20
        
        # Check if answer box fits on page
        if y_position - answer_height < 50:
            c.showPage()
            y_position = height - 60
        
        # Draw answer box
        c.rect(margin, y_position - answer_height, width - margin * 2, answer_height, fill=1, stroke=0)
        
        # Answer text
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
        
        y_position = y_position - answer_height - 30
    
    # Footer on last page
    c.setFont("Helvetica-Oblique", 8)
    c.setFillColor(colors.grey)
    c.drawCentredString(width / 2, 30, f"INDX1000 • {test_name}")
    
    c.save()
    buffer.seek(0)
    return buffer