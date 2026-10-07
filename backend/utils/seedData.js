require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../db");
const User = require("../models/user.model");
const Offer = require("../models/offer.model");
const PointTransaction = require("../models/pointTransaction.model");
const Faq = require("../models/faq.model");
const { MEMBERSHIP_TIERS, TRANSACTION_TYPES, USER_ROLES } = require("../constants");

const sampleOffers = [
  {
    slug: "punta-cana-todo-incluido",
    title: "Punta Cana Todo Incluido",
    destination: "Punta Cana",
    country: "República Dominicana",
    priceUSD: 1450,
    pointsReward: 120,
    duration: "5 días / 4 noches",
    hotelCategory: "Resort 5 estrellas",
    badge: "Más solicitado",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80",
    ],
    summary: "Resort frente al mar con todo incluido, playas de arena blanca y excursión en catamarán a Isla Saona.",
    description: "Cuatro noches en un resort frente a Playa Bávaro con alimentos y bebidas incluidos, traslados privados desde el aeropuerto y una excursión en catamarán a Isla Saona.",
    highlights: ["Resort frente a la playa en Bávaro", "Alimentos y bebidas incluidos las 24 horas", "Excursión en catamarán a Isla Saona", "Traslado privado aeropuerto – hotel – aeropuerto"],
    included: ["4 noches en habitación vista al mar", "Plan todo incluido", "Traslados privados", "Excursión en catamarán con almuerzo"],
    notIncluded: ["Vuelos internacionales", "Propinas y gastos personales"],
    itinerary: [
      { day: 1, title: "Llegada y bienvenida", description: "Recibimiento en el aeropuerto y traslado al resort." },
      { day: 2, title: "Día de playa", description: "Día libre para disfrutar de la playa y las piscinas." },
      { day: 3, title: "Isla Saona", description: "Navegación en catamarán, piscina natural y almuerzo en la playa." },
      { day: 4, title: "Día libre", description: "Actividades del resort o paseo por la zona." },
      { day: 5, title: "Regreso", description: "Desayuno y traslado al aeropuerto." },
    ],
    isFeatured: true,
  },
  {
    slug: "santo-domingo-zona-colonial",
    title: "Santo Domingo y la Zona Colonial",
    destination: "Santo Domingo",
    country: "República Dominicana",
    priceUSD: 780,
    pointsReward: 80,
    duration: "3 días / 2 noches",
    hotelCategory: "Hotel boutique 4 estrellas",
    badge: "Cultura e historia",
    image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1000&q=80",
    ],
    summary: "Recorrido por la primera ciudad de América: calles coloniales, museos, gastronomía y vida nocturna.",
    description: "Dos noches en un hotel boutique de la Zona Colonial, con visita guiada a los principales monumentos y una cena de comida criolla.",
    highlights: ["Hotel boutique dentro de la Zona Colonial", "Visita guiada a la Catedral Primada y el Alcázar de Colón", "Cena de comida dominicana", "Paseo por el Malecón al atardecer"],
    included: ["2 noches con desayuno", "Tour guiado a pie", "Cena criolla", "Traslado desde el aeropuerto"],
    notIncluded: ["Almuerzos", "Vuelos nacionales o internacionales"],
    itinerary: [
      { day: 1, title: "Llegada", description: "Traslado al hotel y paseo por la Calle El Conde." },
      { day: 2, title: "Zona Colonial", description: "Tour guiado por los monumentos y cena criolla." },
      { day: 3, title: "Despedida", description: "Desayuno y traslado al aeropuerto." },
    ],
    isFeatured: true,
  },
  {
    slug: "puerto-plata-costa-norte",
    title: "Puerto Plata y Teleférico Isabel de Torres",
    destination: "Puerto Plata",
    country: "República Dominicana",
    priceUSD: 890,
    pointsReward: 70,
    duration: "4 días / 3 noches",
    hotelCategory: "Resort 4 estrellas en Playa Dorada",
    badge: "Escapada dominicana",
    image: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80",
    ],
    summary: "Costa norte con playa, centro histórico, fortaleza y ascenso en teleférico.",
    description: "Tres noches en Playa Dorada con todo incluido, ascenso en el teleférico a Loma Isabel de Torres y visita al centro histórico.",
    highlights: ["Todo incluido en Playa Dorada", "Ascenso en teleférico a la cima de Loma Isabel de Torres", "Visita a la Fortaleza San Felipe", "Tiempo libre en el malecón de Puerto Plata"],
    included: ["3 noches todo incluido", "Ticket del teleférico", "Visita guiada a la fortaleza", "Traslados"],
    notIncluded: ["Gastos personales", "Excursiones adicionales"],
    itinerary: [
      { day: 1, title: "Llegada a Puerto Plata", description: "Check-in en el resort y tarde de descanso." },
      { day: 2, title: "Teleférico y montaña", description: "Subida en el teleférico y paseo por los jardines botánicos." },
      { day: 3, title: "Historia y malecón", description: "Visita a la Fortaleza San Felipe y paseo por el centro." },
      { day: 4, title: "Regreso", description: "Desayuno y regreso." },
    ],
    isFeatured: false,
  },
  {
    slug: "cancun-riviera-maya",
    title: "Cancún y Riviera Maya",
    destination: "Cancún",
    country: "México",
    priceUSD: 1680,
    pointsReward: 150,
    duration: "6 días / 5 noches",
    hotelCategory: "Resort 5 estrellas frente al mar",
    badge: "Caribe internacional",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1512815494411-17f1a30ef1d4?auto=format&fit=crop&w=1000&q=80",
    ],
    summary: "Playa caribeña, cenotes de agua cristalina y ruinas mayas con plan todo incluido.",
    description: "Cinco noches en la Riviera Maya con acceso a cenotes, excursión a Chichén Itzá y todo incluido en un resort de lujo.",
    highlights: ["Resort 5 estrellas frente al mar", "Excursión a Chichén Itzá con guía certificado", "Visita y nado en cenote sagrado", "Traslados incluidos en Cancún"],
    included: ["5 noches todo incluido", "Tour Chichén Itzá + cenote", "Traslados aeropuerto – hotel – aeropuerto"],
    notIncluded: ["Vuelos internacionales", "Impuesto ambiental hotelero"],
    itinerary: [
      { day: 1, title: "Llegada a Cancún", description: "Recepción en el aeropuerto y traslado a la Riviera Maya." },
      { day: 2, title: "Día de resort y playa", description: "Disfruta de las instalaciones del resort." },
      { day: 3, title: "Chichén Itzá y Cenote", description: "Excursión arqueológica y nado en aguas cristalinas." },
      { day: 4, title: "Playa del Carmen", description: "Tarde de compras y cena en la Quinta Avenida." },
      { day: 5, title: "Día libre", description: "Relax o actividades acuáticas opcionales." },
      { day: 6, title: "Despedida", description: "Traslado al aeropuerto de Cancún." },
    ],
    isFeatured: true,
  },
  {
    slug: "cartagena-de-indias",
    title: "Cartagena de Indias y las Islas del Rosario",
    destination: "Cartagena",
    country: "Colombia",
    priceUSD: 1320,
    pointsReward: 130,
    duration: "5 días / 4 noches",
    hotelCategory: "Hotel colonial 4 estrellas",
    badge: "Ciudad amurallada",
    image: "https://images.unsplash.com/photo-1583531352515-8884af319dc1?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1583531352515-8884af319dc1?auto=format&fit=crop&w=1000&q=80",
    ],
    summary: "Magia colonial dentro de las murallas, atardeceres en el Caribe y paseo en lancha a las islas.",
    description: "Cuatro noches en el centro histórico de Cartagena, con tour a las Islas del Rosario y cena en restaurante de comida caribeña colombiana.",
    highlights: ["Alojamiento en el centro amurallado", "Día completo en las Islas del Rosario con almuerzo típico", "Recorrido histórico guiado a pie", "Atardecer en las murallas"],
    included: ["4 noches con desayuno", "Excursión a Islas del Rosario", "Tour histórico amurallado", "Traslados de llegada y salida"],
    notIncluded: ["Impuesto de muelle", "Vuelos internacionales"],
    itinerary: [
      { day: 1, title: "Bienvenida a Cartagena", description: "Traslado al hotel en la Ciudad Amurallada." },
      { day: 2, title: "Calles coloniales y muralla", description: "Paseo por las plazas históricas y atardecer en el café del mar." },
      { day: 3, title: "Islas del Rosario", description: "Lancha rápida hacia el archipiélago y día de playa." },
      { day: 4, title: "Getsemaní y gastronomía", description: "Barrio Getsemaní, arte urbano y cena caribeña." },
      { day: 5, title: "Regreso", description: "Desayuno y traslado al aeropuerto." },
    ],
    isFeatured: false,
  },
  {
    slug: "madrid-arte-y-gastronomia",
    title: "Madrid: Arte, Tapas y Cultura Española",
    destination: "Madrid",
    country: "España",
    priceUSD: 2150,
    pointsReward: 200,
    duration: "7 días / 6 noches",
    hotelCategory: "Hotel céntrico 4 estrellas",
    badge: "Europa clásica",
    image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1000&q=80",
    ],
    summary: "Museos de talla mundial, tapeo por La Latina y excursión de un día a la histórica Toledo.",
    description: "Seis noches en el corazón de Madrid con entrada al Museo del Prado, ruta guiada de tapas y excursión a Toledo.",
    highlights: ["Hotel a pasos de la Gran Vía", "Entrada preferente al Museo del Prado", "Tour gastronómico de tapas y vinos", "Excursión guiada a Toledo"],
    included: ["6 noches con desayuno", "Entrada al Prado", "Tour gastronómico", "Excursión a Toledo con transporte"],
    notIncluded: ["Vuelos transatlánticos", "Almuerzos libres"],
    itinerary: [
      { day: 1, title: "Llegada a Madrid", description: "Traslado al hotel y paseo por la Plaza Mayor." },
      { day: 2, title: "Museo del Prado y Retiro", description: "Visita al museo y paseo por el Parque del Retiro." },
      { day: 3, title: "Toledo", description: "Excursión de día completo a la ciudad imperial." },
      { day: 4, title: "Madrid de los Austrias", description: "Palacio Real, Catedral de la Almudena y ruta de tapas." },
      { day: 5, title: "Día libre", description: "Compras en Serrano o visita a Segovia." },
      { day: 6, title: "Tarde cultural", description: "Reina Sofía y cena de despedida." },
      { day: 7, title: "Regreso", description: "Desayuno y traslado al aeropuerto de Barajas." },
    ],
    isFeatured: false,
  },
  {
    slug: "paris-la-ciudad-luz",
    title: "París: La Ciudad Luz y Versalles",
    destination: "París",
    country: "Francia",
    priceUSD: 2600,
    pointsReward: 260,
    duration: "7 días / 6 noches",
    hotelCategory: "Hotel boutique 4 estrellas",
    badge: "Romance y estilo",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80",
    ],
    summary: "Torre Eiffel, crucero por el Sena, Museo del Louvre y visita al Palacio de Versalles.",
    description: "Seis noches en un hotel boutique parisino con entradas prioritarias a los principales monumentos y crucero al atardecer por el río Sena.",
    highlights: ["Hotel en el barrio latino o Saint-Germain", "Crucero nocturno por el Sena con copa de champán", "Entrada al Museo del Louvre", "Excursión de medio día al Palacio de Versalles"],
    included: ["6 noches con desayuno buffet", "Crucero por el Sena", "Entrada al Louvre", "Excursión a Versalles"],
    notIncluded: ["Vuelos internacionales", "Cenas no especificadas"],
    itinerary: [
      { day: 1, title: "Bienvenue à Paris", description: "Llegada, traslado al hotel y primera vista de la Torre Eiffel." },
      { day: 2, title: "Louvre y Sena", description: "Museo del Louvre por la mañana y crucero nocturno." },
      { day: 3, title: "Palacio de Versalles", description: "Visita guiada a los jardines y salones reales." },
      { day: 4, title: "Montmartre", description: "Basílica del Sagrado Corazón y plaza de los pintores." },
      { day: 5, title: "Campos Elíseos y Arco de Triunfo", description: "Día de compras y mirador panorámico." },
      { day: 6, title: "Día libre", description: "Paseo por el Marais y bistró típico francés." },
      { day: 7, title: "Regreso", description: "Desayuno y traslado al aeropuerto Charles de Gaulle." },
    ],
    isFeatured: true,
  },
  {
    slug: "nueva-york-esencial",
    title: "Nueva York Esencial: Manhattan y Más",
    destination: "Nueva York",
    country: "Estados Unidos",
    priceUSD: 2300,
    pointsReward: 220,
    duration: "6 días / 5 noches",
    hotelCategory: "Hotel 4 estrellas en Midtown",
    badge: "Gran metrópoli",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1000&q=80",
    ],
    summary: "Mirador Summit One Vanderbilt, Estatua de la Libertad, Central Park y musical en Broadway.",
    description: "Cinco noches en Manhattan a pasos de Times Square, con entradas a los mejores miradores, ferry a la Estatua de la Libertad y tiempo para compras.",
    highlights: ["Hotel céntrico en Midtown Manhattan", "Entrada al mirador Summit One Vanderbilt", "Paseo en ferry hacia la Estatua de la Libertad y Ellis Island", "Caminata guiada por Central Park y Quinta Avenida"],
    included: ["5 noches de alojamiento", "Pase de atracciones", "Ferry Estatua de la Libertad", "Traslado de llegada"],
    notIncluded: ["Vuelos", "Comidas no indicadas"],
    itinerary: [
      { day: 1, title: "Llegada a Nueva York", description: "Traslado al hotel y primera noche en Times Square." },
      { day: 2, title: "Estatua de la Libertad y Wall Street", description: "Ferry matutino y recorrido por el distrito financiero." },
      { day: 3, title: "Central Park y mirador", description: "Paseo por el parque y subida al Summit One Vanderbilt." },
      { day: 4, title: "Brooklyn y DUMBO", description: "Cruce a pie del Puente de Brooklyn y fotos en DUMBO." },
      { day: 5, title: "Día de compras y Broadway", description: "Quinta Avenida, SoHo y noche de teatro opcional." },
      { day: 6, title: "Despedida", description: "Check-out y traslado al aeropuerto JFK o Newark." },
    ],
    isFeatured: false,
  },
];

const sampleFaqs = [
  {
    question: "¿Cómo puedo registrarme en la plataforma?",
    answer: "El registro es completamente gratuito. Solo necesitas tu nombre completo, correo electrónico y una contraseña segura. Si fuiste invitado por un miembro, puedes ingresar su código de referido para unirte a su red.",
    category: "general",
    order: 1,
  },
  {
    question: "¿Es gratis registrarse?",
    answer: "Sí, el registro básico es 100% gratuito y te otorga acceso inmediato al catálogo completo de ofertas de viaje y a tu perfil de miembro.",
    category: "general",
    order: 2,
  },
  {
    question: "¿Qué es un Active Member (Miembro Activo)?",
    answer: "Un Miembro Activo es aquel que ha calificado acumulando los puntos requeridos a través de compras de viaje. Este estatus te habilita para ganar el 100% de los puntos generados por tus referidos directos (Nivel 1).",
    category: "memberships",
    order: 3,
  },
  {
    question: "¿Qué es un Ambassador (Embajador)?",
    answer: "El nivel de Embajador se asigna por mérito y desempeño. Te permite obtener el 100% de los puntos de tu Nivel 1 y el 50% de los puntos generados por tu Nivel 2.",
    category: "memberships",
    order: 4,
  },
  {
    question: "¿Qué es un Elite Ambassador (Embajador Élite)?",
    answer: "Es el nivel más distinguido de la plataforma. Mantiene todos los beneficios de referidos del Embajador (100% Nivel 1 y 50% Nivel 2) junto con beneficios exclusivos de la agencia.",
    category: "memberships",
    order: 5,
  },
  {
    question: "¿Cómo funciona mi red de referidos?",
    answer: "Cuando compartes tu enlace o código de referido, las personas que se registren formarán parte de tu Nivel 1. Cuando ellos inviten a otros, esas nuevas personas formarán tu Nivel 2.",
    category: "referrals",
    order: 6,
  },
  {
    question: "¿Cuántos niveles puedo ver en mi panel?",
    answer: "La visibilidad y los beneficios de tu red dependen de tu membresía: Miembro (0 niveles), Miembro Activo (Nivel 1), Embajador y Embajador Élite (Niveles 1 y 2).",
    category: "referrals",
    order: 7,
  },
  {
    question: "¿Cómo se obtienen los puntos?",
    answer: "Los puntos se generan cuando los miembros de tu red realizan compras de paquetes de viaje. Las compras son gestionadas por la agencia y los puntos son asignados administrativamente.",
    category: "points",
    order: 8,
  },
  {
    question: "¿Las compras de viajes se realizan online?",
    answer: "No. Nuestra plataforma no procesa pagos online ni requiere pasarelas de pago. Toda compra y cotización se coordina directamente con los asesores de viajes de la agencia.",
    category: "general",
    order: 9,
  },
  {
    question: "¿Cómo puedo redimir mis puntos?",
    answer: "Puedes solicitar la redención de tus puntos acumulados desde la sección 'Redimir puntos' de tu panel a partir de 50 puntos disponibles para aplicarlos como créditos en tus próximas vacaciones.",
    category: "points",
    order: 10,
  },
];

const seed = async () => {
  try {
    await connectDB();
    console.log("Seeding Database with Travel Agency Data...");

    // Clear existing collections
    await Offer.deleteMany({});
    await Faq.deleteMany({});
    await User.deleteMany({});
    await PointTransaction.deleteMany({});

    // 1. Insert Offers
    await Offer.insertMany(sampleOffers);
    console.log(` Inserted ${sampleOffers.length} Travel Offers.`);

    // 2. Insert FAQs
    await Faq.insertMany(sampleFaqs);
    console.log(` Inserted ${sampleFaqs.length} FAQs.`);

    // 3. Create Admin User
    const adminUser = await User.create({
      fullname: "Administrador Viajes Dominicana",
      username: "admin_viajes",
      email: "admin@viajesdominicana.com",
      password: "AdminPassword2026!",
      role: USER_ROLES.ADMIN,
      membershipId: MEMBERSHIP_TIERS.ELITE_AMBASSADOR,
      referralCode: "ADMIN-RD",
      isEmailVerified: true,
      country: "República Dominicana",
      city: "Santo Domingo",
    });

    // 4. Create Demo Seed Users (Sofía, Carlos, Elena, Pedro)
    // Sofía (Ambassador)
    const sofia = await User.create({
      fullname: "Sofía Almonte",
      username: "sofia_almonte",
      email: "sofia.almonte@ejemplo.com",
      password: "Password123!",
      phone: "+1 (809) 555-0192",
      city: "Santo Domingo",
      country: "República Dominicana",
      membershipId: MEMBERSHIP_TIERS.AMBASSADOR,
      referralCode: "SOFIA-VIAJES",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      isEmailVerified: true,
    });

    // Level 1 of Sofía: Marcos, Laura, Rafael, Carmen
    const marcos = await User.create({
      fullname: "Marcos Peña",
      username: "marcos_pena",
      email: "marcos.pena@ejemplo.com",
      password: "Password123!",
      membershipId: MEMBERSHIP_TIERS.ACTIVE_MEMBER,
      referredBy: sofia._id,
      upline: [sofia._id],
      referralCode: "MARCOS-RD",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      isEmailVerified: true,
    });

    const laura = await User.create({
      fullname: "Laura Gómez",
      username: "laura_gomez",
      email: "laura.gomez@ejemplo.com",
      password: "Password123!",
      membershipId: MEMBERSHIP_TIERS.ACTIVE_MEMBER,
      referredBy: sofia._id,
      upline: [sofia._id],
      referralCode: "LAURA-RD",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      isEmailVerified: true,
    });

    const rafael = await User.create({
      fullname: "Rafael Valdés",
      username: "rafael_valdes",
      email: "rafael.valdes@ejemplo.com",
      password: "Password123!",
      membershipId: MEMBERSHIP_TIERS.MEMBER,
      referredBy: sofia._id,
      upline: [sofia._id],
      referralCode: "RAFAEL-RD",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      isEmailVerified: true,
    });

    const carmen = await User.create({
      fullname: "Carmen Tavárez",
      username: "carmen_tavarez",
      email: "carmen.tavarez@ejemplo.com",
      password: "Password123!",
      membershipId: MEMBERSHIP_TIERS.ACTIVE_MEMBER,
      referredBy: sofia._id,
      upline: [sofia._id],
      referralCode: "CARMEN-RD",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      isEmailVerified: true,
    });

    // Level 2 of Sofía: Gabriel (under Marcos), Jorge (under Laura), Estela (under Laura), Andrés (under Carmen)
    const gabriel = await User.create({
      fullname: "Gabriel Morales",
      username: "gabriel_morales",
      email: "gabriel.morales@ejemplo.com",
      password: "Password123!",
      membershipId: MEMBERSHIP_TIERS.ACTIVE_MEMBER,
      referredBy: marcos._id,
      upline: [marcos._id, sofia._id],
      referralCode: "GABRIEL-RD",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
      isEmailVerified: true,
    });

    const jorge = await User.create({
      fullname: "Jorge Cruz",
      username: "jorge_cruz",
      email: "jorge.cruz@ejemplo.com",
      password: "Password123!",
      membershipId: MEMBERSHIP_TIERS.ACTIVE_MEMBER,
      referredBy: laura._id,
      upline: [laura._id, sofia._id],
      referralCode: "JORGE-RD",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
      isEmailVerified: true,
    });

    const estela = await User.create({
      fullname: "Estela Rosario",
      username: "estela_rosario",
      email: "estela.rosario@ejemplo.com",
      password: "Password123!",
      membershipId: MEMBERSHIP_TIERS.ACTIVE_MEMBER,
      referredBy: laura._id,
      upline: [laura._id, sofia._id],
      referralCode: "ESTELA-RD",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
      isEmailVerified: true,
    });

    const andres = await User.create({
      fullname: "Andrés Gil",
      username: "andres_gil",
      email: "andres.gil@ejemplo.com",
      password: "Password123!",
      membershipId: MEMBERSHIP_TIERS.ACTIVE_MEMBER,
      referredBy: carmen._id,
      upline: [carmen._id, sofia._id],
      referralCode: "ANDRES-RD",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80",
      isEmailVerified: true,
    });

    // 5. Seed Transactions for Sofía's network
    // Level 1 Transactions (100% rate to Sofía)
    await PointTransaction.create([
      {
        userId: sofia._id,
        sourceUserId: marcos._id,
        sourcePersonName: marcos.fullname,
        purchaseDescription: "Punta Cana Todo Incluido",
        type: TRANSACTION_TYPES.REFERRAL_L1,
        level: 1,
        points: 120,
        status: "completed",
        createdAt: new Date("2026-08-08"),
      },
      {
        userId: sofia._id,
        sourceUserId: laura._id,
        sourcePersonName: laura.fullname,
        purchaseDescription: "Cancún y Riviera Maya",
        type: TRANSACTION_TYPES.REFERRAL_L1,
        level: 1,
        points: 150,
        status: "completed",
        createdAt: new Date("2026-09-28"),
      },
      {
        userId: sofia._id,
        sourceUserId: carmen._id,
        sourcePersonName: carmen.fullname,
        purchaseDescription: "Puerto Plata y Teleférico",
        type: TRANSACTION_TYPES.REFERRAL_L1,
        level: 1,
        points: 70,
        status: "completed",
        createdAt: new Date("2026-06-30"),
      },
      // Level 2 Transactions (50% rate to Sofía)
      {
        userId: sofia._id,
        sourceUserId: gabriel._id,
        sourcePersonName: gabriel.fullname,
        purchaseDescription: "Santo Domingo y la Zona Colonial",
        type: TRANSACTION_TYPES.REFERRAL_L2,
        level: 2,
        points: 40, // 80 * 0.5
        status: "completed",
        createdAt: new Date("2026-07-19"),
      },
      {
        userId: sofia._id,
        sourceUserId: jorge._id,
        sourcePersonName: jorge.fullname,
        purchaseDescription: "Punta Cana Todo Incluido",
        type: TRANSACTION_TYPES.REFERRAL_L2,
        level: 2,
        points: 60, // 120 * 0.5
        status: "completed",
        createdAt: new Date("2026-09-24"),
      },
      {
        userId: sofia._id,
        sourceUserId: estela._id,
        sourcePersonName: estela.fullname,
        purchaseDescription: "Cancún y Riviera Maya",
        type: TRANSACTION_TYPES.REFERRAL_L2,
        level: 2,
        points: 75, // 150 * 0.5
        status: "completed",
        createdAt: new Date("2026-09-10"),
      },
      {
        userId: sofia._id,
        sourceUserId: andres._id,
        sourcePersonName: andres.fullname,
        purchaseDescription: "Puerto Plata y Teleférico",
        type: TRANSACTION_TYPES.REFERRAL_L2,
        level: 2,
        points: 35, // 70 * 0.5
        status: "completed",
        createdAt: new Date("2026-07-02"),
      },
      // Redemption by Sofía
      {
        userId: sofia._id,
        sourcePersonName: "Solicitud personal",
        purchaseDescription: "Canje de puntos por crédito de viaje",
        type: TRANSACTION_TYPES.REDEMPTION,
        level: null,
        points: -200,
        status: "completed",
        createdAt: new Date("2026-09-15"),
      },
    ]);

    // Update Sofía's cached stats
    sofia.pointsStats = {
      availablePoints: 350, // (120+150+70+40+60+75+35) - 200 = 550 - 200 = 350
      totalEarnedPoints: 550,
      redeemedPoints: 200,
      level1Points: 340,
      level2Points: 210,
    };
    await sofia.save({ validateBeforeSave: false });

    // Carlos (Active Member)
    const carlos = await User.create({
      fullname: "Carlos Mendoza",
      username: "carlos_mendoza",
      email: "carlos.mendoza@ejemplo.com",
      password: "Password123!",
      phone: "+1 (829) 555-0144",
      city: "Santiago de los Caballeros",
      country: "República Dominicana",
      membershipId: MEMBERSHIP_TIERS.ACTIVE_MEMBER,
      referralCode: "CARLOS-RD",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      isEmailVerified: true,
    });

    const monica = await User.create({
      fullname: "Mónica Reyes",
      username: "monica_reyes",
      email: "monica.reyes@ejemplo.com",
      password: "Password123!",
      membershipId: MEMBERSHIP_TIERS.ACTIVE_MEMBER,
      referredBy: carlos._id,
      upline: [carlos._id],
      referralCode: "MONICA-RD",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      isEmailVerified: true,
    });

    const luis = await User.create({
      fullname: "Luis Batista",
      username: "luis_batista",
      email: "luis.batista@ejemplo.com",
      password: "Password123!",
      membershipId: MEMBERSHIP_TIERS.ACTIVE_MEMBER,
      referredBy: carlos._id,
      upline: [carlos._id],
      referralCode: "LUIS-RD",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
      isEmailVerified: true,
    });

    await PointTransaction.create([
      {
        userId: carlos._id,
        sourceUserId: monica._id,
        sourcePersonName: monica.fullname,
        purchaseDescription: "Santo Domingo y la Zona Colonial",
        type: TRANSACTION_TYPES.REFERRAL_L1,
        level: 1,
        points: 80,
        status: "completed",
        createdAt: new Date("2026-07-14"),
      },
      {
        userId: carlos._id,
        sourceUserId: luis._id,
        sourcePersonName: luis.fullname,
        purchaseDescription: "Cartagena de Indias",
        type: TRANSACTION_TYPES.REFERRAL_L1,
        level: 1,
        points: 130,
        status: "completed",
        createdAt: new Date("2026-08-30"),
      },
    ]);

    carlos.pointsStats = {
      availablePoints: 210,
      totalEarnedPoints: 210,
      redeemedPoints: 0,
      level1Points: 210,
      level2Points: 0,
    };
    await carlos.save({ validateBeforeSave: false });

    // Elena (Elite Ambassador)
    const elena = await User.create({
      fullname: "Elena Castillo",
      username: "elena_castillo",
      email: "elena.castillo@ejemplo.com",
      password: "Password123!",
      phone: "+1 (849) 555-0188",
      city: "Punta Cana",
      country: "República Dominicana",
      membershipId: MEMBERSHIP_TIERS.ELITE_AMBASSADOR,
      referralCode: "ELENA-ELITE",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
      isEmailVerified: true,
      pointsStats: {
        availablePoints: 665,
        totalEarnedPoints: 1065,
        redeemedPoints: 400,
        level1Points: 680,
        level2Points: 385,
      },
    });

    // Pedro (Member)
    const pedro = await User.create({
      fullname: "Pedro Santos",
      username: "pedro_santos",
      email: "pedro.santos@ejemplo.com",
      password: "Password123!",
      phone: "+1 (809) 555-0177",
      city: "La Romana",
      country: "República Dominicana",
      membershipId: MEMBERSHIP_TIERS.MEMBER,
      referralCode: "PEDRO-SANTOS",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
      isEmailVerified: true,
      pointsStats: {
        availablePoints: 0,
        totalEarnedPoints: 0,
        redeemedPoints: 0,
        level1Points: 0,
        level2Points: 0,
      },
    });

    console.log(" Seed completed successfully!");
    console.log(" Demo accounts created:");
    console.log("  - Admin: admin@viajesdominicana.com / AdminPassword2026!");
    console.log("  - Sofía (Ambassador): sofia.almonte@ejemplo.com / Password123!");
    console.log("  - Carlos (Active Member): carlos.mendoza@ejemplo.com / Password123!");
    console.log("  - Elena (Elite Ambassador): elena.castillo@ejemplo.com / Password123!");
    console.log("  - Pedro (Member): pedro.santos@ejemplo.com / Password123!");

    process.exit(0);
  } catch (error) {
    console.error(" Seed failed:", error);
    process.exit(1);
  }
};

seed();
