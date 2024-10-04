// src/middlewares/uploadImage.ts

import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import crypto from 'crypto'; // Importar el módulo crypto
import { config } from '../settings/config';

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads')); // Ajusta la ruta según tu estructura
  },
  filename: (req: Request, file, cb) => {
    // Generar un nombre de archivo único usando crypto.randomUUID
    const uniqueSuffix = `${Date.now()}-${crypto.randomUUID()}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// Filtro para aceptar solo imágenes
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif)'));
  }
};

// Configurar Multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// Función para crear el middleware personalizado
export const uploadImage = (propertyName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Usar Multer para manejar la subida
    const uploadSingle = upload.single(propertyName); // 'image' es el campo de la solicitud que contiene la imagen

    uploadSingle(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        // Errores de Multer
        return res.status(400).json({ message: err.message });
      } else if (err) {
        // Otros errores
        return res.status(400).json({ message: err.message });
      }

      // Si no hay archivo, continuar
      if (!req.file) {
        return res
          .status(400)
          .json({ message: 'No se ha subido ninguna imagen' });
      }

      // Obtener las variables de entorno
      const protocol = config.protocol || 'http';
      const host = config.host || 'localhost';
      const port = config.port ? `:${config.port}` : '';

      // Construir la URL completa de la imagen
      const imagePath = `/public/uploads/${req.file.filename}`;
      const imageUrl = `${protocol}://${host}${port}${imagePath}`;

      // Añadir la propiedad personalizada al body
      req.body[propertyName] = imageUrl;

      next();
    });
  };
};
