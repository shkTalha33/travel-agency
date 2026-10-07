const nodemailer = require("nodemailer");

const getMailUser = () => {
  const user = process.env.MAIL_USER || process.env.SMTP_USER || "";
  return user.replace(/["'\s]/g, "");
};

const getMailPass = () => {
  const pass = process.env.MAIL_PASS || process.env.SMTP_PASS || "";
  return pass.replace(/["'\s]/g, "");
};

const getMailHost = () => {
  return process.env.SMTP_HOST || "smtp.gmail.com";
};

const getMailPort = () => {
  return parseInt(process.env.SMTP_PORT || "587", 10);
};

let transporter = null;

const user = getMailUser();
const pass = getMailPass();

if (user && pass && pass !== "app_password_here") {
  transporter = nodemailer.createTransport({
    host: getMailHost(),
    port: getMailPort(),
    secure: getMailPort() === 465,
    auth: {
      user,
      pass,
    },
  });
}

const sendEmail = async ({ to, subject, html, text }) => {
  const fromAddress = process.env.EMAIL_FROM || `Viajes Dominicana <${getMailUser() || "no-reply@viajesdominicana.com"}>`;

  if (!transporter) {
    console.log(`\n--- [EMAIL SIMULATION (DEV)] ---`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${text || html}`);
    console.log(`--------------------------------\n`);
    return { messageId: "simulated-email-id-" + Date.now() };
  }

  try {
    return await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text,
      html,
    });
  } catch (err) {
    console.error("SMTP Delivery Error:", err.message);
    // Return simulated success so registration flow continues gracefully if SMTP is unreachable
    return { messageId: "fallback-" + Date.now(), error: err.message };
  }
};

/**
 * Send 6-digit OTP email for registration verification
 */
const sendRegisterOtpEmail = async (email, otp, fullname = "Viajero VIP", lang = "es") => {
  const isEn = typeof lang === "string" && lang.toLowerCase().startsWith("en");

  const subject = isEn
    ? `Your verification code: ${otp} - Viajes Dominicana`
    : `Tu código de verificación: ${otp} - Viajes Dominicana`;

  const title = isEn ? "Verify your email address" : "Verifica tu correo electrónico";
  const greeting = isEn ? `Hello <strong>${fullname}</strong>,` : `Hola <strong>${fullname}</strong>,`;
  const bodyText = isEn
    ? "Thank you for joining Viajes Dominicana! Use the following 6-digit verification code to complete your registration and activate your VIP travel rewards account:"
    : "¡Gracias por unirte a Viajes Dominicana! Usa el siguiente código de verificación de 6 dígitos para completar tu registro y activar tu cuenta de beneficios de viaje:";
  const expiryNotice = isEn
    ? "This verification code will expire in <strong>15 minutes</strong>. If you did not request this code, you can safely ignore this email."
    : "Este código expirará en <strong>15 minutos</strong>. Si no solicitaste este registro, puedes ignorar este correo de forma segura.";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
          .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(10,25,47,0.05); }
          .header { background: linear-gradient(135deg, #0c2340 0%, #0369a1 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
          .content { padding: 32px 28px; }
          .greeting { font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 12px; }
          .body-text { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
          .otp-box { background: #f0f9ff; border: 2px dashed #0284c7; border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0; }
          .otp-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #0369a1; margin-bottom: 8px; }
          .otp-code { font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #0c2340; font-family: 'Courier New', monospace; }
          .footer { background: #f8fafc; padding: 20px 28px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌴 Viajes Dominicana</h1>
          </div>
          <div class="content">
            <div class="greeting">${greeting}</div>
            <p class="body-text">${bodyText}</p>
            <div class="otp-box">
              <div class="otp-label">${isEn ? "Verification Code" : "Código de Verificación"}</div>
              <div class="otp-code">${otp}</div>
            </div>
            <p class="body-text" style="font-size: 13px; color: #64748b;">${expiryNotice}</p>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} Viajes Dominicana. ${isEn ? "All rights reserved." : "Todos los derechos reservados."}
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject,
    text: `${isEn ? "Your verification code is" : "Tu código de verificación es"}: ${otp}`,
    html,
  });
};

/**
 * Send 6-digit OTP email for password reset
 */
const sendPasswordResetOtpEmail = async (email, otp, fullname = "Estimado miembro", lang = "es") => {
  const isEn = typeof lang === "string" && lang.toLowerCase().startsWith("en");

  const subject = isEn
    ? `Your password reset code: ${otp} - Viajes Dominicana`
    : `Tu código para restablecer contraseña: ${otp} - Viajes Dominicana`;

  const title = isEn ? "Password Reset Request" : "Recuperación de Contraseña";
  const greeting = isEn ? `Hello <strong>${fullname}</strong>,` : `Hola <strong>${fullname}</strong>,`;
  const bodyText = isEn
    ? "We received a request to reset the password for your Viajes Dominicana account. Use the following 6-digit verification code to set your new password:"
    : "Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Viajes Dominicana. Usa el siguiente código de verificación de 6 dígitos para crear tu nueva contraseña:";
  const expiryNotice = isEn
    ? "This code will expire in <strong>15 minutes</strong>. If you did not request this password reset, your account is secure and you can disregard this email."
    : "Este código expirará en <strong>15 minutos</strong>. Si no solicitaste este cambio, tu cuenta está segura y puedes ignorar este correo.";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
          .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(10,25,47,0.05); }
          .header { background: linear-gradient(135deg, #0c2340 0%, #c59b27 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
          .content { padding: 32px 28px; }
          .greeting { font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 12px; }
          .body-text { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
          .otp-box { background: #fffbeb; border: 2px dashed #d97706; border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0; }
          .otp-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #b45309; margin-bottom: 8px; }
          .otp-code { font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #0c2340; font-family: 'Courier New', monospace; }
          .footer { background: #f8fafc; padding: 20px 28px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Viajes Dominicana</h1>
          </div>
          <div class="content">
            <div class="greeting">${greeting}</div>
            <p class="body-text">${bodyText}</p>
            <div class="otp-box">
              <div class="otp-label">${isEn ? "Reset Code" : "Código de Restablecimiento"}</div>
              <div class="otp-code">${otp}</div>
            </div>
            <p class="body-text" style="font-size: 13px; color: #64748b;">${expiryNotice}</p>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} Viajes Dominicana. ${isEn ? "All rights reserved." : "Todos los derechos reservados."}
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject,
    text: `${isEn ? "Your password reset code is" : "Tu código de restablecimiento es"}: ${otp}`,
    html,
  });
};

module.exports = {
  sendEmail,
  sendRegisterOtpEmail,
  sendPasswordResetOtpEmail,
};
