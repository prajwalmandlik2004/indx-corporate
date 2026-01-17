import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any
from ..config import settings
from datetime import datetime
import ssl
import certifi

def format_analysis_for_email(analysis: Dict[str, Any]) -> str:
    """Format analysis data into readable HTML"""
    
    index_items = "".join([
        f"<li style='margin-bottom: 8px; color: #374151;'>{item}</li>"
        for item in analysis.get('index', [])
    ])
    
    analysis_paragraphs = "".join([
        f"<p style='margin-bottom: 16px; line-height: 1.6; color: #374151;'>{para.strip()}</p>"
        for para in analysis.get('analysis', '').split('\n\n')
    ])
    
    return f"""
    <div style="margin-bottom: 32px;">
        <h3 style="color: #050E3C; font-size: 18px; font-weight: 600; margin-bottom: 16px;">
            Index de lecture
        </h3>
        <ol style="padding-left: 20px; margin: 0;">
            {index_items}
        </ol>
    </div>
    
    <div style="margin-bottom: 32px;">
        <h3 style="color: #050E3C; font-size: 18px; font-weight: 600; margin-bottom: 16px;">
            Analyse synthétique continue
        </h3>
        <div>
            {analysis_paragraphs}
        </div>
    </div>
    
    <div style="margin-bottom: 14px;">
        <h3 style="color: #050E3C; font-size: 18px; font-weight: 600; margin-bottom: 16px;">
            Projection opératoire
        </h3>
        <p style="line-height: 1.6; color: #374151;">
            {analysis.get('operational_projection', '')}
        </p>
    </div>
    """

def create_result_email_html(
    user_name: str,
    test_name: str,
    test_id: int,
    score: float,
    analysis: Dict[str, Any],
    completed_at: str
) -> str:
    """Create HTML email template for test results"""
    
    formatted_analysis = format_analysis_for_email(analysis)
    date_str = datetime.fromisoformat(completed_at.replace('Z', '+00:00')).strftime("%B %d, %Y at %H:%M")
    
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #050E3C 0%, #050E3C 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700;">
                                    INDX1000
                                </h1>
                                <p style="color: #e5e7eb; margin: 8px 0 0 0; font-size: 14px;">
                                    Human-AI Cognitive Trajectory Framework
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Greeting -->
                        <tr>
                            <td style="padding: 40px 40px 20px 40px;">
                                <h2 style="color: #050E3C; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">
                                    Bonjour {user_name},
                                </h2>
                                <p style="color: #374151; margin: 0; line-height: 1.6; font-size: 16px;">
                                    Vous avez terminé le test <strong>{test_name}</strong> le {date_str}.
                                    Voici votre analyse détaillée.
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Analysis Content -->
                        <tr>
                            <td style="padding: 0 40px 40px 40px;">
                                {formatted_analysis}
                            </td>
                        </tr>

                        <!-- Score Card -->
                        <tr>
                            <td style="padding: 0 40px 40px 40px;">
                                <div>
                                    <p style="margin: 0 0 14px 0; color: #1f2937; font-size: 18px; font-weight: 700;">
                                        Index intercognitif brut
                                    </p>
                                    <p style="margin: 0; color: #050E3C; font-size: 32px; font-weight: 700; line-height: 1;">
                                        INDX<span style="font-size: 24px; vertical-align: sub;">1000</span> : {int(score)}
                                    </p>
                                </div>
                            </td>
                        </tr>
                        
                        <!-- CTA Button -->
                        <tr>
                            <td style="padding: 0 40px 40px 40px; text-align: center;">
                                <a href="{settings.FRONTEND_URL}" 
                                   style="display: inline-block; background-color: #050E3C; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                                    Accéder au site
                                </a>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f9fafb; padding: 32px 40px; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
                                <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                                    Merci d'avoir utilisé INDX1000.
                                </p>
                                <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                    © 2025 INDX1000. Tous droits réservés.
                                </p>
                            </td>
                        </tr>
                        
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

async def send_result_email(
    user_email: str,
    user_name: str,
    test_name: str,
    test_id: int,
    score: float,
    analysis: Dict[str, Any],
    completed_at: str
) -> Dict[str, Any]:
    """Send test result email to user via SMTP"""
    
    try:
        message = MIMEMultipart('alternative')
        message['Subject'] = f"Votre résultat INDX1000 - {test_name}"
        message['From'] = f"INDX1000 <{settings.ADMIN_EMAIL}>"
        message['To'] = user_email
        
        html_content = create_result_email_html(
            user_name=user_name,
            test_name=test_name,
            test_id=test_id,
            score=score,
            analysis=analysis,
            completed_at=completed_at
        )

        html_part = MIMEText(html_content, 'html', 'utf-8')
        message.attach(html_part)

        context = ssl.create_default_context(cafile=certifi.where())
        
        with smtplib.SMTP_SSL(settings.SMTP_HOST, 465, context=context) as server:
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.send_message(message)

        return {"success": True, "email_id": f"smtp_{user_email}_{test_id}"}
        
    except Exception as e:
        print(f"Email sending failed: {str(e)}")
        return {"success": False, "error": str(e)}