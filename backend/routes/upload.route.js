const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');

/**
 * @swagger
 * /upload/image:
 *   post:
 *     summary: Upload an image to Firebase Storage (with local fallback)
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 description: Base64 data URL or raw base64 string
 *                 example: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
 *               filename:
 *                 type: string
 *                 example: "punta-cana-resort.jpg"
 *               folder:
 *                 type: string
 *                 example: "offers"
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: "https://firebasestorage.googleapis.com/v0/b/doctor-school.firebasestorage.app/o/travel-agency%2Foffers%2F1741...jpg?alt=media&token=..."
 *                     storagePath:
 *                       type: string
 *                     provider:
 *                       type: string
 *                       example: "firebase"
 */
router.post('/image', uploadController.uploadImageHandler);
router.post('/', uploadController.uploadImageHandler);

module.exports = router;
