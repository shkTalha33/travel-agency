const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Viajes Dominicana - Travel Referral Platform API",
    version: "1.0.0",
    description:
      "Production-grade RESTful API for the Dominican Republic Travel Agency & Multi-Tier Referral Platform.\n\nIncludes JWT authentication (Access & Refresh tokens), member networks (Level 1 & Level 2), point ledgers, redemption workflows, and travel catalogs.",
    contact: {
      name: "Soporte Técnico Viajes Dominicana",
      email: "soporte@viajesdominicana.com",
    },
  },
  servers: [
    {
      url: "http://localhost:5000/api/v1",
      description: "Development Server",
    },
    {
      url: "https://api.viajesdominicana.com/api/v1",
      description: "Production Server",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Ingrese su Access Token JWT en el formato: Bearer <token>",
      },
    },
    schemas: {
      ApiResponseSuccess: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Operación realizada exitosamente" },
          data: { type: "object" },
        },
      },
      ApiResponseError: {
        type: "object",
        properties: {
          status: { type: "integer", example: 400 },
          error: { type: "boolean", example: true },
          message: { type: "string", example: "Descripción detallada del error" },
        },
      },
      User: {
        type: "object",
        properties: {
          _id: { type: "string", example: "65e2197f8c9b2e0012345678" },
          fullname: { type: "string", example: "Sofía Almonte" },
          email: { type: "string", example: "sofia.almonte@ejemplo.com" },
          username: { type: "string", example: "sofia_almonte" },
          phone: { type: "string", example: "+1 (809) 555-0192" },
          country: { type: "string", example: "República Dominicana" },
          city: { type: "string", example: "Santo Domingo" },
          avatar: { type: "string", example: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2" },
          membershipId: {
            type: "string",
            enum: ["member", "active_member", "ambassador", "elite_ambassador"],
            example: "ambassador",
          },
          role: { type: "string", enum: ["user", "admin"], example: "user" },
          status: { type: "string", enum: ["active", "deactivate", "deleted"], example: "active" },
          referralCode: { type: "string", example: "SOFIA-VIAJES" },
          referralLink: { type: "string", example: "https://viajesdominicana.com/register?ref=SOFIA-VIAJES" },
          isEmailVerified: { type: "boolean", example: true },
          pointsStats: {
            type: "object",
            properties: {
              availablePoints: { type: "number", example: 685 },
              totalEarnedPoints: { type: "number", example: 885 },
              redeemedPoints: { type: "number", example: 200 },
              level1Points: { type: "number", example: 490 },
              level2Points: { type: "number", example: 395 },
            },
          },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      SignupRequest: {
        type: "object",
        required: ["fullname", "email", "password"],
        properties: {
          fullname: { type: "string", example: "Carlos Mendoza" },
          email: { type: "string", format: "email", example: "carlos.mendoza@ejemplo.com" },
          password: { type: "string", format: "password", example: "Segura123!" },
          username: { type: "string", example: "carlos_mendoza" },
          phone: { type: "string", example: "+18295550144" },
          country: { type: "string", example: "República Dominicana" },
          city: { type: "string", example: "Santiago de los Caballeros" },
          referralCode: { type: "string", example: "SOFIA-VIAJES", description: "Código del patrocinador que invitó al usuario" },
        },
      },
      SigninRequest: {
        type: "object",
        required: ["identifier", "password"],
        properties: {
          identifier: { type: "string", example: "carlos.mendoza@ejemplo.com", description: "Correo electrónico o nombre de usuario" },
          password: { type: "string", format: "password", example: "Segura123!" },
        },
      },
      RefreshTokenRequest: {
        type: "object",
        required: ["refreshToken"],
        properties: {
          refreshToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsIn..." },
        },
      },
      AuthTokensResponse: {
        type: "object",
        properties: {
          user: { $ref: "#/components/schemas/User" },
          accessToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsIn..." },
          refreshToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsIn..." },
        },
      },
      TravelOffer: {
        type: "object",
        properties: {
          _id: { type: "string", example: "65e2197f8c9b2e0012345679" },
          slug: { type: "string", example: "punta-cana-todo-incluido" },
          title: { type: "string", example: "Punta Cana Todo Incluido" },
          destination: { type: "string", example: "Punta Cana" },
          country: { type: "string", example: "República Dominicana" },
          priceUSD: { type: "number", example: 1450 },
          pointsReward: { type: "number", example: 120 },
          duration: { type: "string", example: "5 días / 4 noches" },
          hotelCategory: { type: "string", example: "Resort 5 estrellas" },
          badge: { type: "string", example: "Más solicitado" },
          image: { type: "string", example: "https://images.unsplash.com/photo-1540555700478-4be289fbecef" },
          gallery: { type: "array", items: { type: "string" } },
          summary: { type: "string", example: "Resort frente al mar con todo incluido y excursión a Isla Saona." },
          description: { type: "string", example: "Cuatro noches en un resort frente a Playa Bávaro con alimentos y bebidas incluidas..." },
          highlights: { type: "array", items: { type: "string" } },
          included: { type: "array", items: { type: "string" } },
          notIncluded: { type: "array", items: { type: "string" } },
          itinerary: {
            type: "array",
            items: {
              type: "object",
              properties: {
                day: { type: "integer", example: 1 },
                title: { type: "string", example: "Llegada y bienvenida" },
                description: { type: "string", example: "Recibimiento en el aeropuerto y traslado." },
              },
            },
          },
          isFeatured: { type: "boolean", example: true },
        },
      },
      RedemptionRequest: {
        type: "object",
        required: ["points"],
        properties: {
          points: { type: "integer", minimum: 50, example: 100 },
          rewardType: {
            type: "string",
            enum: ["travel_credit", "discount_voucher", "gift_card", "custom"],
            example: "travel_credit",
          },
          paymentDetails: { type: "string", example: "Aplicar como crédito para próxima reserva en Punta Cana" },
          notes: { type: "string", example: "Viaje planificado para el próximo mes" },
        },
      },
      AdminAssignPointsRequest: {
        type: "object",
        required: ["purchaserUserId", "purchasePoints", "offerTitle"],
        properties: {
          purchaserUserId: { type: "string", example: "65e2197f8c9b2e0012345678", description: "ID de MongoDB del miembro que realizó la compra offline" },
          purchasePoints: { type: "integer", minimum: 1, example: 150, description: "Puntos base del paquete de viaje" },
          offerTitle: { type: "string", example: "Punta Cana Todo Incluido" },
          offerId: { type: "string", example: "65e2197f8c9b2e0012345679" },
        },
      },
      ContactMessageRequest: {
        type: "object",
        required: ["fullname", "email", "subject", "message"],
        properties: {
          fullname: { type: "string", example: "María González" },
          email: { type: "string", format: "email", example: "maria@ejemplo.com" },
          phone: { type: "string", example: "+18095550199" },
          subject: { type: "string", example: "Información sobre membresía Embajador" },
          message: { type: "string", example: "Hola, quisiera saber los requisitos para afiliar a mi agencia..." },
        },
      },
    },
  },
  paths: {
    "/auth/signup": {
      post: {
        tags: ["Authentication"],
        summary: "Registrar un nuevo miembro",
        description: "Crea una nueva cuenta de usuario, asigna membresía inicial 'member', genera código de referido único, vincula con el árbol del patrocinador (upline) y envía email de verificación.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SignupRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Usuario registrado exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string" },
                    data: { $ref: "#/components/schemas/AuthTokensResponse" },
                  },
                },
              },
            },
          },
          400: { description: "Error de validación o usuario ya existente", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponseError" } } } },
        },
      },
    },
    "/auth/signin": {
      post: {
        tags: ["Authentication"],
        summary: "Iniciar sesión",
        description: "Autentica al usuario con correo/usuario y contraseña. Retorna un Access Token de corta duración y un Refresh Token.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SigninRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Inicio de sesión exitoso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string" },
                    data: { $ref: "#/components/schemas/AuthTokensResponse" },
                  },
                },
              },
            },
          },
          400: { description: "Credenciales incorrectas", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponseError" } } } },
        },
      },
    },
    "/auth/refresh-token": {
      post: {
        tags: ["Authentication"],
        summary: "Rotar y refrescar token de acceso",
        description: "Emite un nuevo Access Token y rota el Refresh Token para sesiones continuas y seguras sin requerir nuevo login.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RefreshTokenRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Token refrescado exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string" },
                    data: {
                      type: "object",
                      properties: {
                        accessToken: { type: "string" },
                        refreshToken: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Refresh token inválido o expirado", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponseError" } } } },
        },
      },
    },
    "/auth/logout": {
      post: {
        tags: ["Authentication"],
        summary: "Cerrar sesión",
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "Sesión cerrada", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponseSuccess" } } } },
        },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Authentication"],
        summary: "Obtener usuario autenticado actual",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Datos del usuario actual",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/forgot-password": {
      post: {
        tags: ["Authentication"],
        summary: "Solicitar recuperación de contraseña",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: { email: { type: "string", format: "email" } },
              },
            },
          },
        },
        responses: {
          200: { description: "Correo enviado si la cuenta existe", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponseSuccess" } } } },
        },
      },
    },
    "/auth/reset-password": {
      post: {
        tags: ["Authentication"],
        summary: "Restablecer contraseña con token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["token", "newPassword"],
                properties: {
                  token: { type: "string" },
                  newPassword: { type: "string", minLength: 6 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Contraseña actualizada exitosamente", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponseSuccess" } } } },
          400: { description: "Token inválido o expirado", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponseError" } } } },
        },
      },
    },
    "/auth/verify-email": {
      get: {
        tags: ["Authentication"],
        summary: "Verificar correo electrónico",
        parameters: [
          { name: "token", in: "query", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Correo verificado exitosamente", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponseSuccess" } } } },
          400: { description: "Token inválido o expirado", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponseError" } } } },
        },
      },
    },
    "/users/profile": {
      get: {
        tags: ["Users & Profile"],
        summary: "Obtener perfil del usuario",
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "Perfil del usuario", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
        },
      },
    },
    "/users/update-details": {
      put: {
        tags: ["Users & Profile"],
        summary: "Actualizar datos de contacto y biografía",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  fullname: { type: "string" },
                  phone: { type: "string" },
                  country: { type: "string" },
                  city: { type: "string" },
                  bio: { type: "string" },
                  address: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Perfil actualizado", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponseSuccess" } } } },
        },
      },
    },
    "/users/network": {
      get: {
        tags: ["Referral Network & Points"],
        summary: "Obtener red de referidos (Nivel 1 y Nivel 2)",
        description: "Retorna los miembros de la red respetando los límites de visibilidad del nivel de membresía (Miembro: 0 niveles; Miembro Activo: Nivel 1; Embajador y Embajador Élite: Niveles 1 y 2).",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Estructura de la red del miembro con puntos generados",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        membershipId: { type: "string", example: "ambassador" },
                        maxReferralLevel: { type: "integer", example: 2 },
                        referralCode: { type: "string", example: "SOFIA-VIAJES" },
                        network: {
                          type: "object",
                          properties: {
                            level1: { type: "array", items: { type: "object" } },
                            level2: { type: "array", items: { type: "object" } },
                          },
                        },
                        stats: {
                          type: "object",
                          properties: {
                            directReferralsCount: { type: "integer", example: 4 },
                            secondLevelReferralsCount: { type: "integer", example: 4 },
                            totalNetworkCount: { type: "integer", example: 8 },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/offers": {
      get: {
        tags: ["Travel Offers"],
        summary: "Listar catálogo de ofertas de viaje",
        parameters: [
          { name: "destination", in: "query", schema: { type: "string" }, description: "Filtrar por destino" },
          { name: "search", in: "query", schema: { type: "string" }, description: "Búsqueda por texto libre" },
          { name: "isFeatured", in: "query", schema: { type: "boolean" }, description: "Filtrar destacadas" },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: {
          200: {
            description: "Listado de ofertas de viaje",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        offers: { type: "array", items: { $ref: "#/components/schemas/TravelOffer" } },
                        pagination: { type: "object" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/offers/{idOrSlug}": {
      get: {
        tags: ["Travel Offers"],
        summary: "Obtener detalle completo de una oferta de viaje",
        parameters: [
          { name: "idOrSlug", in: "path", required: true, schema: { type: "string" }, example: "punta-cana-todo-incluido" },
        ],
        responses: {
          200: {
            description: "Detalle de la oferta de viaje y ofertas relacionadas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        offer: { $ref: "#/components/schemas/TravelOffer" },
                        relatedOffers: { type: "array", items: { $ref: "#/components/schemas/TravelOffer" } },
                      },
                    },
                  },
                },
              },
            },
          },
          404: { description: "Oferta no encontrada" },
        },
      },
    },
    "/points/summary": {
      get: {
        tags: ["Referral Network & Points"],
        summary: "Obtener balance y resumen de puntos del miembro",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Resumen de puntos disponibles, acumulados y redimidos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        availablePoints: { type: "number", example: 685 },
                        totalEarnedPoints: { type: "number", example: 885 },
                        redeemedPoints: { type: "number", example: 200 },
                        level1Points: { type: "number", example: 490 },
                        level2Points: { type: "number", example: 395 },
                        membershipId: { type: "string", example: "ambassador" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/points/transactions": {
      get: {
        tags: ["Referral Network & Points"],
        summary: "Historial de transacciones de puntos",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "type", in: "query", schema: { type: "string", enum: ["referral_l1", "referral_l2", "purchase_points", "redemption", "manual_adjustment"] } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 50 } },
        ],
        responses: {
          200: { description: "Libro mayor de transacciones", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponseSuccess" } } } },
        },
      },
    },
    "/points/admin/assign-purchase-points": {
      post: {
        tags: ["Admin - Points Management"],
        summary: "Asignar puntos de compra offline y calcular comisiones multinivel de referidos",
        description: "Asigna puntos al comprador para activación de estatus y calcula automáticamente las comisiones a la línea ascendente (100% Nivel 1, 50% Nivel 2 según membresía).",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AdminAssignPointsRequest" },
            },
          },
        },
        responses: {
          200: { description: "Comisiones calculadas y distribuidas exitosamente", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponseSuccess" } } } },
        },
      },
    },
    "/redemptions/request": {
      post: {
        tags: ["Redemptions"],
        summary: "Solicitar redención de puntos",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RedemptionRequest" },
            },
          },
        },
        responses: {
          201: { description: "Solicitud creada y puntos deducidos provisionalmente", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponseSuccess" } } } },
          400: { description: "Puntos insuficientes o cantidad menor a 50", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponseError" } } } },
        },
      },
    },
    "/redemptions/my": {
      get: {
        tags: ["Redemptions"],
        summary: "Ver mis solicitudes de redención",
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "Listado de redenciones del usuario", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponseSuccess" } } } },
        },
      },
    },
    "/faqs": {
      get: {
        tags: ["FAQs"],
        summary: "Obtener preguntas frecuentes",
        responses: {
          200: { description: "Lista de preguntas frecuentes", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponseSuccess" } } } },
        },
      },
    },
    "/contact": {
      post: {
        tags: ["Contact"],
        summary: "Enviar formulario de contacto o consulta",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ContactMessageRequest" },
            },
          },
        },
        responses: {
          201: { description: "Mensaje recibido correctamente", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponseSuccess" } } } },
        },
      },
    },
  },
};

const swaggerSpec = swaggerJsdoc({
  swaggerDefinition,
  apis: ["./routes/*.js", "./controllers/*.js"],
});

module.exports = { swaggerSpec };
