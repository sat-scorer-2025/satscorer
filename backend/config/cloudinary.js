import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

export const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });
};

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'SATscorer/user_profiles',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(file.originalname.toLowerCase().split('.').pop());
    if (mimetype && extname) return cb(null, true);
    cb(new Error('File upload only supports the following filetypes: jpg, png, jpeg, webp'));
  },
});

export const uploadToCloudinary = async (filePath, folder = 'SATscorer/course_thumbnails') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload to Cloudinary');
  }
};

export const deleteFromCloudinary = async (fileUrl) => {
  try {
    if (!fileUrl) {
      console.warn('No file URL provided for deletion');
      return;
    }
    const parts = fileUrl.split('/');
    const publicIdWithExtension = parts.slice(-2).join('/');
    const publicId = publicIdWithExtension.split('.').slice(0, -1).join('.');
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete from Cloudinary');
  }
};
