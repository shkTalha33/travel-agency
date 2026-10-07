const { uploadImage } = require('../services/firebaseStorage.service');
const { onSuccess } = require('../libs/responseWrapper');
const { BadRequestException } = require('../libs/errorExceptionSchema');

/**
 * Handle Image Upload (via Base64 or JSON payload)
 * Accepts { image: "data:image/jpeg;base64,...", filename: "my-photo.jpg", folder: "offers" | "avatars" | "general" }
 */
exports.uploadImageHandler = async (req, res, next) => {
  try {
    const { image, base64, filename, contentType, folder } = req.body;
    const imageData = image || base64;

    if (!imageData) {
      throw new BadRequestException('Image data (base64 or file payload) is required');
    }

    const result = await uploadImage({
      base64: imageData,
      filename: filename || 'image.jpg',
      contentType: contentType || 'image/jpeg',
      folder: folder || 'offers',
    });

    return res.status(200).json(
      onSuccess('Image uploaded successfully', {
        url: result.url,
        storagePath: result.storagePath,
        provider: result.provider,
        size: result.size,
        contentType: result.contentType,
      })
    );
  } catch (error) {
    next(error);
  }
};
