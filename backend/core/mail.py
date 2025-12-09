import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from core.config import settings

def send_invite_email(to_email, invite_url):
    msg = MIMEMultipart()
    msg["From"] = settings.MAIL_FROM
    msg["To"] = to_email
    msg["Subject"] = "Yeni Workspace Daveti"

    body = f"""
    <h2>Yeni Workspace Daveti</h2>
    <p>Sizi çalışma alanına davet ediyoruz.</p>
    <a href="{invite_url}">👉 Daveti Kabul Etmek İçin Tıklayın</a>
    """

    msg.attach(MIMEText(body, "html", "utf-8"))

    # --- 🔥 GMAIL İÇİN DOĞRU SMTP BAĞLANTISI ---
    with smtplib.SMTP_SSL(settings.MAIL_SERVER, settings.MAIL_PORT) as server:
        server.login(settings.MAIL_USERNAME, settings.MAIL_PASSWORD)
        server.sendmail(settings.MAIL_FROM, to_email, msg.as_string())
