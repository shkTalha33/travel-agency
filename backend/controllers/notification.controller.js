const { aysncHandler } = require("../utils/aysncHandler");
const Notification = require("../models/notification.model");
const { onSuccess } = require("../libs/responseWrapper");
const successMessages = require("../libs/successMessages");
const { NotFoundException, BadRequestException } = require("../libs/errorExceptionSchema");

const getMyNotifications = aysncHandler(async (req, res) => {
  const userId = req.user._id;

  let notifications = await Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(50);

  // If user has no notifications in DB yet, create welcome and promo defaults
  if (notifications.length === 0) {
    const isEn = req.query.lang === 'en' || req.headers['accept-language']?.includes('en');
    const defaultNotifs = [
      {
        user: userId,
        type: 'points',
        title: isEn ? 'Points Credited!' : '¡Puntos Acreditados!',
        message: isEn
          ? 'You received welcome rewards on your account activation.'
          : 'Recibiste recompensas de bienvenida en la activación de tu cuenta.',
        link: '/dashboard/points',
        read: false,
      },
      {
        user: userId,
        type: 'offer',
        title: isEn ? 'New VIP Offer Available' : 'Nueva Oferta VIP Disponible',
        message: isEn
          ? 'Discover exclusive Caribbean luxury packages and member rates.'
          : 'Descubre nuevas experiencias de lujo y tarifas para miembros.',
        link: '/dashboard/offers',
        read: false,
      },
      {
        user: userId,
        type: 'welcome',
        title: isEn ? 'Welcome to Círculo Wingding!' : '¡Bienvenido a Círculo Wingding!',
        message: isEn
          ? 'Explore our resort catalog and start earning rewards.'
          : 'Explora el catálogo de ofertas y comienza a generar beneficios.',
        link: '/dashboard/offers',
        read: true,
      },
    ];

    try {
      notifications = await Notification.insertMany(defaultNotifs);
    } catch (_) {
      // If insertion fails, continue
    }
  }

  const unreadCount = await Notification.countDocuments({ user: userId, read: false });

  return res.status(200).json(
    onSuccess(successMessages.FETCH_NOTIFICATIONS, {
      notifications,
      unreadCount,
    })
  );
});

const createNotification = aysncHandler(async (req, res, next) => {
  const { title, message, type = 'general', link = '/dashboard', read = false, userId } = req.body;

  if (!title || !message) {
    return next(new BadRequestException("Title and message are required."));
  }

  const targetUserId = userId || req.user._id;

  const notification = await Notification.create({
    user: targetUserId,
    title: title.trim(),
    message: message.trim(),
    type,
    link,
    read: !!read,
  });

  return res.status(201).json(
    onSuccess(successMessages.NOTIFICATION_CREATED, notification)
  );
});

const markAsRead = aysncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const notification = await Notification.findOneAndUpdate(
    { _id: id, user: userId },
    { $set: { read: true } },
    { new: true }
  );

  if (!notification) {
    return next(new NotFoundException("Notification not found."));
  }

  const unreadCount = await Notification.countDocuments({ user: userId, read: false });

  return res.status(200).json(
    onSuccess(successMessages.NOTIFICATIONS_MARKED_READ, {
      notification,
      unreadCount,
    })
  );
});

const markAllAsRead = aysncHandler(async (req, res) => {
  const userId = req.user._id;

  await Notification.updateMany(
    { user: userId, read: false },
    { $set: { read: true } }
  );

  return res.status(200).json(
    onSuccess(successMessages.NOTIFICATIONS_MARKED_READ, {
      unreadCount: 0,
    })
  );
});

const deleteNotification = aysncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const notification = await Notification.findOneAndDelete({ _id: id, user: userId });

  if (!notification) {
    return next(new NotFoundException("Notification not found."));
  }

  const unreadCount = await Notification.countDocuments({ user: userId, read: false });

  return res.status(200).json(
    onSuccess(successMessages.NOTIFICATION_DELETED, {
      id,
      unreadCount,
    })
  );
});

const clearAllNotifications = aysncHandler(async (req, res) => {
  const userId = req.user._id;

  await Notification.deleteMany({ user: userId });

  return res.status(200).json(
    onSuccess(successMessages.NOTIFICATIONS_CLEARED, {
      unreadCount: 0,
    })
  );
});

module.exports = {
  getMyNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
};
