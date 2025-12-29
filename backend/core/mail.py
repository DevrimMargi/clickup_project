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

    try:
        print("📡 SMTP SSL bağlantısı kuruluyor...")
        print("➡️ SERVER:", settings.MAIL_SERVER)
        print("➡️ PORT:", settings.MAIL_PORT)
        print("➡️ USER:", settings.MAIL_USERNAME)
        print("➡️ TO:", to_email)

        with smtplib.SMTP_SSL(
            settings.MAIL_SERVER,
            settings.MAIL_PORT,
            timeout=10
        ) as server:

            server.login(
                settings.MAIL_USERNAME,
                settings.MAIL_PASSWORD
            )

            server.sendmail(
                settings.MAIL_FROM,
                to_email,
                msg.as_string()
            )

        print("✅ SMTP: Mail GERÇEKTEN gönderildi")

    except Exception as e:
        print("❌ SMTP HATASI YAKALANDI")
        print("HATA:", e)
        raise
