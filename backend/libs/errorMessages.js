const errorMessagesDict = {
  // Auth Errors
  EMAIL_ALREADY_EXIST: {
    es: "El correo electrónico ya está registrado. Intente con otro.",
    en: "Email address is already registered. Please try another.",
  },
  USERNAME_ALREADY_EXIST: {
    es: "El nombre de usuario ya está en uso. Intente con otro.",
    en: "Username is already in use. Please try another.",
  },
  PHONE_NUMBER_ALREADY_EXIST: {
    es: "El número de teléfono ya está registrado.",
    en: "Phone number is already registered.",
  },
  PASSWORD_NOT_CORRECT: {
    es: "La contraseña es incorrecta.",
    en: "Incorrect password.",
  },
  AN_UNKNOWN_ERROR_OCCURS: {
    es: "Ha ocurrido un error inesperado.",
    en: "An unexpected error occurred.",
  },
  DO_NOT_FOUND_ANY_ROUTE: {
    es: "No se encontró la ruta solicitada.",
    en: "Requested route was not found.",
  },
  EMAIL_NOT_FOUND: {
    es: "No se proporcionó ningún correo electrónico.",
    en: "No email provided.",
  },
  USER_AVATAR_MISSING: {
    es: "El avatar es requerido.",
    en: "Avatar is required.",
  },
  USER_NOT_FOUND: {
    es: "Usuario no encontrado.",
    en: "User not found.",
  },
  USERNAME_NOT_FOUND: {
    es: "No se proporcionó el nombre de usuario.",
    en: "Username was not provided.",
  },
  EMAIL_OR_USERNAME_NOT_FOUND: {
    es: "Correo electrónico o contraseña incorrectos.",
    en: "Invalid email/username or password.",
  },
  UNAUTHORIZED_ACCESS: {
    es: "Acceso no autorizado. Inicie sesión nuevamente.",
    en: "Unauthorized access. Please log in again.",
  },
  FORBIDDEN_ACCESS: {
    es: "No tiene permisos para realizar esta acción.",
    en: "You do not have permission to perform this action.",
  },
  INVALID_ACCESS_TOKEN: {
    es: "Token de acceso inválido o expirado.",
    en: "Invalid or expired access token.",
  },
  INVALID_REFRESH_TOKEN: {
    es: "Token de actualización inválido.",
    en: "Invalid refresh token.",
  },
  REFRESH_TOKEN_EXPIRED: {
    es: "La sesión ha expirado. Por favor inicie sesión nuevamente.",
    en: "Session expired. Please log in again.",
  },
  UNSUPPORTED_FILE_TYPE: {
    es: "Tipo de archivo no soportado.",
    en: "Unsupported file type.",
  },
  DO_NOT_FOUND_USER: {
    es: "No se encontró ningún usuario.",
    en: "No user found.",
  },
  INTERNAL_SERVER_ERROR: {
    es: "Error interno del servidor.",
    en: "Internal server error.",
  },
  FILE_MISSING: {
    es: "El archivo es requerido.",
    en: "File is required.",
  },
  SOMETHING_WENT_WRONG_FILE_UPLOADING_PROCESS: {
    es: "Error al subir el archivo.",
    en: "Error uploading file.",
  },
  SOMETHING_WENT_WRONG_USER_CREATED_PROCESS: {
    es: "Error al registrar la cuenta.",
    en: "Error creating user account.",
  },
  SOMETHING_WENT_WRONG_USER_UPDATED_PROCESS: {
    es: "Error al actualizar la información del usuario.",
    en: "Error updating user information.",
  },
  SOMETHING_WENT_WRONG_USER_LOG_IN: {
    es: "Error al iniciar sesión.",
    en: "Error logging in.",
  },
  EMAIL_ALREADY_VERIFIED: {
    es: "El correo electrónico ya ha sido verificado.",
    en: "Email is already verified.",
  },
  INVALID_OR_EXPIRED_VERIFICATION_TOKEN: {
    es: "El código de verificación es inválido o ha expirado.",
    en: "Verification token is invalid or has expired.",
  },
  INVALID_OR_EXPIRED_RESET_TOKEN: {
    es: "El enlace de recuperación es inválido o ha expirado.",
    en: "Password reset link is invalid or has expired.",
  },
  INVALID_OR_EXPIRED_OTP: {
    es: "El código OTP de verificación es inválido o ha expirado.",
    en: "The OTP verification code is invalid or has expired.",
  },
  OTP_CODE_REQUIRED: {
    es: "El código OTP de 6 dígitos es requerido.",
    en: "The 6-digit OTP code is required.",
  },
  PENDING_REGISTRATION_NOT_FOUND: {
    es: "No se encontró un registro pendiente para este correo. Por favor complete el formulario de registro nuevamente.",
    en: "No pending registration found for this email. Please complete the registration form again.",
  },
  NO_ACCOUNT_WITH_EMAIL: {
    es: "No existe una cuenta registrada con este correo electrónico.",
    en: "No registered account found with this email address.",
  },
  REFERRAL_CODE_INVALID: {
    es: "El código de referido ingresado no es válido.",
    en: "The referral code entered is invalid.",
  },
  CANNOT_REFER_YOURSELF: {
    es: "No puedes utilizar tu propio código de referido.",
    en: "You cannot use your own referral code.",
  },

  // Contact Errors
  SOMETHING_WENT_WRONG_CONTACT_PROCESS: {
    es: "Error al enviar el mensaje de contacto.",
    en: "Error submitting contact message.",
  },
  SOMETHING_WENT_WRONG_GET_ALL_CONTACTS: {
    es: "Error al obtener la lista de contactos.",
    en: "Error retrieving contact list.",
  },
  INVALID_STATUS: {
    es: "Estado inválido.",
    en: "Invalid status.",
  },
  CONTACT_NOT_FOUND: {
    es: "Mensaje de contacto no encontrado.",
    en: "Contact message not found.",
  },

  // Offers Errors
  OFFER_TITLE_ALREADY_EXIST: {
    es: "Ya existe una oferta con este título.",
    en: "An offer with this title already exists.",
  },
  OFFER_NOT_FOUND: {
    es: "Oferta de viaje no encontrada.",
    en: "Travel offer not found.",
  },
  SOMETHING_WENT_WRONG_OFFER_PROCESS: {
    es: "Error al procesar la oferta de viaje.",
    en: "Error processing travel offer.",
  },

  // Points & Redemptions
  INSUFFICIENT_POINTS: {
    es: "No tienes suficientes puntos disponibles para esta redención.",
    en: "You do not have enough available points for this redemption.",
  },
  MINIMUM_REDEMPTION_POINTS: {
    es: "El monto mínimo de redención es de 50 puntos.",
    en: "Minimum redemption amount is 50 points.",
  },
  REDEMPTION_NOT_FOUND: {
    es: "Solicitud de redención no encontrada.",
    en: "Redemption request not found.",
  },
  INVALID_MEMBERSHIP_LEVEL: {
    es: "Nivel de membresía no válido.",
    en: "Invalid membership level.",
  },
  POINTS_MUST_BE_POSITIVE: {
    es: "La cantidad de puntos debe ser mayor a cero.",
    en: "Points amount must be greater than zero.",
  },
  PURCHASER_NOT_FOUND: {
    es: "El comprador especificado no existe.",
    en: "Purchaser does not exist.",
  },
  PURCHASER_CANNOT_EARN_OWN_REFERRAL: {
    es: "El comprador no genera comisiones de referido para sí mismo.",
    en: "Buyer cannot earn referral commission on their own purchase.",
  },
};

// Express-validator message translations
const validationTranslations = {
  "El nombre completo es requerido": "Full name is required",
  "El nombre completo debe tener al menos 3 caracteres": "Full name must be at least 3 characters",
  "El correo electrónico es requerido": "Email address is required",
  "El correo electrónico no es válido": "Invalid email address format",
  "La contraseña es requerida": "Password is required",
  "La contraseña debe tener al menos 6 caracteres": "Password must be at least 6 characters",
  "El nombre de usuario debe tener entre 3 y 30 caracteres": "Username must be between 3 and 30 characters",
  "El nombre de usuario solo puede contener letras, números y guiones bajos": "Username can only contain letters, numbers, and underscores",
  "El número de teléfono no tiene un formato válido": "Invalid phone number format",
  "El correo o nombre de usuario es requerido": "Email or username is required",
  "El token de actualización (refreshToken) es requerido": "Refresh token is required",
  "El token de restablecimiento es requerido": "Password reset token is required",
  "La nueva contraseña es requerida": "New password is required",
  "La nueva contraseña debe tener al menos 6 caracteres": "New password must be at least 6 characters",
  "El asunto es requerido": "Subject is required",
  "El mensaje es requerido": "Message is required",
  "El título de la oferta es requerido": "Offer title is required",
  "El destino es requerido": "Destination is required",
  "El país es requerido": "Country is required",
  "El precio es requerido y debe ser un número positivo": "Price is required and must be a positive number",
  "Los puntos de recompensa deben ser un entero positivo": "Points reward must be a positive integer",
  "La duración es requerida": "Duration is required",
  "La categoría del hotel es requerida": "Hotel category is required",
  "La URL de imagen principal es requerida": "Main image URL is required",
  "El resumen es requerido": "Summary is required",
  "La descripción es requerida": "Description is required",
  "Los puntos a redimir deben ser al menos 50": "Points to redeem must be at least 50",
  "El ID de comprador (purchaserId) es requerido": "Purchaser ID is required",
  "El monto de compra (purchaseAmountUSD) debe ser positivo": "Purchase amount (USD) must be positive",
  "El código OTP es requerido": "OTP code is required",
  "El código OTP debe tener 6 dígitos": "OTP code must be 6 digits",
  "El código de verificación es requerido": "Verification code is required",
  "El slug o nombre de la oferta es requerido": "Offer slug or title is required",
};

/**
 * Localizes any error message according to requested language code ('en' or 'es')
 */
function translateErrorMessage(msg, lang = 'es') {
  if (!msg || typeof msg !== 'string') return msg;
  const isEn = typeof lang === 'string' && lang.toLowerCase().startsWith('en');
  if (!isEn) return msg;

  // 1. Check exact Spanish match in dictionary
  for (const key of Object.keys(errorMessagesDict)) {
    if (errorMessagesDict[key].es === msg) {
      return errorMessagesDict[key].en;
    }
  }

  // 2. Check validation translations
  if (validationTranslations[msg]) {
    return validationTranslations[msg];
  }

  return msg;
}

// Flat export for existing controller calls errorMessages.KEY
const errorMessages = {};
for (const key of Object.keys(errorMessagesDict)) {
  errorMessages[key] = errorMessagesDict[key].es;
}

errorMessages.dict = errorMessagesDict;
errorMessages.translate = translateErrorMessage;

module.exports = errorMessages;
