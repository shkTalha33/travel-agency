const successMessagesDict = {
  // Auth Success
  USER_REGISTERED: {
    es: "Cuenta creada exitosamente. Bienvenido a Viajes Dominicana.",
    en: "Account created successfully. Welcome to Viajes Dominicana.",
  },
  USER_LOGIN: {
    es: "Inicio de sesión exitoso.",
    en: "Logged in successfully.",
  },
  USER_LOGOUT: {
    es: "Sesión cerrada correctamente.",
    en: "Logged out successfully.",
  },
  REFRESHTOKEN_UPDATED: {
    es: "Token de acceso actualizado exitosamente.",
    en: "Access token refreshed successfully.",
  },
  CURRENT_USER: {
    es: "Información de usuario obtenida exitosamente.",
    en: "User profile retrieved successfully.",
  },
  PASSWORD_UPDATED: {
    es: "Contraseña actualizada exitosamente.",
    en: "Password updated successfully.",
  },
  EMAIL_UPDATED: {
    es: "Correo electrónico actualizado exitosamente.",
    en: "Email updated successfully.",
  },
  USERNAME_UPDATED: {
    es: "Nombre de usuario actualizado exitosamente.",
    en: "Username updated successfully.",
  },
  USER_DETAIL_UPDATED: {
    es: "Perfil actualizado exitosamente.",
    en: "Profile details updated successfully.",
  },
  USER_AVATAR_UPDATED: {
    es: "Foto de perfil actualizada exitosamente.",
    en: "Profile photo updated successfully.",
  },
  GET_ALL_USER: {
    es: "Usuarios obtenidos exitosamente.",
    en: "Users retrieved successfully.",
  },
  ACTIVATE_USER: {
    es: "Usuario activado exitosamente.",
    en: "User activated successfully.",
  },
  DEACTIVATE_USER: {
    es: "Cuenta desactivada exitosamente.",
    en: "Account deactivated successfully.",
  },
  DELETE_USER: {
    es: "Cuenta eliminada exitosamente.",
    en: "Account deleted successfully.",
  },
  EMAIL_VERIFIED: {
    es: "Correo electrónico verificado exitosamente.",
    en: "Email verified successfully.",
  },
  VERIFICATION_EMAIL_SENT: {
    es: "Correo de verificación enviado exitosamente.",
    en: "Verification email sent successfully.",
  },
  OTP_SENT: {
    es: "Código de verificación OTP enviado a tu correo electrónico.",
    en: "Verification OTP code sent to your email.",
  },
  FORGOT_PASSWORD_OTP_SENT: {
    es: "Código de verificación para restablecer contraseña enviado a tu correo.",
    en: "Password reset verification code sent to your email.",
  },
  OTP_VERIFIED: {
    es: "Código OTP verificado correctamente.",
    en: "OTP code verified successfully.",
  },
  FORGOT_PASSWORD_EMAIL_SENT: {
    es: "Si la cuenta existe, se ha enviado un código de recuperación.",
    en: "If the account exists, a password reset code has been sent.",
  },
  PASSWORD_RESET_SUCCESS: {
    es: "Contraseña restablecida con éxito.",
    en: "Password reset successfully.",
  },

  // Offers Success
  FETCH_ALL_OFFERS: {
    es: "Ofertas de viaje obtenidas exitosamente.",
    en: "Travel offers retrieved successfully.",
  },
  FETCH_SINGLE_OFFER: {
    es: "Oferta de viaje obtenida exitosamente.",
    en: "Travel offer retrieved successfully.",
  },
  OFFER_CREATED: {
    es: "Oferta de viaje creada exitosamente.",
    en: "Travel offer created successfully.",
  },
  OFFER_UPDATED: {
    es: "Oferta de viaje actualizada exitosamente.",
    en: "Travel offer updated successfully.",
  },
  OFFER_DELETED: {
    es: "Oferta de viaje eliminada exitosamente.",
    en: "Travel offer deleted successfully.",
  },

  // Referral Network & Points
  FETCH_NETWORK: {
    es: "Red de referidos obtenida exitosamente.",
    en: "Referral network retrieved successfully.",
  },
  FETCH_POINTS_SUMMARY: {
    es: "Resumen de puntos obtenido exitosamente.",
    en: "Points summary retrieved successfully.",
  },
  FETCH_TRANSACTIONS: {
    es: "Historial de transacciones obtenido exitosamente.",
    en: "Transaction history retrieved successfully.",
  },
  REDEMPTION_REQUESTED: {
    es: "Solicitud de redención creada exitosamente.",
    en: "Redemption request submitted successfully.",
  },
  FETCH_REDEMPTIONS: {
    es: "Solicitudes de redención obtenidas exitosamente.",
    en: "Redemption requests retrieved successfully.",
  },
  REDEMPTION_STATUS_UPDATED: {
    es: "Estado de redención actualizado exitosamente.",
    en: "Redemption status updated successfully.",
  },
  PURCHASE_POINTS_ASSIGNED: {
    es: "Puntos de compra y comisiones de referidos distribuidos con éxito.",
    en: "Purchase points and referral commissions distributed successfully.",
  },

  // Contact Success
  CONTACT_SUBMITTED: {
    es: "Mensaje enviado exitosamente. Nos pondremos en contacto pronto.",
    en: "Message sent successfully. We will get in touch shortly.",
  },
  FETCH_ALL_CONTACTS: {
    es: "Mensajes de contacto obtenidos exitosamente.",
    en: "Contact messages retrieved successfully.",
  },
  CONTACT_STATUS_UPDATED: {
    es: "Estado de mensaje actualizado.",
    en: "Message status updated successfully.",
  },

  // FAQs
  FETCH_ALL_FAQS: {
    es: "Preguntas frecuentes obtenidas exitosamente.",
    en: "Frequently asked questions retrieved successfully.",
  },
  FAQ_CREATED: {
    es: "Pregunta frecuente creada exitosamente.",
    en: "FAQ created successfully.",
  },
  FAQ_UPDATED: {
    es: "Pregunta frecuente actualizada exitosamente.",
    en: "FAQ updated successfully.",
  },
  FAQ_DELETED: {
    es: "Pregunta frecuente eliminada exitosamente.",
    en: "FAQ deleted successfully.",
  },

  // Notifications
  FETCH_NOTIFICATIONS: {
    es: "Notificaciones obtenidas exitosamente.",
    en: "Notifications retrieved successfully.",
  },
  NOTIFICATION_CREATED: {
    es: "Notificación creada exitosamente.",
    en: "Notification created successfully.",
  },
  NOTIFICATIONS_MARKED_READ: {
    es: "Notificaciones marcadas como leídas.",
    en: "Notifications marked as read.",
  },
  NOTIFICATION_DELETED: {
    es: "Notificación eliminada exitosamente.",
    en: "Notification deleted successfully.",
  },
  NOTIFICATIONS_CLEARED: {
    es: "Todas las notificaciones han sido eliminadas.",
    en: "All notifications have been cleared.",
  },
};

function translateSuccessMessage(msg, lang = 'es') {
  if (!msg || typeof msg !== 'string') return msg;
  const isEn = typeof lang === 'string' && lang.toLowerCase().startsWith('en');
  if (!isEn) return msg;

  for (const key of Object.keys(successMessagesDict)) {
    if (successMessagesDict[key].es === msg) {
      return successMessagesDict[key].en;
    }
  }

  return msg;
}

const successMessages = {};
for (const key of Object.keys(successMessagesDict)) {
  successMessages[key] = successMessagesDict[key].es;
}

successMessages.dict = successMessagesDict;
successMessages.translate = translateSuccessMessage;

module.exports = successMessages;
