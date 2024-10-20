import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import crypto from 'node:crypto';

// Configurar Cloudinary con tus credenciales
cloudinary.config({
  // Las variables de entorno se definen en el archivo .env or en la configuración de tu servidor
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, //
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Crear el almacenamiento en Cloudinary usando multer-storage-cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => {
    return {
      folder: 'uploads', // Especifica la carpeta en Cloudinary
      format: 'webp', // Formato en el que se guardarán las imágenes
      public_id: `${file.fieldname}-${crypto.randomUUID().toString()}`, // Nombre de archivo único
      transformation: [{ width: 128, height: 128, crop: 'fill' }], // Redimensionar a 128x128 píxeles
    };
  },
});

// Filtro para aceptar solo imágenes
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(file.mimetype);

  if (extname) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
  }
};

// Configurar Multer para usar Cloudinary storage
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5 MB
});

// Middleware para subir la imagen
export const uploadImage = (propertyName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const uploadSingle = upload.single(propertyName);

    uploadSingle(req, res, (err: any) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      if (req.file) {
        // URL pública de Cloudinary
        req.body[propertyName] = req.file.path;
      }

      next();
    });
  };
};
