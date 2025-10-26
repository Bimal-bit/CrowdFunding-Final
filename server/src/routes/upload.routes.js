import express from 'express';
import { upload } from '../config/cloudinary.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Upload single image to Cloudinary (authenticated users)
router.post('/image', protect, (req, res) => {
  console.log('📥 Upload request received');
  console.log('User:', req.user?.email);
  
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('❌ Upload error:', err);
      console.error('Error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
      return res.status(400).json({ 
        success: false, 
        message: err.message,
        error: err.name 
      });
    }

    if (!req.file) {
      console.error('❌ No file in request');
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    try {
      // Cloudinary URL is in req.file.path
      const imageUrl = req.file.path;
      
      console.log('✅ File uploaded to Cloudinary successfully!');
      console.log('📷 Image URL:', imageUrl);
      console.log('📁 Public ID:', req.file.filename);
      console.log('📊 File details:', {
        size: req.file.size,
        format: req.file.format,
        originalname: req.file.originalname
      });

      res.status(200).json({
        success: true,
        imageUrl: imageUrl,
        publicId: req.file.filename,
        filename: req.file.filename
      });
    } catch (error) {
      console.error('❌ Error processing upload:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  });
});

// Upload multiple images to Cloudinary (authenticated users)
router.post('/images', protect, upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const imageUrls = req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
      filename: file.filename
    }));

    console.log(`✅ ${req.files.length} files uploaded to Cloudinary`);

    res.status(200).json({
      success: true,
      images: imageUrls
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
