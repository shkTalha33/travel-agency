# Backend — Plataforma de Viajes y Recompensas (Dominican Republic Travel Platform)

Backend de producción para la agencia de viajes y plataforma de referidos multinivel, construido sobre **Node.js, Express, MongoDB (Mongoose), JWT, OpenAPI 3.0 (Swagger)** con la misma arquitectura, manejo de errores y controladores de **`Esate-Loop`**, optimizado para alto rendimiento y máxima seguridad.

---

## 🏛️ Arquitectura del Backend

La estructura del proyecto replica y expande las convenciones establecidas en `Esate-Loop`:

```text
backend/
├── app.js                          # Configuración de Express, middlewares globales, Swagger UI y router
├── server.js                       # Punto de entrada HTTP y conexión a base de datos
├── db.js                           # Conexión optimizada a MongoDB con connection pooling
├── constants.js                    # Constantes de negocio (Membresías, Estados, Tasas de Comisión, Roles)
├── .env / sample.env               # Variables de entorno
├── package.json                    # Dependencias y scripts
├── config/
│   └── swagger.js                  # Especificación completa OpenAPI 3.0 / Swagger
├── libs/
│   ├── errorExceptionSchema.js     # Clases de error HTTP personalizadas (BadRequest, Unauthorized, etc.)
│   ├── errorMessages.js            # Mensajes de error centralizados
│   ├── successMessages.js          # Mensajes de éxito centralizados
│   └── responseWrapper.js          # Formateadores uniformes onSuccess() y onError()
├── middlewares/
│   ├── verifyJwt.js                # Verificación de Bearer Token JWT (Access Token)
│   ├── auth.middleware.js          # Validaciones de unicidad (email, username, teléfono) y roles
│   ├── validation.middleware.js    # Reglas de validación declarativas con express-validator
│   └── rateLimiter.js              # Limitadores de peticiones por IP (Estricto para Auth)
├── models/
│   ├── user.model.js               # Esquema de usuario, red de referidos (upline/downline), tokens y balance
│   ├── offer.model.js              # Catálogo de viajes, itinerarios, galerías y puntos de recompensa
│   ├── pointTransaction.model.js   # Libro mayor de transacciones (L1, L2, compras offline, canjes)
│   ├── redemption.model.js         # Solicitudes de canje de puntos
│   ├── faq.model.js                # Preguntas frecuentes dinámicas
│   └── contact.model.js            # Formulario de consultas y contacto
├── controllers/
│   ├── auth.controller.js          # Registro, Login, Refresh Token, Recuperación de contraseña, Verificación
│   ├── user.controller.js          # Perfil, Actualizaciones, Red de referidos con niveles por membresía
│   ├── offer.controller.js         # Catálogo de ofertas, búsqueda, filtrado y detalle
│   ├── points.controller.js        # Resumen de puntos, historial y asignación administrativa de compras
│   ├── redemption.controller.js    # Creación y procesamiento de redenciones
│   ├── faq.controller.js           # CRUD de preguntas frecuentes
│   └── contact.controller.js       # Recepción y gestión de mensajes
├── routes/
│   ├── auth.route.js
│   ├── user.route.js
│   ├── offer.route.js
│   ├── points.route.js
│   ├── redemption.route.js
│   ├── faq.route.js
│   ├── contact.route.js
│   └── index.js                    # Enrutador maestro montado en /api/v1
└── utils/
    ├── aysncHandler.js             # Envoltura de promesas asíncronas para controladores
    ├── emailService.js             # Envío de correos de verificación y restablecimiento de contraseña
    └── seedData.js                 # Script para sembrar ofertas y usuarios demo
```

---

## 🔒 Formato de Respuestas y Manejo de Errores (Conforme a `Esate-Loop`)

### 1. Respuesta Exitosa (`onSuccess`)
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso.",
  "data": { ... }
}
```

### 2. Respuesta de Error (`onError`)
```json
{
  "status": 400,
  "error": true,
  "message": "El correo electrónico ya está registrado. Intente con otro."
}
```

### 3. Excepciones HTTP Heredadas
- `BadRequestException(message)` -> `400`
- `UnauthorizedAccess(message)` -> `401`
- `ForbiddenException(message)` -> `403`
- `NotFoundException(message)` -> `404`
- `ServerError(message)` -> `500`

---

## 🔑 Seguridad y Manejo de Tokens (Access & Refresh Tokens)

1. **Access Token (Corta duración: 15m)**:
   - Se incluye en el header: `Authorization: Bearer <accessToken>`.
   - Verificado de forma ultrarrápida por `verifyJwt` middleware sin sobrecargar la base de datos en peticiones concurrentes.

2. **Refresh Token (Larga duración: 7d)**:
   - Se almacena de forma segura.
   - Endpoint: `POST /api/v1/auth/refresh-token`.
   - Rota automáticamente el par de tokens.
   - En el frontend (`frontend/src/lib/apiClient.js`), un interceptor detecta automáticamente respuestas `401`, refresca el token en background y reintenta las solicitudes pendientes mediante una cola de suscriptores sin interrumpir la sesión del usuario.

3. **Capas adicionales de Seguridad**:
   - **Helmet**: Cabeceras HTTP de protección (X-Content-Type-Options, X-Frame-Options, etc.).
   - **HPP**: Prevención de Parameter Pollution.
   - **Express Rate Limit**: Protección contra ataques de fuerza bruta en rutas de autenticación (`/auth/*`).
   - **Payload Limits**: Límite de tamaño en cuerpo JSON para prevenir DoS.
   - **Bcrypt**: Hashing de contraseñas con salt rounds.

---

## ⚡ Optimización y Rendimiento Instantáneo

- **Mongoose Indexing**: Índices compuestos y sparse en campos clave (`email`, `username`, `referralCode`, `referredBy`, `status`, `priceUSD`, `isActive`, `createdAt`).
- **Lean Queries**: Consultas de solo lectura con `.lean()` para evitar la sobrecarga de documentos Mongoose.
- **Compresión Gzip (`compression`)**: Respuestas comprimidas para menor latencia.
- **Upline Ancestor Array**: Búsqueda en O(1) de líneas ascendentes para la asignación instantánea de comisiones multinivel.

---

## 🎁 Lógica de Referidos y Puntos (Especificación §30–§33)

1. **Miembro (`member`)**:
   - Acceso al catálogo.
   - 0% comisiones de referidos.
2. **Miembro Activo (`active_member`)**:
   - 100% de los puntos de su Nivel 1 (referidos directos).
3. **Embajador (`ambassador`)**:
   - 100% de los puntos de su Nivel 1.
   - 50% de los puntos de su Nivel 2.
4. **Embajador Élite (`elite_ambassador`)**:
   - 100% Nivel 1 + 50% Nivel 2 + beneficios internos.
5. **Regla de Puntos de Compra**:
   - Las compras offline asignadas por el administrador otorgan puntos al comprador para su calificación/mantenimiento de estatus de Miembro Activo.
   - El comprador **no** recibe comisiones de referido de su propia compra. Las comisiones se distribuyen a sus patrocinadores Nivel 1 (100%) y Nivel 2 (50%) automáticamente según sus membresías.

---

## 📖 Documentación Interactiva de Swagger (OpenAPI 3.0)

La documentación interactiva incluye todos los cuerpos de solicitud (`requestBody`), esquemas de respuesta, parámetros de consulta y autenticación Bearer JWT:

- **URL Swagger UI**: `http://localhost:5000/api-docs` (o `http://localhost:5000/api/v1/docs`)
- **JSON OpenAPI**: `http://localhost:5000/api/v1/swagger.json`

---

## 🚀 Comandos para Ejecutar

### 1. Instalar dependencias
```bash
cd backend
npm install
```

### 2. Poblar la base de datos (Seed data inicial)
```bash
npm run seed
```

### 3. Iniciar servidor en modo desarrollo
```bash
npm run dev
```
O en producción:
```bash
npm start
```
