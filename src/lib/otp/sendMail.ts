// src/lib/otp/sendMail.ts
"use server";

import nodemailer from "nodemailer";

// Configuration du transporteur SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const OTPVerificationTemplate = (email: string, otp: string) => `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visiloo - Réinitialisation de mot de passe</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f7f7f7;
            width: 100% !important;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .email-header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #eeeeee;
        }
        .email-header h1 {
            color: #2c3e50;
            margin: 0;
            font-size: 24px;
        }
        .email-body {
            padding: 20px 0;
            background: #ffffff;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .email-content {
            padding: 0 30px;
        }
        .otp-code {
            background: #f0f7ff;
            color: #2c3e50;
            font-size: 28px;
            font-weight: bold;
            text-align: center;
            padding: 15px 0;
            margin: 25px 0;
            border-radius: 4px;
            letter-spacing: 3px;
        }
        .button {
            display: block;
            width: 200px;
            margin: 25px auto;
            padding: 12px 0;
            text-align: center;
            background-color: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
        }
        .email-footer {
            text-align: center;
            padding: 20px 0;
            color: #7f8c8d;
            font-size: 12px;
            border-top: 1px solid #eeeeee;
        }
        a {
            color: #3498db;
            text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
            .email-content { padding: 0 15px; }
            .otp-code { font-size: 24px; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Réinitialisation de votre mot de passe Visiloo</h1>
        </div>
        <div class="email-body">
            <div class="email-content">
                <p>Bonjour,</p>
                <p>Vous avez demandé à réinitialiser votre mot de passe pour votre compte Visiloo. Veuillez utiliser le code de vérification suivant :</p>
                
                <div class="otp-code">${otp}</div>
                
                <p>Ce code est valable pendant <strong>10 minutes</strong>. Veuillez le saisir rapidement pour réinitialiser votre mot de passe.</p>
                
                <p>Si vous n'avez pas fait cette demande, ignorez simplement cet e-mail. Votre mot de passe restera inchangé.</p>
                
                <p>Besoin d'aide ? Contactez notre support : <a href="mailto:support@visiloo.com">support@visiloo.com</a></p>
                
                <p>Cordialement,<br />L'équipe Visiloo</p>
            </div>
        </div>
        <div class="email-footer">
            <p>&copy; ${new Date().getFullYear()} Visiloo. Tous droits réservés.</p>
            <p><a href="#">Politique de confidentialité</a> | <a href="#">Conditions d'utilisation</a></p>
        </div>
    </div>
</body>
</html>
`;

export const sendEmail = async (
  to: string,
  subject: string,
  template: "otp-verification" | "password-reset",
  data: Record<string, any>
) => {
  try {
    let html: string;

    switch (template) {
      case "otp-verification":
        html = OTPVerificationTemplate(data.email, data.otp);
        break;
      default:
        throw new Error("Template email non reconnu");
    }

    const mailOptions = {
      from: `"Localadd" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw new Error("Échec de l'envoi de l'email");
  }
};