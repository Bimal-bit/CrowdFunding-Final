import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Verify Cloudinary configuration
console.log('🔧 Cloudinary Configuration:');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME || '❌ NOT SET');
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '✅ SET' : '❌ NOT SET');
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ SET' : '❌ NOT SET');

// Configure Multer Storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    console.log('📤 Uploading to Cloudinary...');
    console.log('File:', file.originalname);
    return {
      folder: 'crowdfunding-projects',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [{ width: 1200, height: 800, crop: 'limit' }]
    };
  }
});

// Configure multer with file size limits
export const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

export default cloudinary;
