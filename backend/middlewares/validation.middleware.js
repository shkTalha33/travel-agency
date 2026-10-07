const { check, body, param, query } = require("express-validator");

// Auth Validations
const signupValidations = [
  check("fullname")
    .notEmpty()
    .withMessage("El nombre completo es requerido")
    .isLength({ min: 3 })
    .withMessage("El nombre completo debe tener al menos 3 caracteres")
    .trim(),

  check("email")
    .notEmpty()
    .withMessage("El correo electrónico es requerido")
    .isEmail()
    .withMessage("El correo electrónico no es válido")
    .normalizeEmail(),

  check("password")
    .notEmpty()
    .withMessage("La contraseña es requerida")
    .isLength({ min: 6, max: 50 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),

  check("username")
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage("El nombre de usuario debe tener entre 3 y 30 caracteres")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("El nombre de usuario solo puede contener letras, números y guiones bajos"),

  check("phone")
    .optional({ checkFalsy: true })
    .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
    .withMessage("El número de teléfono no tiene un formato válido"),

  check("referralCode")
    .optional({ checkFalsy: true })
    .isString()
    .trim(),
];

const signinValidations = [
  check("identifier")
    .notEmpty()
    .withMessage("El correo o nombre de usuario es requerido")
    .trim(),
  check("password")
    .notEmpty()
    .withMessage("La contraseña es requerida"),
];

const refreshTokenValidations = [
  check("refreshToken")
    .notEmpty()
    .withMessage("El token de actualización (refreshToken) es requerido"),
];

const forgotPasswordValidations = [
  check("email")
    .notEmpty()
    .withMessage("El correo electrónico es requerido")
    .isEmail()
    .withMessage("El correo electrónico no es válido"),
];

const verifyRegisterOtpValidations = [
  check("email")
    .notEmpty()
    .withMessage("El correo electrónico es requerido")
    .isEmail()
    .withMessage("El correo electrónico no es válido"),
  check("otp")
    .notEmpty()
    .withMessage("El código OTP es requerido")
    .isLength({ min: 6, max: 6 })
    .withMessage("El código OTP debe tener 6 dígitos"),
];

const resendRegisterOtpValidations = [
  check("email")
    .notEmpty()
    .withMessage("El correo electrónico es requerido")
    .isEmail()
    .withMessage("El correo electrónico no es válido"),
];

const resetPasswordValidations = [
  check("email")
    .notEmpty()
    .withMessage("El correo electrónico es requerido")
    .isEmail()
    .withMessage("El correo electrónico no es válido"),
  check("otp")
    .notEmpty()
    .withMessage("El código OTP es requerido")
    .isLength({ min: 6, max: 6 })
    .withMessage("El código OTP debe tener 6 dígitos"),
  check("newPassword")
    .notEmpty()
    .withMessage("La nueva contraseña es requerida")
    .isLength({ min: 6, max: 50 })
    .withMessage("La nueva contraseña debe tener al menos 6 caracteres"),
];

const updateUserDetailsValidations = [
  check("fullname")
    .optional()
    .isLength({ min: 3 })
    .withMessage("El nombre completo debe tener al menos 3 caracteres")
    .trim(),
  check("country")
    .optional()
    .trim(),
  check("city")
    .optional()
    .trim(),
  check("bio")
    .optional()
    .trim(),
  check("address")
    .optional()
    .trim(),
  check("phone")
    .optional()
    .trim(),
];

const changePasswordValidations = [
  check("oldPassword")
    .notEmpty()
    .withMessage("La contraseña actual es requerida"),
  check("newPassword")
    .notEmpty()
    .withMessage("La nueva contraseña es requerida")
    .isLength({ min: 6, max: 50 })
    .withMessage("La nueva contraseña debe tener al menos 6 caracteres"),
];

const changeEmailValidation = [
  check("email")
    .notEmpty()
    .withMessage("El nuevo correo electrónico es requerido")
    .isEmail()
    .withMessage("El correo electrónico no es válido"),
];

const changeUsernameValidation = [
  check("username")
    .notEmpty()
    .withMessage("El nuevo nombre de usuario es requerido")
    .isLength({ min: 3, max: 30 })
    .withMessage("El nombre de usuario debe tener entre 3 y 30 caracteres")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("El nombre de usuario solo puede tener letras, números y guión bajo"),
];

// Offer Validations
const offerValidation = [
  check("title")
    .notEmpty()
    .withMessage("El título de la oferta es requerido")
    .trim(),
  check("destination")
    .notEmpty()
    .withMessage("El destino es requerido")
    .trim(),
  check("priceUSD")
    .isNumeric()
    .withMessage("El precio debe ser un número positivo"),
  check("pointsReward")
    .isNumeric()
    .withMessage("Los puntos de recompensa deben ser un número positivo"),
  check("duration")
    .notEmpty()
    .withMessage("La duración del viaje es requerida"),
  check("image")
    .notEmpty()
    .withMessage("La imagen principal es requerida"),
  check("summary")
    .notEmpty()
    .withMessage("El resumen es requerido"),
  check("description")
    .notEmpty()
    .withMessage("La descripción completa es requerida"),
];

// Redemption Validations
const redemptionValidation = [
  check("points")
    .isInt({ min: 50 })
    .withMessage("La cantidad mínima para redimir es de 50 puntos"),
  check("rewardType")
    .optional()
    .isIn(["travel_credit", "discount_voucher", "gift_card", "custom"])
    .withMessage("Tipo de recompensa no válido"),
  check("paymentDetails")
    .optional()
    .trim(),
];

// Assign Purchase Points (Admin)
const assignPointsValidation = [
  check("purchaserUserId")
    .notEmpty()
    .withMessage("El ID del usuario comprador es requerido")
    .isMongoId()
    .withMessage("El ID del comprador no es válido"),
  check("purchasePoints")
    .isInt({ min: 1 })
    .withMessage("Los puntos de compra deben ser al menos 1"),
  check("offerTitle")
    .notEmpty()
    .withMessage("La descripción o título de la oferta es requerida")
    .trim(),
];

// Contact Validations
const contactValidations = [
  check("fullname")
    .notEmpty()
    .withMessage("El nombre es requerido")
    .trim(),
  check("email")
    .notEmpty()
    .withMessage("El correo electrónico es requerido")
    .isEmail()
    .withMessage("El correo electrónico no es válido"),
  check("subject")
    .notEmpty()
    .withMessage("El asunto es requerido")
    .trim(),
  check("message")
    .notEmpty()
    .withMessage("El mensaje no puede estar vacío")
    .isLength({ min: 5 })
    .withMessage("El mensaje debe tener al menos 5 caracteres"),
];

// FAQ Validations
const faqValidation = [
  check("question")
    .notEmpty()
    .withMessage("La pregunta es requerida")
    .trim(),
  check("answer")
    .notEmpty()
    .withMessage("La respuesta es requerida")
    .trim(),
];

module.exports = {
  signupValidations,
  signinValidations,
  refreshTokenValidations,
  forgotPasswordValidations,
  resetPasswordValidations,
  verifyRegisterOtpValidations,
  resendRegisterOtpValidations,
  updateUserDetailsValidations,
  changePasswordValidations,
  changeEmailValidation,
  changeUsernameValidation,
  offerValidation,
  redemptionValidation,
  assignPointsValidation,
  contactValidations,
  faqValidation,
};
