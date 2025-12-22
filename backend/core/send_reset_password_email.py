import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from core.config import settings

def send_reset_password_email(to_email: str, reset_url: str):
    print(f"📨 Mail gönderim işlemi başlatıldı: {to_email}")

    msg = MIMEMultipart("alternative")
    msg["From"] = f"TeamFlow Güvenlik <{settings.MAIL_FROM}>"
    msg["To"] = to_email
    msg["Subject"] = "🔐 Şifre Sıfırlama Talebi"

    # HTML Şablonu
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            .container {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f7fa;
                padding: 40px 0;
                width: 100%;
            }}
            .card {{
                max-width: 480px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            }}
            .header {{
                background-color: #4f46e5;
                padding: 30px;
                text-align: center;
            }}
            .content {{
                padding: 40px 30px;
                text-align: center;
                color: #1f2937;
            }}
            .button {{
                display: inline-block;
                padding: 14px 30px;
                background-color: #4f46e5;
                color: #ffffff !important;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
                margin-top: 25px;
            }}
            .footer {{
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #6b7280;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="card">
                <div class="header">
                    <h1 style="color: white; margin: 0; font-size: 24px;">TeamFlow</h1>
                </div>
                <div class="content">
                    <h2 style="margin-top: 0;">Şifre Sıfırlama</h2>
                    <p style="line-height: 1.6; color: #4b5563;">
                        Hesabınız için şifre sıfırlama talebinde bulundunuz. Aşağıdaki butona tıklayarak yeni şifrenizi belirleyebilirsiniz.
                    </p>
                    <a href="{reset_url}" class="button">Şifremi Sıfırla</a>
                    <p style="margin-top: 30px; font-size: 13px; color: #9ca3af;">
                        Bu bağlantı 30 dakika boyunca geçerlidir. Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.
                    </p>
                </div>
                <div class="footer">
                    &copy; 2025 TeamFlow Projesi. Tüm hakları saklıdır.
                </div>
            </div>
        </div>
    </body>
    </html>
    """

    msg.attach(MIMEText(html_body, "html", "utf-8"))

    try:
        with smtplib.SMTP_SSL(settings.MAIL_SERVER, settings.MAIL_PORT) as server:
            server.login(settings.MAIL_USERNAME, settings.MAIL_PASSWORD)
            server.sendmail(settings.MAIL_FROM, to_email, msg.as_string())
        print(f"✅ MAIL BAŞARIYLA GÖNDERİLDİ: {to_email}")
        return True
    except Exception as e:
        print(f"❌ MAIL HATASI ({to_email}): {e}")
        return False